import { STONE_TILE } from '../assets/textures';
import { NULL_DOG, YERAY } from '../assets/characters/characters';
import { PixelSprite } from './PixelSprite';
import styles from './Hud.module.css';

// Both portraits sit in the same frame: Yeray's head down to the goatee and the vest collar
// (the top 76 rows of his 64×94 portrait), Null's 50×47 face centred.
const FRAME = { width: 64, height: 76 };

type HudProps = {
  zoom: number; // CSS px per portrait pixel
  names: { yeray: string; null: string };
  compact?: boolean; // name beside the portrait instead of under it (portrait screens)
};

/** Bottom HUD: Yeray's portrait on the left, Null's on the right, each with a name plate.
 *  No bars: there are no real numbers to show (DESIGN.md §7). */
export function Hud({ zoom, names, compact = false }: HudProps) {
  const frame = { width: FRAME.width * zoom, height: FRAME.height * zoom };
  return (
    <div className={styles.hud} data-compact={compact}>
      <figure className={styles.panel} style={{ backgroundImage: STONE_TILE.url }}>
        <div className={styles.portrait} style={frame}>
          <PixelSprite pose={YERAY.portrait} unit={zoom} />
        </div>
        <figcaption className={styles.name}>{names.yeray}</figcaption>
      </figure>
      <figure className={styles.panel} style={{ backgroundImage: STONE_TILE.url }}>
        <div className={`${styles.portrait} ${styles.centred}`} style={frame}>
          <PixelSprite pose={NULL_DOG.portrait} unit={zoom} />
        </div>
        <figcaption className={styles.name}>{names.null}</figcaption>
      </figure>
    </div>
  );
}
