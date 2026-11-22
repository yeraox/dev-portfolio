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
  | { kind: 'screenshots'; shots: { id: 'pakitosRuleta' | 'pakitosBlackjack' | 'portfolio'; alt: string }[] };

export type Project = {
  id: 'capyroad' | 'pakitos' | 'portfolio';
  name: string;
  tab?: string; // a shorter name for its tab, when `name` is long (the section's heading has it whole)
  tag?: string; // a small badge: FEATURED, YOU ARE HERE…
  context: string;
  summary: string;
  why: string; // why the project exists, in Yeray's words: shown right after the summary
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
  | 'typescript'
  | 'django'
  | 'html'
  | 'css'
  | 'oracle'
  | 'mongodb'
  | 'terraform';

/** ABOUT ME's hobbies: each one has its icon (src/assets/about, made by `npm run hobby-icons`),
 *  and a missing one is a compile error there. `dog` is Null. */
export type HobbyId = 'anime' | 'games' | 'gym' | 'basket' | 'cooking' | 'dog';

export type Hobby = { id: HobbyId; name: string; text: string };

/** ABOUT ME: two sections. As a developer, a few short paragraphs (what the CV doesn't say); the
 *  personal side, a line and the hobbies, each with its icon. */
export type About = {
  developer: { tab: string; paragraphs: string[] };
  personal: { tab: string; intro: string; hobbies: Hobby[] };
};

/** A technology: which icon (`id`) and how it is written (`name`). */
export type Tech = { id: TechId; name: string };

export type Tier = {
  title: string;
  groups: { name: string; items: Tech[] }[];
};

/** SETTINGS, what the gear opens (in the ring and on the title): the language, the animations on
 *  or off with a note on what that changes, BACK TO TITLE (camp only) and a privacy line. */
export type Settings = {
  banner: string;
  title: string;
  animations: {
    legend: string;
    on: string;
    off: string;
    notes: { on: string; off: string }; // what is moving, or what stands still (in red)
    system: string; // put before the note when the system asked for less motion
  };
  backToTitle: string;
  privacy: string; // no cookies, no analytics: what the site keeps in the browser
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
  // The language switch: the flags in SETTINGS.
  language: { legend: string; es: string; en: string };
  settings: Settings;
  window: { close: string; newTab: string };
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
    labels: { why: string; did: string; stack: string; repo: string; demo: string };
    list: Project[];
  };
  stack: { tiers: Tier[] };
  contact: { rows: Row[] };
  about: About;
};
