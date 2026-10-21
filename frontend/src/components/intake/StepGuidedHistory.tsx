import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { GuidedHistoryData, MedicalAnswerStatus, ChiefComplaintData } from '../../types';
import { VoiceInputButton } from './VoiceInputButton';
import { 
  ClipboardList, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Pill,
  ShieldAlert,
  Users,
  Activity,
  Heart
} from 'lucide-react';

interface StepGuidedHistoryProps {
  data: GuidedHistoryData;
  complaintData: ChiefComplaintData;
  onChange: (data: GuidedHistoryData) => void;
  onContinue: () => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export const StepGuidedHistory: React.FC<StepGuidedHistoryProps> = ({
  data,
  complaintData,
  onChange,
  onContinue,
  onBack,
  onSaveProgress,
}) => {
  const { t, language } = useLanguage();
  const [activeSubSection, setActiveSubSection] = useState<number>(1);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  // Common chronic conditions list
  const chronicConditions = [
    { id: 'diabetes', label: t('conditionDiabetes') },
    { id: 'hypertension', label: t('conditionHypertension') },
    { id: 'asthma', label: t('conditionAsthma') },
    { id: 'heart', label: t('conditionHeartDisease') },
    { id: 'thyroid', label: t('conditionThyroid') },
    { id: 'kidney', label: t('conditionKidney') },
    { id: 'none', label: t('conditionNone') },
  ];

  // Family conditions list
  const familyConditions = [
    { id: 'fam_diabetes', label: t('familyDiabetes') },
    { id: 'fam_heart', label: t('familyHeart') },
    { id: 'fam_htn', label: t('familyHypertension') },
    { id: 'fam_cancer', label: t('familyCancer') },
    { id: 'fam_none', label: t('familyNone') },
  ];

  const handleToggleCondition = (conditionLabel: string) => {
    let updated: string[];
    if (conditionLabel === t('conditionNone')) {
      updated = [conditionLabel];
    } else {
      const filtered = data.existingConditions.filter((c) => c !== t('conditionNone'));
      if (filtered.includes(conditionLabel)) {
        updated = filtered.filter((c) => c !== conditionLabel);
      } else {
        updated = [...filtered, conditionLabel];
      }
    }
    onChange({ ...data, existingConditions: updated });
  };

  const handleToggleFamilyCondition = (conditionLabel: string) => {
    let updated: string[];
    if (conditionLabel === t('familyNone')) {
      updated = [conditionLabel];
    } else {
      const filtered = data.familyHistory.filter((c) => c !== t('familyNone'));
      if (filtered.includes(conditionLabel)) {
        updated = filtered.filter((c) => c !== conditionLabel);
      } else {
        updated = [...filtered, conditionLabel];
      }
    }
    onChange({ ...data, familyHistory: updated });
  };

  const handleSave = () => {
    onSaveProgress();
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Complaint-specific adaptive prompt helper
  const hasChestPainOrBreath =
    complaintData.selectedSymptoms.some((s) => s.includes('Chest') || s.includes('सीने') || s.includes('Breath') || s.includes('सांस'));
  const hasAbdominalOrNausea =
    complaintData.selectedSymptoms.some((s) => s.includes('Abdominal') || s.includes('पेट') || s.includes('Nausea') || s.includes('उल्टी'));
  const hasCoughOrFever =
    complaintData.selectedSymptoms.some((s) => s.includes('Cough') || s.includes('खांसी') || s.includes('Fever') || s.includes('बुखार'));

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <ClipboardList className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t('stepHistoryTitle')}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          {t('stepHistorySubtitle')}
        </p>
      </div>

      {/* Sub-section tab chips for easy kiosk touch navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 text-xs font-semibold no-scrollbar">
        {[
          { id: 1, label: language === 'hi' ? 'पुरानी बीमारियां' : 'Conditions' },
          { id: 2, label: language === 'hi' ? 'दवाइयां' : 'Medications' },
          { id: 3, label: language === 'hi' ? 'एलर्जी' : 'Allergies' },
          { id: 4, label: language === 'hi' ? 'ऑपरेशन / भर्ती' : 'Surgeries' },
          { id: 5, label: language === 'hi' ? 'पारिवारिक' : 'Family' },
          { id: 6, label: language === 'hi' ? 'आदतें' : 'Lifestyle' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubSection(tab.id)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
              activeSubSection === tab.id
                ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {saveSuccessMsg && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{t('saveSuccess')}</span>
        </div>
      )}

      {/* Section 1: Chronic Conditions */}
      {activeSubSection === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>{t('sectionConditions')}</span>
          </h3>
          <p className="text-xs text-slate-600">
            {language === 'hi'
              ? 'क्या आप पूर्व में इनमें से किसी बीमारी के मरीज रहे हैं? लागू विकल्पों पर टैप करें:'
              : 'Have you been diagnosed with any of the following? Select all that apply:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {chronicConditions.map((cond) => {
              const isSelected = data.existingConditions.includes(cond.label);
              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => handleToggleCondition(cond.label)}
                  className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-200'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{cond.label}</span>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveSubSection(2)}
              className="text-xs text-teal-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'hi' ? 'अगला: दवाइयों का ब्योरा →' : 'Next: Current Medications →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Section 2: Current Medications */}
      {activeSubSection === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4 h-4 text-sky-600" />
            <span>{t('sectionMeds')}</span>
          </h3>
          <p className="text-xs text-slate-600">{t('medsPrompt')}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['yes', 'no', 'unknown', 'prefer-not-to-say'] as MedicalAnswerStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onChange({ ...data, currentMedications: status })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  data.currentMedications === status
                    ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-200'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {status === 'yes'
                  ? t('optYes')
                  : status === 'no'
                  ? t('optNo')
                  : status === 'unknown'
                  ? t('optDontKnow')
                  : t('optPreferNot')}
              </button>
            ))}
          </div>

          {data.currentMedications === 'yes' && (
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  {language === 'hi' ? 'दवाइयों के नाम और खुराक लिखें:' : 'List medicine names and dosage:'}
                </label>
                <VoiceInputButton
                  onTranscript={(txt) => {
                    const updated = data.medicationsDetails ? `${data.medicationsDetails}, ${txt}` : txt;
                    onChange({ ...data, medicationsDetails: updated });
                  }}
                />
              </div>
              <textarea
                rows={2}
                value={data.medicationsDetails}
                onChange={(e) => onChange({ ...data, medicationsDetails: e.target.value })}
                placeholder={t('medsDetailsPlaceholder')}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
          )}

          <div className="pt-2 flex justify-between text-xs font-bold text-teal-700">
            <button
              type="button"
              onClick={() => setActiveSubSection(1)}
              className="hover:underline cursor-pointer"
            >
              ← {language === 'hi' ? 'पिछला: पुरानी बीमारियां' : 'Back: Conditions'}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubSection(3)}
              className="hover:underline cursor-pointer"
            >
              {language === 'hi' ? 'अगला: एलर्जी →' : 'Next: Allergies →'}
            </button>
          </div>
        </div>
      )}

      {/* Section 3: Known Allergies */}
      {activeSubSection === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>{t('sectionAllergies')}</span>
          </h3>
          <p className="text-xs text-slate-600">{t('allergiesPrompt')}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['no', 'yes', 'unknown', 'prefer-not-to-say'] as MedicalAnswerStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onChange({ ...data, knownAllergies: status })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  data.knownAllergies === status
                    ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-200'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {status === 'yes'
                  ? t('optYes')
                  : status === 'no'
                  ? t('optNo')
                  : status === 'unknown'
                  ? t('optDontKnow')
                  : t('optPreferNot')}
              </button>
            ))}
          </div>

          {data.knownAllergies === 'yes' && (
            <div className="pt-2 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                {language === 'hi' ? 'एलर्जी पैदा करने वाली दवा या भोजन का नाम:' : 'Specific allergy details:'}
              </label>
              <input
                type="text"
                value={data.allergiesDetails}
                onChange={(e) => onChange({ ...data, allergiesDetails: e.target.value })}
                placeholder={t('allergiesDetailsPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              />
            </div>
          )}

          <div className="pt-2 flex justify-between text-xs font-bold text-teal-700">
            <button
              type="button"
              onClick={() => setActiveSubSection(2)}
              className="hover:underline cursor-pointer"
            >
              ← {language === 'hi' ? 'पिछला: दवाइयां' : 'Back: Medications'}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubSection(4)}
              className="hover:underline cursor-pointer"
            >
              {language === 'hi' ? 'अगला: ऑपरेशन / भर्ती →' : 'Next: Surgeries →'}
            </button>
          </div>
        </div>
      )}

      {/* Section 4: Past Surgeries */}
      {activeSubSection === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-indigo-600" />
            <span>{t('sectionSurgery')}</span>
          </h3>
          <p className="text-xs text-slate-600">{t('surgeryPrompt')}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['yes', 'no', 'unknown', 'prefer-not-to-say'] as MedicalAnswerStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onChange({ ...data, pastSurgery: status })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  data.pastSurgery === status
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {status === 'yes'
                  ? t('optYes')
                  : status === 'no'
                  ? t('optNo')
                  : status === 'unknown'
                  ? t('optDontKnow')
                  : t('optPreferNot')}
              </button>
            ))}
          </div>

          {data.pastSurgery === 'yes' && (
            <div className="pt-2 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                {language === 'hi' ? 'ऑपरेशन का नाम व संभावित वर्ष:' : 'Surgery name & approximate year:'}
              </label>
              <input
                type="text"
                value={data.pastSurgeryDetails}
                onChange={(e) => onChange({ ...data, pastSurgeryDetails: e.target.value })}
                placeholder={t('surgeryDetailsPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          )}

          <div className="pt-2 flex justify-between text-xs font-bold text-teal-700">
            <button
              type="button"
              onClick={() => setActiveSubSection(3)}
              className="hover:underline cursor-pointer"
            >
              ← {language === 'hi' ? 'पिछला: एलर्जी' : 'Back: Allergies'}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubSection(5)}
              className="hover:underline cursor-pointer"
            >
              {language === 'hi' ? 'अगला: पारिवारिक इतिहास →' : 'Next: Family History →'}
            </button>
          </div>
        </div>
      )}

      {/* Section 5: Family History */}
      {activeSubSection === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span>{t('sectionFamily')}</span>
          </h3>
          <p className="text-xs text-slate-600">{t('familyPrompt')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {familyConditions.map((fam) => {
              const isSelected = data.familyHistory.includes(fam.label);
              return (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => handleToggleFamilyCondition(fam.label)}
                  className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-200'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{fam.label}</span>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between text-xs font-bold text-teal-700">
            <button
              type="button"
              onClick={() => setActiveSubSection(4)}
              className="hover:underline cursor-pointer"
            >
              ← {language === 'hi' ? 'पिछला: ऑपरेशन' : 'Back: Surgeries'}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubSection(6)}
              className="hover:underline cursor-pointer"
            >
              {language === 'hi' ? 'अगला: व्यक्तिगत आदतें →' : 'Next: Lifestyle Habits →'}
            </button>
          </div>
        </div>
      )}

      {/* Section 6: Personal History & Conditional Notes */}
      {activeSubSection === 6 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-600" />
            <span>{t('sectionPersonal')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Diet Pattern */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('dietLabel')}</label>
              <select
                value={data.dietType}
                onChange={(e) =>
                  onChange({
                    ...data,
                    dietType: e.target.value as 'vegetarian' | 'non-vegetarian' | 'vegan' | 'unspecified',
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
              >
                <option value="vegetarian">{t('dietVeg')}</option>
                <option value="non-vegetarian">{t('dietNonVeg')}</option>
                <option value="vegan">{t('dietVegan')}</option>
                <option value="unspecified">{t('optPreferNot')}</option>
              </select>
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('sleepLabel')}</label>
              <select
                value={data.sleepQuality}
                onChange={(e) =>
                  onChange({
                    ...data,
                    sleepQuality: e.target.value as 'good' | 'disturbed' | 'insomnia' | 'unspecified',
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
              >
                <option value="good">{t('sleepGood')}</option>
                <option value="disturbed">{t('sleepDisturbed')}</option>
                <option value="insomnia">{t('sleepInsomnia')}</option>
                <option value="unspecified">{t('optPreferNot')}</option>
              </select>
            </div>
          </div>

          {/* Conditional follow-up prompt based on chief complaint */}
          {(hasChestPainOrBreath || hasAbdominalOrNausea || hasCoughOrFever) && (
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 space-y-2 mt-2">
              <span className="text-xs font-bold text-sky-900 block">
                {language === 'hi' ? 'विशेष लक्षण से जुड़े अनुवर्ती प्रश्न:' : 'Specific Follow-up Questions for Doctor:'}
              </span>
              <p className="text-xs text-sky-800">
                {hasChestPainOrBreath
                  ? language === 'hi'
                    ? 'सीने में दर्द चलने पर बढ़ता है? क्या पसीना आता है?'
                    : 'Does the chest discomfort increase with exertion or walking? Any sweating?'
                  : hasAbdominalOrNausea
                  ? language === 'hi'
                    ? 'दर्द का भोजन से कोई संबंध है? क्या उल्टी में खून दिखा?'
                    : 'Is the stomach pain related to meal times? Any blood in vomit or stools?'
                  : language === 'hi'
                  ? 'खांसी के साथ बलगम आ रहा है? तेज ठंड लगकर बुखार आता है?'
                  : 'Is the cough producing sputum/phlegm? Any chills or shivering?'}
              </p>
              <input
                type="text"
                value={data.conditionalFollowUpNotes}
                onChange={(e) => onChange({ ...data, conditionalFollowUpNotes: e.target.value })}
                placeholder={language === 'hi' ? 'यहाँ अतिरिक्त विवरण लिखें (वैकल्पिक)...' : 'Add any additional notes here (optional)...'}
                className="w-full px-3 py-2 bg-white rounded-lg border border-sky-300 text-xs"
              />
            </div>
          )}
        </div>
      )}

      {/* Nav Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('previousButton')}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t('saveProgress')}
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            <span>{t('nextButton')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
