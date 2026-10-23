import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  UserPlus, 
  Stethoscope, 
  ArrowRight, 
  Clock, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Lock,
  Building2
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
    <section className="relative w-full overflow-hidden border-b border-slate-200 min-h-[620px] lg:min-h-[700px] flex flex-col justify-center">
      {/* Hospital Reception Photographic Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center sm:bg-[center_top_25%] bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('/images/hospital-reception-bg.png')` }}
        aria-hidden="true"
      />

      {/* Subtle 20% Semi-Transparent Overlay - Keeps Image Clearly Visible */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/20 to-sky-950/15 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Main Content Stage */}
      <div className="relative z-10 py-8 sm:py-12 lg:py-14 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* 2-Column Main Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Hospital Value Proposition & 3 Benefits */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4 bg-white/75 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/90 shadow-sm max-w-2xl">
              {/* OPD Kiosk Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-sky-200 text-sky-800 text-xs font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
                <span>{language === 'hi' ? 'ओपीडी स्व-सेवा कियोस्क' : 'Hospital Outpatient Kiosk'}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">
                  {language === 'hi' ? 'औसत समय: ~3 मिनट' : 'Estimated time: ~3 mins'}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t('fasterRegistrationTitle')}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                {t('fasterRegistrationSubtitle')}
              </p>
            </div>

            {/* 3 Concise Hospital Benefits */}
            <div className="space-y-3 pt-2">
              {/* Benefit 1 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/92 backdrop-blur-md border border-slate-200/90 shadow-2xs hover:bg-white hover:border-sky-300 hover:shadow-xs transition-all">
                <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-slate-900">
                    {t('benefitQuickRegTitle')}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                    {t('benefitQuickRegDesc')}
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/92 backdrop-blur-md border border-slate-200/90 shadow-2xs hover:bg-white hover:border-teal-300 hover:shadow-xs transition-all">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-slate-900">
                    {t('benefitDocUploadTitle')}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                    {t('benefitDocUploadDesc')}
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/92 backdrop-blur-md border border-slate-200/90 shadow-2xs hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-slate-900">
                    {t('benefitSecureRecordsTitle')}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                    {t('benefitSecureRecordsDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Role-Based Entry Welcome Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/80 p-6 sm:p-8 shadow-xl shadow-slate-900/10 relative">
              
              {/* Card Header */}
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {t('welcomeCardTitle')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t('welcomeCardSubtitle')}
                  </p>
                </div>
              </div>

              {/* Role Options */}
              <div className="space-y-4 pt-5">
                
                {/* Option 1: Patient Entry */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onOpenPatientIntake(false)}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <UserPlus className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base sm:text-lg leading-tight">
                            {t('rolePatientTitle')}
                          </span>
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white/20 rounded text-sky-100 uppercase tracking-wider">
                            {t('rolePatientBadge')}
                          </span>
                        </div>
                        <p className="text-xs text-sky-100 mt-1 line-clamp-1">
                          {t('rolePatientSubtitle')}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-sky-200 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  {/* Subtle Demo Testing Option */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => onOpenPatientIntake(true)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-700 font-medium py-1 px-2.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'hi' ? 'डेमो मरीज रिकॉर्ड से देखें (परीक्षण हेतु)' : 'Try with Sample Demo Patient (for testing)'}</span>
                    </button>
                  </div>
                </div>

                {/* Clean Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-[11px] text-slate-400">
                    <span className="bg-white/90 backdrop-blur-xs px-3 font-semibold uppercase tracking-wider">
                      {language === 'hi' ? 'अथवा' : 'OR'}
                    </span>
                  </div>
                </div>

                {/* Option 2: Doctor / Clinical Staff Login */}
                <div>
                  <button
                    type="button"
                    onClick={() => onOpenDoctorPortal(false)}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl bg-slate-50/90 hover:bg-white active:bg-slate-100/90 border-2 border-slate-200 hover:border-teal-500/60 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-teal-900 leading-tight">
                            {t('roleDoctorTitle')}
                          </span>
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded uppercase tracking-wider">
                            {t('roleDoctorBadge')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {t('roleDoctorSubtitle')}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-teal-700 group-hover:border-teal-300 transition-colors shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                  </button>
                </div>

              </div>

              {/* Assistance Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{t('receptionHelpNotice')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Exactly 3 Compact Feature Cards */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/80">
          <div className="text-center mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {language === 'hi' ? 'अस्पताल कियोस्क की मुख्य सुविधाएं' : 'Core Hospital Kiosk Features'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Upload Medical Documents */}
            <div className="p-5 rounded-2xl bg-white/92 backdrop-blur-md border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {t('featureDocUploadTitle')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('featureDocUploadDesc')}
              </p>
            </div>

            {/* Card 2: Secure Patient Records */}
            <div className="p-5 rounded-2xl bg-white/92 backdrop-blur-md border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {t('featureSecureRecordsTitle')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('featureSecureRecordsDesc')}
              </p>
            </div>

            {/* Card 3: Doctor Review */}
            <div className="p-5 rounded-2xl bg-white/92 backdrop-blur-md border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {t('featureDoctorReviewTitle')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('featureDoctorReviewDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
