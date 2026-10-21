import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Server, 
  Mic, 
  FileText, 
  Database, 
  Layers
} from 'lucide-react';

export const SystemStatus: React.FC = () => {
  const { t, language } = useLanguage();

  const statuses = [
    {
      title: language === 'hi' ? 'कियोस्क टर्मिनल' : 'Kiosk Interface',
      status: language === 'hi' ? 'सक्रिय एवं सुरक्षित (React 19)' : 'Active (React 19 + Vite)',
      icon: Layers,
      state: 'online',
    },
    {
      title: language === 'hi' ? 'स्पीच रिकॉग्निशन' : 'Voice Input Adapter',
      status: language === 'hi' ? 'वेब स्पीच एपीआई तैयार' : 'Web Speech API Ready',
      icon: Mic,
      state: 'ready',
    },
    {
      title: language === 'hi' ? 'दस्तावेज़ ओसीआर' : 'Document OCR Engine',
      status: language === 'hi' ? 'स्थानीय एडाप्टर मोड' : 'Local Adapter Standby',
      icon: FileText,
      state: 'ready',
    },
    {
      title: language === 'hi' ? 'डेटाबेस एवं बैकएंड' : 'Clinical Storage',
      status: language === 'hi' ? 'चरण १ सैंडबॉक्स (स्थानीय)' : 'Phase 1 Local Sandbox',
      icon: Database,
      state: 'sandbox',
    },
  ];

  return (
    <section className="py-6 max-w-7xl mx-auto px-4">
      <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-700" />
            <h3 className="font-semibold text-slate-900 text-sm">
              {t('systemStatusTitle')}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Environment: Localhost Development • Node 24.17 • Python 3.13
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {statuses.map((item, i) => {
            const Icon = item.icon;
            return (
              <div 
                key={i}
                className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="text-[11px] text-slate-600 truncate">
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
