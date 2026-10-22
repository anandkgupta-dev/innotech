import type { PatientIntakeState } from '../types';

function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (!envUrl) {
    // In local development, use '/api' to leverage Vite dev proxy to backend port 5000
    return '/api';
  }
  const cleanUrl = envUrl.replace(/\/+$/, '');
  if (!cleanUrl.endsWith('/api')) {
    return `${cleanUrl}/api`;
  }
  return cleanUrl;
}

const API_BASE_URL = getApiBaseUrl();

export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  database: {
    status: 'connected' | 'connecting' | 'disconnecting' | 'disconnected';
    connected: boolean;
    name: string;
  };
  environment: string;
}

export interface IntakeSubmissionResponse {
  success: boolean;
  message?: string;
  duplicatePrevented?: boolean;
  error?: string;
  validationErrors?: string[];
  code?: string;
  data?: {
    intakeId: string;
    patientId: string;
    tokenNumber: string;
    visitDate: string;
    status?: string;
    createdAt?: string;
  };
}

/**
 * Health check to verify backend API and database status.
 */
export async function checkBackendHealth(): Promise<HealthCheckResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Submit patient clinical intake to the backend for persistent MongoDB storage.
 */
export async function submitPatientIntakeToBackend(
  state: PatientIntakeState
): Promise<IntakeSubmissionResponse> {
  // Generate a client idempotency key if not already present
  const clientSubmissionId = `SUB-${state.registration.patientId}-${state.registration.visitDate}`;

  const payload = {
    clientSubmissionId,
    consentGiven: state.consentGiven,
    registration: {
      patientId: state.registration.patientId,
      fullName: state.registration.fullName,
      age: Number(state.registration.age),
      dob: state.registration.dob,
      gender: state.registration.gender,
      preferredLanguage: state.registration.preferredLanguage,
      visitDate: state.registration.visitDate,
      phone: state.registration.phone,
    },
    complaint: {
      selectedSymptoms: state.complaint.selectedSymptoms,
      customDescription: state.complaint.customDescription,
      durationValue: state.complaint.durationValue,
      durationUnit: state.complaint.durationUnit,
      severity: state.complaint.severity,
    },
    history: {
      associatedSymptoms: state.history.associatedSymptoms,
      existingConditions: state.history.existingConditions,
      pastSurgery: state.history.pastSurgery,
      pastSurgeryDetails: state.history.pastSurgeryDetails,
      currentMedications: state.history.currentMedications,
      medicationsDetails: state.history.medicationsDetails,
      knownAllergies: state.history.knownAllergies,
      allergiesDetails: state.history.allergiesDetails,
      familyHistory: state.history.familyHistory,
      dietType: state.history.dietType,
      tobaccoUse: state.history.tobaccoUse,
      alcoholUse: state.history.alcoholUse,
      sleepQuality: state.history.sleepQuality,
      conditionalFollowUpNotes: state.history.conditionalFollowUpNotes,
    },
    emergency: {
      isTriggered: state.emergency.isTriggered,
      reasons: state.emergency.reasons,
      acknowledged: state.emergency.acknowledged,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const res = await fetch(`${API_BASE_URL}/patients/intake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return {
        success: false,
        error: `Backend endpoint returned non-JSON response (${res.status}). Verify that VITE_API_BASE_URL is set to your live backend URL in Vercel settings and redeploy.`,
        code: 'INVALID_RESPONSE',
      };
    }

    const json = await res.json();
    return json;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        error: 'Network request timed out. Hospital server took too long to respond.',
        code: 'TIMEOUT',
      };
    }
    return {
      success: false,
      error: 'Unable to reach backend service. Server may be offline or unreachable.',
      code: 'NETWORK_ERROR',
    };
  }
}
