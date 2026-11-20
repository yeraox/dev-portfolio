import { statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { EN } from './en';
import { ES } from './es';
import { pickLocale } from './locale';
import { flattenTexts as texts } from './texts';
import type { Content } from './types';

// TS concept — a tuple list in a test table: [name, dictionary].
const LOCALES: [string, Content][] = [
  ['es', ES],
  ['en', EN],
];

describe('Spanish and English', () => {
  it('have exactly the same texts in the same places (lists included)', () => {
    // TypeScript already checks the fields; this also catches a list with one item more or less.
    expect(texts(EN).map(([path]) => path)).toEqual(texts(ES).map(([path]) => path));
  });

  it('keep the facts that must not change: links, names, dates', () => {
    const facts = (content: Content) => [
      content.contact.rows.map((row) => row.href).filter((href) => !href?.startsWith('/cv/')),
      content.projects.list.map((project) => [project.id, project.repo, project.stack.length, project.media.kind]),
      content.profile.education.map((item) => [item.school, item.years, item.status]),
      content.profile.quests.map((quest) => [quest.company, quest.tasks.length]),
      content.stack.tiers.map((tier) => tier.groups.map((group) => group.items.map((tech) => tech.id))),
    ];
    expect(facts(EN)).toEqual(facts(ES));
  });
});

describe.each(LOCALES)('%s', (_locale, content) => {
  const all = texts(content);

  it('never shows a phone number', () => {
    for (const [path, text] of all) expect(text, path).not.toMatch(/\+?\d[\d .-]{8,}\d/);
  });

  it('has no TODO or placeholder left', () => {
    for (const [path, text] of all) expect(text, path).not.toMatch(/\bTODO\b|PREGUNTA|[Ll]orem ipsum/); // the markers are uppercase: 'todo el ciclo' is fine
  });

  it('links are https or mailto, or the CV pages and PDF on this site', () => {
    const hrefs = [...content.contact.rows.map((row) => row.href), ...content.projects.list.map((project) => project.repo)];
    for (const href of hrefs) if (href) expect(href).toMatch(/^(https:\/\/|mailto:|\/cv\/)/);
  });

  it('Bosa Digital (NDA) only shows its three CV sentences, with no media', () => {
    const bosa = content.projects.list.find((project) => project.id === 'bosa');
    expect(bosa?.did).toHaveLength(3);
    expect(bosa?.did).toEqual(content.profile.quests[0].tasks);
    expect(bosa?.media.kind).toBe('classified');
    expect(bosa?.repo).toBeUndefined();
    expect(bosa?.summary).toBeUndefined();
  });

  it('STACK has no levels or percentages', () => {
    for (const tier of content.stack.tiers) {
      for (const group of tier.groups) for (const item of group.items) expect(item.name).not.toMatch(/%|\d+\s*\/\s*\d+/);
    }
    expect(content.stack.tiers).toHaveLength(2);
  });
});

describe('Spanish source', () => {
  it('keeps the Bosa Digital sentences exactly as in the CV', () => {
    expect(ES.profile.quests[0].tasks).toEqual([
      'Herramientas en Python para automatizar procesos internos del área de ventas.',
      'Investigación e integración de APIs externas y fuentes de datos para herramientas internas.',
      'Lógica de backend con Django en el entorno de desarrollo de la empresa, con Git.',
    ]);
  });
});

describe('pickLocale', () => {
  it('uses the saved choice first', () => {
    expect(pickLocale('en', 'es-ES')).toBe('en');
    expect(pickLocale('es', 'en-US')).toBe('es');
  });

  it('otherwise Spanish for Spanish browsers and English for everyone else', () => {
    expect(pickLocale(null, 'es-ES')).toBe('es');
    expect(pickLocale(null, 'es')).toBe('es');
    expect(pickLocale(null, 'ca-ES')).toBe('en');
    expect(pickLocale(null, 'en-GB')).toBe('en');
    expect(pickLocale(null, undefined)).toBe('en');
    expect(pickLocale('fr', 'es-AR')).toBe('es'); // an unknown saved value is ignored
  });
});

describe('the CV slot of the ring', () => {
  it.each([
    ['es', ES, ','],
    ['en', EN, '.'],
  ] as const)('%s: says how much its PDF really weighs', (locale, content, decimalMark) => {
    // The question window tells the size before downloading: it must match the file in public/.
    const megabytes = statSync(`public/cv/yeray-caturla-cv-${locale}.pdf`).size / 1024 / 1024;
    expect(content.cvDownload.file).toContain(`${megabytes.toFixed(1).replace('.', decimalMark)} MB`);
  });
});
