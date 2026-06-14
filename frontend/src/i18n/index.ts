import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import tr from './tr.json';
import en from './en.json';
import fr from './fr.json';

i18n.use(initReactI18next).init({
  resources: { tr: { translation: tr }, en: { translation: en }, fr: { translation: fr } },
  lng: localStorage.getItem('marcher_lang') || 'tr',
  fallbackLng: 'tr',
  interpolation: { escapeValue: false },
});

export default i18n;
