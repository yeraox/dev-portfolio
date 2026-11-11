// Where things stand in the 640×360 camp, in scene pixels (DESIGN.md §6–7).
import type { Point } from '../../game/ring';

const GROUND = 296; // the line Yeray's boots stand on

export const CAMP = {
  yeray: { x: 320, ground: GROUND },
  // Null sits at Yeray's right, a little in front of him, inside the ring.
  null: { x: 376, ground: GROUND + 2 },
  // The ring turns around Yeray's middle (he is 110 px tall).
  ringCenter: { x: 320, y: GROUND - 55 } satisfies Point,
  // Signature idle (BRIEF.md): arms crossed after ~3 s without touching the menu.
  armsCrossedAfterMs: 3000,
};
