import { useEffect, useEffectEvent, useRef, type MouseEvent } from 'react';
import { SkipIntro } from '../../components/SkipIntro';
import type { Locale } from '../../content/types';
import { useLocale } from '../../content/useLocale';
import { isAnyKey, isOnControl } from '../../engine/anyKey';
import { titleNameSize, type StageLayout } from '../../game/stage';
import { preloadCamp } from '../camp/campAssets';
import { drawTitleBackground } from './titleBackground';
import styles from './TitleScreen.module.css';

const LOCALES: Locale[] = ['es', 'en'];

type TitleScreenProps = {
  layout: StageLayout;
  onStart: () => void; // PRESS START: the intro, then the camp
  onSkip: () => void; // SKIP INTRO: straight to the camp
};

/** TITLE: the night landscape, the golden name, the credits and PRESS START. Any key, click or
 *  tap starts — except on the language buttons and SKIP INTRO, which do their own thing. */
export function TitleScreen({ layout, onStart, onSkip }: TitleScreenProps) {
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
      if (!isAnyKey(event)) return;
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
    if (isOnControl(event.target)) return;
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

      <SkipIntro label={t.title.skip} onSkip={onSkip} />
    </main>
  );
}
