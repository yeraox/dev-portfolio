// The intro's script (docs/plan-de-fases.md, phase 6): Yeray and Null come out of the cave at the
// top of the camp image and walk down to their places; then the ring opens. It is the camp scene
// itself, so no other transition is needed. Change the timings here: the player
// (game/script.ts) only follows this list.
import { NULL_DOG, YERAY } from '../../assets/characters/characters';
import { scriptDuration, type ActorScript } from '../../game/script';
import { CAMP } from './campLayout';

// The cave mouth in Yeray's camp image, in scene px (measured on the image: its dark opening
// spans x 283–358 from y 30 down to its floor at y 112).
export const CAVE_MOUTH = { left: 283, right: 358, top: 30, floor: 112 };

// Yeray: a beat at the cave mouth, then straight down to his spot at a calm walk (60 px/s ≈ one
// 0.96 s walk cycle per 58 px, so his feet don't slide).
const YERAY_SCRIPT: ActorScript = {
  from: { x: CAMP.yeray.x, y: CAVE_MOUTH.floor },
  steps: [
    { type: 'wait', pose: YERAY.idle, ms: 500 },
    { type: 'walk', pose: YERAY.walkDown, to: { x: CAMP.yeray.x, y: CAMP.yeray.ground }, speed: 60 },
  ],
  rest: YERAY.idle,
};

// Null: a step behind Yeray, at his right inside the cave (dark on dark: he shows up as he steps
// out). He sets off later, follows him down a few steps behind, trots to his spot and sits.
const NULL_X = 348;
const NULL_SCRIPT: ActorScript = {
  from: { x: NULL_X, y: CAVE_MOUTH.floor - 4 },
  steps: [
    { type: 'wait', pose: NULL_DOG.stand, ms: 1100 },
    { type: 'walk', pose: NULL_DOG.walkDown, to: { x: NULL_X, y: CAMP.null.ground - 12 }, speed: 68 },
    { type: 'walk', pose: NULL_DOG.trotSide, to: { x: CAMP.null.x, y: CAMP.null.ground }, speed: 90 },
  ],
  rest: NULL_DOG.sit,
};

export const INTRO = { yeray: YERAY_SCRIPT, null: NULL_SCRIPT };

// Both in place for a moment before the ring opens.
const SETTLE_MS = 300;

/** When the intro hands over to the camp (the ring then opens in 12 frames). */
export const INTRO_MS = Math.max(scriptDuration(YERAY_SCRIPT), scriptDuration(NULL_SCRIPT)) + SETTLE_MS;

/** Every pose the intro draws, for preloading. */
export const INTRO_POSES = [YERAY.idle, YERAY.walkDown, NULL_DOG.stand, NULL_DOG.walkDown, NULL_DOG.trotSide, NULL_DOG.sit];
