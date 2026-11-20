import type { Ref } from 'react';
import { ICONS, iconOutline } from '../assets/icons/icons';
import { useLocale } from '../content/useLocale';
import styles from './CvScroll.module.css';

type CvScrollProps = {
  scale: number; // CSS px per scene px: the icon keeps the scene's pixel size, as in the ring
  onOpen: () => void; // asks "Download the CV as a PDF?"
  // TS concept — `Ref<T>`: a box React fills with the <button>. Since React 19 `ref` is a normal prop.
  ref?: Ref<HTMLButtonElement>; // the title gives the focus back here when the question closes
};

/** The CV's parchment on the title screen, top left: the same icon and name as in the ring, and
 *  the same question when chosen. The CV is one step away before the game even starts. */
export function CvScroll({ scale, onOpen, ref }: CvScrollProps) {
  const { t } = useLocale();
  const icon = ICONS.cv;
  return (
    <button
      ref={ref}
      type="button"
      className={styles.scroll}
      aria-haspopup="dialog"
      // The accessible name starts with the visible one (WCAG 2.5.3 "label in name").
      aria-label={`${t.ring.names.cv}: ${t.cvDownload.banner}`}
      onClick={onOpen}
    >
      <span className={styles.name} aria-hidden="true">
        {t.ring.names.cv}
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
