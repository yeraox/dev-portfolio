import { useEffect, useState, type ReactNode } from 'react';
import { DICTIONARIES, pickLocale, readSavedLocale, saveLocale } from './locale';
import type { Locale } from './types';
import { LocaleContext } from './useLocale';

/** Holds the language for the whole app, remembers the choice and keeps <html lang> in sync. */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => pickLocale(readSavedLocale(), navigator.language));

  // Screen readers and search engines read the page's language from <html lang>; the tab's title
  // follows the language too.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = DICTIONARIES[locale].page.title;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    saveLocale(next);
  };

  return <LocaleContext value={{ locale, setLocale, t: DICTIONARIES[locale] }}>{children}</LocaleContext>;
}
