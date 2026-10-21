import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Languages, 
  UserCheck, 
  MessageSquareHeart, 
  ScanLine, 
  FileCheck,
  CheckCircle,
  Clock
} from 'lucide-react';

export const WorkflowSteps: React.FC = () => {
  const { t, language } = useLanguage();

  const steps = [
    {
      id: 1,
      icon: Languages,
      title: t('step1Title'),
      desc: t('step1Desc'),
      duration: '30s',
      badge: language === 'hi' ? 'चरण १' : 'Step 1',
      color: 'sky',
    },
    {
      id: 2,
      icon: UserCheck,
      title: t('step2Title'),
      desc: t('step2Desc'),
      duration: '45s',
      badge: language === 'hi' ? 'चरण २' : 'Step 2',
      color: 'blue',
    },
    {
      id: 3,
      icon: MessageSquareHeart,
      title: t('step3Title'),
      desc: t('step3Desc'),
      duration: '2-3m',
      badge: language === 'hi' ? 'चरण ३' : 'Step 3',
      color: 'teal',
    },
    {
      id: 4,
      icon: ScanLine,
      title: t('step4Title'),
      desc: t('step4Desc'),
      duration: '1m',
      badge: language === 'hi' ? 'चरण ४' : 'Step 4',
      color: 'indigo',
    },
    {
      id: 5,
      icon: FileCheck,
      title: t('step5Title'),
      desc: t('step5Desc'),
      duration: 'Instant',
      badge: language === 'hi' ? 'चरण ५' : 'Step 5',
      color: 'emerald',
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-wider text-sky-700 uppercase">
            {language === 'hi' ? 'मरीज यात्रा' : 'Patient Care Flow'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t('workflowTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t('workflowSubtitle')}
          </p>
        </div>

        {/* Step-by-Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 relative flex flex-col justify-between hover:border-sky-300 transition-all hover:bg-white hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {step.badge}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {step.duration}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1.5">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {language === 'hi' ? 'स्वचालित सत्यापन' : 'Automated Check'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
