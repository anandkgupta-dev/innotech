import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Building2, ShieldCheck, HeartHandshake, FileCode } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Institutional Info */}
          <div>
            <div className="flex items-center gap-2.5 text-white font-bold text-sm mb-3">
              <Building2 className="w-5 h-5 text-sky-400" />
              <span>{t('hospitalName')}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {language === 'hi'
                ? 'सरकारी अस्पताल एवं आयुष एकीकृत बाह्य रोगी विभाग (OPD)। मरीजों के सुखद एवं त्वरित उपचार के लिए आधुनिक डिजिटल तकनीक।'
                : 'District Memorial & AYUSH Integrated Health Center. Providing expedited clinical history capture and documentation for busy outpatient departments.'}
            </p>
            <div className="mt-3 text-slate-300 font-medium">
              {t('emergencyHelpDesk')}
            </div>
          </div>

          {/* Col 2: Clinical Ethics & Safety */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? 'सुरक्षा एवं गोपनीयता' : 'Safety & Governance'}</span>
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              {t('footerDisclaimer')}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-sky-400 border border-slate-700">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{t('complianceBadge')}</span>
            </div>
          </div>

          {/* Col 3: Academic & Technical Reference */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'तकनीकी वास्तुकला' : 'Project Architecture'}</span>
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              {language === 'hi'
                ? 'चरण १: फ्रंटएंड आधार एवं अस्पताल प्रवेश द्वार (React 19 + TypeScript + Tailwind)। आगामी चरण: मरीज प्रश्नावली, बैकएंड, ओसीआर एवं डॉक्टर समीक्षा।'
                : 'Phase 1: Hospital Landing Page & Foundation (React 19 + TypeScript + Tailwind CSS). Multi-tier ready for Phase 2 intake and Phase 3 API services.'}
            </p>
            <div className="mt-3 text-slate-500 font-mono text-[11px]">
              Platform: MediKiosk v1.0.0 (Phase 1 Baseline)
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>{t('footerCopyright')}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">
              {language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Notice'}
            </span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">
              {language === 'hi' ? 'सहमति शर्तें' : 'Terms of Consent'}
            </span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">
              {language === 'hi' ? 'सहायता केंद्र' : 'Kiosk Help'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
