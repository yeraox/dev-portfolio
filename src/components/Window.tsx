import { useId, type ReactNode } from 'react';
import { STONE_TILE } from '../assets/textures';
import styles from './Window.module.css';

// TS concept — optional props: `title?` means the parent may leave it out
// (then its type inside the component is `string | undefined`).
type WindowProps = {
  title?: string;
  titleId?: string; // id for the title, when something else (a dialog) needs to point at it
  hint?: ReactNode; // top-right slot, usually <KeyHint />
  help?: ReactNode; // bottom slot, usually <HelpBar />
  closing?: boolean; // plays the 10-frame closing wipe
  children: ReactNode;
  className?: string;
};

/** Stone panel with a bevelled frame and an engraved inner groove. Opens with an 18-frame stepped
 *  wipe and closes with a 10-frame one. */
export function Window({ title, titleId: givenTitleId, hint, help, closing = false, children, className }: WindowProps) {
  const ownTitleId = useId();
  const titleId = givenTitleId ?? ownTitleId;
  const classes = [styles.window, closing && styles.closing, className].filter(Boolean).join(' ');

  return (
    <section
      className={classes}
      style={{ backgroundImage: STONE_TILE.url }}
      aria-labelledby={title ? titleId : undefined}
    >
      {(title || hint) && (
        <header className={styles.header}>
          {title && (
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          )}
          {hint}
        </header>
      )}
      <div className={styles.body}>{children}</div>
      {help}
    </section>
  );
}
