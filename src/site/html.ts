// HTML made at build time from the same typed content as the game (vite.config.ts → the
// `sitePages` plugin): the <head> tags of every page, and the whole CV page (/cv/ and /cv/en/).
// The CV page is plain HTML with no JavaScript: it loads at once, prints well and search engines
// read it as it is. Every text goes through `escapeHtml`, so a "<" or "&" in the content can
// never break the page. Pure functions → tested in html.test.ts.
import { DICTIONARIES } from '../content/locale';
import type { Content, Education, Locale, Project, Quest, Row } from '../content/types';
import { UI_PALETTE } from '../styles/palette';
import { PATHS } from './paths';

export { PATHS };
export type PageId = 'game' | 'cv';

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
 * The <head> tags of a page: title, description, icons and what LinkedIn, WhatsApp… show when the
 * link is shared. Absolute addresses (canonical, share image, languages) need the site's final
 * address: without `siteUrl` they are left out and everything else still works.
 */
export function renderHead(page: PageId, locale: Locale, siteUrl?: string): string {
  const t = DICTIONARIES[locale];
  const title = page === 'cv' ? t.cv.title : t.page.title;
  const description = page === 'cv' ? t.cv.description : t.page.description;
  const path = page === 'cv' ? PATHS.cv[locale] : PATHS.game;
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

  const url = absolute(path);
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
    // The CV exists in two languages at two addresses: search engines show the right one.
    if (page === 'cv') {
      tags.push(
        link('alternate', absolute(PATHS.cv.es) ?? '', ' hreflang="es"'),
        link('alternate', absolute(PATHS.cv.en) ?? '', ' hreflang="en"'),
        link('alternate', absolute(PATHS.cv.es) ?? '', ' hreflang="x-default"'),
      );
    }
  }
  return tags.join('\n    ');
}

// ---------- The CV page ----------

function rows(list: Row[]): string {
  const items = list.map((row) => {
    const value = row.href ? `<a href="${escapeHtml(row.href)}">${escapeHtml(row.value)}</a>` : escapeHtml(row.value);
    return `<div><dt>${escapeHtml(row.label)}</dt><dd>${value}</dd></div>`;
  });
  return `<dl class="rows">${items.join('')}</dl>`;
}

const list = (items: string[]) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;

const section = (id: string, heading: string, body: string) =>
  `<section aria-labelledby="${id}"><h2 id="${id}">${escapeHtml(heading)}</h2>${body}</section>`;

function quest(item: Quest): string {
  return (
    `<article><h3>${escapeHtml(item.role)}</h3>` +
    `<p class="meta">${escapeHtml(item.company)} · ${escapeHtml(item.details)}</p>${list(item.tasks)}</article>`
  );
}

function education(item: Education, t: Content): string {
  const status = t.stats.status[item.status];
  const note = item.note ? `<p>${escapeHtml(item.note)}</p>` : '';
  return (
    `<article><h3>${escapeHtml(item.title)}</h3>` +
    `<p class="meta">${escapeHtml(item.school)} · ${escapeHtml(item.years)} · ${escapeHtml(status)}</p>${note}</article>`
  );
}

function project(item: Project, t: Content): string {
  const labels = t.equip.labels;
  const tag = item.tag ? ` <span class="tag">${escapeHtml(item.tag)}</span>` : '';
  const facts: Row[] = [
    { label: labels.stack, value: item.stack.join(' · ') },
    ...item.notes,
    ...(item.repo ? [{ label: labels.repo, value: item.repo.replace(/^https:\/\//, ''), href: item.repo }] : []),
    ...(item.demo ? [{ label: labels.demo, value: item.demo }] : []),
  ];
  return (
    `<article><h3>${escapeHtml(item.name)}${tag}</h3>` +
    `<p class="meta">${escapeHtml(item.context)}</p>` +
    (item.summary ? `<p>${escapeHtml(item.summary)}</p>` : '') +
    `<p class="label">${escapeHtml(labels.did)}</p>${list(item.did)}${rows(facts)}</article>`
  );
}

/** The whole <body> of the CV page in `locale`. */
export function renderCv(locale: Locale): string {
  const t = DICTIONARIES[locale];
  const other = OTHER[locale];
  const h = t.cv.headings;
  // Contact rows without the CV links: this page already is the CV.
  const contact = t.comms.rows.filter((row) => !row.href?.startsWith('/cv/'));
  const stack = t.alchemy.tiers.map(
    (tier) => `<h3>${escapeHtml(tier.title)}</h3>${rows(tier.groups.map((group) => ({ label: group.name, value: group.items.join(' · ') })))}`,
  );

  return `<div class="page">
      <header class="top">
        <nav class="links">
          <a href="${PATHS.game}">${escapeHtml(t.cv.back)}</a>
          <a href="${PATHS.cv[other]}" hreflang="${other}" lang="${other}">${escapeHtml(t.cv.otherLanguage)}</a>
        </nav>
        <h1>${escapeHtml(t.stats.name)}</h1>
        <p class="role">${escapeHtml(t.stats.role)}</p>
        <a class="download" href="${PATHS.pdf}" download>${escapeHtml(t.cv.download)}</a>
      </header>
      <main>
        ${section('contact', h.contact, rows(contact))}
        ${section('profile', h.profile, `<p>${escapeHtml(t.stats.bio)}</p>${rows(t.stats.rows)}`)}
        ${section('experience', h.experience, t.stats.quests.map(quest).join(''))}
        ${section('education', h.education, t.stats.education.map((item) => education(item, t)).join(''))}
        ${section('projects', h.projects, t.equip.projects.map((item) => project(item, t)).join(''))}
        ${section('stack', h.stack, stack.join(''))}
      </main>
    </div>`;
}
