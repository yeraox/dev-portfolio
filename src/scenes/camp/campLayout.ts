// Where things stand in the 640×360 camp, in scene pixels (DESIGN.md §6–6b).
import { SCENE_IMAGES } from '../../assets/scenes/scenes.gen';
import type { Point } from '../../game/ring';

// Yeray's camp image fills the scene's height. It is a touch wider than 16:9 (1376×768), so it
// overhangs the scene by 2.5 px on each side.
const BACKGROUND_SCALE = 360 / SCENE_IMAGES.camp.height; // scene px per image px
const BACKGROUND_WIDTH = SCENE_IMAGES.camp.width * BACKGROUND_SCALE;

// The line Yeray's boots stand on: the lower edge of the clearing, where the path starts. Low
// enough for the ring's left icon to pass under the campfire instead of over it.
const GROUND = 310;

export const CAMP = {
  background: {
    image: SCENE_IMAGES.camp,
    x: (640 - BACKGROUND_WIDTH) / 2,
    y: 0,
    scale: BACKGROUND_SCALE,
  },
  yeray: { x: 320, ground: GROUND },
  // Null sits at Yeray's right, a little in front of him, inside the ring.
  null: { x: 376, ground: GROUND + 2 },
  // The ring turns around Yeray's middle (he is 110 px tall).
  ringCenter: { x: 320, y: GROUND - 55 } satisfies Point,
};
