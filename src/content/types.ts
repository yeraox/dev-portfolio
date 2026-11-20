// The shape every language file must have. `es.ts` and `en.ts` are both checked against it, so a
// missing or misspelled text in either language is a compile error. Plain data only (no JSX):
// it could move to an i18n library later without changes.
import type { SectionId, SlotId } from './sections';

export type Locale = 'es' | 'en';

/** A label + value row (PROFILE, CONTACT). `href` makes the value a link. */
export type Row = { label: string; value: string; href?: string };

export type Education = {
  title: string;
  school: string;
  years: string;
  status: 'inProgress' | 'done';
  note?: string;
};

export type Quest = {
  role: string;
  company: string;
  details: string;
  tasks: string[];
};

// TS concept — a discriminated union again (like GameState): each project shows a different kind
// of media, and `kind` tells TypeScript which fields exist.
export type ProjectMedia =
  | { kind: 'video'; videoLabel: string; screenshot: { id: 'capyroad'; alt: string } }
  | { kind: 'screenshots'; shots: { id: 'pakitosRuleta' | 'pakitosBlackjack'; alt: string }[] }
  | { kind: 'classified' }; // NDA: no media at all

export type Project = {
  id: 'capyroad' | 'pakitos' | 'bosa';
  name: string;
  tag?: string; // a small badge: FEATURED, CLASSIFIED…
  context: string;
  summary?: string;
  did: string[];
  stack: string[];
  notes: Row[]; // extra facts (persistence, confidentiality…)
  repo?: string;
  demo?: string;
  media: ProjectMedia;
};

/** Every technology of the STACK window: each one has its icon (src/assets/stack, made by
 *  `npm run stack-icons`), and a missing one is a compile error there. */
export type TechId =
  | 'javascript'
  | 'java'
  | 'python'
  | 'sql'
  | 'nodejs'
  | 'express'
  | 'rest'
  | 'react'
  | 'postgresql'
  | 'docker'
  | 'aws'
  | 'linux'
  | 'wsl'
  | 'git'
  | 'github'
  | 'php'
  | 'django'
  | 'html'
  | 'css'
  | 'oracle'
  | 'mongodb'
  | 'terraform';

/** A technology: which icon (`id`) and how it is written (`name`). */
export type Tech = { id: TechId; name: string };

export type Tier = {
  title: string;
  groups: { name: string; items: Tech[] }[];
};

/** The CV slot of the ring: it asks before downloading the PDF of the current language. */
export type CvDownload = {
  banner: string; // the camp banner while the CV slot is at the top of the ring
  question: string; // the confirmation window's title
  file: string; // which file it is: format, language and size (no surprises on mobile data)
  yes: string;
  no: string;
};

export type Content = {
  // The game page: heading for screen readers, <title> and meta description; `noscript` = what a
  // browser without JavaScript shows instead of the game (a link to the CV PDF).
  page: {
    heading: string;
    title: string;
    description: string;
    shareImageAlt: string;
    noscript: { message: string; link: string };
  };
  // Title screen. PRESS START and SKIP INTRO are game labels: English in both languages.
  title: { name: string; credits: string; press: string; skip: string };
  // `names` = what each slot is called under its icon, always visible (PROYECTOS, STACK…).
  ring: { label: string; names: Record<SlotId, string> };
  // Banner and window titles: "game name — what it is" (BRIEF.md table).
  sections: Record<SectionId, { title: string }>;
  cvDownload: CvDownload;
  // The language switch: the title's ES/EN, the ring's flag and CONTACT's radio buttons.
  language: { legend: string; es: string; en: string; banner: string; switchTo: string };
  window: { close: string; draft: string; newTab: string };
  // Help line at the bottom of a window: with a mouse/keyboard, and on touch screens.
  help: {
    back: string;
    sections: { pointer: string; touch: string };
    projects: { pointer: string; touch: string };
  };
  // HP and XP are game labels (English in both languages); `explored` is what a screen reader
  // hears for the XP bar ({n} and {total} are filled in by the HUD).
  hud: { yeray: string; null: string; hp: string; xp: string; explored: string };
  profile: {
    profileTitle: string;
    name: string;
    role: string;
    rows: Row[];
    bio: string;
    educationTitle: string;
    education: Education[];
    status: { inProgress: string; done: string };
    questsTitle: string;
    quests: Quest[];
  };
  projects: {
    listLabel: string;
    labels: { did: string; stack: string; repo: string; demo: string };
    list: Project[];
  };
  stack: { tiers: Tier[] };
  contact: { rows: Row[] };
};
