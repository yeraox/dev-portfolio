import { useEffect, useEffectEvent, useRef, useState, type MouseEvent } from 'react';
import { CvDownloadDialog } from '../../components/CvDownloadDialog';
import { SettingsDialog } from '../../components/SettingsDialog';
import { SkipIntro } from '../../components/SkipIntro';
import { TitleCorner } from '../../components/TitleCorner';
import { useLocale } from '../../content/useLocale';
import { isAnyKey, isOnControl } from '../../engine/anyKey';
import { titleNameSize, type StageLayout } from '../../game/stage';
import { preloadCamp } from '../camp/campAssets';
import { drawTitleBackground } from './titleBackground';
import styles from './TitleScreen.module.css';

// The title's two windows: the CV's question (top left) and SETTINGS (top right).
type TitleWindow = 'cv' | 'settings';

type TitleScreenProps = {
  layout: StageLayout;
  onStart: () => void; // PRESS START: the intro, then the camp
  onSkip: () => void; // SKIP INTRO: straight to the camp
};

/** TITLE: the night landscape, the golden name, the credits and PRESS START. Any key, click or
 *  tap starts — except on the CV, the SETTINGS gear and SKIP INTRO, which do their own thing,
 *  and while one of their windows is open. */
export function TitleScreen({ layout, onStart, onSkip }: TitleScreenProps) {
  const { t } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cvRef = useRef<HTMLButtonElement>(null);
  const gearRef = useRef<HTMLButtonElement>(null);
  // The window on screen, if any: open, or playing its closing wipe (`open: false`).
  const [shown, setShown] = useState<{ name: TitleWindow; open: boolean } | null>(null);
  const close = () => setShown((now) => (now ? { ...now, open: false } : null));
  // Closed: the focus goes back to the corner that opened it.
  const closed = (name: TitleWindow) => {
    setShown(null);
    (name === 'cv' ? cvRef : gearRef).current?.focus();
  };
  // Any key starts, but not while a window is on screen: its keys are the window's.
  const onAnyKey = useEffectEvent((event: KeyboardEvent) => {
    if (shown || !isAnyKey(event)) return;
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

  // A click or tap anywhere starts, unless it landed on a control or a window is open (its
  // window sits inside the title, so its clicks arrive here too).
  function onClick(event: MouseEvent<HTMLElement>) {
    if (shown || isOnControl(event.target)) return;
    onStart();
  }

  const nameSize = titleNameSize(layout);
  const creditSize = 10 * Math.max(2, Math.round(layout.scale));

  return (
    <main className={styles.title} onClick={onClick}>
      <canvas ref={canvasRef} className={styles.sky} aria-hidden="true" />

      {/* First on the page, so they are also the first stops when tabbing: the CV, one key away,
          then the language and the animations. */}
      <TitleCorner
        ref={cvRef}
        slot="cv"
        scale={layout.scale}
        label={`${t.ring.names.cv}: ${t.cvDownload.banner}`}
        onOpen={() => setShown({ name: 'cv', open: true })}
      />
      <TitleCorner
        ref={gearRef}
        slot="settings"
        scale={layout.scale}
        label={t.ring.names.settings}
        onOpen={() => setShown({ name: 'settings', open: true })}
      />

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

      {shown?.name === 'cv' && (
        <CvDownloadDialog open={shown.open} onRequestClose={close} onClosed={() => closed('cv')} />
      )}
      {/* No BACK TO TITLE here: this already is the title. */}
      {shown?.name === 'settings' && (
        <SettingsDialog open={shown.open} onRequestClose={close} onClosed={() => closed('settings')} />
      )}
    </main>
  );
}
