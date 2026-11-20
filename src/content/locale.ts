// Which language to show. Pure functions here; the React part is in LocaleProvider.tsx.
import { EN } from './en';
import { ES } from './es';
import type { Content, Locale } from './types';

export const DICTIONARIES: Record<Locale, Content> = { es: ES, en: EN };

const LOCALE_STORAGE_KEY = 'locale';

/** The visitor's saved choice wins; otherwise Spanish for Spanish browsers, English for the rest. */
export function pickLocale(saved: string | null, browserLanguage: string | undefined): Locale {
  if (saved === 'es' || saved === 'en') return saved;
  return browserLanguage?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

// Storage can be missing or blocked (private mode, strict settings): the site works without it.
export function readSavedLocale(): string | null {
  try {
    return window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Not saved: the choice still lasts until the page is closed.
  }
}
