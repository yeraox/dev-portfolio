import { STACK_ATLAS, STACK_ICONS } from '../assets/stack/stack-icons.gen';
import type { TechId } from '../content/types';
import styles from './TechIcon.module.css';

type TechIconProps = {
  id: TechId;
  zoom: number; // CSS px per icon pixel: a whole number of screen pixels (devicePixelZoom)
};

/** A technology's 16×16 icon (`npm run stack-icons`), cut from the one-row atlas. Decorative: the
 *  name is always written next to it. */
export function TechIcon({ id, zoom }: TechIconProps) {
  const size = STACK_ATLAS.size * zoom;
  return (
    <span
      className={styles.icon}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${STACK_ATLAS.src})`,
        backgroundSize: `${size * STACK_ATLAS.count}px ${size}px`,
        backgroundPosition: `${-STACK_ICONS[id] * size}px 0`,
      }}
    />
  );
}
