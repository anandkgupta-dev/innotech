import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { PatientRegistrationData, GenderOption } from '../../types';
import { User, Sparkles, ArrowRight, ArrowLeft, AlertCircle, Calendar, Hash } from 'lucide-react';

interface StepRegistrationProps {
  data: PatientRegistrationData;
  onChange: (data: PatientRegistrationData) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const StepRegistration: React.FC<StepRegistrationProps> = ({
  data,
  onChange,
  onContinue,
  onBack,
}) => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const generateDemoPatientId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `PAT-2026-${randomNum}`;
    onChange({
      ...data,
      patientId: newId,
    });
    setErrors((prev) => ({ ...prev, patientId: '' }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!data.patientId.trim()) {
      newErrors.patientId = t('errPatientIdRequired');
    }

    if (!data.fullName.trim()) {
      newErrors.fullName = t('errFullNameRequired');
    }

    const ageNum = parseInt(String(data.age), 10);
    if (!data.age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      newErrors.age = t('errAgeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          <User className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t('stepRegTitle')}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          {t('stepRegSubtitle')}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-5 mb-8">
        {/* Patient ID with Demo Generator */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('patientIdLabel')} *
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={data.patientId}
                onChange={(e) => {
                  onChange({ ...data, patientId: e.target.value });
                  if (errors.patientId) setErrors((prev) => ({ ...prev, patientId: '' }));
                }}
                placeholder="e.g. PAT-2026-0842"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-mono transition-all ${
                  errors.patientId
                    ? 'border-rose-400 bg-rose-50/30 ring-2 ring-rose-200'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                }`}
              />
            </div>
            <button
              type="button"
              onClick={generateDemoPatientId}
              className="px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>{t('generateDemoIdBtn')}</span>
            </button>
          </div>
          {errors.patientId && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.patientId}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('fullNameLabel')} *
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => {
              onChange({ ...data, fullName: e.target.value });
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
            }}
            placeholder={t('fullNamePlaceholder')}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
              errors.fullName
                ? 'border-rose-400 bg-rose-50/30 ring-2 ring-rose-200'
                : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Age and Sex / Gender Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('ageLabel')} *
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={data.age}
              onChange={(e) => {
                onChange({ ...data, age: e.target.value });
                if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
              }}
              placeholder={t('agePlaceholder')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                errors.age
                  ? 'border-rose-400 bg-rose-50/30 ring-2 ring-rose-200'
                  : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
              }`}
            />
            {errors.age && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.age}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('genderLabel')}
            </label>
            <select
              value={data.gender}
              onChange={(e) => onChange({ ...data, gender: e.target.value as GenderOption })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <option value="male">{t('genderMale')}</option>
              <option value="female">{t('genderFemale')}</option>
              <option value="other">{t('genderOther')}</option>
              <option value="undisclosed">{t('genderUndisclosed')}</option>
            </select>
          </div>
        </div>

        {/* Visit Date & Optional Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Visit Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('visitDateLabel')}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="date"
                value={data.visitDate}
                onChange={(e) => onChange({ ...data, visitDate: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>

          {/* Contact Mobile (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('phoneLabel')}
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              placeholder={t('phonePlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>
      </div>

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
