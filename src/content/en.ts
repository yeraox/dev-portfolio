// English copy — translated from es.ts for Yeray to review (/dev/textos shows both side by side).
// Same facts, nothing added: if a Spanish text is a TODO, the English one is too.
import type { Content } from './types';

// The Bosa Digital internship's three CV sentences, translated faithfully (NDA: nothing else).
const BOSA_TASKS = [
  'Python tools to automate internal processes in the sales department.',
  'Research and integration of external APIs and data sources for internal tools.',
  "Backend logic with Django in the company's development environment, using Git.",
];

const REPO = 'https://github.com/yeraox/pakitos-gambling';

export const EN: Content = {
  page: {
    heading: 'Yeray Caturla · Junior Backend Developer',
  },
  title: {
    name: 'YERAY CATURLA',
    credits: 'BACKEND DEVELOPER · NODE.JS · EXPRESS · JAVA · DOCKER · AWS',
    press: 'PRESS START',
    skip: 'SKIP INTRO',
  },
  ring: {
    label: 'Camp menu',
  },
  // Banner titles from the BRIEF.md table.
  sections: {
    equip: { title: 'Equipment — Projects' },
    alchemy: { title: 'Alchemy — Tech Stack' },
    stats: { title: 'Stats — Profile' },
    buffs: { title: 'Status — Training' },
    craft: { title: 'Crafting — Kitchen' },
    comms: { title: 'Config — Contact' },
  },
  window: {
    close: 'Close window',
    draft: 'Section in preparation.',
    newTab: '(opens in a new tab)',
  },
  help: {
    back: 'Esc returns to camp.',
    sections: {
      pointer: 'Wheel or ← → change section · Esc returns to camp.',
      touch: 'Swipe sideways or tap a tab to change section.',
    },
    projects: {
      pointer: 'Wheel or ← → change project · Esc returns to camp.',
      touch: 'Swipe sideways or tap a project to change.',
    },
  },
  hud: {
    yeray: 'Yeray',
    null: 'Null',
  },

  stats: {
    profileTitle: 'Profile',
    name: 'Yeray Caturla',
    role: 'Junior Backend Developer',
    rows: [
      { label: 'Specialty', value: 'Node.js · Express · Java · Python · Docker · AWS' },
      { label: 'Based in', value: 'Elda (Alicante), Spain' },
      { label: 'Languages', value: 'Spanish (native) · Catalan (native) · English (professional proficiency)' },
    ],
    bio:
      'Junior backend developer with a degree in Web Application Development (DAW), now taking the ' +
      'specialization course in Cloud Resource and Service Administration. I build REST APIs with ' +
      'Node.js and Express, automate processes with Python and Django, and work with SQL and NoSQL ' +
      'databases. I come from systems (SMR) and I am drawn to DevOps: Docker, Linux and Terraform. ' +
      'My goal is to master the whole software lifecycle, from the API to its automated deployment.',
    educationTitle: 'Education',
    education: [
      {
        title: 'Specialization Course in Cloud Resource and Service Administration',
        school: 'IES Poeta Paco Mollà',
        years: '2026 – 2027',
        status: 'inProgress',
        note: 'DevOps, Terraform, Docker',
      },
      {
        title: 'Higher Technician in Web Application Development (DAW)',
        school: 'IES Poeta Paco Mollà',
        years: '2024 – 2026',
        status: 'done',
      },
      {
        title: 'Technician in Microcomputer Systems and Networks (SMR)',
        school: 'IES Poeta Paco Mollà',
        years: '2022 – 2024',
        status: 'done',
      },
    ],
    status: { inProgress: 'In progress', done: 'Completed' },
    questsTitle: 'Quest log',
    quests: [
      {
        role: 'Junior Software Developer (internship)',
        company: 'Sistemas de Innovación Bosa Digital SL',
        details: 'Elda (Alicante) · Hybrid · Mar 2026 – Jun 2026',
        tasks: BOSA_TASKS,
      },
      {
        role: 'Systems Technician (internship)',
        company: 'VKOficinas',
        details: '2024',
        tasks: [
          'Installation, deployment and configuration of operating systems on client and school computers.',
          'Hardware assembly, repair and maintenance; technical support for users.',
        ],
      },
    ],
  },

  equip: {
    listLabel: 'Projects',
    labels: { did: 'What I did', stack: 'Stack', repo: 'Repository', demo: 'Demo' },
    projects: [
      {
        id: 'capyroad',
        name: 'Capyroad',
        tag: 'FEATURED',
        context: "A game inside Pakito's Gambling · play money",
        summary:
          "An original game inside Pakito's Gambling. A capybara crosses a road, hopping from lane to " +
          'lane. Each lane raises the prize multiplier (1.25x → 1.48x → 1.74x → …) and also the risk ' +
          'of being run over (shown in %). Every turn the player chooses Cross (keep risking) or Cash ' +
          'out (leave with the winnings).',
        did: ['The whole cycle, from the backend to the React frontend.'],
        stack: ['Node.js', 'Express', 'PostgreSQL', 'React'],
        notes: [
          {
            label: 'Persistence',
            value: "Every transaction (bet or cash-out) is stored in PostgreSQL, linked to the user's id.",
          },
        ],
        repo: REPO,
        media: {
          kind: 'video',
          videoLabel: 'Capyroad gameplay, no sound: a winning cash-out, then the capybara gets run over.',
          screenshot: { id: 'capyroad', alt: 'Capyroad: the capybara on lane 4, multiplier 1.74x, 25% risk.' },
        },
      },
      {
        id: 'pakitos',
        name: "Pakito's Gambling",
        context: 'Final DAW project · team of 3 · Feb 2026 – Jun 2026',
        summary: 'A web platform recreating casino games with play money (no real money).',
        did: [
          'Platform backend: REST API and data model design.',
          'Backend for European and American roulette.',
          'Backend for blackjack.',
          'Capyroad, end to end: backend and React frontend.',
          'Teamwork with Git and GitHub.',
        ],
        stack: ['Node.js', 'Express', 'PostgreSQL', 'Git', 'GitHub'],
        notes: [],
        repo: REPO,
        demo: 'No live demo deployed.',
        media: {
          kind: 'screenshots',
          shots: [
            { id: 'pakitosRuleta', alt: 'American roulette with the full betting table.' },
            { id: 'pakitosBlackjack', alt: 'Blackjack with a hand dealt.' },
          ],
        },
      },
      {
        id: 'bosa',
        name: 'Internal tools · Bosa Digital',
        tag: 'CLASSIFIED',
        context: 'Internship · Mar 2026 – Jun 2026',
        did: BOSA_TASKS,
        stack: ['Python', 'Django', 'External APIs', 'Git'],
        notes: [{ label: 'Confidential', value: 'Non-disclosure agreement: no screenshots, figures, code or demo.' }],
        media: { kind: 'classified' },
      },
    ],
  },

  alchemy: {
    tiers: [
      {
        title: 'Mastery',
        groups: [
          { name: 'Languages', items: ['JavaScript', 'Java', 'Python', 'SQL'] },
          { name: 'Backend', items: ['Node.js', 'Express', 'REST APIs'] },
          { name: 'Frontend', items: ['React'] },
          { name: 'Databases', items: ['PostgreSQL'] },
          { name: 'DevOps & cloud', items: ['Docker', 'AWS', 'Linux', 'WSL'] },
          { name: 'Tools', items: ['Git', 'GitHub'] },
        ],
      },
      {
        title: 'Worked with',
        groups: [
          { name: 'Languages', items: ['PHP'] },
          { name: 'Backend', items: ['Django'] },
          { name: 'Frontend', items: ['HTML', 'CSS'] },
          { name: 'Databases', items: ['Oracle Database', 'MongoDB'] },
          { name: 'DevOps & cloud', items: ['Terraform'] },
        ],
      },
    ],
  },

  comms: {
    rows: [
      { label: 'GitHub', value: 'github.com/yeraox', href: 'https://github.com/yeraox' },
      { label: 'LinkedIn', value: 'linkedin.com/in/yeraycaturla', href: 'https://www.linkedin.com/in/yeraycaturla' },
      { label: 'Email', value: 'yeraoxcaturlax@gmail.com', href: 'mailto:yeraoxcaturlax@gmail.com' },
      { label: 'Location', value: 'Elda (Alicante), Spain' },
      { label: 'Availability', value: 'Available · on-site, hybrid or remote' },
    ],
    language: { legend: 'Language', es: 'Español', en: 'English' },
  },
};
