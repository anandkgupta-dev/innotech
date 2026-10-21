import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SupportedLanguage, TextScale } from '../types';
import { translations } from '../i18n/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  voiceGuide: boolean;
  toggleVoiceGuide: () => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [textScale, setTextScale] = useState<TextScale>('normal');
  const [voiceGuide, setVoiceGuide] = useState<boolean>(false);

  // Optional: load from localStorage if available
  useEffect(() => {
    const savedLang = localStorage.getItem('medikiosk_lang') as SupportedLanguage;
    if (savedLang === 'en' || savedLang === 'hi') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('medikiosk_lang', lang);
  };

  const toggleVoiceGuide = () => {
    setVoiceGuide((prev) => !prev);
  };

  const t = (key: keyof typeof translations.en): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    return translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        textScale,
        setTextScale,
        voiceGuide,
        toggleVoiceGuide,
        t,
      }}
    >
      <div
        className={`min-h-screen transition-all duration-150 ${
          textScale === 'xlarge' ? 'text-lg' : textScale === 'large' ? 'text-base' : 'text-sm'
        }`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
