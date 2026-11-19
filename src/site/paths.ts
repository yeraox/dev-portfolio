// Where things live on the site (served from the domain's root). Shared by the game (the CV link)
// and by the pages made at build time (src/site/html.ts).
export const PATHS = {
  game: '/',
  cv: { es: '/cv/', en: '/cv/en/' },
  pdf: '/cv/yeray-caturla-cv-es.pdf', // only in Spanish for now
  shareImage: '/og-image.png',
  favicon: '/favicon.png',
  appleIcon: '/apple-touch-icon.png',
} as const;
