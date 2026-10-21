import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle, ShieldAlert, X, MapPin } from 'lucide-react';

interface EmergencyRedFlagBannerProps {
  reasons: string[];
  onAcknowledge: () => void;
  acknowledged: boolean;
}

export const EmergencyRedFlagBanner: React.FC<EmergencyRedFlagBannerProps> = ({
  reasons,
  onAcknowledge,
  acknowledged,
}) => {
  const { t, language } = useLanguage();
  const [showDirections, setShowDirections] = useState<boolean>(false);

  return (
    <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 mb-6 shadow-md animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-rose-900 text-base sm:text-lg">
                {t('emergencyTriggerTitle')}
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-200 text-rose-900 border border-rose-300">
                {language === 'hi' ? 'तत्काल सावधानी' : 'Immediate Action Required'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-rose-900 mt-1.5 leading-relaxed font-medium">
              {t('emergencyTriggerText')}
            </p>

            {/* Specific triggers identified */}
            {reasons.length > 0 && (
              <div className="mt-2 text-xs text-rose-800">
                <span className="font-semibold">
                  {language === 'hi' ? 'पहचाने गए संभावित गंभीर संकेत:' : 'Flagged Potential Red-Flag Symptoms:'}
                </span>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5 font-medium">
                  {reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-3 p-3 bg-white/90 rounded-xl border border-rose-200 text-xs sm:text-sm text-rose-950 font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{t('emergencyStaffAdvice')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full sm:w-auto shrink-0 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowDirections(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-2xs cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>{t('emergencyActionBtn')}</span>
          </button>

          {!acknowledged ? (
            <button
              type="button"
              onClick={onAcknowledge}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-rose-900 border border-rose-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>{t('emergencyAcknowledgeBtn')}</span>
            </button>
          ) : (
            <span className="text-[11px] text-rose-700 bg-rose-100 px-2 py-1 rounded text-center font-medium">
              {language === 'hi' ? 'चेतावनी पावती दर्ज' : 'Warning Acknowledged'}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-rose-200/80 text-[11px] text-rose-800 flex items-center justify-between">
        <span>{t('emergencyBypassNotice')}</span>
        <span className="font-semibold text-rose-900">Emergency: 108 / 112</span>
      </div>

      {/* Emergency Directions Popup */}
      {showDirections && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-rose-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'hi' ? 'आपातकालीन आकस्मिक विभाग मार्ग' : 'Emergency Casualty Directions'}
              </h4>
              <button
                type="button"
                onClick={() => setShowDirections(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs sm:text-sm text-slate-700">
              <p className="font-semibold text-rose-900">
                {language === 'hi'
                  ? 'तत्काल सहायता हेतु मुख्य हॉल के बाईं ओर काउंटर नं. 1 (कैजुअल्टी वार्ड) पर पहुंचें।'
                  : 'Proceed immediately to Counter 1 (Casualty / Emergency Ward) on the ground floor.'}
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                <div><strong>Floor:</strong> Ground Floor, Left Wing</div>
                <div><strong>Desk:</strong> Counter No. 1 (24x7 Triage)</div>
                <div><strong>Intercom:</strong> Ext. 2101 / 2102</div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDirections(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
