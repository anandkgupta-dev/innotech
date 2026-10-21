import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { PatientIntakeState } from '../../types';
import { CheckCircle2, Printer, Building2, Clock } from 'lucide-react';

interface IntakeSuccessModalProps {
  intakeState: PatientIntakeState;
  onRestart: () => void;
  onExit: () => void;
}

export const IntakeSuccessModal: React.FC<IntakeSuccessModalProps> = ({
  intakeState,
  onRestart,
  onExit,
}) => {
  const { t, language } = useLanguage();
  const { registration, complaint } = intakeState;

  const tokenNumber = `TK-${registration.patientId.slice(-4) || '1042'}`;
  const currentTime = React.useMemo(() => {
    return new Date().toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [language]);

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-5 shadow-sm animate-in zoom-in-75 duration-200">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
        {t('intakeSuccessTitle')}
      </h2>
      <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
        {t('intakeSuccessSubtitle')}
      </p>

      {/* Hospital Intake Token Slip */}
      <div className="my-8 bg-white border-2 border-dashed border-sky-300 rounded-3xl p-6 sm:p-8 text-left shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-800">
            <Building2 className="w-5 h-5 text-sky-700" />
            <span className="font-bold text-xs sm:text-sm">{t('hospitalName')}</span>
          </div>
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {currentTime}
          </span>
        </div>

        {/* Large Token Badge */}
        <div className="py-6 text-center bg-sky-50/60 rounded-2xl my-4 border border-sky-100">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block mb-1">
            {t('intakeTokenLabel')}
          </span>
          <span className="text-4xl sm:text-5xl font-black text-sky-900 tracking-wider font-mono">
            {tokenNumber}
          </span>
          <span className="text-xs text-slate-500 block mt-2">
            OPD Room #14 • General Medicine Desk
          </span>
        </div>

        {/* Patient Snapshot */}
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 pb-4 border-b border-slate-200">
          <div>
            <span className="text-slate-500 block">Patient Name</span>
            <span className="font-bold text-slate-900">{registration.fullName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Age / Sex</span>
            <span className="font-bold text-slate-900">{registration.age}y / {registration.gender}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Patient ID</span>
            <span className="font-mono font-bold text-slate-900">{registration.patientId}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Chief Complaint</span>
            <span className="font-bold text-slate-900 truncate block">
              {complaint.selectedSymptoms[0] || complaint.customDescription || 'General Consultation'}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="pt-4 space-y-2 text-xs text-slate-600">
          <span className="font-bold text-slate-900 block">{t('intakeInstructionsHeading')}</span>
          <p>• {t('intakeInstruction1')}</p>
          <p>• {t('intakeInstruction2')}</p>
          <p>• {t('intakeInstruction3')}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer border border-slate-300"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>{t('printSummaryBtn')}</span>
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <span>{t('newIntakeBtn')}</span>
        </button>

        <button
          type="button"
          onClick={onExit}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <span>{t('exitKiosk')}</span>
        </button>
      </div>
    </div>
  );
};
