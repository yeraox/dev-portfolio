import { Fragment } from 'react';
import styles from './KeyHint.module.css';

// TS concept — an array type: `KeyHintItem[]` means "a list of KeyHintItem objects".
export type KeyHintItem = {
  key: string; // e.g. "ENTER"
  action: string; // e.g. "SELECT"
};

/** Key prompts for the top-right of a window: [ENTER] SELECT · [ESC] EXIT */
export function KeyHint({ items }: { items: KeyHintItem[] }) {
  return (
    <p className={styles.hint}>
      {items.map((item, i) => (
        <Fragment key={item.key}>
          {i > 0 && <span aria-hidden="true"> · </span>}
          <kbd className={styles.key}>{item.key}</kbd> {item.action}
        </Fragment>
      ))}
    </p>
  );
}
