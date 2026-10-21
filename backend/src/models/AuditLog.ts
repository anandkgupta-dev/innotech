import mongoose, { Document, Schema } from 'mongoose';

export type AuditAction =
  | 'INTAKE_CREATED'
  | 'INTAKE_ACCESSED'
  | 'INTAKE_DUPLICATE_PREVENTED'
  | 'HEALTH_CHECK';

export interface IAuditLog extends Document {
  action: AuditAction;
  intakeId?: string;
  patientId?: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILURE' | 'ERROR';
  details?: Record<string, unknown>;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    action: {
      type: String,
      required: true,
      index: true,
    },
    intakeId: {
      type: String,
      index: true,
    },
    patientId: {
      type: String,
      index: true,
    },
    ipAddress: {
      type: String,
      default: 'unknown',
    },
    userAgent: {
      type: String,
      default: 'unknown',
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE', 'ERROR'],
      default: 'SUCCESS',
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    // Capped collection or auto-indexed collection for audit records
    timestamps: false,
  }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

/**
 * Log an audit event securely without medical data exposure.
 */
export async function createAuditEntry(
  action: AuditAction,
  options: {
    intakeId?: string;
    patientId?: string;
    ipAddress?: string;
    userAgent?: string;
    status?: 'SUCCESS' | 'FAILURE' | 'ERROR';
    details?: Record<string, unknown>;
  }
): Promise<void> {
  try {
    // Only attempt to save if database is connected
    if (mongoose.connection.readyState === 1) {
      await AuditLog.create({
        action,
        intakeId: options.intakeId,
        patientId: options.patientId,
        ipAddress: options.ipAddress || 'unknown',
        userAgent: options.userAgent || 'unknown',
        status: options.status || 'SUCCESS',
        details: options.details || {},
        timestamp: new Date(),
      });
    }
  } catch (err) {
    // Audit logging failure should never crash the main clinical API
    console.warn('⚠️ [AuditLog] Failed to persist audit record:', err instanceof Error ? err.message : err);
  }
}
