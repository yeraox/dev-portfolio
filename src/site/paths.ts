// Where things live on the site (served from the domain's root). Shared by the game (the CV
// downloads) and by the HTML made at build time (src/site/html.ts).
import type { Locale } from '../content/types';

// TS concept — `Record<Locale, string>`: one PDF for every language. If a third language were
// added to `Locale`, this object would stop compiling until that language had its PDF too.
const PDF: Record<Locale, string> = {
  es: '/cv/yeray-caturla-cv-es.pdf',
  en: '/cv/yeray-caturla-cv-en.pdf',
};

export const PATHS = {
  game: '/',
  pdf: PDF,
  shareImage: '/og-image.png',
  favicon: '/favicon.png',
  appleIcon: '/apple-touch-icon.png',
} as const;
