import { useEffect, useEffectEvent, useId, useRef, type ReactNode } from 'react';
import { Window } from './Window';
import styles from './SectionDialog.module.css';

type SectionDialogProps = {
  title: string;
  open: boolean; // false → plays the closing wipe, then calls onClosed
  tall: boolean; // portrait screens: the window becomes a full-width sheet
  // A small window in the middle, as big as its content (a question), instead of one covering
  // the scene. It has no ESC EXIT button: its own answers close it (Esc still does too).
  compact?: boolean;
  closeLabel?: string; // said after the visible "ESC EXIT" by screen readers (not in compact)
  descriptionId?: string; // id of a text inside that screen readers read with the title
  help?: ReactNode; // bottom help line, usually <HelpBar />
  onRequestClose: () => void; // Esc, the close button or a click outside
  onClosed: () => void; // the closing wipe has finished
  children: ReactNode;
};

const CLOSE_FALLBACK_MS = 400; // in case the closing animation never reports its end

/**
 * A section window as a native modal <dialog> (showModal): the browser makes the rest of the page
 * inert — Tab never reaches it, screen readers don't read it — and turns Esc into a "cancel"
 * event. No focus trap of our own: like any native modal, Tab may still reach the browser's own
 * toolbar (modern-web-guidance: dialog).
 */
export function SectionDialog({ title, open, tall, compact = false, closeLabel, descriptionId, help, onRequestClose, onClosed, children }: SectionDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // Really close the <dialog> first: while it is open the rest of the page is inert and the
  // ring could not take the focus back.
  const closeNow = () => {
    ref.current?.close();
    onClosed();
  };
  // The same, for the fallback timer (an effect needs an "effect event" to call the latest one).
  const closeFromTimer = useEffectEvent(closeNow);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Closing: wait for the wipe, then really close.
  useEffect(() => {
    if (open) return;
    const timer = window.setTimeout(() => closeFromTimer(), CLOSE_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      data-tall={tall && !compact}
      data-compact={compact}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault(); // we close it ourselves, after the closing wipe
        onRequestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onRequestClose(); // click outside the window
      }}
      onAnimationEnd={() => {
        if (!open) closeNow();
      }}
    >
      <Window
        title={title}
        titleId={titleId}
        closing={!open}
        className={styles.window}
        help={help}
        hint={
          compact ? undefined : (
            // The accessible name starts with what is visible (WCAG 2.5.3 "label in name").
            <button type="button" className={styles.close} onClick={onRequestClose}>
              <kbd className={styles.key}>ESC</kbd> EXIT<span className={styles.srOnly}> · {closeLabel}</span>
            </button>
          )
        }
      >
        {children}
      </Window>
    </dialog>
  );
}
