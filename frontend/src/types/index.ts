export type SupportedLanguage = 'en' | 'hi';

export type TextScale = 'normal' | 'large' | 'xlarge';

export interface WorkflowStep {
  id: number;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  icon: string;
  badgeEn: string;
  badgeHi: string;
}

export interface RedFlagAlert {
  titleEn: string;
  titleHi: string;
  warningEn: string;
  warningHi: string;
  actionEn: string;
  actionHi: string;
  emergencyNumber: string;
}

export interface DemoPatientPreview {
  id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  primaryComplaint: string;
}

// ==========================================
// Phase 2: Patient Intake Data Models
// ==========================================

export type IntakeStepId =
  | 'language'
  | 'consent'
  | 'registration'
  | 'complaint'
  | 'history'
  | 'review'
  | 'success';

export type GenderOption = 'male' | 'female' | 'other' | 'undisclosed';

export interface PatientRegistrationData {
  patientId: string;
  fullName: string;
  age: string;
  dob?: string;
  gender: GenderOption;
  preferredLanguage: SupportedLanguage;
  visitDate: string;
  phone: string;
}

export interface ChiefComplaintData {
  selectedSymptoms: string[];
  customDescription: string;
  durationValue: string;
  durationUnit: 'hours' | 'days' | 'weeks' | 'months' | 'years';
  severity: 'mild' | 'moderate' | 'severe' | 'unspecified';
}

export type MedicalAnswerStatus = 'yes' | 'no' | 'unknown' | 'prefer-not-to-say' | 'unanswered';

export interface GuidedHistoryData {
  // 1. Associated symptoms
  associatedSymptoms: string[];

  // 2. Existing conditions
  existingConditions: string[];
  otherConditionDetails?: string;

  // 3. Past surgery & hospitalizations
  pastSurgery: MedicalAnswerStatus;
  pastSurgeryDetails: string;

  // 4. Current medications
  currentMedications: MedicalAnswerStatus;
  medicationsDetails: string;

  // 5. Known allergies
  knownAllergies: MedicalAnswerStatus;
  allergiesDetails: string;

  // 6. Family history
  familyHistory: string[];

  // 7. Personal & Lifestyle
  dietType: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'unspecified';
  tobaccoUse: MedicalAnswerStatus;
  alcoholUse: MedicalAnswerStatus;
  sleepQuality: 'good' | 'disturbed' | 'insomnia' | 'unspecified';

  // 8. Conditional follow-up notes
  conditionalFollowUpNotes: string;
}

export interface EmergencyRedFlagState {
  isTriggered: boolean;
  reasons: string[];
  acknowledged: boolean;
}

export interface PatientIntakeState {
  step: IntakeStepId;
  consentGiven: boolean;
  consentTimestamp?: string;
  registration: PatientRegistrationData;
  complaint: ChiefComplaintData;
  history: GuidedHistoryData;
  emergency: EmergencyRedFlagState;
  completedAt?: string;
}
