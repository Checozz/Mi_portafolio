import { translations } from "./translations.js";

/**
 * Get the current language from a URL object.
 * With Astro's i18n routing (prefixDefaultLocale: false),
 * Astro.currentLocale is 'es' by default and 'en' for /en/* routes.
 * @param {string} locale - Astro.currentLocale value
 * @returns {'es' | 'en'}
 */
export function getLang(locale) {
  if (locale === "en") return "en";
  return "es";
}

/**
 * Returns a translation function for the given language.
 * @param {'es' | 'en'} lang
 * @returns {(key: string) => any}
 */
export function useTranslations(lang) {
  return function t(key) {
    const value = translations[lang]?.[key];
    if (value !== undefined) return value;
    // fallback to Spanish
    return translations["es"]?.[key] ?? key;
  };
}

/**
 * Get the equivalent path in the other language.
 * @param {string} currentPath - current URL pathname
 * @param {'es' | 'en'} currentLang
 * @returns {string}
 */
export function getAlternatePath(currentPath, currentLang) {
  if (currentLang === "en") {
    // Remove /en prefix to get Spanish path
    const spanishPath = currentPath.replace(/^\/en/, "") || "/";
    return spanishPath;
  } else {
    // Add /en prefix to get English path
    const normalizedPath = currentPath === "/" ? "" : currentPath;
    return "/en" + normalizedPath;
  }
}
