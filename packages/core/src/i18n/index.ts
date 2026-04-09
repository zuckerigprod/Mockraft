import i18next from "i18next";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const en = require("./en.json");
const ru = require("./ru.json");

let initialized = false;

export async function initI18n(lang: string = "en") {
  if (initialized) {
    await i18next.changeLanguage(lang);
    return i18next;
  }

  await i18next.init({
    lng: lang,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    interpolation: {
      escapeValue: false,
    },
  });

  initialized = true;
  return i18next;
}

export function t(key: string, options?: Record<string, unknown>): string {
  return i18next.t(key, options);
}

export function setLanguage(lang: string) {
  return i18next.changeLanguage(lang);
}

export function getCurrentLanguage(): string {
  return i18next.language || "en";
}
