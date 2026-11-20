// HTML made at build time from the same typed content as the game (vite.config.ts → the
// `sitePages` plugin): the <head> tags of the page, and what a browser without JavaScript shows
// instead of the game (links to the CV PDFs). Every text goes through `escapeHtml`, so a "<" or
// "&" in the content can never break the page. Pure functions → tested in html.test.ts.
import { DICTIONARIES } from '../content/locale';
import type { Locale } from '../content/types';
import { UI_PALETTE } from '../styles/palette';
import { PATHS } from './paths';

export { PATHS };

const SHARE_IMAGE = { width: 1200, height: 630 };
const OG_LOCALE: Record<Locale, string> = { es: 'es_ES', en: 'en_US' };
const OTHER: Record<Locale, Locale> = { es: 'en', en: 'es' };

/** Makes text safe to put inside HTML (also inside attribute values). */
export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const meta = (name: string, content: string) => `<meta name="${name}" content="${escapeHtml(content)}" />`;
const property = (name: string, content: string) => `<meta property="${name}" content="${escapeHtml(content)}" />`;
const link = (rel: string, href: string, extra = '') => `<link rel="${rel}" href="${escapeHtml(href)}"${extra} />`;

/**
 * The <head> tags of the page: title, description, icons and what LinkedIn, WhatsApp… show when
 * the link is shared. Absolute addresses (canonical, share image) need the site's final address:
 * without `siteUrl` they are left out and everything else still works.
 */
export function renderHead(locale: Locale, siteUrl?: string): string {
  const t = DICTIONARIES[locale];
  const { title, description } = t.page;
  const absolute = (to: string) => (siteUrl ? `${siteUrl.replace(/\/$/, '')}${to}` : undefined);

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    meta('description', description),
    meta('theme-color', UI_PALETTE['night-0']),
    link('icon', PATHS.favicon, ' type="image/png"'),
    link('apple-touch-icon', PATHS.appleIcon),
    property('og:type', 'website'),
    property('og:site_name', 'Yeray Caturla'),
    property('og:title', title),
    property('og:description', description),
    property('og:locale', OG_LOCALE[locale]),
    property('og:locale:alternate', OG_LOCALE[OTHER[locale]]),
    meta('twitter:card', 'summary_large_image'),
  ];

  const url = absolute(PATHS.game);
  const image = absolute(PATHS.shareImage);
  if (url && image) {
    tags.push(
      link('canonical', url),
      property('og:url', url),
      property('og:image', image),
      property('og:image:width', String(SHARE_IMAGE.width)),
      property('og:image:height', String(SHARE_IMAGE.height)),
      property('og:image:alt', t.page.shareImageAlt),
    );
  }
  return tags.join('\n    ');
}

/**
 * What the page shows when JavaScript is off (it never shows otherwise): the game cannot run, so
 * it says so and links both CV PDFs, each sentence in its own language.
 */
export function renderNoscript(): string {
  const locales: Locale[] = ['es', 'en'];
  const paragraphs = locales.map((locale) => {
    const t = DICTIONARIES[locale].page.noscript;
    return `<p lang="${locale}">${escapeHtml(t.message)} <a href="${PATHS.pdf[locale]}" download>${escapeHtml(t.link)}</a></p>`;
  });
  return `<noscript><div class="noscript">${paragraphs.join('')}</div></noscript>`;
}
