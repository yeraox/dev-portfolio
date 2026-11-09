// Dev-only page: /dev/windows. Never shipped (see Root.tsx).
// Phase 1 deliverable: the window system and a static STATS window with real data.
// The data below is a dev fixture copied from CONTENT.md; in phase 4 it moves to
// src/content/es.ts + en.ts and this layout becomes the real StatsWindow.
import { useState } from 'react';
import { BannerWindow } from '../components/BannerWindow';
import { Divider } from '../components/Divider';
import { HelpBar } from '../components/HelpBar';
import { KeyHint, type KeyHintItem } from '../components/KeyHint';
import { StatBar } from '../components/StatBar';
import { Window } from '../components/Window';
import styles from './WindowsDemo.module.css';

type Education = {
  title: string;
  school: string;
  years: string;
  inProgress: boolean;
  note?: string;
};

type Quest = {
  role: string;
  company: string;
  details: string;
  tasks: string[];
};

const IDENTITY = {
  role: 'Desarrollador Backend Junior',
  base: 'Elda (Alicante), España',
};

const PROFILE_ROWS: [string, string][] = [
  ['Especialidad', 'Node.js · Express · Java · Python · Docker · AWS'],
  ['Idiomas', 'Español (nativo) · Catalán (nativo) · Inglés (profesional)'],
];

const BIO =
  'Desarrollador backend junior, titulado en DAW y cursando la especialización en ' +
  'Administración de Recursos y Servicios en la Nube. Construyo APIs REST con Node.js y ' +
  'Express, automatizo procesos con Python y Django, y trabajo con bases de datos SQL y NoSQL. ' +
  'Vengo de sistemas (SMR) y me interesa el DevOps: Docker, Linux y Terraform. Mi objetivo es ' +
  'dominar todo el ciclo de vida del software, desde la API hasta su despliegue automatizado.';

const EDUCATION: Education[] = [
  {
    title: 'C.E. Administración de Recursos y Servicios en la Nube',
    school: 'IES Poeta Paco Mollà',
    years: '2026 – 2027',
    inProgress: true,
    note: 'DevOps, Terraform, Docker',
  },
  {
    title: 'Técnico Superior en Desarrollo de Aplicaciones Web (DAW)',
    school: 'IES Poeta Paco Mollà',
    years: '2024 – 2026',
    inProgress: false,
  },
  {
    title: 'Técnico en Sistemas Microinformáticos y Redes (SMR)',
    school: 'IES Poeta Paco Mollà',
    years: '2022 – 2024',
    inProgress: false,
  },
];

const QUESTS: Quest[] = [
  {
    role: 'Desarrollador de Software Junior (prácticas)',
    company: 'Sistemas de Innovación Bosa Digital SL',
    details: 'Elda (Alicante) · Híbrido · mar. 2026 – jun. 2026',
    tasks: [
      'Herramientas en Python para automatizar procesos internos del área de ventas.',
      'Investigación e integración de APIs externas y fuentes de datos para herramientas internas.',
      'Lógica de backend con Django en el entorno de desarrollo de la empresa, con Git.',
    ],
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
];

const HINTS: KeyHintItem[] = [
  { key: 'ESC', action: 'EXIT' },
];

export default function WindowsDemo() {
  // Changing `replay` re-mounts the window, which replays its opening wipe.
  const [replay, setReplay] = useState(0);

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1>Sistema de ventanas · Fase 1</h1>
        <p>
          La ventana STATS con tus datos reales y, debajo, cada pieza por separado. Solo existe
          mientras desarrollamos.
        </p>
        <button type="button" className={styles.replay} onClick={() => setReplay((n) => n + 1)}>
          Repetir la animación de apertura
        </button>
      </header>

      <div className={styles.stage}>
        <BannerWindow title="Stats — Perfil" />
        <StatsWindow key={replay} />
      </div>

      <section className={styles.catalog}>
        <h2>Piezas por separado</h2>

        <h3>BannerWindow</h3>
        <BannerWindow title="Equipment — Proyectos" />

        <h3>KeyHint</h3>
        <Window>
          <KeyHint
            items={[
              { key: 'ENTER', action: 'SELECT' },
              { key: 'ESC', action: 'EXIT' },
            ]}
          />
        </Window>

        <h3>StatBar (valores de ejemplo, no son datos tuyos)</h3>
        <Window>
          <div className={styles.bars}>
            <StatBar label="Ejemplo A" value={6} max={6} valueText="6/6" />
            <StatBar label="Ejemplo B" value={3} max={6} valueText="3/6" />
            <StatBar label="Ejemplo C" value={1} max={6} valueText="1/6" />
          </div>
        </Window>

        <h3>Divider + HelpBar</h3>
        <Window help={<HelpBar>Usa ←/→ para elegir. Esc para volver al campamento.</HelpBar>}>
          <p className={styles.plain}>Texto de ventana.</p>
          <Divider />
          <p className={styles.plain}>Más texto de ventana, separado por una línea grabada.</p>
        </Window>
      </section>
    </main>
  );
}

function StatsWindow() {
  return (
    <Window
      title="Yeray Caturla"
      hint={<KeyHint items={HINTS} />}
      help={<HelpBar>Esc para volver al campamento.</HelpBar>}
    >
      <div className={styles.sheet}>
        <div className={styles.column}>
          <div className={styles.profile}>
            <div className={styles.portrait} aria-hidden="true">
              <span>48×48</span>
              <span>fase 2</span>
            </div>
            <div className={styles.identity}>
              <p className={styles.role}>{IDENTITY.role}</p>
              <p className={styles.base}>{IDENTITY.base}</p>
            </div>
          </div>
          <dl className={styles.rows}>
            {PROFILE_ROWS.map(([label, value]) => (
              <div key={label} className={styles.row}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <Divider />
          <p className={styles.bio}>{BIO}</p>
        </div>

        <div className={styles.column}>
          <h3 className={styles.heading}>Formación</h3>
          <ul className={styles.list}>
            {EDUCATION.map((item) => (
              <li key={item.title} className={styles.entry}>
                <p className={styles.entryTitle}>{item.title}</p>
                <p className={styles.entryMeta}>
                  {item.school} · <span className={styles.years}>{item.years}</span> ·{' '}
                  <span className={item.inProgress ? styles.inProgress : undefined}>
                    {item.inProgress ? 'En curso' : 'Completado'}
                  </span>
                </p>
                {item.note && <p className={styles.entryMeta}>{item.note}</p>}
              </li>
            ))}
          </ul>

          <Divider />

          <h3 className={styles.heading}>Registro de misiones</h3>
          <ul className={styles.list}>
            {QUESTS.map((quest) => (
              <li key={quest.company} className={styles.entry}>
                <p className={styles.entryTitle}>{quest.role}</p>
                <p className={styles.entryMeta}>
                  {quest.company} · {quest.details}
                </p>
                <ul className={styles.tasks}>
                  {quest.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Window>
  );
}
