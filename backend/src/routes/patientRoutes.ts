import { Router, Request, Response } from 'express';
import { PatientIntake } from '../models/PatientIntake.js';
import { createAuditEntry } from '../models/AuditLog.js';
import { isDbConnected } from '../config/db.js';
import { validateIntakePayload, ValidatedIntakeBody, validateDoctorReview, ValidatedDoctorReviewBody } from '../middleware/validation.js';
import { requireClinicianAuth, authenticateClinicianCredentials } from '../middleware/auth.js';

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
 * POST /api/patients/clinician/auth
 * Server-verified authentication for authorized clinical staff.
 */
router.post('/clinician/auth', async (req: Request, res: Response): Promise<void> => {
  const { staffId, passcode } = req.body || {};
  const meta = {
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
  };
  const result = await authenticateClinicianCredentials(staffId, passcode, meta);
  if (!result.success) {
    res.status(401).json({ success: false, error: result.error });
    return;
  }
  res.status(200).json({
    success: true,
    token: result.token,
    session: result.session,
  });
});

/**
 * GET /api/patients/queue
 * Fetches the active patient intake queue for authorized clinical staff.
 * Supports filtering by real vs synthetic demo records.
 */
router.get('/queue', requireClinicianAuth, async (req: Request, res: Response): Promise<void> => {
  if (!isDbConnected()) {
    res.status(503).json({
      success: false,
      error: 'Database service is currently unavailable.',
    });
    return;
  }

  try {
    const includeDemo = req.query.includeDemo === 'true';
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 50, 100);

    const filter: any = {};
    if (!includeDemo) {
      filter.isDemo = { $ne: true };
    }

    const rawQueue = await PatientIntake.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(
        'intakeId patientId clientSubmissionId fullName age gender preferredLanguage visitDate tokenNumber complaint emergency status review isDemo createdAt updatedAt'
      )
      .lean();

    // Accurately classify records: do not automatically assume legacy records are real patients
    const queue = rawQueue.map((p: any) => {
      const isSynthetic =
        p.isDemo === true ||
        (p.patientId && (p.patientId.startsWith('TEST-') || p.patientId.startsWith('SYNTH-'))) ||
        (p.fullName && p.fullName.toLowerCase().includes('synthetic')) ||
        (p.clientSubmissionId && p.clientSubmissionId.startsWith('TEST-'));

      let classification: 'verified_patient' | 'synthetic_demo' | 'legacy_unclassified';
      if (isSynthetic) {
        classification = 'synthetic_demo';
      } else if (p.isDemo === false) {
        classification = 'verified_patient';
      } else {
        // isDemo is missing/undefined on older records
        classification = 'legacy_unclassified';
      }

      return {
        ...p,
        recordClassification: classification,
      };
    });

    const clinician = (req as any).clinician;
    await createAuditEntry('QUEUE_ACCESSED', {
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      status: 'SUCCESS',
      details: { staffId: clinician?.staffId, returnedCount: queue.length, includeDemo },
    });

    res.status(200).json({
      success: true,
      count: queue.length,
      data: queue,
    });
  } catch (err) {
    console.error('❌ [Queue Route] Error fetching patient queue:', err instanceof Error ? err.message : err);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while fetching the patient queue.',
    });
  }
});

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
      const body = req.body as ValidatedIntakeBody & { isDemo?: boolean };
      const { clientSubmissionId, registration, complaint, history, emergency, isDemo } = body;

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
        isDemo: Boolean(isDemo),
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
        details: { tokenNumber, emergencyFlag: Boolean(emergency?.isTriggered), isDemo: Boolean(isDemo) },
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
 * Fetches an intake record by intakeId for authorized clinical review.
 */
router.get('/intake/:id', requireClinicianAuth, async (req: Request, res: Response): Promise<void> => {
  if (!isDbConnected()) {
    res.status(503).json({
      success: false,
      error: 'Database service is currently unavailable.',
    });
    return;
  }

  const { id } = req.params;

  // Basic validation of id format
  if (!id || id.length > 50 || !/^[A-Za-z0-9_-]+$/.test(id)) {
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

    const clinician = (req as any).clinician;
    // Audit access
    await createAuditEntry('INTAKE_ACCESSED', {
      intakeId: record.intakeId,
      patientId: record.patientId,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      status: 'SUCCESS',
      details: { accessedByStaffId: clinician?.staffId },
    });

    const isSynthetic =
      (record as any).isDemo === true ||
      ((record as any).patientId && ((record as any).patientId.startsWith('TEST-') || (record as any).patientId.startsWith('SYNTH-'))) ||
      ((record as any).fullName && (record as any).fullName.toLowerCase().includes('synthetic')) ||
      ((record as any).clientSubmissionId && (record as any).clientSubmissionId.startsWith('TEST-'));

    let classification: 'verified_patient' | 'synthetic_demo' | 'legacy_unclassified';
    if (isSynthetic) {
      classification = 'synthetic_demo';
    } else if ((record as any).isDemo === false) {
      classification = 'verified_patient';
    } else {
      classification = 'legacy_unclassified';
    }

    res.status(200).json({
      success: true,
      data: {
        ...record,
        recordClassification: classification,
      },
    });
  } catch (err) {
    console.error('❌ [Intake Route] Error retrieving record:', err instanceof Error ? err.message : err);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while retrieving the intake record.',
    });
  }
});

