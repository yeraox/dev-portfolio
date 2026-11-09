import { useId, type ReactNode } from 'react';
import { STONE_TILE } from '../assets/textures';
import styles from './Window.module.css';

// TS concept — optional props: `title?` means the parent may leave it out
// (then its type inside the component is `string | undefined`).
type WindowProps = {
  title?: string;
  hint?: ReactNode; // top-right slot, usually <KeyHint />
  help?: ReactNode; // bottom slot, usually <HelpBar />
  children: ReactNode;
  className?: string;
};

/** Stone panel with a bevelled frame and an engraved inner groove. Opens with an 18-frame stepped wipe. */
export function Window({ title, hint, help, children, className }: WindowProps) {
  const titleId = useId();
  const classes = [styles.window, className].filter(Boolean).join(' ');

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
