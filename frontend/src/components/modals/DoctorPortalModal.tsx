import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  Stethoscope, 
  FileText, 
  CheckCircle, 
  Edit3, 
  Flame,
  AlertTriangle,
  Clock,
  RefreshCw,
  Lock,
  Unlock,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  FileSearch,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  loginClinician, 
  fetchClinicianPatientQueue, 
  fetchPatientDetail, 
  saveDoctorReview,
  type QueuePatientItem,
  type FullPatientRecord,
  type ClinicianSession
} from '../../services/api';

interface DoctorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSampleMode: boolean;
}

const SESSION_TOKEN_KEY = 'medikiosk_clinician_token';
const SESSION_DATA_KEY = 'medikiosk_clinician_session';

export const DoctorPortalModal: React.FC<DoctorPortalModalProps> = ({
  isOpen,
  onClose,
  isSampleMode,
}) => {
  const { language } = useLanguage();

  // Auth State
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem(SESSION_TOKEN_KEY);
  });
  const [session, setSession] = useState<ClinicianSession | null>(() => {
    const raw = sessionStorage.getItem(SESSION_DATA_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [staffIdInput, setStaffIdInput] = useState<string>('DR-RAO-14');
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Queue State
  const [queue, setQueue] = useState<QueuePatientItem[]>([]);
  const [queueLoading, setQueueLoading] = useState<boolean>(false);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [queueFilter, setQueueFilter] = useState<'all' | 'verified' | 'demo' | 'unclassified'>(isSampleMode ? 'demo' : 'all');

  // Selected Patient State
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientRecord, setPatientRecord] = useState<FullPatientRecord | null>(null);
  const [patientLoading, setPatientLoading] = useState<boolean>(false);
  const [patientError, setPatientError] = useState<string | null>(null);

  // Tabs & Doctor Review Form State
  const [activeTab, setActiveTab] = useState<'summary' | 'ayush' | 'documents'>('summary');
  const [doctorNotes, setDoctorNotes] = useState<string>('');
  const [allowAmendment, setAllowAmendment] = useState<boolean>(false);
  const [reviewSaving, setReviewSaving] = useState<boolean>(false);
  const [reviewMessage, setReviewMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync sample mode prop with filter
  useEffect(() => {
    if (isSampleMode) {
      setQueueFilter('demo');
    }
  }, [isSampleMode]);

  // Load Queue function
  const loadQueue = useCallback(async (authToken: string) => {
    setQueueLoading(true);
    setQueueError(null);
    const res = await fetchClinicianPatientQueue(authToken, true);
    if (res.success) {
      setQueue(res.data);
    } else {
      setQueueError(res.error || 'Unable to retrieve clinical queue.');
      if (res.error?.includes('Unauthorized') || res.error?.includes('authentication')) {
        handleLogout();
        setAuthError('Your clinical staff session has expired. Please re-enter staff credentials.');
      }
    }
    setQueueLoading(false);
  }, []);

  // Fetch queue on token arrival
  useEffect(() => {
    if (isOpen && token) {
      loadQueue(token);
    }
  }, [isOpen, token, loadQueue]);

  // Handle staff login
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const res = await loginClinician(staffIdInput, passcodeInput);
    if (res.success && res.token) {
      setToken(res.token);
      setSession(res.session || null);
      sessionStorage.setItem(SESSION_TOKEN_KEY, res.token);
      if (res.session) {
        sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(res.session));
      }
      loadQueue(res.token);
    } else {
      setAuthError(res.error || 'Authentication rejected. Verify staff ID and passcode.');
    }
    setAuthLoading(false);
  };

  const handleQuickDemoLogin = () => {
    setStaffIdInput('DEMO-DOC');
    setPasscodeInput('DEMO');
    setTimeout(() => {
      loginClinician('DEMO-DOC', 'DEMO').then((res) => {
        if (res.success && res.token) {
          setToken(res.token);
          setSession(res.session || null);
          sessionStorage.setItem(SESSION_TOKEN_KEY, res.token);
          if (res.session) sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(res.session));
          loadQueue(res.token);
        }
      });
    }, 50);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_DATA_KEY);
    setToken(null);
    setSession(null);
    setSelectedPatientId(null);
    setPatientRecord(null);
    setQueue([]);
  };

  // Select patient to review
  const handleSelectPatient = async (id: string) => {
    if (!token) return;
    setSelectedPatientId(id);
    setPatientLoading(true);
    setPatientError(null);
    setReviewMessage(null);
    setActiveTab('summary');

    const res = await fetchPatientDetail(id, token);
    if (res.success && res.data) {
      setPatientRecord(res.data);
      setDoctorNotes(res.data.doctorNotes || '');
    } else {
      setPatientError(res.error || 'Failed to retrieve patient clinical intake.');
    }
    setPatientLoading(false);
  };

  // Back to queue
  const handleBackToQueue = () => {
    setSelectedPatientId(null);
    setPatientRecord(null);
    setReviewMessage(null);
    if (token) loadQueue(token);
  };

  // Save Doctor Review & Sign-Off
  const handleSaveReview = async (isApproved: boolean) => {
    if (!token || !selectedPatientId || !patientRecord) return;
    setReviewSaving(true);
    setReviewMessage(null);

    const reviewerName = session?.name || 'Dr. Sunita Rao, MD';
    const res = await saveDoctorReview(
      selectedPatientId,
      {
        doctorNotes,
        isApproved,
        reviewedBy: reviewerName,
        allowAmendment,
      },
      token
    );

    if (res.success && res.data) {
      setPatientRecord((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          doctorNotes: res.data.doctorNotes,
          review: res.data.review,
          status: res.data.status,
        };
      });
      setReviewMessage({
        type: 'success',
        text: isApproved 
          ? `Clinical intake draft approved and signed by ${reviewerName}. Saved to MongoDB.` 
          : 'Doctor examination notes saved successfully to MongoDB.',
      });
      setAllowAmendment(false);
      // Refresh background queue
      loadQueue(token);
    } else {
      if (res.code === 'ALREADY_COMPLETED') {
        setReviewMessage({
          type: 'error',
          text: 'This intake is already signed off. To update notes, please check "Clinical Amendment Authorization" below.',
        });
      } else {
        setReviewMessage({
          type: 'error',
          text: res.error || 'Failed to save review. Please check server connectivity.',
        });
      }
    }
    setReviewSaving(false);
  };

  if (!isOpen) return null;

  const getClassification = (item: any): 'verified_patient' | 'synthetic_demo' | 'legacy_unclassified' => {
    if (item.recordClassification) return item.recordClassification;
    const isSynthetic =
      item.isDemo === true ||
      (item.patientId && (item.patientId.startsWith('TEST-') || item.patientId.startsWith('SYNTH-'))) ||
      (item.fullName && item.fullName.toLowerCase().includes('synthetic')) ||
      (item.clientSubmissionId && item.clientSubmissionId.startsWith('TEST-'));
    if (isSynthetic) return 'synthetic_demo';
    if (item.isDemo === false) return 'verified_patient';
    return 'legacy_unclassified';
  };

  // Filtered queue items
  const filteredQueue = queue.filter((item) => {
    const c = getClassification(item);
    if (queueFilter === 'verified') return c === 'verified_patient';
    if (queueFilter === 'demo') return c === 'synthetic_demo';
    if (queueFilter === 'unclassified') return c === 'legacy_unclassified';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 duration-150 max-h-[94vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-900">
                  {language === 'hi' ? 'चिकित्सक व क्लिनिकल स्टाफ समीक्षा पोर्टल' : 'Doctor & Clinical Staff Review Desk'}
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-teal-100 text-teal-800 rounded border border-teal-300">
                  {token ? (session?.name || 'Authorized Staff') : 'Authentication Required'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {token ? `${session?.department || 'OPD Medicine'} • Staff ID: ${session?.staffId}` : 'Hospital clinical record management platform'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-rose-700 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                title="Lock Clinical Desk"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Desk</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: Clinician Login Gate (When not authenticated)                     */}
        {/* ========================================================================= */}
        {!token && (
          <div className="py-8 px-4 flex flex-col items-center justify-center max-w-md mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-lg text-slate-900 mb-1">
              Authorized Clinician Sign-In
            </h4>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Patient health records are confidential and protected by server-verified authorization. Please verify your clinical staff credentials to view patient intakes.
            </p>

            {authError && (
              <div className="w-full mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinician Staff ID
                </label>
                <input
                  type="text"
                  value={staffIdInput}
                  onChange={(e) => setStaffIdInput(e.target.value)}
                  placeholder="e.g. DR-RAO-14"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Staff Access Passcode
                </label>
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter staff passcode"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {authLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
                <span>Unlock Clinical Desk</span>
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-200 w-full text-center">
              <span className="text-[11px] text-slate-400 block mb-2">Evaluator or demo reviewer?</span>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1.5 py-1 px-3 rounded-md bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Unlock with Demo Evaluator Credentials</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: Patient Intake Queue (When authenticated & no patient selected)   */}
        {/* ========================================================================= */}
        {token && !selectedPatientId && (
          <div className="py-3 flex-1 flex flex-col overflow-hidden">
            {/* Filter and Queue Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQueueFilter('all')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    queueFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({queue.length})
                </button>
                <button
                  type="button"
                  onClick={() => setQueueFilter('verified')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    queueFilter === 'verified'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Verified ({queue.filter((p) => getClassification(p) === 'verified_patient').length})
                </button>
                <button
                  type="button"
                  onClick={() => setQueueFilter('demo')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    queueFilter === 'demo'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Demo ({queue.filter((p) => getClassification(p) === 'synthetic_demo').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQueueFilter('unclassified')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    queueFilter === 'unclassified'
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unclassified ({queue.filter((p) => getClassification(p) === 'legacy_unclassified').length})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => token && loadQueue(token)}
                  disabled={queueLoading}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Refresh Queue"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${queueLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Queue Error Banner */}
            {queueError && (
              <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                <span>{queueError}</span>
                <button
                  type="button"
                  onClick={() => token && loadQueue(token)}
                  className="font-bold underline cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Queue List Content */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-2.5">
              {queueLoading && queue.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-teal-600" />
                  <p className="text-xs">Fetching live patient records from MongoDB Atlas...</p>
                </div>
              ) : filteredQueue.length === 0 ? (
                <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <FileSearch className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                  <h4 className="font-bold text-sm text-slate-700">No Patient Records in this View</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {queueFilter === 'verified'
                      ? 'No verified patient intakes found. Patients completing self-intake at the kiosk will appear here.'
                      : queueFilter === 'unclassified'
                      ? 'No unclassified legacy records found in MongoDB.'
                      : queueFilter === 'demo'
                      ? 'No synthetic demo records found. Run the test script or submit demo intakes to inspect them.'
                      : 'No patient intake records found in the database.'}
                  </p>
                </div>
              ) : (
                filteredQueue.map((patient) => {
                  const isEmergency = Boolean(patient.emergency?.isTriggered);
                  const isSigned = patient.status === 'completed' || patient.review?.isApproved;

                  return (
                    <div
                      key={patient.intakeId}
                      className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isEmergency
                          ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50'
                          : isSigned
                          ? 'border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {patient.tokenNumber}
                          </span>
                          <span className="font-bold text-sm text-slate-900">
                            {patient.fullName}
                          </span>
                          <span className="text-slate-500 font-medium">
                            ({patient.age}y / {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)})
                          </span>

                          {getClassification(patient) === 'synthetic_demo' && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded border border-amber-300">
                              SYNTHETIC DEMO
                            </span>
                          )}
                          {getClassification(patient) === 'legacy_unclassified' && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-700 rounded border border-slate-300" title="Legacy record without isDemo classification">
                              LEGACY / UNVERIFIED
                            </span>
                          )}
                          {getClassification(patient) === 'verified_patient' && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded border border-emerald-300">
                              VERIFIED PATIENT
                            </span>
                          )}

                          {isEmergency && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-rose-600 text-white rounded">
                              <AlertTriangle className="w-3 h-3" />
                              <span>RED FLAG TRIGGERED</span>
                            </span>
                          )}

                          {isSigned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Signed Off</span>
                            </span>
                          )}
                        </div>

                        {/* Chief complaint summary */}
                        <div className="text-slate-600">
                          <span className="font-semibold text-slate-700">Complaint: </span>
                          <span>
                            {patient.complaint?.selectedSymptoms?.length
                              ? patient.complaint.selectedSymptoms.join(', ')
                              : patient.complaint?.customDescription || 'General check-up'}
                          </span>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="text-slate-500">
                            Duration: {patient.complaint?.durationValue} {patient.complaint?.durationUnit}
                          </span>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="text-slate-500">
                            Severity: <strong className="capitalize">{patient.complaint?.severity}</strong>
                          </span>
                        </div>

                        {/* Submission time metadata */}
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Submitted: {new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Visit: {patient.visitDate}</span>
                          </span>
                          <span>ID: {patient.patientId}</span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectPatient(patient.intakeId)}
                          className="px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>Review Intake</span>
                          <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: Selected Patient Clinical Review (Master Record Detail)           */}
        {/* ========================================================================= */}
        {token && selectedPatientId && (
          <div className="py-2 flex-1 flex flex-col overflow-hidden">
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <button
                type="button"
                onClick={handleBackToQueue}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Patient Queue</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Record ID:</span>
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {selectedPatientId}
                </span>
              </div>
            </div>

            {patientLoading ? (
              <div className="py-20 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-teal-600" />
                <p className="text-xs">Loading patient intake from hospital database...</p>
              </div>
            ) : patientError ? (
              <div className="p-4 my-auto rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center">
                <p className="font-bold mb-2">{patientError}</p>
                <button
                  type="button"
                  onClick={() => handleSelectPatient(selectedPatientId)}
                  className="px-3 py-1 bg-rose-700 text-white rounded font-semibold cursor-pointer"
                >
                  Retry Loading
                </button>
              </div>
            ) : patientRecord ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Patient Verified Header */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-slate-500 block">Patient</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {patientRecord.fullName} ({patientRecord.age}y / {patientRecord.gender})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">OPD Token #</span>
                      <span className="font-mono font-bold text-slate-800">
                        {patientRecord.tokenNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Reported Allergies</span>
                      {patientRecord.history?.knownAllergies === 'yes' && patientRecord.history.allergiesDetails ? (
                        <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          {patientRecord.history.allergiesDetails}
                        </span>
                      ) : (
                        <span className="text-slate-600">No known drug allergies reported</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {patientRecord.isDemo && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded border border-amber-300">
                        SYNTHETIC RECORD
                      </span>
                    )}
                    {patientRecord.emergency?.isTriggered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-600 text-white">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Red Flag Triggered</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>No Red Flags</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Prominent Emergency Alert Box if Triggered */}
                {patientRecord.emergency?.isTriggered && (
                  <div className="mb-3 p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm block text-rose-800 mb-1">
                        High Priority Triage Red Flag Detected
                      </span>
                      <p className="leading-relaxed mb-1">
                        Patient self-intake indicated critical symptoms: <strong>{patientRecord.emergency.reasons?.join('; ') || 'High risk clinical presentation'}</strong>.
                      </p>
                      <p className="text-[11px] text-rose-700 italic">
                        Notice: This kiosk is for preliminary history taking and does NOT replace emergency clinical judgment or casualty resuscitation protocols.
                      </p>
                    </div>
                  </div>
                )}

                {/* Review Message feedback banner */}
                {reviewMessage && (
                  <div
                    className={`mb-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                      reviewMessage.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}
                  >
                    {reviewMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{reviewMessage.text}</span>
                  </div>
                )}

                {/* Tabs Navigation */}
                <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('summary')}
                    className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'summary'
                        ? 'border-sky-600 text-sky-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Structured Clinical Summary
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ayush')}
                    className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'ayush'
                        ? 'border-teal-600 text-teal-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>AYUSH Assessment</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('documents')}
                    className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'documents'
                        ? 'border-indigo-600 text-indigo-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Scanned Documents ({patientRecord.documents?.length || 0})
                  </button>
                </div>

                {/* Tab Content Body */}
                <div className="overflow-y-auto flex-1 pr-1 space-y-4 text-xs sm:text-sm">
                  {/* TAB 1: SUMMARY */}
                  {activeTab === 'summary' && (
                    <div className="space-y-4">
                      {/* Section A: Patient Reported Chief Complaint */}
                      <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sky-900 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-sky-700" />
                            <span>Patient-Reported Chief Complaint (HPI Draft)</span>
                          </span>
                          <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                            Self-Reported
                          </span>
                        </div>
                        <div className="space-y-1.5 text-slate-800 leading-relaxed font-sans">
                          <div>
                            <span className="font-semibold text-slate-700">Reported Symptoms: </span>
                            <span>{patientRecord.complaint?.selectedSymptoms?.join(', ') || 'None selected'}</span>
                          </div>
                          {patientRecord.complaint?.customDescription && (
                            <div>
                              <span className="font-semibold text-slate-700">Patient Description: </span>
                              <span className="italic">"{patientRecord.complaint.customDescription}"</span>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-slate-600 pt-1">
                            <span>
                              <strong>Duration:</strong> {patientRecord.complaint?.durationValue} {patientRecord.complaint?.durationUnit}
                            </span>
                            <span>
                              <strong>Severity:</strong> <span className="capitalize">{patientRecord.complaint?.severity}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section B: Medical History Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="border border-slate-200 rounded-xl p-3 bg-white">
                          <span className="font-bold text-slate-600 uppercase tracking-wide block mb-1.5 text-[11px]">
                            Associated Symptoms & Conditions
                          </span>
                          <div className="space-y-1 text-slate-700">
                            <p>
                              <strong>Associated:</strong> {patientRecord.history?.associatedSymptoms?.length ? patientRecord.history.associatedSymptoms.join(', ') : 'None reported'}
                            </p>
                            <p>
                              <strong>Existing Conditions:</strong> {patientRecord.history?.existingConditions?.length ? patientRecord.history.existingConditions.join(', ') : 'None reported'}
                            </p>
                            <p>
                              <strong>Family History:</strong> {patientRecord.history?.familyHistory?.length ? patientRecord.history.familyHistory.join(', ') : 'None reported'}
                            </p>
                          </div>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-3 bg-white">
                          <span className="font-bold text-slate-600 uppercase tracking-wide block mb-1.5 text-[11px]">
                            Medications, Surgeries & Allergies
                          </span>
                          <div className="space-y-1 text-slate-700">
                            <p>
                              <strong>Current Medications:</strong> {patientRecord.history?.currentMedications === 'yes' ? patientRecord.history.medicationsDetails || 'Reported, details pending' : 'None reported'}
                            </p>
                            <p>
                              <strong>Past Surgeries:</strong> {patientRecord.history?.pastSurgery === 'yes' ? patientRecord.history.pastSurgeryDetails || 'Reported, details pending' : 'None reported'}
                            </p>
                            <p>
                              <strong>Known Drug Allergies:</strong> {patientRecord.history?.knownAllergies === 'yes' ? patientRecord.history.allergiesDetails || 'Reported' : 'None reported'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section C: Doctor Notes & Sign-off Form */}
                      <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Edit3 className="w-4 h-4 text-teal-700" />
                            <span>Physician Examination Notes & Prescription Plan</span>
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {session?.name || 'Dr. Sunita Rao, MD'}
                          </span>
                        </div>
                        <textarea
                          value={doctorNotes}
                          onChange={(e) => setDoctorNotes(e.target.value)}
                          rows={3}
                          placeholder="Type clinical diagnosis, medications prescribed, dosage, and diagnostic test recommendations..."
                          className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />

                        {/* Sign-Off Status Footer */}
                        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div>
                            {patientRecord.review?.isApproved ? (
                              <div className="space-y-1.5">
                                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Signed by {patientRecord.review.reviewedBy || 'Attending Physician'} on {new Date(patientRecord.review.reviewedAt || Date.now()).toLocaleDateString()}</span>
                                </span>
                                <div className="flex items-center gap-2 pt-0.5">
                                  <input
                                    type="checkbox"
                                    id="allowAmendmentCheck"
                                    checked={allowAmendment}
                                    onChange={(e) => setAllowAmendment(e.target.checked)}
                                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer h-3.5 w-3.5"
                                  />
                                  <label htmlFor="allowAmendmentCheck" className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 cursor-pointer select-none">
                                    Authorize Clinical Amendment (allow modifying signed intake)
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px]">
                                Status: Draft intake unapproved. Saving with approval will mark intake completed.
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveReview(false)}
                              disabled={reviewSaving}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {reviewSaving ? 'Saving...' : 'Save Draft Notes'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSaveReview(true)}
                              disabled={reviewSaving}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{patientRecord.review?.isApproved ? 'Update & Re-Sign' : 'Approve & Sign Intake'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: AYUSH */}
                  {activeTab === 'ayush' && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                        <span className="font-bold block mb-1">
                          AYUSH Assessment & Ahara-Vihara (Lifestyle) Capture
                        </span>
                        <p className="leading-relaxed">
                          Integrated AYUSH institutional workflow. Captured lifestyle and dietary parameters are displayed below. Specialized clinical assessments (Dashavidha Pariksha) require in-person physician validation.
                        </p>
                      </div>

                      {/* Real Captured Lifestyle Parameters */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-1.5">
                          <span className="font-bold text-slate-800 block text-xs">Ahara (Dietary Intake)</span>
                          <p className="text-slate-700">
                            <strong>Diet Type:</strong> <span className="capitalize">{patientRecord.history?.dietType || 'Not specified'}</span>
                          </p>
                          <p className="text-slate-700">
                            <strong>Tobacco Use:</strong> <span className="capitalize">{patientRecord.history?.tobaccoUse || 'None reported'}</span>
                          </p>
                          <p className="text-slate-700">
                            <strong>Alcohol Use:</strong> <span className="capitalize">{patientRecord.history?.alcoholUse || 'None reported'}</span>
                          </p>
                        </div>

                        <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-1.5">
                          <span className="font-bold text-slate-800 block text-xs">Vihara (Daily Routine & Sleep)</span>
                          <p className="text-slate-700">
                            <strong>Sleep Quality:</strong> <span className="capitalize">{patientRecord.history?.sleepQuality || 'Not specified'}</span>
                          </p>
                          {patientRecord.history?.conditionalFollowUpNotes && (
                            <p className="text-slate-700">
                              <strong>Notes:</strong> {patientRecord.history.conditionalFollowUpNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Dashavidha Pariksha Honest Evaluation Status */}
                      <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50">
                        <span className="font-bold text-slate-700 block mb-2">Dashavidha Pariksha Status</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                            <span className="font-bold text-slate-800 block">Prakriti</span>
                            <span className="text-slate-500 italic text-[11px]">Not assessed / Pending physician Nadi Pariksha</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                            <span className="font-bold text-slate-800 block">Agni (Digestive Fire)</span>
                            <span className="text-slate-500 italic text-[11px]">Not assessed / Pending in-person assessment</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                            <span className="font-bold text-slate-800 block">Koshtha / Dhatu</span>
                            <span className="text-slate-500 italic text-[11px]">Not assessed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: DOCUMENTS */}
                  {activeTab === 'documents' && (
                    <div className="space-y-3 text-xs">
                      {/* Honest OCR Banner */}
                      <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900">
                        <div className="flex items-center gap-2 mb-1">
                          <FileSearch className="w-4 h-4 text-indigo-700 shrink-0" />
                          <span className="font-bold">Medical Document & Prescription Digitization Engine</span>
                        </div>
                        <p className="leading-relaxed">
                          OCR processing and automatic prescription entity extraction are scheduled for Phase 4 implementation. The platform does not claim automated OCR verification until the digitization pipeline is integrated.
                        </p>
                      </div>

                      {/* Uploaded Documents List */}
                      {patientRecord.documents && patientRecord.documents.length > 0 ? (
                        patientRecord.documents.map((doc) => (
                          <div
                            key={doc.documentId}
                            className="p-3 border border-slate-200 rounded-xl bg-white flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-indigo-600" />
                              <div>
                                <span className="font-semibold text-slate-900 block">{doc.fileName}</span>
                                <span className="text-slate-500 text-[11px]">
                                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()} • Status: {doc.ocrStatus}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                              {doc.ocrStatus}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                          <p className="font-semibold text-slate-700">No medical documents uploaded for this patient</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Patients can upload paper prescriptions and laboratory reports during physical kiosk intake.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            MediKiosk Platform • Hospital Clinical Informatics System
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
