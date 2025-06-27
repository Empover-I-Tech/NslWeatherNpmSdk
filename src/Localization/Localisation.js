import * as RNLocalize from "react-native-localize";
import { I18n } from 'i18n-js';
import memoize from 'lodash.memoize';

// Create instance
const i18n = new I18n();

// Supported translations
export const translationGetters = {
  en: () => require('./en.json'),
  te: () => require('./te.json'),
  hi: () => require('./hi.json'),
  mr: () => require('./mr.json'),
};

// Memoized translation function
export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

// Set locale configuration
export const setI18nConfig = (lang = "") => {
  const fallback = { languageTag: 'en' };

  const { languageTag } =
    lang && translationGetters[lang]
      ? { languageTag: lang }
      : RNLocalize.findBestLanguageTag(Object.keys(translationGetters)) || fallback;

  console.log("Language set to -->", languageTag);

  // Clear cache and update translation
  translate.cache.clear();

  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
  i18n.fallbacks = true;
};

// One-time initialization (auto-detect device locale)
export const initLocalisation = () => {
  setI18nConfig();
};

// Manual change (e.g. from language selector)
export const changeLanguage = (lang) => {
  setI18nConfig(lang);
};
