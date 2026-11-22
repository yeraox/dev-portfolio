import type { Ref } from 'react';
import { ICONS, iconOutline } from '../assets/icons/icons';
import { useLocale } from '../content/useLocale';
import styles from './TitleCorner.module.css';

type TitleCornerProps = {
  slot: 'cv' | 'settings'; // the CV's parchment (top left) or the SETTINGS gear (top right)
  scale: number; // CSS px per scene px: the icon keeps the scene's pixel size, as in the ring
  label: string; // accessible name; it starts with the visible name (WCAG 2.5.3 "label in name")
  onOpen: () => void; // opens its window: the CV's question, or SETTINGS
  // TS concept — `Ref<T>`: a box React fills with the <button>. Since React 19 `ref` is a normal prop.
  ref?: Ref<HTMLButtonElement>; // the title gives the focus back here when the window closes
};

/** One of the title screen's two corners: the same icon and name as in the ring, opening the same
 *  window. The CV is one step away before the game even starts, and so are the language and the
 *  animations. */
export function TitleCorner({ slot, scale, label, onOpen, ref }: TitleCornerProps) {
  const { t } = useLocale();
  const icon = ICONS[slot];
  return (
    <button
      ref={ref}
      type="button"
      className={styles.corner}
      data-side={slot === 'cv' ? 'left' : 'right'}
      aria-haspopup="dialog"
      aria-label={label}
      onClick={onOpen}
    >
      <span className={styles.name} aria-hidden="true">
        {t.ring.names[slot]}
      </span>
      <img
        className={styles.icon}
        src={icon.src}
        width={icon.width * scale}
        height={icon.height * scale}
        alt=""
        draggable={false}
        style={{ filter: iconOutline(scale) }}
      />
    </button>
  );
}
