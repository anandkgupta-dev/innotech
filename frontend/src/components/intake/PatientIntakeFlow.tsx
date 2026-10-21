import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { 
  PatientIntakeState, 
  IntakeStepId, 
  PatientRegistrationData, 
  ChiefComplaintData, 
  GuidedHistoryData 
} from '../../types';
import { StepLanguage } from './StepLanguage';
import { StepConsent } from './StepConsent';
import { StepRegistration } from './StepRegistration';
import { StepChiefComplaint } from './StepChiefComplaint';
import { StepGuidedHistory } from './StepGuidedHistory';
import { StepReview } from './StepReview';
import { IntakeSuccessModal } from './IntakeSuccessModal';
import { EmergencyRedFlagBanner } from './EmergencyRedFlagBanner';
import { Building2, X } from 'lucide-react';

interface PatientIntakeFlowProps {
  isDemoMode: boolean;
  onExit: () => void;
}

const initialRegistration: PatientRegistrationData = {
  patientId: '',
  fullName: '',
  age: '',
  gender: 'male',
  preferredLanguage: 'en',
  visitDate: new Date().toISOString().split('T')[0],
  phone: '',
};

const demoRegistration: PatientRegistrationData = {
  patientId: 'PAT-2026-0842',
  fullName: 'Ramesh Sharma',
  age: '54',
  gender: 'male',
  preferredLanguage: 'en',
  visitDate: new Date().toISOString().split('T')[0],
  phone: '9876543210',
};

const initialComplaint: ChiefComplaintData = {
  selectedSymptoms: [],
  customDescription: '',
  durationValue: '',
  durationUnit: 'days',
  severity: 'moderate',
};

const demoComplaint: ChiefComplaintData = {
  selectedSymptoms: ['Abdominal / Stomach Pain', 'Nausea / Vomiting'],
  customDescription: 'Burning epigastric pain for 3 weeks, worse after spicy food. Mild nausea.',
  durationValue: '3',
  durationUnit: 'weeks',
  severity: 'moderate',
};

const initialHistory: GuidedHistoryData = {
  associatedSymptoms: [],
  existingConditions: [],
  pastSurgery: 'no',
  pastSurgeryDetails: '',
  currentMedications: 'no',
  medicationsDetails: '',
  knownAllergies: 'no',
  allergiesDetails: '',
  familyHistory: [],
  dietType: 'vegetarian',
  tobaccoUse: 'no',
  alcoholUse: 'no',
  sleepQuality: 'good',
  conditionalFollowUpNotes: '',
};

const demoHistory: GuidedHistoryData = {
  associatedSymptoms: ['Post-prandial fullness'],
  existingConditions: ['Diabetes (High Blood Sugar)'],
  pastSurgery: 'no',
  pastSurgeryDetails: '',
  currentMedications: 'yes',
  medicationsDetails: 'Tab Metformin 500mg twice daily with meals',
  knownAllergies: 'yes',
  allergiesDetails: 'Penicillin (developed generalized rash 4 years ago)',
  familyHistory: ['Diabetes in family', 'Hypertension'],
  dietType: 'vegetarian',
  tobaccoUse: 'no',
  alcoholUse: 'no',
  sleepQuality: 'disturbed',
  conditionalFollowUpNotes: 'No vomiting blood. No melena or dark stools.',
};

