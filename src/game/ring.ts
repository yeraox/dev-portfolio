// Ring menu geometry (DESIGN.md §6), in scene pixels of the 640×360 scene. Pure functions.
export const RING = {
  rx: 124, // horizontal radius of the ellipse
  ry: 84, // vertical radius
  icon: 32, // a 16×16 icon drawn at 2 scene px per icon pixel
} as const;
// TS concept — `as const`: the values become read-only and keep their exact numbers.

export const ROTATE_FRAMES = 8; // one slot turns in 8 frames (≈ 133 ms)

export type Point = { x: number; y: number };

/** Angle in degrees of slot `index` (0° = right, 90° = down, -90° = top) when the ring is turned
 *  to `turn`: the slot number at the top. `turn` is fractional while the ring is moving. */
export function slotAngle(index: number, turn: number, count: number): number {
  return -90 + ((index - turn) * 360) / count;
}

/** Where slot `index` sits, relative to the ring's centre. */
export function slotOffset(index: number, turn: number, count: number): Point {
  const radians = (slotAngle(index, turn, count) * Math.PI) / 180;
  return { x: RING.rx * Math.cos(radians), y: RING.ry * Math.sin(radians) };
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
