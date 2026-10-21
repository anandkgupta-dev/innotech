import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Lock, 
  Info,
  Scale
} from 'lucide-react';

export const InstitutionalScope: React.FC = () => {
  const { t, language } = useLanguage();

  const points = [
    {
      icon: ShieldCheck,
      title: t('point1Title'),
      desc: t('point1Desc'),
      color: 'sky',
    },
    {
      icon: AlertOctagon,
      title: t('point2Title'),
      desc: t('point2Desc'),
      color: 'rose',
    },
    {
      icon: Scale,
      title: t('point3Title'),
      desc: t('point3Desc'),
      color: 'teal',
    },
    {
      icon: Lock,
      title: t('point4Title'),
      desc: t('point4Desc'),
      color: 'emerald',
    },
  ];

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4">
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-md">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-semibold mb-3 border border-slate-700">
            <Info className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'चिकित्सा नैतिकता एवं सुरक्षा' : 'Clinical Governance & Safety Standards'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('scopeTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {t('scopeSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/80 text-sky-400 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base mb-1">
                      {pt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear Non-Diagnostic Disclaimer Box */}
        <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></div>
          <p className="leading-relaxed">
            <strong className="text-white">
              {language === 'hi' ? 'महत्वपूर्ण अस्वीकरण (Disclaimer): ' : 'Regulatory Disclaimer: '}
            </strong>
            {language === 'hi'
              ? 'मेडीकियोस्क केवल डॉक्टर के परामर्श पूर्व इतिहास संकलन एवं दस्तावेज़ डिजिटलीकरण के लिए है। यह चिकित्सा परीक्षण अथवा किसी बीमारी की स्वयं पुष्टि नहीं करता।'
              : 'MediKiosk is an assistive clinical intake tool designed exclusively to prepare structured documentation for physician review. It does not replace medical consultation, clinical examination, or doctor prescription.'}
          </p>
        </div>
      </div>
    </section>
  );
};
