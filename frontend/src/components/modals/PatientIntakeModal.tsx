import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  User, 
  CheckCircle, 
  Sparkles, 
  AlertTriangle
} from 'lucide-react';

interface PatientIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDemoMode: boolean;
}

export const PatientIntakeModal: React.FC<PatientIntakeModalProps> = ({
  isOpen,
  onClose,
  isDemoMode,
}) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-xl border border-sky-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">
                  {t('patientModalTitle')}
                </h3>
                {isDemoMode && (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 rounded border border-amber-300">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'hi' 
                  ? 'चरण २ में सक्रिय होने वाली मरीज स्व-सेवा कार्यप्रणाली'
                  : 'Phase 2 Clinical Intake Roadmap & Interactive Preview'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Patient Card */}
        <div className="my-5">
          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                {language === 'hi' ? 'पूर्व-लोड किया गया डेमो मरीज' : 'Simulated Development Record'}
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                PAT-2026-0842
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{language === 'hi' ? 'नाम' : 'Name'}</span>
                <span className="font-semibold text-slate-800">Ramesh Sharma</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{language === 'hi' ? 'उम्र / लिंग' : 'Age/Sex'}</span>
                <span className="font-semibold text-slate-800">54 Y / Male</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{language === 'hi' ? 'विभाग' : 'Dept'}</span>
                <span className="font-semibold text-slate-800">Gen Medicine</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{language === 'hi' ? 'भाषा' : 'Language'}</span>
                <span className="font-semibold text-slate-800">{language === 'hi' ? 'हिंदी' : 'English'}</span>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 block mb-0.5 font-medium">
                {language === 'hi' ? 'प्राथमिक शिकायत (Chief Complaint)' : 'Primary Complaint'}
              </span>
              <p className="text-slate-800 font-medium">
                {language === 'hi'
                  ? 'पेट के ऊपरी भाग में हल्का दर्द एवं अपच (3 सप्ताह से), पूर्व में मधुमेह की शिकायत'
                  : 'Epigastric discomfort and intermittent nausea for 3 weeks; known Type 2 Diabetes'}
              </p>
            </div>
          </div>
        </div>

        {/* Phase 2 Interactive Roadmap */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {language === 'hi' ? 'चरण २ में तैयार होने वाले घटक' : 'Implementation Pipeline for Phase 2'}
          </h4>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">
                  {language === 'hi' ? '१. द्विभाषी सूचित सहमति' : '1. Bilingual Informed Consent Form'}
                </span>
                <p className="text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'डेटा संग्रह एवं गोपनीयता नियमों की स्पष्ट सरल भाषा में स्वीकृति'
                    : 'Simple, transparent explanation of data usage with explicit electronic consent.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">
                  {language === 'hi' ? '२. न्यूनतम मरीज पंजीकरण' : '2. Minimal Patient Registration'}
                </span>
                <p className="text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'ओपीडी पर्ची संख्या, मोबाइल नंबर, और संपर्क विवरण का त्वरित संकलन'
                    : 'Capturing essential visit identifiers with demo mode support.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">
                  {language === 'hi' ? '३. निर्देशित वॉइस व टच प्रश्नोत्तर' : '3. Guided Voice/Touch Questionnaire'}
                </span>
                <p className="text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'मुख्य लक्षण, अवधि, पिछली दवाएं, एलर्जी और परिवार का इतिहास'
                    : 'Constrained clinical questions for chief complaint, duration, medications, allergies & ROS.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">
                  {language === 'hi' ? '४. आपातकालीन रेड-फ्लैग इंटरसेप्टर' : '4. Conservative Red-Flag Interceptor'}
                </span>
                <p className="text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'गंभीर लक्षण दर्ज होते ही तत्काल सवाल रोककर आपातकालीन डेस्क पर भेजना'
                    : 'Halt intake immediately when high-risk symptoms (chest pain, dyspnea) are flagged.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {language === 'hi' ? 'चरण १: प्रवेश द्वार सत्यापित' : 'Phase 1: Entry Portal Verified'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-sky-700 hover:bg-sky-800 text-white transition-colors cursor-pointer"
          >
            {t('closeBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
