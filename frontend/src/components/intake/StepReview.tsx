import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { PatientIntakeState, IntakeStepId } from '../../types';
import { 
  ClipboardCheck, 
  ArrowLeft, 
  Edit3, 
  AlertCircle, 
  User, 
  HeartPulse, 
  Activity, 
  Send,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface StepReviewProps {
  intakeState: PatientIntakeState;
  onEditSection: (step: IntakeStepId) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  onClearError?: () => void;
}

export const StepReview: React.FC<StepReviewProps> = ({
  intakeState,
  onEditSection,
  onSubmit,
  onBack,
  isSubmitting = false,
  submitError = null,
  onClearError,
}) => {
  const { t, language } = useLanguage();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { registration, complaint, history } = intakeState;

  const handleSubmit = () => {
    if (isSubmitting) return;
    if (!isConfirmed) {
      setErrorMessage(t('errReviewConfirmRequired'));
      return;
    }
    setErrorMessage(null);
    if (onClearError) onClearError();
    onSubmit();
  };

  const unansweredText = (
    <span className="text-slate-400 italic font-normal">
      {t('reviewUnanswered')}
    </span>
  );

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <ClipboardCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t('stepReviewTitle')}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          {t('stepReviewSubtitle')}
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Section 1: Patient Identity Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-700" />
              <span>{t('reviewPatientInfo')}</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditSection('registration')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('reviewEditBtn')}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block mb-0.5">{t('patientIdLabel')}</span>
              <span className="font-mono font-bold text-slate-900">{registration.patientId || unansweredText}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block mb-0.5">{t('fullNameLabel')}</span>
              <span className="font-bold text-slate-900">{registration.fullName || unansweredText}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block mb-0.5">{t('ageLabel')} / {t('genderLabel')}</span>
              <span className="font-bold text-slate-900">
                {registration.age ? `${registration.age}y` : unansweredText} • {registration.gender}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block mb-0.5">{t('visitDateLabel')}</span>
              <span className="font-bold text-slate-900">{registration.visitDate}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Chief Complaint & Symptoms */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>{t('reviewChiefComplaint')}</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditSection('complaint')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('reviewEditBtn')}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block text-xs mb-1 font-semibold uppercase">
                {language === 'hi' ? 'चुने गए लक्षण:' : 'Selected Symptoms:'}
              </span>
              {complaint.selectedSymptoms.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {complaint.selectedSymptoms.map((sym, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-900 font-semibold text-xs border border-sky-200"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              ) : (
                unansweredText
              )}
            </div>

            {complaint.customDescription && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-xs mb-1 font-semibold uppercase">
                  {language === 'hi' ? 'मरीज के शब्दों में विवरण:' : 'Patient Described in Own Words:'}
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {complaint.customDescription}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500 block">{t('durationTitle')}</span>
                <span className="font-bold text-slate-800">
                  {complaint.durationValue
                    ? `${complaint.durationValue} ${complaint.durationUnit}`
                    : unansweredText}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">{t('severityTitle')}</span>
                <span className="font-bold text-slate-800 capitalize">
                  {complaint.severity || unansweredText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Medical History & Routine */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>{t('reviewHistory')}</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditSection('history')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('reviewEditBtn')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block font-semibold mb-1 uppercase">
                {t('sectionConditions')}
              </span>
              <p className="text-slate-800 font-medium">
                {history.existingConditions.length > 0
                  ? history.existingConditions.join(', ')
                  : unansweredText}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block font-semibold mb-1 uppercase">
                {t('sectionMeds')}
              </span>
              <p className="text-slate-800 font-medium">
                {history.currentMedications === 'yes'
                  ? history.medicationsDetails || 'Yes (Details not specified)'
                  : history.currentMedications === 'no'
                  ? 'No / None'
                  : history.currentMedications}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block font-semibold mb-1 uppercase">
                {t('sectionAllergies')}
              </span>
              <p className="text-slate-800 font-medium">
                {history.knownAllergies === 'yes'
                  ? history.allergiesDetails || 'Yes (Details not specified)'
                  : history.knownAllergies === 'no'
                  ? 'No Known Allergies'
                  : history.knownAllergies}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block font-semibold mb-1 uppercase">
                {t('sectionSurgery')}
              </span>
              <p className="text-slate-800 font-medium">
                {history.pastSurgery === 'yes'
                  ? history.pastSurgeryDetails || 'Yes (Details not specified)'
                  : history.pastSurgery === 'no'
                  ? 'No major surgery'
                  : history.pastSurgery}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div
        onClick={() => {
          setIsConfirmed(!isConfirmed);
          if (!isConfirmed) setErrorMessage(null);
        }}
        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 mb-6 ${
          isConfirmed
            ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs'
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
      >
        <input
          type="checkbox"
          id="confirm-submit"
          checked={isConfirmed}
          onChange={(e) => {
            setIsConfirmed(e.target.checked);
            if (e.target.checked) setErrorMessage(null);
          }}
          className="mt-1 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
        />
        <label htmlFor="confirm-submit" className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed cursor-pointer select-none">
          {t('reviewConfirmLabel')}
        </label>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{t('submissionFailedTitle')}</p>
              <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">{submitError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>{t('submissionRetryBtn')}</span>
          </button>
        </div>
      )}

      {/* Nav Controls */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('previousButton')}</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-sm ${
            isSubmitting
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t('submittingIntake')}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{t('reviewSubmitBtn')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
