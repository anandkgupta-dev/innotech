import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle, MapPin, PhoneCall, X, ArrowRight, ShieldAlert } from 'lucide-react';

interface EmergencyAlertProps {
  onOpenEmergencyModal?: () => void;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = () => {
  const { t, language } = useLanguage();
  const [showDirections, setShowDirections] = useState<boolean>(false);

  return (
    <>
      <div className="bg-rose-50 border-y sm:border sm:rounded-xl border-rose-200 p-4 sm:p-5 my-4 max-w-7xl mx-auto shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-900 text-sm sm:text-base">
                  {t('emergencyBannerTitle')}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                  {language === 'hi' ? 'महत्वपूर्ण नियम' : 'Immediate Red Flag Rule'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed max-w-4xl">
                {t('emergencyBannerText')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDirections(true)}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>{t('emergencyActionBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Emergency Casualty Ward Directions Modal */}
      {showDirections && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-rose-200 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-rose-700">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="font-bold text-lg text-slate-900">
                  {language === 'hi' ? 'आपातकालीन आकस्मिक विभाग (Casualty Ward)' : 'Emergency & Casualty Ward Directions'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDirections(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-sm text-slate-700">
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-100 text-rose-900">
                <p className="font-semibold">
                  {language === 'hi'
                    ? 'यदि आप इन लक्षणों का अनुभव कर रहे हैं, तो तुरंत काउंटर 1 पर जाएं:'
                    : 'If you are experiencing any of these, proceed directly to Counter 1:'}
                </p>
                <ul className="list-disc list-inside mt-2 text-xs space-y-1 text-rose-800">
                  <li>{language === 'hi' ? 'सीने में भारी दबाव या दर्द' : 'Crushing chest pain or pressure'}</li>
                  <li>{language === 'hi' ? 'गंभीर सांस फूलना या दम घुटना' : 'Severe shortness of breath or choking'}</li>
                  <li>{language === 'hi' ? 'अचानक चेहरे का लटकना या अंगों की कमजोरी' : 'Sudden facial droop, limb weakness, or slurred speech'}</li>
                  <li>{language === 'hi' ? 'अनियंत्रित रक्तस्राव या गहरा आघात' : 'Uncontrolled bleeding or severe physical trauma'}</li>
                </ul>
              </div>

              <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 text-sky-700" />
                  <span>
                    {language === 'hi'
                      ? 'स्थान: भूतल, मुख्य प्रवेश द्वार के बाईं ओर (काउंटर नं. 1)'
                      : 'Location: Ground Floor, Left of Main Entry (Counter No. 1)'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'hi'
                      ? 'आंतरिक आपातकालीन इंटरकॉम: एक्सटेंशन 2101 / 2102'
                      : 'Internal Hospital Intercom: Ext. 2101 / 2102'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDirections(false)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition-colors"
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
