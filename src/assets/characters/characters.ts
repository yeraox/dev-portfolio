// Characters = Yeray's reference images on their native pixel grid (characters.gen.ts, made by
// `npm run characters`). This file says which images form each pose and how big each pose is
// drawn, so every pose of a character ends up the same height.
import { CHARACTER_IMAGES } from './characters.gen';

// TS concept — `keyof typeof X`: the union of X's key names ('yeray-front' | 'null-sit' | …),
// so a typo in a frame name is a compile error.
export type CharacterImageName = keyof typeof CHARACTER_IMAGES;

export type Pose = {
  frames: CharacterImageName[]; // one image = a still pose; several = an animation cycle
  ms: number; // time per frame (or per bob step for a single image)
  // Size of one image pixel relative to the front pose. Yeray's poses are all 110 rows tall
  // (pixelSize 1); Null's sitting reference was drawn at twice his walking resolution (0.5).
  pixelSize: number;
  bob?: boolean; // 1-pixel breathing bob for poses with a single drawing
};

// Walk cycles: 8 frames, 120 ms each (0.96 s for two steps). Contact → down → passing → up, then
// the same with the other leg (docs/animacion-caminar.md §3). The front step with the right leg
// is the left step mirrored; "passing" and "up" reuse the idle drawing 1 px lower / as it is.
const WALK_DOWN: CharacterImageName[] = [
  'yeray-front-step-left',
  'yeray-front-step-left-down',
  'yeray-front-pass',
  'yeray-front',
  'yeray-front-step-right',
  'yeray-front-step-right-down',
  'yeray-front-pass',
  'yeray-front',
];
const WALK_SIDE: CharacterImageName[] = [
  'yeray-side-step-a',
  'yeray-side-step-a-down',
  'yeray-side-pass',
  'yeray-side',
  'yeray-side-step-b',
  'yeray-side-step-b-down',
  'yeray-side-pass',
  'yeray-side',
];

export const YERAY = {
  idle: { frames: ['yeray-front'], ms: 650, pixelSize: 1, bob: true },
  armsCrossed: { frames: ['yeray-arms'], ms: 750, pixelSize: 1, bob: true },
  side: { frames: ['yeray-side'], ms: 650, pixelSize: 1, bob: true },
  walkDown: { frames: WALK_DOWN, ms: 120, pixelSize: 1 }, // toward the camera
  walkSide: { frames: WALK_SIDE, ms: 120, pixelSize: 1 }, // facing right; flip for left
  portrait: { frames: ['yeray-portrait'], ms: 1000, pixelSize: 1 },
} satisfies Record<string, Pose>;

export const NULL_DOG = {
  sit: { frames: ['null-sit'], ms: 700, pixelSize: 0.5, bob: true },
  trotSide: {
    frames: ['null-side-0', 'null-side-1', 'null-side-2', 'null-side-3', 'null-side-4', 'null-side-5'],
    ms: 110,
    pixelSize: 1,
  },
  walkDown: { frames: ['null-front-0', 'null-front-1', 'null-front-2', 'null-front-1'], ms: 160, pixelSize: 1 },
  portrait: { frames: ['null-portrait'], ms: 1000, pixelSize: 1 },
} satisfies Record<string, Pose>;

export { CHARACTER_IMAGES };
