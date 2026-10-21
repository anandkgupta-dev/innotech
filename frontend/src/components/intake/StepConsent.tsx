import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface StepConsentProps {
  onContinue: () => void;
  onBack: () => void;
  consentGiven: boolean;
  onConsentChange: (consented: boolean) => void;
}

export const StepConsent: React.FC<StepConsentProps> = ({
  onContinue,
  onBack,
  consentGiven,
  onConsentChange,
}) => {
  const { t, language } = useLanguage();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleContinue = () => {
    if (!consentGiven) {
      setErrorMessage(t('consentRequiredError'));
      return;
    }
    setErrorMessage(null);
    onContinue();
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t('stepConsentTitle')}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          {t('stepConsentSubtitle')}
        </p>
      </div>

      {/* Information Cards explaining purpose, physician oversight, and prototype limits */}
      <div className="space-y-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1.5">
            <FileText className="w-4 h-4 text-sky-700" />
            <span>{t('consentPurposeHeading')}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('consentPurposeText')}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{t('consentDoctorHeading')}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('consentDoctorText')}
          </p>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
            {t('consentDemoHeading')}
          </h4>
          <p className="text-xs leading-relaxed text-amber-800">
            {t('consentDemoText')}
          </p>
        </div>
      </div>

      {/* Explicit Consent Checkbox (Enforced) */}
      <div
        onClick={() => {
          onConsentChange(!consentGiven);
          if (!consentGiven) setErrorMessage(null);
        }}
        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 mb-6 ${
          consentGiven
            ? 'border-sky-600 bg-sky-50/80 shadow-2xs'
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
      >
        <input
          type="checkbox"
          id="consent-checkbox"
          checked={consentGiven}
          onChange={(e) => {
            onConsentChange(e.target.checked);
            if (e.target.checked) setErrorMessage(null);
          }}
          className="mt-1 w-5 h-5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
        />
        <label htmlFor="consent-checkbox" className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed cursor-pointer select-none">
          {t('consentCheckboxLabel')}
        </label>
      </div>

      {/* Validation Error Message */}
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
          <span>{language === 'hi' ? 'भाषा बदलें' : 'Change Language'}</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer ${
            consentGiven
              ? 'bg-sky-700 hover:bg-sky-800 text-white'
              : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
          }`}
        >
          <span>{t('nextButton')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
