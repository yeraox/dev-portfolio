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
    title: 'Yeray Caturla — Junior Backend Developer',
    description:
      'Portfolio of Yeray Caturla, junior backend developer (Node.js, Express, Java, Python, Docker, AWS), shaped as a 16-bit RPG.',
    shareImageAlt: 'Title screen of the portfolio: “YERAY CATURLA” in gold letters over a 16-bit night sky.',
    noscript: {
      message: 'This portfolio is a small game and needs JavaScript.',
      link: 'Download my CV as a PDF (English)',
    },
  },
  title: {
    name: 'YERAY CATURLA',
    credits: 'BACKEND DEVELOPER · NODE.JS · EXPRESS · JAVA · DOCKER · AWS',
    press: 'PRESS START',
    skip: 'SKIP INTRO',
  },
  ring: {
    label: 'Camp menu',
    // Under each icon of the ring, always visible.
    names: {
      projects: 'PROJECTS',
      stack: 'STACK',
      profile: 'PROFILE',
      contact: 'CONTACT',
      about: 'ABOUT ME',
      cv: 'CV',
      settings: 'SETTINGS',
    },
  },
  // Banner titles from the BRIEF.md table.
  sections: {
    projects: { title: 'Alchemy — Projects' },
    stack: { title: 'Equipment — Tech Stack' },
    profile: { title: 'Stats — Profile' },
    contact: { title: 'Config — Contact' },
    about: { title: 'Journal — About Me' },
  },
  cvDownload: {
    banner: 'Scroll — Download CV',
    question: 'Download the CV as a PDF?',
    file: 'PDF · English · 3.1 MB',
    yes: 'YES',
    no: 'NO',
  },
  language: {
    legend: 'Language',
    es: 'Español',
    en: 'English',
  },
  settings: {
    banner: 'Gear — Settings',
    title: 'Settings',
    animations: {
      legend: 'Animations',
      on: 'ON',
      off: 'OFF',
      notes: {
        on: 'With animations: intro, transitions, the ring turning, the campfire, Yeray and Null moving and the Capyroad video on a loop.',
        off: 'Without animations: no intro or transitions; the ring changes at once; the campfire, Yeray and Null stand still; the video does not start by itself.',
      },
      system: 'Your system asks for less motion.',
    },
    backToTitle: 'BACK TO TITLE',
    privacy: 'This site uses no cookies or analytics. It only keeps your language, settings and progress in your browser.',
  },
  window: {
    close: 'Close window',
    draft: 'Section in preparation.',
    newTab: '(opens in a new tab)',
  },
  help: {
    back: 'Esc returns to camp.',
    sections: {
      pointer: '← → change section · Wheel or ↑ ↓ to read · Esc returns to camp.',
      touch: 'Swipe sideways or tap a tab to change section.',
    },
    projects: {
      pointer: '← → change project · Wheel or ↑ ↓ to read · Esc returns to camp.',
      touch: 'Swipe sideways or tap a project to change.',
    },
  },
  hud: {
    yeray: 'Yeray',
    null: 'Null',
    hp: 'HP',
    xp: 'XP',
    explored: 'Experience: {n} of {total} sections explored',
  },

  profile: {
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

  projects: {
    listLabel: 'Projects',
    labels: { why: 'Why', did: 'What I did', stack: 'Stack', repo: 'Repository', demo: 'Demo' },
    list: [
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
        why:
          "The capybara was our casino's mascot: an animal the whole team found funny. The backend moved " +
          'fast and I felt the casino was short of games, so I used the time left before the deadline to ' +
          "invent one of our own. It ended up being the jury's favourite at the presentation.",
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
        context: 'Final DAW project · team of 4 · Feb 2026 – Jun 2026',
        summary: 'A web platform recreating casino games with play money (no real money).',
        why:
          'We wanted to get away from the usual: not an online shop or a social network, but something big, ' +
          'with complex logic behind it and strong security. With play money, no real money, to stay clear ' +
          'of legal issues. Being four of us, we could go big. I prefer the backend, so I took that part, ' +
          'though I ended up working on the frontend too.',
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
        id: 'portfolio',
        name: 'This portfolio',
        tab: 'Portfolio',
        tag: 'YOU ARE HERE',
        context: 'Personal project · Nov 2026 · built with Claude Code',
        summary:
          'A portfolio shaped as a 16-bit RPG: a title screen, an intro out of the cave and a camp with ' +
          'a ring menu that opens my CV section by section. No game engine: React, TypeScript and ' +
          'Canvas.',
        why:
          'I wanted a portfolio people would remember: instead of another website with sections, a small ' +
          "game where each part of my CV is a place in the camp. It's inspired by Secret of Evermore, the " +
          "first video game I ever played, with my dad, and it's very special to me.",
        did: [
          'The idea and the direction: the world, every screen and every design decision.',
          'The art references: the characters, the icons and the camp background.',
          'The development, with Claude Code (an AI agent), phase by phase: I reviewed each one with screenshots on phone, tablet and desktop before approving it.',
          'I learnt TypeScript with this project.',
        ],
        stack: ['React', 'TypeScript', 'Vite', 'Canvas', 'Vitest', 'Playwright'],
        notes: [{ label: 'Accessibility', value: 'Works with keyboard, mouse or touch, with a screen reader and without animations.' }],
        media: {
          kind: 'screenshots',
          shots: [{ id: 'portfolio', alt: 'The camp: Yeray and Null by the campfire, with the ring menu and its six icons around Yeray.' }],
        },
      },
    ],
  },

  stack: {
    tiers: [
      {
        title: 'Mastery',
        groups: [
          { name: 'Languages', items: [{ id: 'javascript', name: 'JavaScript' }, { id: 'java', name: 'Java' }, { id: 'python', name: 'Python' }, { id: 'sql', name: 'SQL' }] },
          { name: 'Backend', items: [{ id: 'nodejs', name: 'Node.js' }, { id: 'express', name: 'Express' }, { id: 'rest', name: 'REST APIs' }] },
          { name: 'Frontend', items: [{ id: 'react', name: 'React' }] },
          { name: 'Databases', items: [{ id: 'postgresql', name: 'PostgreSQL' }] },
          { name: 'DevOps & cloud', items: [{ id: 'docker', name: 'Docker' }, { id: 'aws', name: 'AWS' }, { id: 'linux', name: 'Linux' }, { id: 'wsl', name: 'WSL' }] },
          { name: 'Tools', items: [{ id: 'git', name: 'Git' }, { id: 'github', name: 'GitHub' }] },
        ],
      },
      {
        title: 'Worked with',
        groups: [
          { name: 'Languages', items: [{ id: 'php', name: 'PHP' }, { id: 'typescript', name: 'TypeScript' }] },
          { name: 'Backend', items: [{ id: 'django', name: 'Django' }] },
          { name: 'Frontend', items: [{ id: 'html', name: 'HTML' }, { id: 'css', name: 'CSS' }] },
          { name: 'Databases', items: [{ id: 'oracle', name: 'Oracle Database' }, { id: 'mongodb', name: 'MongoDB' }] },
          { name: 'DevOps & cloud', items: [{ id: 'terraform', name: 'Terraform' }] },
        ],
      },
    ],
  },

  contact: {
    rows: [
      { label: 'GitHub', value: 'github.com/yeraox', href: 'https://github.com/yeraox' },
      { label: 'LinkedIn', value: 'linkedin.com/in/yeraycaturla', href: 'https://www.linkedin.com/in/yeraycaturla' },
      { label: 'Email', value: 'yeraoxcaturlax@gmail.com', href: 'mailto:yeraoxcaturlax@gmail.com' },
      { label: 'Location', value: 'Elda (Alicante), Spain' },
      { label: 'Availability', value: 'Available · on-site, hybrid or remote' },
      { label: 'CV as PDF', value: 'Download', href: '/cv/yeray-caturla-cv-en.pdf' },
    ],
  },
};
