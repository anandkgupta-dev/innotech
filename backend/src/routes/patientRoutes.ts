import { Router, Request, Response } from 'express';
import { PatientIntake } from '../models/PatientIntake.js';
import { createAuditEntry } from '../models/AuditLog.js';
import { isDbConnected } from '../config/db.js';
import { validateIntakePayload, ValidatedIntakeBody } from '../middleware/validation.js';

const router = Router();

/**
 * Generate a unique, human-readable intake ID e.g., MED-2026-9281
 */
function generateIntakeId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MED-${year}-${randomSuffix}`;
}

/**
 * POST /api/patients/intake
 * Persists a validated patient clinical intake record to MongoDB.
 */
router.post(
  '/intake',
  validateIntakePayload,
  async (req: Request, res: Response): Promise<void> => {
    // 1. Verify database connectivity
    if (!isDbConnected()) {
      res.status(503).json({
        success: false,
        error:
          'Database service is currently unavailable. Operating in offline demo mode. Please notify hospital reception or retry.',
        code: 'DATABASE_UNAVAILABLE',
      });
      return;
    }

    try {
      const body = req.body as ValidatedIntakeBody;
      const { clientSubmissionId, registration, complaint, history, emergency } = body;

      // 2. Duplicate Prevention / Idempotency Check
      if (clientSubmissionId) {
        const existingRecord = await PatientIntake.findOne({ clientSubmissionId });
        if (existingRecord) {
          await createAuditEntry('INTAKE_DUPLICATE_PREVENTED', {
            intakeId: existingRecord.intakeId,
            patientId: existingRecord.patientId,
            ipAddress: req.ip || req.socket.remoteAddress,
            userAgent: req.get('user-agent'),
            status: 'SUCCESS',
            details: { reason: 'Duplicate clientSubmissionId detected' },
          });

          res.status(200).json({
            success: true,
            message: 'Intake record already exists (duplicate prevented).',
            duplicatePrevented: true,
            data: {
              intakeId: existingRecord.intakeId,
              patientId: existingRecord.patientId,
              tokenNumber: existingRecord.tokenNumber,
              visitDate: existingRecord.visitDate,
              createdAt: existingRecord.createdAt,
            },
          });
          return;
        }
      }

      // Check for same patient submitting twice in short window (within last 10 minutes)
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentDuplicate = await PatientIntake.findOne({
        patientId: registration.patientId,
        visitDate: registration.visitDate,
        createdAt: { $gte: tenMinutesAgo },
      });

      if (recentDuplicate) {
        await createAuditEntry('INTAKE_DUPLICATE_PREVENTED', {
          intakeId: recentDuplicate.intakeId,
          patientId: recentDuplicate.patientId,
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.get('user-agent'),
          status: 'SUCCESS',
          details: { reason: 'Recent duplicate submission within 10 minutes' },
        });

        res.status(200).json({
          success: true,
          message: 'Recent intake record found for this patient visit.',
          duplicatePrevented: true,
          data: {
            intakeId: recentDuplicate.intakeId,
            patientId: recentDuplicate.patientId,
            tokenNumber: recentDuplicate.tokenNumber,
            visitDate: recentDuplicate.visitDate,
            createdAt: recentDuplicate.createdAt,
          },
        });
        return;
      }

      // 3. Generate IDs and token
      const intakeId = generateIntakeId();
      const tokenNumber = `TK-${registration.patientId.slice(-4) || String(Math.floor(1000 + Math.random() * 9000))}`;

      // 4. Create and persist record
      const newIntake = await PatientIntake.create({
        intakeId,
        clientSubmissionId: clientSubmissionId || undefined,
        patientId: registration.patientId,
        fullName: registration.fullName,
        age: Number(registration.age),
        dob: registration.dob,
        gender: registration.gender || 'undisclosed',
        preferredLanguage: registration.preferredLanguage || 'en',
        visitDate: registration.visitDate,
        phone: registration.phone,
        consent: {
          given: true,
          timestamp: new Date(),
          version: '1.0',
        },
        complaint: {
          selectedSymptoms: complaint.selectedSymptoms || [],
          customDescription: complaint.customDescription || '',
          durationValue: String(complaint.durationValue),
          durationUnit: complaint.durationUnit || 'days',
          severity: complaint.severity || 'unspecified',
        },
        history: {
          associatedSymptoms: history?.associatedSymptoms || [],
          existingConditions: history?.existingConditions || [],
          pastSurgery: history?.pastSurgery || 'no',
          pastSurgeryDetails: history?.pastSurgeryDetails || '',
          currentMedications: history?.currentMedications || 'no',
          medicationsDetails: history?.medicationsDetails || '',
          knownAllergies: history?.knownAllergies || 'no',
          allergiesDetails: history?.allergiesDetails || '',
          familyHistory: history?.familyHistory || [],
          dietType: history?.dietType || 'unspecified',
          tobaccoUse: history?.tobaccoUse || 'no',
          alcoholUse: history?.alcoholUse || 'no',
          sleepQuality: history?.sleepQuality || 'unspecified',
          conditionalFollowUpNotes: history?.conditionalFollowUpNotes || '',
        },
        emergency: {
          isTriggered: Boolean(emergency?.isTriggered),
          reasons: emergency?.reasons || [],
          acknowledged: Boolean(emergency?.acknowledged),
        },
        status: 'submitted',
        tokenNumber,
      });

      // 5. Audit Logging
      await createAuditEntry('INTAKE_CREATED', {
        intakeId,
        patientId: registration.patientId,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
        status: 'SUCCESS',
        details: { tokenNumber, emergencyFlag: Boolean(emergency?.isTriggered) },
      });

      // 6. Return response
      res.status(201).json({
        success: true,
        message: 'Patient intake record successfully saved to MongoDB.',
        data: {
          intakeId: newIntake.intakeId,
          patientId: newIntake.patientId,
          tokenNumber: newIntake.tokenNumber,
          visitDate: newIntake.visitDate,
          status: newIntake.status,
          createdAt: newIntake.createdAt,
        },
      });
    } catch (err) {
      console.error('❌ [Intake Route] Error saving record:', err instanceof Error ? err.message : err);
      res.status(500).json({
        success: false,
        error: 'An internal error occurred while saving the intake record.',
      });
    }
  }
);

/**
 * GET /api/patients/intake/:id
 * Fetches an intake record by intakeId for clinical review.
 * No generic list endpoint is provided to safeguard patient confidentiality.
 */
router.get('/intake/:id', async (req: Request, res: Response): Promise<void> => {
  if (!isDbConnected()) {
    res.status(503).json({
      success: false,
      error: 'Database service is currently unavailable.',
    });
    return;
  }

  const { id } = req.params;

  // Basic validation of id format
  if (!id || id.length > 50) {
    res.status(400).json({ success: false, error: 'Invalid record identifier format.' });
    return;
  }

  try {
    const record = await PatientIntake.findOne({
      $or: [{ intakeId: id }, { patientId: id }],
    }).lean();

    if (!record) {
      res.status(404).json({
        success: false,
        error: 'Intake record not found.',
      });
      return;
    }

    // Audit access
    await createAuditEntry('INTAKE_ACCESSED', {
      intakeId: record.intakeId,
      patientId: record.patientId,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      status: 'SUCCESS',
    });

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err) {
    console.error('❌ [Intake Route] Error retrieving record:', err instanceof Error ? err.message : err);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while retrieving the intake record.',
    });
  }
});

export default router;