export const PatientIntakeFlow: React.FC<PatientIntakeFlowProps> = ({
  isDemoMode,
  onExit,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const [intakeState, setIntakeState] = useState<PatientIntakeState>(() => {
    // Check session storage for saved demo session
    const saved = sessionStorage.getItem('medikiosk_intake_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore JSON parse errors
      }
    }
    return {
      step: 'language',
      consentGiven: isDemoMode,
      registration: isDemoMode ? demoRegistration : initialRegistration,
      complaint: isDemoMode ? demoComplaint : initialComplaint,
      history: isDemoMode ? demoHistory : initialHistory,
      emergency: {
        isTriggered: false,
        reasons: [],
        acknowledged: false,
      },
    };
  });


  const saveToSession = () => {
    sessionStorage.setItem('medikiosk_intake_draft', JSON.stringify(intakeState));
  };

  // Conservative Red-Flag Checker
  const checkEmergencyTriggers = (symptoms: string[], text: string) => {
    const triggers: string[] = [];
    const lowerText = text.toLowerCase();

    const hasChestPain = symptoms.some((s) => s.includes('Chest') || s.includes('सीने')) || lowerText.includes('chest pain') || lowerText.includes('सीने में दर्द');
    const hasBreathIssue = symptoms.some((s) => s.includes('Breath') || s.includes('सांस')) || lowerText.includes('shortness of breath') || lowerText.includes('breathless') || lowerText.includes('दम घुटना');
    const hasWeakness = symptoms.some((s) => s.includes('Weakness') || s.includes('कमजोरी')) || lowerText.includes('stroke') || lowerText.includes('paralysis') || lowerText.includes('सुन्नपन');

    if (hasChestPain && hasBreathIssue) {
      triggers.push(language === 'hi' ? 'सीने में दर्द के साथ सांस फूलना (Chest pain + Dyspnea)' : 'Chest pain combined with breathing difficulty');
    } else if (hasChestPain) {
      triggers.push(language === 'hi' ? 'सीने में भारी दबाव अथवा दर्द (Chest pain)' : 'Acute chest discomfort or pressure');
    }

    if (hasBreathIssue && !hasChestPain) {
      triggers.push(language === 'hi' ? 'गंभीर सांस फूलना या दम घुटना (Severe Dyspnea)' : 'Severe shortness of breath');
    }

    if (hasWeakness) {
      triggers.push(language === 'hi' ? 'अचानक अंगों की कमजोरी अथवा पक्षाघात के लक्षण (Sudden weakness/stroke signs)' : 'Sudden limb weakness or potential stroke symptoms');
    }

    if (triggers.length > 0) {
      setIntakeState((prev) => ({
        ...prev,
        emergency: {
          isTriggered: true,
          reasons: triggers,
          acknowledged: prev.emergency.acknowledged,
        },
      }));
    } else {
      setIntakeState((prev) => ({
        ...prev,
        emergency: {
          isTriggered: false,
          reasons: [],
          acknowledged: false,
        },
      }));
    }
  };

  const stepsList: IntakeStepId[] = [
    'language',
    'consent',
    'registration',
    'complaint',
    'history',
    'review',
  ];

  const currentStepIndex = stepsList.indexOf(intakeState.step);
  const totalSteps = stepsList.length;

  const goToStep = (nextStep: IntakeStepId) => {
    setIntakeState((prev) => ({ ...prev, step: nextStep }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Kiosk Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center shadow-2xs shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg">
                  {t('intakeHeaderTitle')}
                </span>
                {isDemoMode && (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 rounded border border-amber-300">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {t('hospitalName')} • OPD Wing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bilingual Language Switch */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  language === 'en' ? 'bg-sky-700 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  language === 'hi' ? 'bg-sky-700 text-white shadow-2xs' : 'text-slate-600'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Exit Kiosk Button */}
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">{t('exitKiosk')}</span>
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        {intakeState.step !== 'success' && currentStepIndex >= 0 && (
          <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2">
            <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-600 font-semibold mb-1.5">
              <span>
                {t('stepIndicator')} {currentStepIndex + 1} {t('ofText')} {totalSteps}
              </span>
              <span className="text-sky-800 font-bold capitalize">
                {intakeState.step === 'language'
                  ? t('step1Title')
                  : intakeState.step === 'consent'
                  ? t('stepConsentTitle')
                  : intakeState.step === 'registration'
                  ? t('stepRegTitle')
                  : intakeState.step === 'complaint'
                  ? t('stepComplaintTitle')
                  : intakeState.step === 'history'
                  ? t('stepHistoryTitle')
                  : t('stepReviewTitle')}
              </span>
            </div>
            <div className="max-w-6xl mx-auto w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Questionnaire Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Conservative Red-Flag Banner (if triggered) */}
        {intakeState.emergency.isTriggered && (
          <EmergencyRedFlagBanner
            reasons={intakeState.emergency.reasons}
            acknowledged={intakeState.emergency.acknowledged}
            onAcknowledge={() =>
              setIntakeState((prev) => ({
                ...prev,
                emergency: { ...prev.emergency, acknowledged: true },
              }))
            }
          />
        )}

        {/* Step Views */}
        {intakeState.step === 'language' && (
          <StepLanguage onContinue={() => goToStep('consent')} />
        )}

        {intakeState.step === 'consent' && (
          <StepConsent
            consentGiven={intakeState.consentGiven}
            onConsentChange={(consented) =>
              setIntakeState((prev) => ({
                ...prev,
                consentGiven: consented,
                consentTimestamp: consented ? new Date().toISOString() : undefined,
              }))
            }
            onContinue={() => goToStep('registration')}
            onBack={() => goToStep('language')}
          />
        )}

        {intakeState.step === 'registration' && (
          <StepRegistration
            data={intakeState.registration}
            onChange={(reg) => setIntakeState((prev) => ({ ...prev, registration: reg }))}
            onContinue={() => goToStep('complaint')}
            onBack={() => goToStep('consent')}
          />
        )}

        {intakeState.step === 'complaint' && (
          <StepChiefComplaint
            data={intakeState.complaint}
            onChange={(comp) => setIntakeState((prev) => ({ ...prev, complaint: comp }))}
            onCheckEmergency={checkEmergencyTriggers}
            onContinue={() => goToStep('history')}
            onBack={() => goToStep('registration')}
          />
        )}

        {intakeState.step === 'history' && (
          <StepGuidedHistory
            data={intakeState.history}
            complaintData={intakeState.complaint}
            onChange={(hist) => setIntakeState((prev) => ({ ...prev, history: hist }))}
            onSaveProgress={saveToSession}
            onContinue={() => goToStep('review')}
            onBack={() => goToStep('complaint')}
          />
        )}

        {intakeState.step === 'review' && (
          <StepReview
            intakeState={intakeState}
            onEditSection={(step) => goToStep(step)}
            onBack={() => goToStep('history')}
            onSubmit={() => {
              setIntakeState((prev) => ({
                ...prev,
                step: 'success',
                completedAt: new Date().toISOString(),
              }));
              sessionStorage.removeItem('medikiosk_intake_draft');
            }}
          />
        )}

        {intakeState.step === 'success' && (
          <IntakeSuccessModal
            intakeState={intakeState}
            onRestart={() => {
              sessionStorage.removeItem('medikiosk_intake_draft');
              setIntakeState({
                step: 'language',
                consentGiven: false,
                registration: initialRegistration,
                complaint: initialComplaint,
                history: initialHistory,
                emergency: {
                  isTriggered: false,
                  reasons: [],
                  acknowledged: false,
                },
              });
            }}
            onExit={onExit}
          />
        )}
      </main>
    </div>
  );
};
