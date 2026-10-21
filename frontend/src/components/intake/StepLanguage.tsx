import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { SupportedLanguage } from '../../types';
import { Languages, Check, ArrowRight } from 'lucide-react';

interface StepLanguageProps {
  onContinue: () => void;
}

export const StepLanguage: React.FC<StepLanguageProps> = ({ onContinue }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mx-auto mb-4 shadow-2xs">
          <Languages className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t('stepLangTitle')}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
          {t('stepLangSubtitle')}
        </p>
      </div>

      {/* Large Language Choice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {/* English Choice */}
        <button
          type="button"
          onClick={() => handleSelectLanguage('en')}
          className={`p-6 rounded-2xl border-2 text-left transition-all relative cursor-pointer flex flex-col justify-between ${
            language === 'en'
              ? 'border-sky-600 bg-sky-50/70 shadow-sm ring-2 ring-sky-200'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {language === 'en' && (
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          )}
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
              Primary Option
            </span>
            <h3 className="text-2xl font-bold text-slate-900">English</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {t('langEnglishDesc')}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Voice & touch input enabled</span>
          </div>
        </button>

        {/* Hindi Choice */}
        <button
          type="button"
          onClick={() => handleSelectLanguage('hi')}
          className={`p-6 rounded-2xl border-2 text-left transition-all relative cursor-pointer flex flex-col justify-between ${
            language === 'hi'
              ? 'border-sky-600 bg-sky-50/70 shadow-sm ring-2 ring-sky-200'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {language === 'hi' && (
            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          )}
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
              हिंदी विकल्प
            </span>
            <h3 className="text-2xl font-bold text-slate-900">हिंदी (Hindi)</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {t('langHindiDesc')}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>ध्वनि एवं स्पर्श इनपुट समर्थित</span>
          </div>
        </button>
      </div>

      <div className="text-center text-xs text-slate-500 mb-6 bg-slate-100/80 p-3 rounded-xl border border-slate-200">
        {t('changeLangNote')}
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-80 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-base transition-all shadow-sm cursor-pointer"
        >
          <span>{t('nextButton')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
