// The shape every language file must have. `es.ts` and `en.ts` are both checked against it, so a
// missing or misspelled text in either language is a compile error. Plain data only (no JSX):
// it could move to an i18n library later without changes.
import type { SectionId } from './sections';

export type Locale = 'es' | 'en';

/** A label + value row (STATS, ALCHEMY, COMMS). `href` makes the value a link. */
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

export type Tier = {
  title: string;
  groups: { name: string; items: string[] }[];
};

/** The plain CV page (/cv/ and /cv/en/), made at build time from this same content. */
export type CvPage = {
  link: string; // the "view CV" link shown on every screen of the game
  title: string; // the CV page's <title>
  description: string; // its meta description (search results, share previews)
  download: string; // the PDF download button
  back: string; // link back to the game
  otherLanguage: string; // link to the CV in the other language
  headings: { contact: string; profile: string; experience: string; education: string; projects: string; stack: string };
};

export type Content = {
  // The game page: heading for screen readers, <title> and meta description.
  page: { heading: string; title: string; description: string; shareImageAlt: string };
  cv: CvPage;
  // Title screen. PRESS START and SKIP INTRO are game labels: English in both languages.
  title: { name: string; credits: string; press: string; skip: string };
  ring: { label: string };
  sections: Record<SectionId, { title: string }>;
  window: { close: string; draft: string; newTab: string };
  // Help line at the bottom of a window: with a mouse/keyboard, and on touch screens.
  help: {
    back: string;
    sections: { pointer: string; touch: string };
    projects: { pointer: string; touch: string };
  };
  hud: { yeray: string; null: string };
  stats: {
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
  equip: {
    listLabel: string;
    labels: { did: string; stack: string; repo: string; demo: string };
    projects: Project[];
  };
  alchemy: { tiers: Tier[] };
  comms: {
    rows: Row[];
    language: { legend: string; es: string; en: string };
  };
};
