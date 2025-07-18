import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './i18n/en.json';
import ar from './i18n/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

// Detect language from localStorage, fallback to browser, then default to 'en'
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('i18nextLng');
    if (stored) return stored;
    const browser = navigator.language.split('-')[0];
    if (Object.prototype.hasOwnProperty.call(resources, browser)) return browser;
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
