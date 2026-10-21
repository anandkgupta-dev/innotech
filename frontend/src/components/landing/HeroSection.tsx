import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  UserPlus, 
  Stethoscope, 
  ArrowRight, 
  Mic, 
  Hand, 
  FileCheck2, 
  FileSearch, 
  ClipboardCheck, 
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface HeroSectionProps {
  onOpenPatientIntake: (demoMode: boolean) => void;
  onOpenDoctorPortal: (sampleMode: boolean) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenPatientIntake,
  onOpenDoctorPortal,
}) => {
  const { t, language } = useLanguage();

  return (
    <section className="py-4 sm:py-8 max-w-7xl mx-auto px-4">
      {/* Hospital Banner Intro */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>{t('kioskModeBadge')}</span>
          <span className="w-1 h-1 rounded-full bg-sky-400"></span>
          <span>{language === 'hi' ? 'औसत समय: 3-5 मिनट' : 'Average time: 3-5 mins'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
          {t('welcomeHeading')}
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {t('welcomeSubheading')}
        </p>
      </div>

      {/* Two Main Hospital Portals (Patient Kiosk vs Doctor Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Card 1: Patient Self-Registration & Clinical Intake */}
        <div className="bg-white rounded-2xl border-2 border-sky-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-sky-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
            {language === 'hi' ? 'प्राथमिक सेवा' : 'Primary Kiosk'}
          </div>

          <div>
            <div className="w-14 h-14 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-5">
              <UserPlus className="w-7 h-7" />
            </div>

            <div className="mb-2">
              <span className="text-xs font-bold tracking-wider text-sky-700 uppercase">
                {t('patientCardSubtitle')}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {t('patientCardTitle')}
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {t('patientCardDesc')}
            </p>

            {/* Accessibility & Input Mode Highlights */}
            <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{language === 'hi' ? 'बोलकर उत्तर दें' : 'Speak or Tap'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hand className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'hi' ? 'सरल बड़े बटन' : 'Large Touch Targets'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{language === 'hi' ? 'पर्चा व रिपोर्ट स्कैन' : 'Prescription Scan'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{language === 'hi' ? 'हिंदी व अंग्रेजी' : 'Hindi & English'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => onOpenPatientIntake(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-base transition-all shadow-xs cursor-pointer group-hover:scale-[1.01]"
            >
              <span>{t('patientCardBtn')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => onOpenPatientIntake(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('patientCardDemoBtn')}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Doctor & Clinical Staff Review Portal */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-slate-700 text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
            {language === 'hi' ? 'स्टाफ पोर्टल' : 'Clinician Desk'}
          </div>

          <div>
            <div className="w-14 h-14 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-5">
              <Stethoscope className="w-7 h-7" />
            </div>

            <div className="mb-2">
              <span className="text-xs font-bold tracking-wider text-teal-700 uppercase">
                {t('doctorCardSubtitle')}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {t('doctorCardTitle')}
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {t('doctorCardDesc')}
            </p>

            {/* Doctor Capabilities */}
            <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{language === 'hi' ? 'संरचित सारांश' : 'Structured Summary'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{language === 'hi' ? 'ओसीआर सत्यापन' : 'Verified OCR Fields'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{language === 'hi' ? 'आयुष दशविध परीक्षा' : 'AYUSH Assessment'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'hi' ? 'चिकित्सक अनुमोदन' : 'Edit & Sign-off'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => onOpenDoctorPortal(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white font-semibold text-base transition-all shadow-xs cursor-pointer group-hover:scale-[1.01]"
            >
              <span>{t('doctorCardBtn')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => onOpenDoctorPortal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer border border-slate-200"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('doctorCardDemoBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
