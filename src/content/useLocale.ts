import { createContext, useContext } from 'react';
import type { Content, Locale } from './types';

type LocaleValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Content; // the active dictionary: t.stats.bio, t.sections.equip.title…
};

// TS concept — a typed React context: every component that reads it gets `LocaleValue`, or null
// when there is no provider above it (useLocale turns that into a clear error).
export const LocaleContext = createContext<LocaleValue | null>(null);

/** The active language and its texts. Use inside <LocaleProvider>. */
export function useLocale(): LocaleValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale() needs a <LocaleProvider> above it');
  return value;
}
