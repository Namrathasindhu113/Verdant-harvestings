
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translations as initialTranslations } from '@/lib/translations';

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

interface LocalizationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  translations: Translations;
  addTranslations: (lang: string, newTranslations: { [key: string]: string }) => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<Translations>(initialTranslations);

  const t = useCallback((key: string) => {
    return translations[language]?.[key] || key;
  }, [language, translations]);

  const addTranslations = (lang: string, newTranslations: { [key: string]: string }) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        ...newTranslations,
      }
    }));
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, [translations]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, translations, addTranslations }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
