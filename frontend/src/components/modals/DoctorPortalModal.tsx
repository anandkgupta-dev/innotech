import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  Stethoscope, 
  FileText, 
  CheckCircle, 
  Edit3, 
  Flame
} from 'lucide-react';

interface DoctorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSampleMode: boolean;
}

export const DoctorPortalModal: React.FC<DoctorPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'summary' | 'ayush' | 'documents'>('summary');
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [doctorNotes, setDoctorNotes] = useState<string>(
    'Patient advised to continue Metformin 500mg. Prescribed Pantoprazole 40mg OD before breakfast for 14 days. Advised USG Whole Abdomen & LFT.'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-7 shadow-xl border border-slate-300 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">
                  {t('doctorModalTitle')}
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-teal-100 text-teal-800 rounded border border-teal-300">
                  {language === 'hi' ? 'चिकित्सक समीक्षा' : 'Clinician Review'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('doctorSampleDoctor')}
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

        {/* Patient Top Bar Info */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 my-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500 block">Patient</span>
              <span className="font-bold text-slate-800">Ramesh Sharma (54y / M)</span>
            </div>
            <div>
              <span className="text-slate-500 block">OPD Reg #</span>
              <span className="font-mono font-semibold text-slate-800">OPD-2026-4412</span>
            </div>
            <div>
              <span className="text-slate-500 block">Allergies</span>
              <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                Penicillin (Rash)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>No Red Flags Triggered</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'summary'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'hi' ? 'संरचित क्लिनिकल सारांश' : 'Structured Clinical Summary'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ayush')}
            className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ayush'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'hi' ? 'आयुष मूल्यांकन (Dashavidha)' : 'AYUSH Assessment (Dashavidha)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'documents'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'hi' ? 'स्कैन किए गए दस्तावेज (2)' : 'Scanned Documents (2)'}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="py-4 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-700" />
                  <span>{t('doctorSampleSummaryTitle')}</span>
                </h4>
                <p className="text-slate-700 leading-relaxed font-mono text-xs whitespace-pre-wrap">
                  {t('doctorSampleSummaryContent')}
                </p>
              </div>

              {/* Verified Clinical Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl p-3 bg-white">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    History of Present Illness (HPI)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Patient reports recurring dull burning pain in epigastrium since 3 weeks. Worsens 1-2 hours after spicy meals. Associated with acid regurgitation and occasional nausea. No hematemesis or melena.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-3 bg-white">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    Past History & Medications
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    • Type 2 Diabetes Mellitus x 5 years (compliant on Tab Metformin 500mg BD)<br />
                    • No surgical history reported<br />
                    • Family history: Father had hypertension; no early CAD
                  </p>
                </div>
              </div>

              {/* Editable Doctor Notes */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Doctor Examination Notes & Plan (Editable)</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Dr. Sunita Rao MD</span>
                </div>
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>
          )}

          {activeTab === 'ayush' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <span className="font-bold block mb-1">
                  Dashavidha Pariksha & Ahara-Vihara Assessment (Subject to Ayurvedic Practitioner Validation)
                </span>
                <p>
                  Specialized clinical questionnaire parameters captured for integrated AYUSH institutional workflow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 border border-slate-200 rounded-xl bg-white">
                  <span className="font-bold text-slate-800 block mb-1">Prakriti (Constitutional Type)</span>
                  <span className="text-sky-700 font-semibold">Pitta-Vata Predominant</span>
                  <p className="text-slate-500 mt-1">Based on thermal sensitivity and sleep pattern.</p>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl bg-white">
                  <span className="font-bold text-slate-800 block mb-1">Agni (Digestive Fire)</span>
                  <span className="text-amber-700 font-semibold">Mandagni / Vishamagni</span>
                  <p className="text-slate-500 mt-1">Impaired appetite with postprandial bloating.</p>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl bg-white">
                  <span className="font-bold text-slate-800 block mb-1">Ahara-Vihara (Diet & Routine)</span>
                  <span className="text-teal-700 font-semibold">Ushna / Katu Ahara (Irregular)</span>
                  <p className="text-slate-500 mt-1">High intake of pungent, delayed meal intervals.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Previous Prescription (Dr. K. Verma, 2025)</span>
                    <span className="text-slate-500">Scanned via Kiosk OCR • Status: Extracted & Verified</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                  Verified Match
                </span>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-teal-600" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Fasting Blood Sugar Lab Report (July 2025)</span>
                    <span className="text-slate-500">Value extracted: FBS 138 mg/dL • Status: Pending Doctor Review</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold text-[11px]">
                  Uncertain Field Marked
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isApproved ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300">
                <CheckCircle className="w-4 h-4" />
                <span>Clinical Intake Approved & Signed by Dr. Rao</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setIsApproved(true)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer"
              >
                Approve & Sign Clinical Draft
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
            >
              {t('closeBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
