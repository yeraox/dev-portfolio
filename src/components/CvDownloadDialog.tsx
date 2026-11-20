import { useEffect, useId, useRef, type KeyboardEvent } from 'react';
import { useLocale } from '../content/useLocale';
import { PATHS } from '../site/paths';
import { SectionDialog } from './SectionDialog';
import styles from './CvDownloadDialog.module.css';

type CvDownloadDialogProps = {
  open: boolean; // false → plays the closing wipe, then calls onClosed
  onRequestClose: () => void; // NO, Esc, a click outside — or YES, once the download has started
  onClosed: () => void; // the closing wipe has finished
};

/**
 * "Download the CV as a PDF?" — the window the ring's CV slot and the title's parchment open. YES is a real
 * download link to the PDF of the current language, so the browser does the download itself; NO,
 * Esc or a click outside close it. YES starts focused; ← → move between the two answers.
 */
export function CvDownloadDialog({ open, onRequestClose, onClosed }: CvDownloadDialogProps) {
  const { t, locale } = useLocale();
  const yes = useRef<HTMLAnchorElement>(null);
  const no = useRef<HTMLButtonElement>(null);
  const fileId = useId(); // screen readers hear which file it is together with the question

  // YES starts focused. The browser would focus the window's first focusable element itself, but
  // that may be its scrolling panel; this effect runs after the window has opened (its child's
  // effects run first), so it has the last word.
  useEffect(() => yes.current?.focus(), []);

  // A menu of two answers, like the ring: the arrows go from one to the other.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    (document.activeElement === yes.current ? no.current : yes.current)?.focus();
  }

  // Like a game cursor, the mouse picks the answer it is over.
  const focusIt = (event: { currentTarget: HTMLElement }) => event.currentTarget.focus();

  return (
    <SectionDialog
      title={t.cvDownload.question}
      open={open}
      tall={false}
      compact
      descriptionId={fileId}
      onRequestClose={onRequestClose}
      onClosed={onClosed}
    >
      <p id={fileId} className={styles.file}>
        {t.cvDownload.file}
      </p>
      <div className={styles.answers} onKeyDown={onKeyDown}>
        <a ref={yes} className={styles.answer} href={PATHS.pdf[locale]} download onClick={onRequestClose} onMouseEnter={focusIt}>
          {t.cvDownload.yes}
        </a>
        <button ref={no} type="button" className={styles.answer} onClick={onRequestClose} onMouseEnter={focusIt}>
          {t.cvDownload.no}
        </button>
      </div>
    </SectionDialog>
  );
}
