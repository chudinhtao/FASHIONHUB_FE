import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationVI from '../locales/vi/translation.json';
import translationEN from '../locales/en/translation.json';

const resources = {
  vi: {
    translation: translationVI,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // Ngôn ngữ mặc định
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // React đã tự động bảo mật XSS
    },
  });

export default i18n;
