// Ring menu geometry (DESIGN.md, "Ring menu"), in scene pixels of the 640×360 scene. Pure functions.
export const RING = {
  // Each slot carries its name above its icon, so the ring leaves room for it: the top slot's name
  // clears the banner, the bottom slot's name fits between Yeray's boots and its icon, and the
  // lower side names pass beside Null (measured in check:camp at 390, 768 and 1440 px, in every
  // position the ring can stop in).
  // The ring is an egg, not an ellipse: its half-width grows from the top to the bottom. Up by
  // Yeray's head there is room, so the upper side slots sit close to him and leave the campfire
  // (left) and the dumbbells (right) in view; down by Null the lower ones keep their distance.
  rxTop: 56, // half-width the ring would have at its very top…
  rxBottom: 156, // …and at its very bottom (in between it changes evenly with the height)
  // It also reaches lower than it rises: with seven slots, the lower right one stops right under
  // Null, so the lower half is a bit deeper and its names sit below his paws (the icons still end
  // inside the scene, 360 px).
  ryTop: 88, // how far above the centre the top slot sits (the active one, over Yeray's head)
  ryBottom: 101, // how far below the centre the bottom of the ring reaches
  icon: 28, // the longest side of an icon (npm run icons), 1 icon pixel = 1 scene pixel
} as const;
// TS concept — `as const`: the values become read-only and keep their exact numbers.

export const ROTATE_FRAMES = 8; // one slot turns in 8 frames (≈ 133 ms)

export type Point = { x: number; y: number };

/** Angle in degrees of slot `index` (0° = right, 90° = down, -90° = top) when the ring is turned
 *  to `turn`: the slot number at the top. `turn` is fractional while the ring is moving. */
export function slotAngle(index: number, turn: number, count: number): number {
  return -90 + ((index - turn) * 360) / count;
}

/** Where slot `index` sits, relative to the ring's centre: round the ring's egg shape. */
export function slotOffset(index: number, turn: number, count: number): Point {
  const radians = (slotAngle(index, turn, count) * Math.PI) / 180;
  const height = Math.sin(radians); // -1 at the top … 1 at the bottom
  const halfWidth = RING.rxTop + ((RING.rxBottom - RING.rxTop) * (height + 1)) / 2;
  const depth = height < 0 ? RING.ryTop : RING.ryBottom;
  return { x: halfWidth * Math.cos(radians), y: depth * height };
}

/** Fewest slots to turn from `from` to `to`: positive = towards the next slot. */
export function shortestTurn(from: number, to: number, count: number): number {
  let delta = (to - from) % count;
  if (delta > count / 2) delta -= count;
  if (delta < -count / 2) delta += count;
  return delta;
}

/** The ring's position `frame` whole frames after starting a turn of `delta` slots from `from`. */
export function turnAt(from: number, delta: number, frame: number): number {
  const done = Math.min(Math.max(Math.floor(frame), 0), ROTATE_FRAMES);
  return from + (delta * done) / ROTATE_FRAMES;
}

// Opening (after the intro): the ring spreads out from Yeray's middle in 6 steps of 2 frames
// (12 frames, 0.2 s), turning one slot as it goes, so the icons swirl into place.
export const OPEN_FRAMES = 12;
const OPEN_STEPS = 6;

/** How far the ring has spread (1/6 → 1) `frame` frames after it starts opening. */
export function openSpread(frame: number): number {
  const step = Math.min(Math.floor(Math.max(frame, 0) / (OPEN_FRAMES / OPEN_STEPS)) + 1, OPEN_STEPS);
  return step / OPEN_STEPS;
}

/** Where slot `index` sits while the ring opens: on a smaller ellipse, one slot behind. */
export function openingOffset(index: number, turn: number, count: number, spread: number): Point {
  const offset = slotOffset(index, turn - (1 - spread), count);
  return { x: offset.x * spread, y: offset.y * spread };
}
