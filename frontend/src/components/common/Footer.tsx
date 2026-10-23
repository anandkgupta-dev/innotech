import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Building2, ShieldCheck, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Hospital Outpatient Department Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Building2 className="w-5 h-5 text-sky-400 shrink-0" />
              <span>{language === 'hi' ? 'जिला मेमोरियल एवं आयुष एकीकृत अस्पताल' : 'District Memorial & AYUSH Integrated Hospital'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-md">
              {language === 'hi'
                ? 'बाह्य रोगी विभाग (OPD) स्व-सेवा कियोस्क। मरीजों के त्वरित पंजीकरण एवं डॉक्टर परामर्श पूर्व इतिहास प्रलेखन हेतु समर्पित सेवा।'
                : 'Hospital Outpatient Department (OPD) self-service kiosk system. Providing expedited patient check-in and structured history documentation.'}
            </p>
            <div className="flex items-center gap-3 text-slate-300 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'आपातकालीन: 108 / 112' : 'Emergency: 108 / 112'}</span>
              </div>
              <span className="text-slate-600">•</span>
              <span>{language === 'hi' ? 'ओपीडी समय: सुबह 8:00 – दोपहर 2:00' : 'OPD Hours: 8:00 AM – 2:00 PM'}</span>
            </div>
          </div>

          {/* Col 2: Clinical Safety Disclaimer */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'hi' ? 'क्लिनिकल सुरक्षा एवं चिकित्सा दायित्व' : 'Clinical Safety & Medical Disclaimer'}</span>
            </h3>
            <p className="text-slate-400 leading-relaxed text-xs">
              {language === 'hi'
                ? 'मेडीकियोस्क एक सहायक डिजिटल इनटेक प्रणाली है। यह डॉक्टर के परीक्षण या चिकित्सकीय निर्णय का स्थान नहीं लेता। सभी निदान एवं उपचार केवल अस्पताल के योग्य चिकित्सक द्वारा ही किए जाते हैं।'
                : 'MediKiosk is an assistive clinical intake platform designed exclusively for patient self-registration and doctor review. It does not replace physician consultation, clinical examination, or doctor prescription.'}
            </p>
            <p className="text-slate-500 text-[11px]">
              {language === 'hi'
                ? 'मरीज का स्वास्थ्य डेटा गोपनीय एवं सुरक्षित सर्वर पर संरक्षित रहता है।'
                : 'Patient health records remain strictly confidential under hospital clinical governance.'}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} MediKiosk Hospital Clinical Informatics. All rights reserved.</p>
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
