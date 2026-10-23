import { Request, Response, NextFunction } from 'express';

export interface ValidatedIntakeBody {
  clientSubmissionId?: string;
  consentGiven: boolean;
  registration: {
    patientId: string;
    fullName: string;
    age: number | string;
    dob?: string;
    gender: 'male' | 'female' | 'other' | 'undisclosed';
    preferredLanguage: 'en' | 'hi';
    visitDate: string;
    phone?: string;
  };
  complaint: {
    selectedSymptoms: string[];
    customDescription?: string;
    durationValue: string;
    durationUnit: 'hours' | 'days' | 'weeks' | 'months' | 'years';
    severity: 'mild' | 'moderate' | 'severe' | 'unspecified';
  };
  history?: {
    associatedSymptoms?: string[];
    existingConditions?: string[];
    pastSurgery?: string;
    pastSurgeryDetails?: string;
    currentMedications?: string;
    medicationsDetails?: string;
    knownAllergies?: string;
    allergiesDetails?: string;
    familyHistory?: string[];
    dietType?: string;
    tobaccoUse?: string;
    alcoholUse?: string;
    sleepQuality?: string;
    conditionalFollowUpNotes?: string;
  };
  emergency?: {
    isTriggered?: boolean;
    reasons?: string[];
    acknowledged?: boolean;
  };
}

export function validateIntakePayload(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const body = req.body as Partial<ValidatedIntakeBody>;
  const errors: string[] = [];

  if (!body) {
    res.status(400).json({
      success: false,
      error: 'Empty request payload.',
    });
    return;
  }

  // 1. Consent validation
  if (!body.consentGiven) {
    errors.push('Consent must be explicitly granted before recording health information.');
  }

  // 2. Registration validation
  const reg = body.registration;
  if (!reg) {
    errors.push('Patient registration details are required.');
  } else {
    if (!reg.patientId || typeof reg.patientId !== 'string' || !reg.patientId.trim()) {
      errors.push('A valid patientId / registration ID is required.');
    }
    if (!reg.fullName || typeof reg.fullName !== 'string' || !reg.fullName.trim()) {
      errors.push('Patient full name is required.');
    }
    const ageNum = parseInt(String(reg.age), 10);
    if (!reg.age || isNaN(ageNum) || ageNum < 1 || ageNum > 125) {
      errors.push('Patient age must be a valid number between 1 and 125.');
    }
    if (reg.gender && !['male', 'female', 'other', 'undisclosed'].includes(reg.gender)) {
      errors.push('Gender must be one of: male, female, other, undisclosed.');
    }
    if (reg.preferredLanguage && !['en', 'hi'].includes(reg.preferredLanguage)) {
      errors.push('Preferred language must be either "en" or "hi".');
    }
    if (!reg.visitDate || typeof reg.visitDate !== 'string') {
      errors.push('Visit date is required.');
    }
  }

  // 3. Complaint validation
  const comp = body.complaint;
  if (!comp) {
    errors.push('Chief complaint information is required.');
  } else {
    const hasSymptoms = Array.isArray(comp.selectedSymptoms) && comp.selectedSymptoms.length > 0;
    const hasDescription = Boolean(comp.customDescription && comp.customDescription.trim());
    if (!hasSymptoms && !hasDescription) {
      errors.push('Please select at least one symptom or describe your complaint in words.');
    }
    if (!comp.durationValue || !String(comp.durationValue).trim()) {
      errors.push('Symptom duration number is required.');
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: 'Validation failed.',
      validationErrors: errors,
    });
    return;
  }

  next();
}

export interface ValidatedDoctorReviewBody {
  doctorNotes?: string;
  isApproved?: boolean;
  reviewedBy?: string;
  status?: 'pending' | 'under_review' | 'completed';
  allowAmendment?: boolean;
}

export function validateDoctorReview(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const body = req.body as Partial<ValidatedDoctorReviewBody>;
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    res.status(400).json({
      success: false,
      error: 'Invalid request body for doctor review.',
    });
    return;
  }

  if (body.doctorNotes !== undefined) {
    if (typeof body.doctorNotes !== 'string') {
      errors.push('doctorNotes must be a string.');
    } else if (body.doctorNotes.length > 5000) {
      errors.push('doctorNotes exceeds maximum limit of 5000 characters.');
    }
  }

  if (body.isApproved !== undefined && typeof body.isApproved !== 'boolean') {
    errors.push('isApproved must be a boolean.');
  }

  if (body.reviewedBy !== undefined) {
    if (typeof body.reviewedBy !== 'string') {
      errors.push('reviewedBy must be a string.');
    } else if (body.reviewedBy.length > 120) {
      errors.push('reviewedBy exceeds maximum length of 120 characters.');
    }
  }

  if (body.status !== undefined) {
    if (!['pending', 'under_review', 'completed'].includes(body.status)) {
      errors.push('status must be one of: pending, under_review, completed.');
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: 'Validation failed for doctor review.',
      validationErrors: errors,
    });
    return;
  }

  next();
}
