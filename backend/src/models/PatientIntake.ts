import mongoose, { Document, Schema } from 'mongoose';

export type GenderType = 'male' | 'female' | 'other' | 'undisclosed';
export type IntakeStatus = 'submitted' | 'under_review' | 'completed' | 'cancelled';

export interface IPatientIntake extends Document {
  intakeId: string; // Unique server-generated ID e.g., MED-2026-8421
  clientSubmissionId?: string; // Client idempotency key for duplicate prevention
  patientId: string; // Hospital OPD or patient identifier e.g., PAT-2026-0842
  
  // Demographics
  fullName: string;
  age: number;
  dob?: string;
  gender: GenderType;
  preferredLanguage: 'en' | 'hi';
  visitDate: string;
  phone?: string;

  // Consent metadata
  consent: {
    given: boolean;
    timestamp: Date;
    version: string;
  };

  // Chief Complaint
  complaint: {
    selectedSymptoms: string[];
    customDescription: string;
    durationValue: string;
    durationUnit: 'hours' | 'days' | 'weeks' | 'months' | 'years';
    severity: 'mild' | 'moderate' | 'severe' | 'unspecified';
  };

  // Guided Medical History
  history: {
    associatedSymptoms: string[];
    existingConditions: string[];
    pastSurgery: string;
    pastSurgeryDetails: string;
    currentMedications: string;
    medicationsDetails: string;
    knownAllergies: string;
    allergiesDetails: string;
    familyHistory: string[];
    dietType: string;
    tobaccoUse: string;
    alcoholUse: string;
    sleepQuality: string;
    conditionalFollowUpNotes: string;
  };

  // Emergency safety check
  emergency: {
    isTriggered: boolean;
    reasons: string[];
    acknowledged: boolean;
  };

  status: IntakeStatus;
  tokenNumber: string; // OPD queue token e.g., TK-0842
  createdAt: Date;
  updatedAt: Date;
}

const PatientIntakeSchema: Schema = new Schema(
  {
    intakeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientSubmissionId: {
      type: String,
      index: true,
      sparse: true,
    },
    patientId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 125,
    },
    dob: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'undisclosed'],
      default: 'undisclosed',
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en',
    },
    visitDate: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    consent: {
      given: {
        type: Boolean,
        required: true,
        default: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      version: {
        type: String,
        default: '1.0',
      },
    },
    complaint: {
      selectedSymptoms: [{ type: String, trim: true }],
      customDescription: { type: String, trim: true, maxlength: 2000, default: '' },
      durationValue: { type: String, trim: true, required: true },
      durationUnit: {
        type: String,
        enum: ['hours', 'days', 'weeks', 'months', 'years'],
        default: 'days',
      },
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe', 'unspecified'],
        default: 'unspecified',
      },
    },
    history: {
      associatedSymptoms: [{ type: String, trim: true }],
      existingConditions: [{ type: String, trim: true }],
      pastSurgery: { type: String, default: 'no' },
      pastSurgeryDetails: { type: String, trim: true, maxlength: 1000, default: '' },
      currentMedications: { type: String, default: 'no' },
      medicationsDetails: { type: String, trim: true, maxlength: 1000, default: '' },
      knownAllergies: { type: String, default: 'no' },
      allergiesDetails: { type: String, trim: true, maxlength: 1000, default: '' },
      familyHistory: [{ type: String, trim: true }],
      dietType: { type: String, default: 'unspecified' },
      tobaccoUse: { type: String, default: 'no' },
      alcoholUse: { type: String, default: 'no' },
      sleepQuality: { type: String, default: 'unspecified' },
      conditionalFollowUpNotes: { type: String, trim: true, maxlength: 1000, default: '' },
    },
    emergency: {
      isTriggered: { type: Boolean, default: false },
      reasons: [{ type: String, trim: true }],
      acknowledged: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'completed', 'cancelled'],
      default: 'submitted',
      index: true,
    },
    tokenNumber: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PatientIntake = mongoose.model<IPatientIntake>(
  'PatientIntake',
  PatientIntakeSchema
);
