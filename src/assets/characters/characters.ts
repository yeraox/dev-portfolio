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
// the same with the other leg (docs/sprites.md, "Walk cycles"). The front step with the right leg
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
  side: { frames: ['yeray-side'], ms: 650, pixelSize: 1, bob: true },
  walkDown: { frames: WALK_DOWN, ms: 120, pixelSize: 1 }, // toward the camera
  walkSide: { frames: WALK_SIDE, ms: 120, pixelSize: 1 }, // facing right; flip for left
  // Idle actions, built on his still drawing (scripts/sprites/idle.mjs), so
  // they start and end on it without a jump. Repeating a frame holds it.
  glasses: { frames: ['yeray-glasses-1', 'yeray-glasses-2', 'yeray-glasses-3', 'yeray-glasses-3', 'yeray-glasses-3', 'yeray-glasses-2', 'yeray-glasses-1'], ms: 140, pixelSize: 1 },
  coffee: {
    frames: ['yeray-coffee-1', 'yeray-coffee-1', 'yeray-coffee-2', 'yeray-coffee-3', 'yeray-coffee-3', 'yeray-coffee-3', 'yeray-coffee-3', 'yeray-coffee-2', 'yeray-coffee-4', 'yeray-coffee-4'],
    ms: 160,
    pixelSize: 1,
  },
  think: {
    frames: ['yeray-think-1', 'yeray-think-2', 'yeray-think-2', 'yeray-think-3', 'yeray-think-3', 'yeray-think-3', 'yeray-think-3', 'yeray-think-3', 'yeray-think-2', 'yeray-think-1'],
    ms: 150,
    pixelSize: 1,
  },
} satisfies Record<string, Pose>;

// Null walking towards the camera: the same 8-step pattern as Yeray's, at a small
// dog's quicker pace (70 ms a frame: 0.56 s for two steps).
const NULL_WALK_DOWN: CharacterImageName[] = [
  'null-front-step-a',
  'null-front-step-a-down',
  'null-front-pass',
  'null-front',
  'null-front-step-b',
  'null-front-step-b-down',
  'null-front-pass',
  'null-front',
];

export const NULL_DOG = {
  sit: { frames: ['null-sit'], ms: 700, pixelSize: 0.5, bob: true },
  // Standing still, facing the camera: the front walk's still drawing (legs together), held. His
  // walk sheet is drawn at the resolution of the sitting picture: half a scene px per pixel too,
  // so he is the same size standing, walking and sitting.
  stand: { frames: ['null-front'], ms: 700, pixelSize: 0.5 },
  walkDown: { frames: NULL_WALK_DOWN, ms: 70, pixelSize: 0.5 },
  // Idle actions, sitting: built on his sitting drawing, so they start and end
  // on it without a jump (scripts/sprites/idle.mjs). Repeating a frame holds it.
  tilt: { frames: ['null-tilt-1', 'null-tilt-1', 'null-tilt-1', 'null-tilt-1', 'null-tilt-1', 'null-tilt-1'], ms: 120, pixelSize: 0.5 },
  wag: {
    frames: ['null-tail-1', 'null-tail-2', 'null-tail-3', 'null-tail-2', 'null-tail-1', 'null-tail-2', 'null-tail-3', 'null-tail-2'],
    ms: 110,
    pixelSize: 0.5,
  },
  scratch: {
    frames: ['null-scratch-1', 'null-scratch-2', 'null-scratch-3', 'null-scratch-2', 'null-scratch-3', 'null-scratch-2', 'null-scratch-3', 'null-scratch-1'],
    ms: 140,
    pixelSize: 0.5,
  },
} satisfies Record<string, Pose>;

export { CHARACTER_IMAGES };
