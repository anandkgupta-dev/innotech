import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { createAuditEntry } from '../models/AuditLog.js';

export interface ClinicianSession {
  staffId: string;
  name: string;
  role: 'doctor' | 'nurse' | 'evaluator';
  department: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Checks whether the current process is executing in a production deployment.
 */
export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

/**
 * Resolves the server HMAC signing secret for clinician session tokens.
 * Fails closed in production if neither CLINICIAN_PORTAL_KEY nor CLINICIAN_ACCESS_KEY is set.
 * Never logs the secret value.
 */
export function getServerAuthSecret(): string | null {
  const secret = process.env.CLINICIAN_PORTAL_KEY || process.env.CLINICIAN_ACCESS_KEY;
  if (secret && secret.trim()) {
    return secret.trim();
  }
  if (isProductionEnvironment()) {
    // Strictly fail closed in production: no default secret permitted
    return null;
  }
  // Local development default fallback only
  return 'medikiosk-clinical-staff-secure-2026';
}

/**
 * Resolves the valid clinician staff passcode.
 * Fails closed in production if CLINICIAN_STAFF_PASSCODE is not configured.
 * Never logs the passcode value.
 */
export function getValidStaffPasscode(): string | null {
  const code = process.env.CLINICIAN_STAFF_PASSCODE;
  if (code && code.trim()) {
    return code.trim();
  }
  if (isProductionEnvironment()) {
    // Strictly fail closed in production: no default passcode permitted
    return null;
  }
  // Local development default fallback only
  return 'DOCTOR2026';
}

/**
 * Generates an HMAC-signed session token for authorized clinical staff.
 * Token expires in 8 hours. Fails closed if the signing secret is unavailable.
 */
export function generateClinicianToken(session: Omit<ClinicianSession, 'issuedAt' | 'expiresAt'>): string {
  const secret = getServerAuthSecret();
  if (!secret) {
    throw new Error('Clinician token generation rejected: portal secret key missing in production.');
  }

  const issuedAt = Date.now();
  const expiresAt = issuedAt + 8 * 60 * 60 * 1000; // 8 hours valid
  const payload: ClinicianSession = {
    ...session,
    issuedAt,
    expiresAt,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Verifies a clinician token signature and expiration.
 * Fails closed if the signing secret is unavailable.
 */
export function verifyClinicianToken(token: string): ClinicianSession | null {
  if (!token || typeof token !== 'string') return null;
  const secret = getServerAuthSecret();
  if (!secret) return null; // Fail closed if secret missing

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const session = JSON.parse(jsonStr) as ClinicianSession;
    if (Date.now() > session.expiresAt) {
      return null; // Expired
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Authenticates clinician login credentials on the server.
 * In production:
 * 1. Fails closed if CLINICIAN_STAFF_PASSCODE or CLINICIAN_PORTAL_KEY is missing.
 * 2. ENABLE_DEMO_EVALUATION is disabled by default in production.
 * 3. Never logs credentials or secrets.
 */
export async function authenticateClinicianCredentials(
  staffId: string,
  passcode: string,
  meta: { ip?: string; userAgent?: string }
): Promise<{ success: boolean; token?: string; session?: ClinicianSession; error?: string }> {
  const cleanId = (staffId || '').trim();
  const cleanPasscode = (passcode || '').trim();

  if (!cleanId || !cleanPasscode) {
    return { success: false, error: 'Staff ID and access passcode are required.' };
  }

  const isProd = isProductionEnvironment();
  const validPasscode = getValidStaffPasscode();
  const serverSecret = getServerAuthSecret();

  // Fail closed in production if required environment variables are missing
  if (isProd && (!validPasscode || !serverSecret)) {
    console.error('❌ [Clinician Auth] Production configuration missing: CLINICIAN_STAFF_PASSCODE or CLINICIAN_PORTAL_KEY is not set. Failing closed.');
    await createAuditEntry('CLINICIAN_AUTH_FAILED', {
      patientId: cleanId,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      status: 'FAILURE',
      details: { staffId: cleanId, reason: 'Production configuration error: missing clinician credentials' },
    });
    return {
      success: false,
      error: 'Clinician portal authentication is unconfigured on this production instance. Contact system administrator.',
    };
  }

  // Demo evaluation mode is strictly disabled by default in production
  const allowDemoLogin = isProd
    ? process.env.ENABLE_DEMO_EVALUATION === 'true'
    : process.env.ENABLE_DEMO_EVALUATION !== 'false';

  const isDemoStaffCandidate =
    (cleanId.toLowerCase().startsWith('demo') || cleanId.toLowerCase() === 'evaluator') &&
    cleanPasscode.toUpperCase() === 'DEMO';

  if ((isDemoStaffCandidate || cleanPasscode.toUpperCase() === 'DEMO') && !allowDemoLogin) {
    await createAuditEntry('CLINICIAN_AUTH_FAILED', {
      patientId: cleanId,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      status: 'FAILURE',
      details: { staffId: cleanId, reason: 'Demo evaluator sign-in disabled in production deployment' },
    });
    return {
      success: false,
      error: 'Demo evaluator sign-in is disabled in production environment (ENABLE_DEMO_EVALUATION not set).',
    };
  }

  const isDemoStaff = isDemoStaffCandidate && allowDemoLogin;
  const isAuthorized = (validPasscode !== null && cleanPasscode === validPasscode) || isDemoStaff;

  if (!isAuthorized) {
    await createAuditEntry('CLINICIAN_AUTH_FAILED', {
      patientId: cleanId,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      status: 'FAILURE',
      details: { staffId: cleanId, reason: 'Invalid passcode' },
    });
    return { success: false, error: 'Invalid clinician ID or staff passcode.' };
  }

  const role: 'evaluator' | 'doctor' = isDemoStaff ? 'evaluator' : 'doctor';
  const name = isDemoStaff ? 'Clinical Evaluator (Demo Mode)' : 'Dr. Sunita Rao, MD';
  const department = isDemoStaff ? 'Academic Evaluation & QA' : 'Internal Medicine & OPD';

  const token = generateClinicianToken({
    staffId: cleanId,
    name,
    role,
    department,
  });

  const verified = verifyClinicianToken(token);

  await createAuditEntry('CLINICIAN_AUTH_SUCCESS', {
    patientId: cleanId,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    status: 'SUCCESS',
    details: { staffId: cleanId, role, department },
  });

  return { success: true, token, session: verified || undefined };
}

/**
 * Express middleware to enforce clinician authentication on protected endpoints.
 */
export async function requireClinicianAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const directKey = req.headers['x-clinician-key'] as string | undefined;

  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-clinician-token']) {
    token = (req.headers['x-clinician-token'] as string).trim();
  }

  // 1. Check signed session token
  if (token) {
    const session = verifyClinicianToken(token);
    if (session) {
      (req as any).clinician = session;
      return next();
    }
  }

  // 2. Direct key fallback for internal integration test scripts (strictly disallowed in production)
  const isProd = isProductionEnvironment();
  const secret = getServerAuthSecret();
  if (directKey && secret && directKey === secret && !isProd) {
    (req as any).clinician = {
      staffId: 'SCRIPT-TESTER',
      name: 'Automated Test Runner',
      role: 'evaluator',
      department: 'QA & Verification',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 60000,
    };
    return next();
  }

  res.status(401).json({
    success: false,
    error: 'Clinician authentication required. Please unlock the clinical portal with authorized staff credentials.',
    code: 'UNAUTHORIZED_CLINICIAN',
  });
}
