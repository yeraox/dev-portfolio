import type { ReactNode } from 'react';
import styles from './HelpBar.module.css';

/** One-line contextual help at the bottom of a window. */
export function HelpBar({ children }: { children: ReactNode }) {
  return <p className={styles.help}>{children}</p>;
}
