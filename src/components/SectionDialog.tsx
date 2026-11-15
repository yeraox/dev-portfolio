import { useEffect, useEffectEvent, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Window } from './Window';
import styles from './SectionDialog.module.css';

type SectionDialogProps = {
  title: string;
  open: boolean; // false → plays the closing wipe, then calls onClosed
  tall: boolean; // portrait screens: the window becomes a full-width sheet
  closeLabel: string; // said after the visible "ESC EXIT" by screen readers
  help?: ReactNode; // bottom help line, usually <HelpBar />
  onRequestClose: () => void; // Esc, the close button or a click outside
  onClosed: () => void; // the closing wipe has finished
  children: ReactNode;
};

const CLOSE_FALLBACK_MS = 400; // in case the closing animation never reports its end

const FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Tab from the last control goes back to the first one (and Shift+Tab the other way), so focus
 *  never leaves the window for the browser's own toolbar (ARIA modal dialog pattern). */
function keepTabInside(event: KeyboardEvent<HTMLDialogElement>, dialog: HTMLDialogElement) {
  const controls = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)];
  if (controls.length === 0) return;
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * A section window as a native modal <dialog>: the browser keeps Tab inside it, hides the rest
 * of the page from screen readers and turns Esc into a "cancel" event.
 */
export function SectionDialog({ title, open, tall, closeLabel, help, onRequestClose, onClosed, children }: SectionDialogProps) {
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
      data-tall={tall}
      aria-labelledby={titleId}
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
      onKeyDown={(event) => {
        if (event.key === 'Tab' && ref.current) keepTabInside(event, ref.current);
      }}
    >
      <Window
        title={title}
        titleId={titleId}
        closing={!open}
        className={styles.window}
        help={help}
        hint={
          // The accessible name starts with what is visible (WCAG 2.5.3 "label in name").
          <button type="button" className={styles.close} onClick={onRequestClose}>
            <kbd className={styles.key}>ESC</kbd> EXIT<span className={styles.srOnly}> · {closeLabel}</span>
          </button>
        }
      >
        {children}
      </Window>
    </dialog>
  );
}
