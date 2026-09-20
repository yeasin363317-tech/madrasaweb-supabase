import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Language } from '@/types';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (bn: string, en: string) => string;
  isBn: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('madrasa_lang') as Language) || 'bn';
  });

  const toggleLanguage = useCallback(() => {
    setLang(prev => {
      const next = prev === 'bn' ? 'en' : 'bn';
      localStorage.setItem('madrasa_lang', next);
      return next;
    });
  }, []);

  const t = useCallback((bn: string, en: string) => {
    return lang === 'bn' ? bn : en;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, isBn: lang === 'bn' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
