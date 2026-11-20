import { STONE_TILE } from '../assets/textures';
import type { Content } from '../content/types';
import { PORTRAIT_PX } from '../game/stage';
import { HudBar } from './HudBar';
import { Portrait } from './Portrait';
import styles from './Hud.module.css';

type HudProps = {
  zoom: number; // CSS px per pixel of Null's portrait: a whole number of screen pixels
  texts: Content['hud']; // names and the HP / XP labels
  xp: number; // how much of the camp the visitor explored, 0–1 (game/explored.ts)
  xpText: string; // the same in words, for screen readers
  compact?: boolean; // portrait screens: the HUD sits in its own row under the scene
};

// TS concept — `Content['hud']`: the type of one field of another type (here, the HUD's texts),
// so the props always match the dictionaries.

/** Bottom HUD: Yeray on the left, Null on the right, each a stone panel with the portrait in an
 *  ink screen, the name, and a life and an experience bar beside it. Life is always
 *  full (there is nothing real to measure); experience fills as the visitor explores. */
export function Hud({ zoom, texts, xp, xpText, compact = false }: HudProps) {
  const side = PORTRAIT_PX * zoom;
  return (
    <div className={styles.hud} data-compact={compact}>
      <figure className={styles.panel} style={{ backgroundImage: STONE_TILE.url }}>
        {/* His in-game drawing in the same screen as Null's portrait, twice as big per pixel: from
            the hair to the shoulders, with his neck and the top of his clothes (his choice). */}
        <Portrait who="yeray" side={side} zoom={2 * zoom} className={styles.screen} />
        <figcaption className={styles.status}>
          <span className={styles.name}>{texts.yeray}</span>
          <HudBar label={texts.hp} kind="hp" value={1} />
          <HudBar label={texts.xp} kind="xp" value={xp} valueText={xpText} />
        </figcaption>
      </figure>
      <figure className={styles.panel} style={{ backgroundImage: STONE_TILE.url }}>
        <Portrait who="null" side={side} zoom={zoom} className={styles.screen} />
        <figcaption className={styles.status}>
          <span className={styles.name}>{texts.null}</span>
          <HudBar label={texts.hp} kind="hp" value={1} />
          {/* The party shares its experience: said once, with Yeray's bar. */}
          <HudBar label={texts.xp} kind="xp" value={xp} />
        </figcaption>
      </figure>
    </div>
  );
}