/**
 * PATCH /api/patients/intake/:id/review
 * Saves doctor examination notes, updates review status, and records clinician sign-off.
 */
router.patch(
  '/intake/:id/review',
  requireClinicianAuth,
  validateDoctorReview,
  async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected()) {
      res.status(503).json({
        success: false,
        error: 'Database service is currently unavailable.',
      });
      return;
    }

    const { id } = req.params;
    if (!id || id.length > 50 || !/^[A-Za-z0-9_-]+$/.test(id)) {
      res.status(400).json({ success: false, error: 'Invalid record identifier format.' });
      return;
    }

    try {
      const clinician = (req as any).clinician;
      const body = req.body as ValidatedDoctorReviewBody;

      const record = await PatientIntake.findOne({
        $or: [{ intakeId: id }, { patientId: id }],
      });

      if (!record) {
        res.status(404).json({
          success: false,
          error: 'Intake record not found for review.',
        });
        return;
      }

      // 1. Role boundary: Evaluators cannot modify non-demo records
      if (clinician?.role === 'evaluator' && !record.isDemo) {
        res.status(403).json({
          success: false,
          error: 'Access denied: Evaluator accounts are restricted to synthetic demo records only.',
          code: 'FORBIDDEN_EVALUATOR',
        });
        return;
      }

      // 2. Prevent silent overwriting of already completed & signed reviews
      const isAlreadyCompleted = record.status === 'completed' || record.review?.isApproved === true;
      if (isAlreadyCompleted && !body.allowAmendment) {
        res.status(409).json({
          success: false,
          error: 'This record has already been reviewed and signed off. Re-signing or modifying notes requires explicit clinical amendment authorization.',
          code: 'ALREADY_COMPLETED',
          existingReview: record.review,
        });
        return;
      }

      // Update doctor notes if provided
      if (body.doctorNotes !== undefined) {
        record.doctorNotes = body.doctorNotes;
      }

      const isApproved = body.isApproved ?? record.review?.isApproved ?? false;
      const reviewStatus = body.status || (isApproved ? 'completed' : 'under_review');
      const reviewerName = body.reviewedBy || clinician?.name || 'Authorized Medical Officer';

      const previousReviewer = record.review?.reviewedBy;
      record.review = {
        reviewedBy: reviewerName,
        reviewedAt: isApproved ? new Date() : record.review?.reviewedAt || new Date(),
        isApproved,
        status: reviewStatus,
      };

      if (isApproved) {
        record.status = 'completed';
      } else if (record.status === 'submitted') {
        record.status = 'under_review';
      }

      await record.save();

      const action = isAlreadyCompleted ? 'INTAKE_AMENDED' : (isApproved ? 'INTAKE_SIGNED' : 'INTAKE_REVIEWED');
      await createAuditEntry(action, {
        intakeId: record.intakeId,
        patientId: record.patientId,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
        status: 'SUCCESS',
        details: {
          staffId: clinician?.staffId,
          reviewerName,
          isApproved,
          isAmended: isAlreadyCompleted,
          previousReviewer,
          notesLength: record.doctorNotes?.length || 0,
        },
      });

      res.status(200).json({
        success: true,
        message: isApproved ? 'Clinical intake reviewed and signed off.' : 'Doctor notes saved successfully.',
        data: {
          intakeId: record.intakeId,
          patientId: record.patientId,
          status: record.status,
          doctorNotes: record.doctorNotes,
          review: record.review,
          updatedAt: record.updatedAt,
        },
      });
    } catch (err) {
      console.error('❌ [Review Route] Error saving doctor review:', err instanceof Error ? err.message : err);
      res.status(500).json({
        success: false,
        error: 'An internal error occurred while saving the doctor review.',
      });
    }
  }
);

/**
 * DELETE /api/patients/synthetic/:intakeId
 * Safety-restricted deletion endpoint strictly limited to synthetic test records.
 * NEVER deletes real patient records (enforced by patientId / isDemo check).
 */
router.delete(
  '/synthetic/:intakeId',
  requireClinicianAuth,
  async (req: Request, res: Response): Promise<void> => {
    if (!isDbConnected()) {
      res.status(503).json({ success: false, error: 'Database service unavailable.' });
      return;
    }

    const { intakeId } = req.params;
    try {
      const record = await PatientIntake.findOne({ intakeId });
      if (!record) {
        res.status(404).json({ success: false, error: 'Synthetic record not found.' });
        return;
      }

      // Strict safety check: only synthetic test records can be cleaned up
      const isTestRecord = record.isDemo || record.patientId.startsWith('TEST-SYNTH-') || record.fullName.includes('(Synthetic Demo)');
      if (!isTestRecord) {
        res.status(403).json({
          success: false,
          error: 'Operation rejected: Real patient records cannot be deleted.',
        });
        return;
      }

      await PatientIntake.deleteOne({ intakeId });

      res.status(200).json({
        success: true,
        message: 'Synthetic test record cleaned up successfully.',
        intakeId,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'An internal error occurred during synthetic record cleanup.',
      });
    }
  }
);

export default router;

