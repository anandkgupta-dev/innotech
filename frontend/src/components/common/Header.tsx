import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Building2, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  Calendar, 
  ShieldCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, textScale, setTextScale, voiceGuide, toggleVoiceGuide, t } = useLanguage();

  const currentDate = React.useMemo(() => {
    return new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [language]);

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
      {/* Top Government / Institutional Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium tracking-wide">
              {t('hospitalName')} • OPD Intake Wing
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('dateLabel')}: {currentDate}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('complianceBadge')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Kiosk Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-sky-700 text-white flex items-center justify-center shadow-xs shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
                  MediKiosk
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-sky-50 text-sky-800 rounded-md border border-sky-200">
                  मेडीकियोस्क
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {t('platformTagline')}
              </p>
            </div>
          </div>

          {/* Right Action Controls: Emergency, Language, Text Size, Voice */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Emergency Hotline Button */}
            <a
              href="tel:108"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
              title="Call National Emergency 108"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span className="hidden md:inline">{t('emergencyHelpline')}</span>
              <span className="md:hidden">108 / 112</span>
            </a>

            {/* Accessible Text Size Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200" title={t('textSizeLabel')}>
              <button
                type="button"
                onClick={() => setTextScale('normal')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  textScale === 'normal'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Normal text size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextScale('large')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  textScale === 'large'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Large text size"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setTextScale('xlarge')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  textScale === 'xlarge'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Extra large text size"
              >
                A++
              </button>
            </div>

            {/* Voice Guide Simulation Toggle */}
            <button
              type="button"
              onClick={toggleVoiceGuide}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                voiceGuide
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title={voiceGuide ? t('voiceAssistOn') : t('voiceAssistOff')}
              aria-pressed={voiceGuide}
            >
              {voiceGuide ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden lg:inline">{t('voiceAssistOn')}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden lg:inline">{t('voiceAssist')}</span>
                </>
              )}
            </button>

            {/* Bilingual Language Switcher (Key Requirement) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200" role="group" aria-label={t('selectLanguage')}>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-sky-700 text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  language === 'hi'
                    ? 'bg-sky-700 text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
