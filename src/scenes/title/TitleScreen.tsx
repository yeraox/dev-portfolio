import { useEffect, useEffectEvent, useRef, type MouseEvent } from 'react';
import type { Locale } from '../../content/types';
import { useLocale } from '../../content/useLocale';
import { titleNameSize, type StageLayout } from '../../game/stage';
import { preloadCamp } from '../camp/campAssets';
import { drawTitleBackground } from './titleBackground';
import styles from './TitleScreen.module.css';

const LOCALES: Locale[] = ['es', 'en'];
// Keys that never start the game: moving between the controls, or holding a modifier.
const IGNORED_KEYS = new Set(['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape']);
const CONTROLS = 'button, a[href], input';

type TitleScreenProps = {
  layout: StageLayout;
  onStart: () => void;
};

/** TITLE: the night landscape, the golden name, the credits and PRESS START. Any key, click or
 *  tap starts — except on the language buttons and SKIP INTRO, which do their own thing. */
export function TitleScreen({ layout, onStart }: TitleScreenProps) {
  const { t, locale, setLocale } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const start = useEffectEvent(onStart);

  // Download the camp while the visitor looks at the title, so the transition reveals it ready.
  useEffect(() => {
    void preloadCamp();
  }, []);

  // TS concept — the browser's own event types: `KeyboardEvent` has `key`, `repeat`, `altKey`…
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || IGNORED_KEYS.has(event.key)) return;
      const onControl = event.target instanceof Element && event.target.closest(CONTROLS);
      if (onControl && (event.key === 'Enter' || event.key === ' ')) return; // the control's own click
      event.preventDefault();
      start();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // The landscape, redrawn whenever the screen changes size (one art pixel = 2 scene px).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      const art = 2 * layout.scale; // CSS px per art pixel
      const width = Math.ceil(canvas.clientWidth / art);
      const height = Math.ceil(canvas.clientHeight / art);
      if (width === 0 || height === 0) return;
      canvas.width = Math.round(canvas.clientWidth * layout.dpr);
      canvas.height = Math.round(canvas.clientHeight * layout.dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      const zoom = art * layout.dpr;
      ctx.drawImage(drawTitleBackground(width, height), 0, 0, width * zoom, height * zoom);
    };
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [layout.scale, layout.dpr]);

  // A click or tap anywhere starts, unless it landed on a control.
  function onClick(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest(CONTROLS)) return;
    onStart();
  }

  const nameSize = titleNameSize(layout);
  const creditSize = 10 * Math.max(2, Math.round(layout.scale));

  return (
    <main className={styles.title} onClick={onClick}>
      <canvas ref={canvasRef} className={styles.sky} aria-hidden="true" />

      <div className={styles.languages} role="group" aria-label={t.comms.language.legend}>
        {LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            className={styles.language}
            aria-pressed={locale === code}
            lang={code}
            onClick={() => setLocale(code)}
          >
            {/* Screen readers hear "ES Español": the visible label first, then the full name. */}
            {code.toUpperCase()}
            <span className={styles.srOnly}> {t.comms.language[code]}</span>
          </button>
        ))}
      </div>

      <div className={styles.centre}>
        <h1 className={styles.name} style={{ fontSize: nameSize }}>
          {t.title.name}
        </h1>
        <p className={styles.credit} style={{ fontSize: creditSize }}>
          {t.title.credits}
        </p>
        <button type="button" className={styles.press} onClick={onStart}>
          {t.title.press}
        </button>
      </div>

      <button type="button" className={styles.skip} onClick={onStart}>
        {t.title.skip}
      </button>
    </main>
  );
}
