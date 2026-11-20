import { useEffect, useEffectEvent, useRef, useState, type MouseEvent } from 'react';
import { CvDownloadDialog } from '../../components/CvDownloadDialog';
import { CvScroll } from '../../components/CvScroll';
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
 *  tap starts — except on the CV, the language buttons and SKIP INTRO, which do their own thing,
 *  and while the CV's question is open. */
export function TitleScreen({ layout, onStart, onSkip }: TitleScreenProps) {
  const { t, locale, setLocale } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLButtonElement>(null);
  // The CV's question: closed, open, or playing its closing wipe (still on screen).
  const [cv, setCv] = useState<'closed' | 'open' | 'closing'>('closed');
  // Any key starts, but not while the question is on screen: its keys are the question's.
  const onAnyKey = useEffectEvent((event: KeyboardEvent) => {
    if (cv !== 'closed' || !isAnyKey(event)) return;
    event.preventDefault();
    onStart();
  });

  // Download the camp while the visitor looks at the title, so the transition reveals it ready.
  useEffect(() => {
    void preloadCamp();
  }, []);

  // TS concept — the browser's own event types: `KeyboardEvent` has `key`, `repeat`, `altKey`…
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => onAnyKey(event);
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

  // A click or tap anywhere starts, unless it landed on a control or the CV's question is open
  // (its window sits inside the title, so its clicks arrive here too).
  function onClick(event: MouseEvent<HTMLElement>) {
    if (cv !== 'closed' || isOnControl(event.target)) return;
    onStart();
  }

  const nameSize = titleNameSize(layout);
  const creditSize = 10 * Math.max(2, Math.round(layout.scale));

  return (
    <main className={styles.title} onClick={onClick}>
      <canvas ref={canvasRef} className={styles.sky} aria-hidden="true" />

      {/* First on the page, so it is also the first stop when tabbing: the CV, one key away. */}
      <CvScroll ref={scrollRef} scale={layout.scale} onOpen={() => setCv('open')} />

      <div className={styles.languages} role="group" aria-label={t.language.legend}>
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
            <span className={styles.srOnly}> {t.language[code]}</span>
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

      {cv !== 'closed' && (
        <CvDownloadDialog
          open={cv === 'open'}
          onRequestClose={() => setCv('closing')}
          onClosed={() => {
            setCv('closed');
            scrollRef.current?.focus();
          }}
        />
      )}
    </main>
  );
}
