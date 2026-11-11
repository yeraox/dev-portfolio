// Sprite sheets: pixel grids + a legend (character → color) + animations.
// Frames are rasterized once into small canvases and then copied with drawImage,
// which is very cheap even at 60 fps.
import { TRANSPARENT, type FrameGrid } from './grid';

export type Animation = {
  frames: FrameGrid[];
  ms: number[]; // how long each frame stays on screen
  loop: boolean;
};

export type SpriteSheet = {
  width: number;
  height: number;
  legend: Record<string, string>; // grid character → #rrggbb (always from a palette)
  animations: Record<string, Animation>;
};

/** Builds an animation. `ms` is either one duration for every frame or one per frame. */
export function anim(frames: FrameGrid[], ms: number | number[], loop = true): Animation {
  return { frames, ms: typeof ms === 'number' ? frames.map(() => ms) : ms, loop };
}

/** Which frame is showing `elapsedMs` after the animation started. Pure → easy to test. */
export function frameIndexAt(animation: Animation, elapsedMs: number): number {
  const total = animation.ms.reduce((sum, ms) => sum + ms, 0);
  if (total <= 0) return 0;
  if (!animation.loop && elapsedMs >= total) return animation.frames.length - 1;
  let t = ((elapsedMs % total) + total) % total;
  for (let i = 0; i < animation.ms.length; i++) {
    if (t < animation.ms[i]) return i;
    t -= animation.ms[i];
  }
  return animation.frames.length - 1;
}

// One canvas per (sheet, frame) pair, created the first time it's drawn.
// TS concept — WeakMap<K, V>: a map whose keys are objects; entries vanish with their key.
const rasterCache = new WeakMap<SpriteSheet, Map<FrameGrid, HTMLCanvasElement>>();

// TS concept — a tuple type: exactly three numbers, in this order (red, green, blue).
function hexToRgb(hex: string): [number, number, number] {
  const channel = (i: number) => parseInt(hex.slice(i, i + 2), 16);
  return [channel(1), channel(3), channel(5)];
}

/** The frame as a canvas of exactly width×height pixels. */
export function rasterize(sheet: SpriteSheet, grid: FrameGrid): HTMLCanvasElement {
  let byFrame = rasterCache.get(sheet);
  if (!byFrame) {
    byFrame = new Map();
    rasterCache.set(sheet, byFrame);
  }
  const cached = byFrame.get(grid);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = sheet.width;
  canvas.height = sheet.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const image = ctx.createImageData(sheet.width, sheet.height);
    grid.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === TRANSPARENT) return;
        const [r, g, b] = hexToRgb(sheet.legend[ch]);
        const i = (y * sheet.width + x) * 4;
        image.data[i] = r;
        image.data[i + 1] = g;
        image.data[i + 2] = b;
        image.data[i + 3] = 255;
      });
    });
    ctx.putImageData(image, 0, 0);
  }
  byFrame.set(grid, canvas);
  return canvas;
}

/** Draws the right frame of `animation` at (x, y). `flip` mirrors it horizontally. */
export function drawAnimation(
  ctx: CanvasRenderingContext2D,
  sheet: SpriteSheet,
  animation: Animation,
  elapsedMs: number,
  x: number,
  y: number,
  flip = false,
): void {
  const frame = animation.frames[frameIndexAt(animation, elapsedMs)];
  const image = rasterize(sheet, frame);
  if (!flip) {
    ctx.drawImage(image, x, y);
    return;
  }
  ctx.save();
  ctx.translate(x + sheet.width, y);
  ctx.scale(-1, 1);
  ctx.drawImage(image, 0, 0);
  ctx.restore();
}
