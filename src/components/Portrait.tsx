import { CHARACTER_IMAGES } from '../assets/characters/characters';
import styles from './Portrait.module.css';

type PortraitProps = {
  who: 'yeray' | 'null';
  side: number; // CSS px: the square screen the portrait fills
  zoom: number; // CSS px per image pixel: a whole number of screen pixels (devicePixelZoom)
  className?: string;
};

// A row of night above Yeray's hair, in pixels of his drawing.
const HEADROOM = 1;

/**
 * A portrait in a square screen, crisp at a whole number of screen pixels per image pixel.
 * - Null: his portrait picture (without its gold frame), as he drew it.
 * - Yeray: his in-game drawing (his choice): the front drawing, skin tone included,
 *   framed from the top of the hair; the screen cuts it below. Nothing is drawn: it is the same
 *   image the camp uses, shown bigger.
 * Decorative: the name is always written beside it.
 */
export function Portrait({ who, side, zoom, className }: PortraitProps) {
  const image = CHARACTER_IMAGES[who === 'yeray' ? 'yeray-front' : 'null-portrait'];
  const width = image.width * zoom;
  const top = who === 'yeray' ? image.top - HEADROOM : 0;
  // Centred across in whole image pixels, so every pixel still starts on a screen pixel.
  const left = Math.floor((side / zoom - image.width) / 2) * zoom;
  return (
    <div
      className={className ? `${styles.portrait} ${className}` : styles.portrait}
      aria-hidden="true"
      style={{
        width: side,
        height: side,
        backgroundImage: `url(${image.src})`,
        backgroundSize: `${width}px auto`,
        // From `top` down (walk sheets stack images: `image.y` is where this one starts).
        backgroundPosition: `${left}px ${-(image.y + top) * zoom}px`,
      }}
    />
  );
}
