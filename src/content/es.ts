// Spanish copy — copied from CONTENT.md, the source of truth. Never add facts that are not there.
import type { Content } from './types';

// The three sentences of the Bosa Digital internship, exactly as in the CV (NDA: nothing else).
const BOSA_TASKS = [
  'Herramientas en Python para automatizar procesos internos del área de ventas.',
  'Investigación e integración de APIs externas y fuentes de datos para herramientas internas.',
  'Lógica de backend con Django en el entorno de desarrollo de la empresa, con Git.',
];

const REPO = 'https://github.com/yeraox/pakitos-gambling';

// TS concept — `const es: Content`: the object must have exactly the fields of `Content`.
export const ES: Content = {
  page: {
    heading: 'Yeray Caturla · Desarrollador Backend Junior',
    title: 'Yeray Caturla — Desarrollador Backend Junior',
    description:
      'Portfolio de Yeray Caturla, desarrollador backend junior (Node.js, Express, Java, Python, Docker, AWS), con forma de RPG de 16 bits.',
    shareImageAlt: 'Pantalla de título del portfolio: «YERAY CATURLA» en letras doradas sobre un cielo nocturno de 16 bits.',
    noscript: {
      message: 'Este portfolio es un pequeño juego y necesita JavaScript.',
      link: 'Descargar mi CV en PDF (español)',
    },
  },
  title: {
    name: 'YERAY CATURLA',
    credits: 'DESARROLLADOR BACKEND · NODE.JS · EXPRESS · JAVA · DOCKER · AWS',
    press: 'PRESS START',
    skip: 'SKIP INTRO',
  },
  ring: {
    label: 'Menú del campamento',
    // Under each icon of the ring, always visible.
    names: {
      projects: 'PROYECTOS',
      stack: 'STACK',
      profile: 'PERFIL',
      contact: 'CONTACTO',
      about: 'SOBRE MÍ',
      cv: 'CV',
      settings: 'AJUSTES',
    },
  },
  // Banner titles: "game name — what it is" (BRIEF.md table), in Spanish.
  sections: {
    projects: { title: 'Alquimia — Proyectos' },
    stack: { title: 'Equipo — Stack técnico' },
    profile: { title: 'Estadísticas — Perfil' },
    contact: { title: 'Configuración — Contacto' },
    about: { title: 'Diario — Sobre mí' },
  },
  cvDownload: {
    banner: 'Pergamino — Descargar CV',
    question: '¿Descargar el CV en PDF?',
    file: 'PDF · español · 3,1 MB',
    yes: 'SÍ',
    no: 'NO',
  },
  language: {
    legend: 'Idioma',
    es: 'Español',
    en: 'English',
  },
  settings: {
    banner: 'Engranaje — Ajustes',
    title: 'Ajustes',
    animations: {
      legend: 'Animaciones',
      on: 'SÍ',
      off: 'NO',
      notes: {
        on: 'Con animaciones: intro, transiciones, rueda girando, hoguera, Yeray y Null moviéndose y el vídeo de Capyroad en bucle.',
        off: 'Sin animaciones: sin intro ni transiciones; la rueda cambia al instante; la hoguera, Yeray y Null se quedan quietos; el vídeo no arranca solo.',
      },
      system: 'Tu sistema pide menos movimiento.',
    },
    backToTitle: 'VOLVER AL TÍTULO',
    privacy: 'Esta web no usa cookies ni analítica. Solo guarda en tu navegador tu idioma, tus ajustes y tu progreso.',
  },
  window: {
    close: 'Cerrar ventana',
    draft: 'Sección en preparación.',
    newTab: '(se abre en otra pestaña)',
  },
  help: {
    back: 'Esc vuelve al campamento.',
    sections: {
      pointer: '← → cambian de sección · Rueda o ↑ ↓ para leer · Esc vuelve al campamento.',
      touch: 'Desliza a los lados o toca una pestaña para cambiar de sección.',
    },
    projects: {
      pointer: '← → cambian de proyecto · Rueda o ↑ ↓ para leer · Esc vuelve al campamento.',
      touch: 'Desliza a los lados o toca un proyecto para cambiar.',
    },
  },
  hud: {
    yeray: 'Yeray',
    null: 'Null',
    hp: 'HP',
    xp: 'XP',
    explored: 'Experiencia: {n} de {total} secciones exploradas',
  },

  profile: {
    profileTitle: 'Perfil',
    name: 'Yeray Caturla',
    role: 'Desarrollador Backend Junior',
    rows: [
      { label: 'Especialidad', value: 'Node.js · Express · Java · Python · Docker · AWS' },
      { label: 'Base', value: 'Elda (Alicante), España' },
      { label: 'Idiomas', value: 'Español (nativo) · Catalán (nativo) · Inglés (competencia profesional)' },
    ],
    bio:
      'Desarrollador backend junior, titulado en DAW y cursando la especialización en Administración ' +
      'de Recursos y Servicios en la Nube. Construyo APIs REST con Node.js y Express, automatizo ' +
      'procesos con Python y Django, y trabajo con bases de datos SQL y NoSQL. Vengo de sistemas ' +
      '(SMR) y me interesa el DevOps: Docker, Linux y Terraform. Mi objetivo es dominar todo el ciclo ' +
      'de vida del software, desde la API hasta su despliegue automatizado.',
    educationTitle: 'Formación',
    education: [
      {
        title: 'C.E. Administración de Recursos y Servicios en la Nube',
        school: 'IES Poeta Paco Mollà',
        years: '2026 – 2027',
        status: 'inProgress',
        note: 'DevOps, Terraform, Docker',
      },
      {
        title: 'Técnico Superior en Desarrollo de Aplicaciones Web (DAW)',
        school: 'IES Poeta Paco Mollà',
        years: '2024 – 2026',
        status: 'done',
      },
      {
        title: 'Técnico en Sistemas Microinformáticos y Redes (SMR)',
        school: 'IES Poeta Paco Mollà',
        years: '2022 – 2024',
        status: 'done',
      },
    ],
    status: { inProgress: 'En curso', done: 'Completado' },
    questsTitle: 'Registro de misiones',
    quests: [
      {
        role: 'Desarrollador de Software Junior (prácticas)',
        company: 'Sistemas de Innovación Bosa Digital SL',
        details: 'Elda (Alicante) · Híbrido · mar. 2026 – jun. 2026',
        tasks: BOSA_TASKS,
      },
      {
        role: 'Técnico de Sistemas (prácticas)',
        company: 'VKOficinas',
        details: '2024',
        tasks: [
          'Instalación, despliegue y configuración de sistemas operativos en equipos de clientes y centros educativos.',
          'Montaje, reparación y mantenimiento de hardware; soporte técnico a usuarios.',
        ],
      },
    ],
  },

  projects: {
    listLabel: 'Proyectos',
    labels: { did: 'Qué hice', stack: 'Stack', repo: 'Repositorio', demo: 'Demo' },
    list: [
      {
        id: 'capyroad',
        name: 'Capyroad',
        tag: 'DESTACADO',
        context: "Juego dentro de Pakito's Gambling · moneda ficticia",
        summary:
          "Juego original dentro de Pakito's Gambling. Un capibara cruza una carretera saltando de " +
          'calle en calle. Cada calle sube el multiplicador del premio (1.25x → 1.48x → 1.74x → …) y ' +
          'también el riesgo de atropello (visible en %). En cada turno el jugador elige Cruzar ' +
          '(seguir arriesgando) o Cobrar (retirarse con lo ganado).',
        did: ['Todo el ciclo, del backend al frontend en React.'],
        stack: ['Node.js', 'Express', 'PostgreSQL', 'React'],
        notes: [
          {
            label: 'Persistencia',
            value: 'Cada transacción (apuesta o cobro) se guarda en PostgreSQL asociada al id del usuario.',
          },
        ],
        repo: REPO,
        media: {
          kind: 'video',
          videoLabel: 'Partida de Capyroad, sin sonido: un cobro ganador y después un atropello.',
          screenshot: { id: 'capyroad', alt: 'Capyroad: el capibara en la calle 4, multiplicador 1.74x, riesgo del 25 %.' },
        },
      },
      {
        id: 'pakitos',
        name: "Pakito's Gambling",
        context: 'Proyecto Final de DAW · equipo de 3 personas · feb. 2026 – jun. 2026',
        summary: 'Plataforma web de recreación de juegos de azar con moneda ficticia (sin dinero real).',
        did: [
          'Backend de la plataforma: diseño de la API REST y del modelo de datos.',
          'Backend de la ruleta europea y americana.',
          'Backend del blackjack.',
          'Capyroad, de principio a fin: backend y frontend en React.',
          'Trabajo colaborativo con Git y GitHub.',
        ],
        stack: ['Node.js', 'Express', 'PostgreSQL', 'Git', 'GitHub'],
        notes: [],
        repo: REPO,
        demo: 'No hay demo desplegada.',
        media: {
          kind: 'screenshots',
          shots: [
            { id: 'pakitosRuleta', alt: 'Ruleta americana con el tablero de apuestas completo.' },
            { id: 'pakitosBlackjack', alt: 'Blackjack con una mano repartida.' },
          ],
        },
      },
      {
        id: 'bosa',
        name: 'Herramientas internas · Bosa Digital',
        tab: 'Bosa Digital',
        tag: 'CLASIFICADO',
        context: 'Prácticas · mar. 2026 – jun. 2026',
        did: BOSA_TASKS,
        stack: ['Python', 'Django', 'APIs externas', 'Git'],
        notes: [{ label: 'Confidencial', value: 'Acuerdo de confidencialidad: sin capturas, cifras, código ni demo.' }],
        media: { kind: 'classified' },
      },
      {
        id: 'portfolio',
        name: 'Este portfolio',
        tab: 'Portfolio',
        tag: 'ESTÁS AQUÍ',
        context: 'Proyecto personal · nov. 2026 · desarrollado con Claude Code',
        summary:
          'Portfolio con forma de RPG de 16 bits: pantalla de título, intro saliendo de la cueva y un ' +
          'campamento con un menú en rueda que abre mi CV por secciones. Sin motor de juegos: React, ' +
          'TypeScript y Canvas.',
        did: [
          'La idea y la dirección del proyecto: el mundo, cada pantalla y cada decisión de diseño.',
          'Las referencias de arte: los personajes, los iconos y el fondo del campamento.',
          'El desarrollo, con Claude Code, fase a fase: en cada una revisé el resultado con capturas en móvil, tablet y escritorio antes de aprobarla asi como el codigo realizado en esa fase.',
          'Aprendí TypeScript mientras realizaba el proyecto.',
        ],
        stack: ['React', 'TypeScript', 'Vite', 'Canvas', 'Vitest', 'Playwright'],
        notes: [
          { label: 'Accesibilidad', value: 'Se maneja con teclado, ratón o pantalla táctil, con lector de pantalla y sin animaciones.' },
        ],
        media: {
          kind: 'screenshots',
          shots: [{ id: 'portfolio', alt: 'El campamento: Yeray y Null junto a la hoguera, con el menú en rueda y sus seis iconos alrededor de Yeray.' }],
        },
      },
    ],
  },

  stack: {
    tiers: [
      {
        title: 'Dominio',
        groups: [
          { name: 'Lenguajes', items: [{ id: 'javascript', name: 'JavaScript' }, { id: 'java', name: 'Java' }, { id: 'python', name: 'Python' }, { id: 'sql', name: 'SQL' }] },
          { name: 'Backend', items: [{ id: 'nodejs', name: 'Node.js' }, { id: 'express', name: 'Express' }, { id: 'rest', name: 'APIs REST' }] },
          { name: 'Frontend', items: [{ id: 'react', name: 'React' }] },
          { name: 'Bases de datos', items: [{ id: 'postgresql', name: 'PostgreSQL' }] },
          { name: 'DevOps y cloud', items: [{ id: 'docker', name: 'Docker' }, { id: 'aws', name: 'AWS' }, { id: 'linux', name: 'Linux' }, { id: 'wsl', name: 'WSL' }] },
          { name: 'Herramientas', items: [{ id: 'git', name: 'Git' }, { id: 'github', name: 'GitHub' }] },
        ],
      },
      {
        title: 'He trabajado con',
        groups: [
          { name: 'Lenguajes', items: [{ id: 'php', name: 'PHP' }, { id: 'typescript', name: 'TypeScript' }] },
          { name: 'Backend', items: [{ id: 'django', name: 'Django' }] },
          { name: 'Frontend', items: [{ id: 'html', name: 'HTML' }, { id: 'css', name: 'CSS' }] },
          { name: 'Bases de datos', items: [{ id: 'oracle', name: 'Oracle Database' }, { id: 'mongodb', name: 'MongoDB' }] },
          { name: 'DevOps y cloud', items: [{ id: 'terraform', name: 'Terraform' }] },
        ],
      },
    ],
  },

  contact: {
    rows: [
      { label: 'GitHub', value: 'github.com/yeraox', href: 'https://github.com/yeraox' },
      { label: 'LinkedIn', value: 'linkedin.com/in/yeraycaturla', href: 'https://www.linkedin.com/in/yeraycaturla' },
      { label: 'Email', value: 'yeraoxcaturlax@gmail.com', href: 'mailto:yeraoxcaturlax@gmail.com' },
      { label: 'Ubicación', value: 'Elda (Alicante), España' },
      { label: 'Disponibilidad', value: 'Disponible · presencial, híbrido o remoto' },
      { label: 'CV en PDF', value: 'Descargar', href: '/cv/yeray-caturla-cv-es.pdf' },
    ],
  },
};
