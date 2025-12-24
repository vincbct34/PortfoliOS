/**
 * @file I18nContext.tsx
 * @description Internationalization context for managing language and translations.
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { translations, type Language, type Translations } from '../i18n/translations';

/** Context value for internationalization */
interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  locale: string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** Storage key for persisting language preference */
const STORAGE_KEY = 'portfolios-language';

/**
 * Gets the initial language from storage or browser preference.
 * @returns The detected or default language
 */
function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') {
      return saved;
    }
  } catch {
    void 0;
  }

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) {
    return 'en';
  }

  return 'fr';
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      void 0;
    }
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: I18nContextValue = {
    language,
    setLanguage,
    t: translations[language],
    locale: language === 'fr' ? 'fr-FR' : 'en-US',
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, language, locale } = useI18n();
  return { t, language, locale };
}
