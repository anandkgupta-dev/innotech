import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { ChiefComplaintData } from '../../types';
import { VoiceInputButton } from './VoiceInputButton';
import { 
  HeartPulse, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Clock, 
  AlertTriangle,
  Check
} from 'lucide-react';

interface StepChiefComplaintProps {
  data: ChiefComplaintData;
  onChange: (data: ChiefComplaintData) => void;
  onContinue: () => void;
  onBack: () => void;
  onCheckEmergency: (symptoms: string[], text: string) => void;
}

export const StepChiefComplaint: React.FC<StepChiefComplaintProps> = ({
  data,
  onChange,
  onContinue,
  onBack,
  onCheckEmergency,
}) => {
  const { t } = useLanguage();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const commonSymptoms = [
    { id: 'fever', label: t('symptomFever'), highRisk: false },
    { id: 'cough', label: t('symptomCough'), highRisk: false },
    { id: 'chest_pain', label: t('symptomChestPain'), highRisk: true },
    { id: 'shortness_of_breath', label: t('symptomShortnessOfBreath'), highRisk: true },
    { id: 'headache', label: t('symptomHeadache'), highRisk: false },
    { id: 'abdominal_pain', label: t('symptomAbdominalPain'), highRisk: false },
    { id: 'nausea', label: t('symptomNausea'), highRisk: false },
    { id: 'dizziness', label: t('symptomDizziness'), highRisk: false },
    { id: 'body_ache', label: t('symptomBodyAche'), highRisk: false },
    { id: 'joint_pain', label: t('symptomJointPain'), highRisk: false },
    { id: 'rash', label: t('symptomRash'), highRisk: false },
    { id: 'urinary', label: t('symptomUrinary'), highRisk: false },
    { id: 'weakness', label: t('symptomWeakness'), highRisk: true },
    { id: 'other', label: t('symptomOther'), highRisk: false },
  ];

  const handleToggleSymptom = (symptomLabel: string) => {
    let updatedSymptoms: string[];
    if (data.selectedSymptoms.includes(symptomLabel)) {
      updatedSymptoms = data.selectedSymptoms.filter((s) => s !== symptomLabel);
    } else {
      updatedSymptoms = [...data.selectedSymptoms, symptomLabel];
    }

    const updatedData = { ...data, selectedSymptoms: updatedSymptoms };
    onChange(updatedData);
    setErrorMessage(null);

    // Trigger conservative red-flag check
    onCheckEmergency(updatedSymptoms, updatedData.customDescription);
  };

  const handleCustomDescriptionChange = (text: string) => {
    const updatedData = { ...data, customDescription: text };
    onChange(updatedData);
    setErrorMessage(null);
    onCheckEmergency(data.selectedSymptoms, text);
  };

  const handleVoiceTranscript = (transcript: string) => {
    const current = data.customDescription ? `${data.customDescription} ${transcript}` : transcript;
    handleCustomDescriptionChange(current);
  };

  const validate = (): boolean => {
    if (data.selectedSymptoms.length === 0 && !data.customDescription.trim()) {
      setErrorMessage(t('errComplaintRequired'));
      return false;
    }
    if (!data.durationValue.trim()) {
      setErrorMessage(t('errDurationRequired'));
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleContinue = () => {
    if (validate()) {
      onContinue();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <HeartPulse className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t('stepComplaintTitle')}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          {t('stepComplaintSubtitle')}
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Common Symptoms Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            {t('commonSymptomsTitle')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {commonSymptoms.map((symptom) => {
              const isSelected = data.selectedSymptoms.includes(symptom.label);
              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => handleToggleSymptom(symptom.label)}
                  className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? symptom.highRisk
                        ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-200'
                        : 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {symptom.highRisk && (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{symptom.label}</span>
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      isSelected
                        ? symptom.highRisk
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'bg-sky-600 border-sky-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Free Text Description & Voice Input */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('describeOwnWordsTitle')}
            </label>
            {/* Integrated Voice Input */}
            <VoiceInputButton onTranscript={handleVoiceTranscript} />
          </div>

          <textarea
            rows={3}
            value={data.customDescription}
            onChange={(e) => handleCustomDescriptionChange(e.target.value)}
            placeholder={t('describePlaceholder')}
            className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all leading-relaxed"
          />
        </div>

        {/* Duration and Severity Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Duration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>{t('durationTitle')} *</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={data.durationValue}
                onChange={(e) => {
                  onChange({ ...data, durationValue: e.target.value });
                  setErrorMessage(null);
                }}
                placeholder="e.g. 3"
                className="w-24 px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
              <select
                value={data.durationUnit}
                onChange={(e) =>
                  onChange({
                    ...data,
                    durationUnit: e.target.value as 'hours' | 'days' | 'weeks' | 'months' | 'years',
                  })
                }
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              >
                <option value="hours">{t('unitHours')}</option>
                <option value="days">{t('unitDays')}</option>
                <option value="weeks">{t('unitWeeks')}</option>
                <option value="months">{t('unitMonths')}</option>
                <option value="years">{t('unitYears')}</option>
              </select>
            </div>
          </div>

          {/* Severity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t('severityTitle')}
            </label>
            <div className="space-y-1.5 text-xs">
              {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                <label
                  key={sev}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                    data.severity === sev
                      ? 'border-sky-600 bg-sky-50/70 font-semibold text-slate-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={sev}
                    checked={data.severity === sev}
                    onChange={() => onChange({ ...data, severity: sev })}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <span>
                    {sev === 'mild'
                      ? t('severityMild')
                      : sev === 'moderate'
                      ? t('severityModerate')
                      : t('severitySevere')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {errorMessage && (
        <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Nav Controls */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('previousButton')}</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          <span>{t('nextButton')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
