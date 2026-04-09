import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../../core/src/i18n/en.json";
import ru from "../../core/src/i18n/ru.json";

const savedLang = localStorage.getItem("mockraft-lang") || navigator.language.split("-")[0];

i18next.use(initReactI18next).init({
  lng: savedLang === "ru" ? "ru" : "en",
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
