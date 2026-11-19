import { describe, expect, it } from 'vitest';
import { EN } from '../content/en';
import { ES } from '../content/es';
import { PATHS, escapeHtml, renderCv, renderHead } from './html';

describe('escapeHtml', () => {
  it('turns the characters that mean something in HTML into text', () => {
    expect(escapeHtml(`<a href="x">Tom & 'Jerry'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;');
  });
});

describe('head tags', () => {
  it('has the title, description and icons of each page and language', () => {
    const head = renderHead('cv', 'en');
    expect(head).toContain(`<title>${escapeHtml(EN.cv.title)}</title>`);
    expect(head).toContain(escapeHtml(EN.cv.description));
    expect(head).toContain(PATHS.favicon);
    expect(renderHead('game', 'es')).toContain(`<title>${escapeHtml(ES.page.title)}</title>`);
  });

  it('leaves out the absolute addresses until the site has one', () => {
    const head = renderHead('game', 'es');
    expect(head).not.toContain('og:image"');
    expect(head).not.toContain('canonical');
  });

  it('with the site address: canonical, share image and both CV languages', () => {
    const head = renderHead('cv', 'es', 'https://example.dev/');
    expect(head).toContain('<link rel="canonical" href="https://example.dev/cv/" />');
    expect(head).toContain('<meta property="og:image" content="https://example.dev/og-image.png" />');
    expect(head).toContain('hreflang="en"');
    expect(head).toContain('hreflang="x-default"');
    expect(renderHead('game', 'es', 'https://example.dev')).not.toContain('hreflang');
  });
});

describe.each([
  ['es', ES],
  ['en', EN],
] as const)('CV page (%s)', (locale, t) => {
  const html = renderCv(locale);
  const text = html.replace(/<[^>]+>/g, ' ');

  it('has every part of the CV, made from the game’s content', () => {
    expect(html).toContain(`<h1>${escapeHtml(t.stats.name)}</h1>`);
    for (const heading of Object.values(t.cv.headings)) expect(html).toContain(escapeHtml(heading));
    for (const project of t.equip.projects) expect(html).toContain(escapeHtml(project.name));
    for (const quest of t.stats.quests) expect(html).toContain(escapeHtml(quest.company));
    for (const item of t.stats.education) expect(html).toContain(escapeHtml(item.title));
  });

  it('links the PDF, the game and the other language', () => {
    expect(html).toContain(`href="${PATHS.pdf}" download`);
    expect(html).toContain(`href="${PATHS.game}"`);
    expect(html).toContain(`href="${PATHS.cv[locale === 'es' ? 'en' : 'es']}"`);
  });

  it('the PDF the game links in COMMS is the same one', () => {
    expect(t.comms.rows.map((row) => row.href)).toContain(PATHS.pdf);
  });

  it('never shows a phone number', () => {
    expect(text).not.toMatch(/\+?\d[\d .-]{8,}\d/);
  });

  it('Bosa Digital keeps only its three CV sentences', () => {
    const bosa = t.equip.projects.find((project) => project.id === 'bosa');
    expect(bosa).toBeDefined();
    for (const sentence of bosa?.did ?? []) expect(html.split(escapeHtml(sentence)).length - 1).toBe(2); // experience + project
  });
});
