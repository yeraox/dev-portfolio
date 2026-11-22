import styles from './AtlasIcon.module.css';

/** A one-row atlas of square pixel icons, as the icon scripts make it (`npm run stack-icons`,
 *  `npm run hobby-icons`): its png, the icons' side in pixels and how many there are. */
type Atlas = { src: string; size: number; count: number };

type AtlasIconProps = {
  atlas: Atlas;
  index: number; // the icon's place in the atlas (STACK_ICONS[id], HOBBY_ICONS[id])
  zoom: number; // CSS px per icon pixel: a whole number of screen pixels (devicePixelZoom)
};

/** One 16×16 icon cut from its atlas: a technology in STACK, a hobby in ABOUT ME. Decorative: its
 *  name is always written next to it. */
export function AtlasIcon({ atlas, index, zoom }: AtlasIconProps) {
  const size = atlas.size * zoom;
  return (
    <span
      className={styles.icon}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${atlas.src})`,
        backgroundSize: `${size * atlas.count}px ${size}px`,
        backgroundPosition: `${-index * size}px 0`,
      }}
    />
  );
}
