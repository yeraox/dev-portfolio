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
  },
  title: {
    name: 'YERAY CATURLA',
    credits: 'DESARROLLADOR BACKEND · NODE.JS · EXPRESS · JAVA · DOCKER · AWS',
    press: 'PRESS START',
    skip: 'SKIP INTRO',
  },
  ring: {
    label: 'Menú del campamento',
  },
  // Banner titles: "game label — what it is" (BRIEF.md table), in Spanish.
  sections: {
    equip: { title: 'Equipo — Proyectos' },
    alchemy: { title: 'Alquimia — Stack técnico' },
    stats: { title: 'Estadísticas — Perfil' },
    buffs: { title: 'Estado — Entrenamiento' },
    craft: { title: 'Artesanía — Cocina' },
    comms: { title: 'Configuración — Contacto' },
  },
  window: {
    close: 'Cerrar ventana',
    draft: 'Sección en preparación.',
    newTab: '(se abre en otra pestaña)',
  },
  help: {
    back: 'Esc vuelve al campamento.',
    sections: {
      pointer: 'Rueda o ← → cambian de sección · Esc vuelve al campamento.',
      touch: 'Desliza a los lados o toca una pestaña para cambiar de sección.',
    },
    projects: {
      pointer: 'Rueda o ← → cambian de proyecto · Esc vuelve al campamento.',
      touch: 'Desliza a los lados o toca un proyecto para cambiar.',
    },
  },
  hud: {
    yeray: 'Yeray',
    null: 'Null',
  },

  stats: {
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

  equip: {
    listLabel: 'Proyectos',
    labels: { did: 'Qué hice', stack: 'Stack', repo: 'Repositorio', demo: 'Demo' },
    projects: [
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
        tag: 'CLASIFICADO',
        context: 'Prácticas · mar. 2026 – jun. 2026',
        did: BOSA_TASKS,
        stack: ['Python', 'Django', 'APIs externas', 'Git'],
        notes: [{ label: 'Confidencial', value: 'Acuerdo de confidencialidad: sin capturas, cifras, código ni demo.' }],
        media: { kind: 'classified' },
      },
    ],
  },

  alchemy: {
    tiers: [
      {
        title: 'Dominio',
        groups: [
          { name: 'Lenguajes', items: ['JavaScript', 'Java', 'Python', 'SQL'] },
          { name: 'Backend', items: ['Node.js', 'Express', 'APIs REST'] },
          { name: 'Frontend', items: ['React'] },
          { name: 'Bases de datos', items: ['PostgreSQL'] },
          { name: 'DevOps y cloud', items: ['Docker', 'AWS', 'Linux', 'WSL'] },
          { name: 'Herramientas', items: ['Git', 'GitHub'] },
        ],
      },
      {
        title: 'He trabajado con',
        groups: [
          { name: 'Lenguajes', items: ['PHP'] },
          { name: 'Backend', items: ['Django'] },
          { name: 'Frontend', items: ['HTML', 'CSS'] },
          { name: 'Bases de datos', items: ['Oracle Database', 'MongoDB'] },
          { name: 'DevOps y cloud', items: ['Terraform'] },
        ],
      },
    ],
  },

  comms: {
    rows: [
      { label: 'GitHub', value: 'github.com/yeraox', href: 'https://github.com/yeraox' },
      { label: 'LinkedIn', value: 'linkedin.com/in/yeraycaturla', href: 'https://www.linkedin.com/in/yeraycaturla' },
      { label: 'Email', value: 'yeraoxcaturlax@gmail.com', href: 'mailto:yeraoxcaturlax@gmail.com' },
      { label: 'Ubicación', value: 'Elda (Alicante), España' },
      { label: 'Disponibilidad', value: 'Disponible · presencial, híbrido o remoto' },
    ],
    language: { legend: 'Idioma', es: 'Español', en: 'English' },
  },
};
