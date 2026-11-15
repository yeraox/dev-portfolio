// Dev-only page: /dev/windows. Never shipped (see Root.tsx).
// The window system pieces (phase 1) and, since phase 4, the real STATS window with the content
// from src/content/ — the fixture data that lived here moved to es.ts / en.ts.
import { useState } from 'react';
import { BannerWindow } from '../components/BannerWindow';
import { Divider } from '../components/Divider';
import { HelpBar } from '../components/HelpBar';
import { KeyHint } from '../components/KeyHint';
import { StatBar } from '../components/StatBar';
import { Window } from '../components/Window';
import { LocaleProvider } from '../content/LocaleProvider';
import { useLocale } from '../content/useLocale';
import StatsWindow from '../windows/StatsWindow';
import styles from './WindowsDemo.module.css';

export default function WindowsDemo() {
  return (
    <LocaleProvider>
      <Demo />
    </LocaleProvider>
  );
}

function Demo() {
  // Changing `replay` re-mounts the window, which replays its opening wipe.
  const [replay, setReplay] = useState(0);
  const { t, locale, setLocale } = useLocale();

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1>Sistema de ventanas</h1>
        <p>
          La ventana STATS real (fase 4), con el contenido de <code>src/content/</code>, y debajo cada
          pieza por separado. Solo existe mientras desarrollamos.
        </p>
        <div className={styles.buttons}>
          <button type="button" className={styles.replay} onClick={() => setReplay((n) => n + 1)}>
            Repetir la animación de apertura
          </button>
          <button type="button" className={styles.replay} onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}>
            Idioma: {locale.toUpperCase()}
          </button>
        </div>
      </header>

      <div className={styles.stage}>
        <BannerWindow title={t.sections.stats.title} />
        <Window
          key={replay}
          title={t.sections.stats.title}
          hint={<KeyHint items={[{ key: 'ESC', action: 'EXIT' }]} />}
          help={<HelpBar>{t.help.back}</HelpBar>}
        >
          <StatsWindow />
        </Window>
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
