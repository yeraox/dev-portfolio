import { useEffect, useId, useRef } from 'react';
import { ICONS } from '../assets/icons/icons';
import type { Locale } from '../content/types';
import { useLocale } from '../content/useLocale';
import { setAnimations, useAnimations, useSystemReducesMotion, type Animations } from '../engine/motion';
import { useStageLayout } from '../engine/useScreen';
import { devicePixelZoom } from '../game/stage';
import { SectionDialog } from './SectionDialog';
import styles from './SettingsDialog.module.css';

const LOCALES: Locale[] = ['es', 'en'];
const ANIMATIONS: Animations[] = ['on', 'off'];

type SettingsDialogProps = {
  open: boolean; // false → plays the closing wipe, then calls onClosed
  onRequestClose: () => void; // Esc, ESC EXIT or a click outside
  onClosed: () => void; // the closing wipe has finished
  onBackToTitle?: () => void; // the camp passes it and BACK TO TITLE appears; the title leaves it out
};

/**
 * SETTINGS, what the gear opens in the ring and on the title: the language (each with its flag)
 * and the animations on or off, with a red note on what that changes. Each row is a group of two
 * toggle buttons; the one in use is pressed. Changes apply at once and are remembered for the
 * next visit. In the camp, BACK TO TITLE. At the bottom, a line on what the site keeps.
 */
export function SettingsDialog({ open, onRequestClose, onClosed, onBackToTitle }: SettingsDialogProps) {
  const { t, locale, setLocale } = useLocale();
  const animations = useAnimations();
  const fromSystem = useSystemReducesMotion();
  const { textSize, dpr } = useStageLayout();
  // The flags as tall as about one and a half lines of text, in whole screen pixels (crisp).
  const zoom = devicePixelZoom(1.5 * textSize, ICONS.es.height, dpr);
  const languageId = useId();
  const animationsId = useId();
  const noteId = useId();
  // The window starts on the language in use. (Left alone, the browser would focus its first
  // control, ESC EXIT; this effect runs after the window has opened, so it has the last word.)
  const languageInUse = useRef<HTMLButtonElement>(null);
  useEffect(() => languageInUse.current?.focus(), []);

  return (
    <SectionDialog
      title={t.settings.title}
      open={open}
      tall={false}
      compact
      closable
      closeLabel={t.window.close}
      onRequestClose={onRequestClose}
      onClosed={onClosed}
    >
      <div className={styles.rows}>
        <div className={styles.row} role="group" aria-labelledby={languageId}>
          <span id={languageId} className={styles.label}>
            {t.language.legend}
          </span>
          <div className={styles.choices}>
            {LOCALES.map((code) => (
              <button
                key={code}
                ref={locale === code ? languageInUse : undefined}
                type="button"
                className={styles.choice}
                aria-pressed={locale === code}
                lang={code}
                onClick={() => setLocale(code)}
              >
                <img
                  className={styles.flag}
                  src={ICONS[code].src}
                  width={ICONS[code].width * zoom}
                  height={ICONS[code].height * zoom}
                  alt=""
                />
                {t.language[code]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.row} role="group" aria-labelledby={animationsId} aria-describedby={noteId}>
          <span id={animationsId} className={styles.label}>
            {t.settings.animations.legend}
          </span>
          <div className={styles.choices}>
            {ANIMATIONS.map((value) => (
              <button
                key={value}
                type="button"
                className={styles.choice}
                aria-pressed={animations === value}
                onClick={() => setAnimations(value)}
              >
                {t.settings.animations[value]}
              </button>
            ))}
          </div>
          {/* What the choice changes. A polite live region: screen readers read the new note
              after a change, without interrupting. */}
          <p id={noteId} className={styles.note} aria-live="polite">
            {fromSystem && `${t.settings.animations.system} `}
            {t.settings.animations.notes[animations]}
          </p>
        </div>
        {onBackToTitle && (
          <button type="button" className={`${styles.choice} ${styles.back}`} onClick={onBackToTitle}>
            {t.settings.backToTitle}
          </button>
        )}
        <p className={styles.privacy}>{t.settings.privacy}</p>
      </div>
    </SectionDialog>
  );
}
