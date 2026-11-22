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
    credits: 'DESARROLLADOR BACKEND JUNIOR · DEVOPS',
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
  // Banner titles: "game name — what it is" (CONTENT.md), in Spanish.
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
    labels: { why: 'Por qué', did: 'Qué hice', stack: 'Stack', repo: 'Repositorio', demo: 'Demo' },
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
        why:
          'El capibara era la mascota de nuestro casino: un animal que nos hacía gracia a todo el equipo. ' +
          'El backend avanzó rápido y sentía que al casino le faltaban juegos, así que aproveché el tiempo ' +
          'que quedaba hasta la entrega para inventar uno propio. Acabó siendo el más popular entre el ' +
          'jurado de la presentación.',
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
        context: 'Proyecto Final de DAW · equipo de 4 personas · feb. 2026 – jun. 2026',
        summary: 'Plataforma web de recreación de juegos de azar con moneda ficticia (sin dinero real).',
        why:
          'Queríamos salir de lo típico: ni una tienda online ni una red social, sino algo grande, con una ' +
          'lógica compleja detrás y mucha seguridad. Con moneda ficticia, sin dinero real, para evitar ' +
          'problemas legales. Siendo cuatro, pudimos hacerlo a lo grande. Yo prefiero el backend, así que ' +
          'me encargué de esa parte, aunque acabé tocando también el frontend.',
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
        id: 'portfolio',
        name: 'Este portfolio',
        tab: 'Portfolio',
        tag: 'ESTÁS AQUÍ',
        context: 'Proyecto personal · nov. 2026 · desarrollado con Claude Code',
        summary:
          'Portfolio con forma de RPG de 16 bits: pantalla de título, intro saliendo de la cueva y un ' +
          'campamento con un menú en rueda que abre mi CV por secciones. Sin motor de juegos: React, ' +
          'TypeScript y Canvas.',
        why:
          'Quería un portfolio que se recordara: en vez de otra web con secciones, un pequeño juego donde ' +
          'cada parte de mi CV es un lugar del campamento. Está inspirado en Secret of Evermore, el primer ' +
          'videojuego al que jugué, junto a mi padre, y le tengo un cariño muy especial.',
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
          shots: [{ id: 'portfolio', alt: 'El campamento: Yeray y Null junto a la hoguera, con el menú en rueda y sus siete iconos alrededor de Yeray.' }],
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
  about: {
    developer: {
      tab: 'Desarrollador',
      paragraphs: [
        'Siempre he estado rodeado de tecnología: mi tío, mi primo y mis amigos más cercanos se dedican a ' +
          'esto, así que en cierto modo sentía que estaba destinado a ello. En la ESO tuve mi primer ' +
          'ordenador y ahí empezó todo. Llegué por la FP: de los sistemas (SMR) al código (DAW), y ahora ' +
          'la nube. Ese camino me ha dado algo que valoro mucho: entender el software desde la máquina ' +
          'hasta que está desplegado.',
        'Me gustan los retos y la parte técnica del backend, pero sabía que para destacar no bastaba con ' +
          'una capa: quería cubrir el ciclo completo del software. Por eso ahora me estoy especializando ' +
          'en la nube y DevOps.',
        'Soy perseverante y trabajo duro. Mi tiempo libre también lo dedico a investigar sobre desarrollo ' +
          'e inteligencia artificial, y ahora mismo lo que más me motiva es desarrollar con IA: este ' +
          'portfolio, de hecho, lo he hecho con Claude Code.',
        'En equipo me adapto: sé liderar y sé seguir. Donde trabajo suele haber buen rollo, y si no lo ' +
          'hay, lo creo: se me da bien desescalar tensiones y mediar en los conflictos. En la cancha era ' +
          'el base, el que organiza el juego, y en un equipo de trabajo hago algo parecido.',
        'Busco un puesto junior en backend, full stack, frontend o DevOps. El próximo año quiero ' +
          'especializarme en DevOps.',
      ],
    },
    personal: {
      tab: 'Personal',
      intro: 'Fuera del código soy competitivo y muy constante. Esto es lo que me mueve:',
      hobbies: [
        {
          id: 'anime',
          name: 'Anime',
          text:
            'Me encantan los de deporte: mis favoritos son Haikyuu!! y Hajime no Ippo. Esa obsesión de sus ' +
            'personajes por conseguir lo que quieren es lo que me define. Y Boku no Hero Academia, que me ' +
            'ha acompañado desde que empecé a ver anime: para mí, una obra maestra.',
        },
        {
          id: 'games',
          name: 'Videojuegos',
          text:
            'Todo empezó con Secret of Evermore, junto a mi padre; de ahí sale este portfolio. Tengo ' +
            'espíritu competitivo y juego mucho online, pero también me encantan los indies como Hades o ' +
            'Sea of Stars, y la saga Persona.',
        },
        {
          id: 'gym',
          name: 'Gym',
          text:
            'Mi templo, mi lugar de tranquilidad. Entreno desde 2023, cuatro días a la semana, y me encanta ' +
            'sentirme en forma. Si te fijas, en el campamento están mis pesas.',
        },
        {
          id: 'basket',
          name: 'Basket',
          text:
            'Jugué de los 6 a los 18 años, de base titular y capitán, y subía de categoría para ayudar a ' +
            'los mayores: era el que orquestaba el juego. Las lesiones me obligaron a dejarlo, y así ' +
            'encontré mi pasión en el gym.',
        },
        {
          id: 'cooking',
          name: 'Cocina',
          text:
            'Cocino de todo y he aprendido solo. Mi plato estrella: solomillo al roquefort. Y sí, la ' +
            'paellera del campamento no está ahí por casualidad.',
        },
        {
          id: 'dog',
          name: 'Null',
          text:
            'No es mi perro de verdad: como el chico de Secret of Evermore, yo también quería ir con perro. ' +
            'Es un grifón de Bruselas, una raza que me encanta, y sus colores son un guiño al perro de mi ' +
            'pareja. Se llama Null por el valor null de la programación.',
        },
      ],
    },
  },
};
