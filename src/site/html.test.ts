import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { EN } from '../content/en';
import { ES } from '../content/es';
import { PATHS, escapeHtml, renderHead, renderNoscript } from './html';

describe('escapeHtml', () => {
  it('turns the characters that mean something in HTML into text', () => {
    expect(escapeHtml(`<a href="x">Tom & 'Jerry'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;');
  });
});

describe('head tags', () => {
  it('has the title, description and icons of the page in each language', () => {
    const head = renderHead('en');
    expect(head).toContain(`<title>${escapeHtml(EN.page.title)}</title>`);
    expect(head).toContain(escapeHtml(EN.page.description));
    expect(head).toContain(PATHS.favicon);
    expect(renderHead('es')).toContain(`<title>${escapeHtml(ES.page.title)}</title>`);
  });

  it('leaves out the absolute addresses until the site has one', () => {
    const head = renderHead('es');
    expect(head).not.toContain('og:image"');
    expect(head).not.toContain('canonical');
  });

  it('with the site address: canonical and share image', () => {
    const head = renderHead('es', 'https://example.dev/');
    expect(head).toContain('<link rel="canonical" href="https://example.dev/" />');
    expect(head).toContain('<meta property="og:image" content="https://example.dev/og-image.png" />');
    expect(head).not.toContain('hreflang'); // one page: the game picks the language itself
  });
});

describe('without JavaScript', () => {
  const html = renderNoscript();

  it('says the game needs JavaScript and links both CV PDFs, each in its language', () => {
    expect(html.startsWith('<noscript>')).toBe(true);
    for (const t of [ES, EN]) expect(html).toContain(escapeHtml(t.page.noscript.message));
    expect(html).toContain(`<p lang="es">`);
    expect(html).toContain(`href="${PATHS.pdf.es}" download`);
    expect(html).toContain(`href="${PATHS.pdf.en}" download`);
  });

  it('never shows a phone number', () => {
    expect(html.replace(/<[^>]+>/g, ' ')).not.toMatch(/\+?\d[\d .-]{8,}\d/);
  });
});

describe.each([
  ['es', ES],
  ['en', EN],
] as const)('CV PDF (%s)', (locale, t) => {
  it('is really there (npm run cv copies it to public/)', () => {
    expect(existsSync(`public${PATHS.pdf[locale]}`)).toBe(true);
  });

  it('CONTACT links the PDF of its own language', () => {
    const hrefs = t.contact.rows.map((row) => row.href);
    expect(hrefs).toContain(PATHS.pdf[locale]);
    expect(hrefs).not.toContain(PATHS.pdf[locale === 'es' ? 'en' : 'es']);
  });
});
