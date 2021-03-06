import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Fetch from 'i18next-fetch-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const SUPPORTED_LOCALES = ['en', 'ru'];

i18n
  .use(Fetch)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    // debug: true,
    simplifyPluralSuffix: false,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    returnEmptyString: false,

    ns: ['translation'],
    defaultNS: 'translation',
  });

i18n.on('languageChanged', (lng) => {
  if (document) document.documentElement.lang = lng;
});

export default i18n;
