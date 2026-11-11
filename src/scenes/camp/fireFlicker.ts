// The campfire's flicker. Yeray's camp image has one still flame, so it is animated the 16-bit
// way: a few variants of the flame where some of its art pixels burn a little dimmer, shown in
// a restless order. Only the flame's own bright pixels change; nothing new is drawn.
import { SCENE_IMAGES } from '../../assets/scenes/scenes.gen';

// The flame inside the camp image, in the image's pixels (below the paella pan).
export const FIRE = { x: 380, y: 445, width: 100, height: 60 } as const;

export const FIRE_FRAME_MS = 110;
const SEQUENCE = [0, 1, 2, 0, 3, 1, 2, 3]; // 0 = the flame as drawn
const VARIANTS = 3;

const isFlame = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 && r > 200 && r > b + 80;

/** Repeatable "random" number in [0, 1) for an art pixel and a variant. */
function chance(cellX: number, cellY: number, variant: number): number {
  let h = Math.imul(cellX, 374761393) + Math.imul(cellY, 668265263) + Math.imul(variant, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** The flame variants as small canvases (FIRE-sized), to draw over the background. */
export function fireVariants(image: HTMLImageElement): HTMLCanvasElement[] {
  const pitch = SCENE_IMAGES.camp.pitch;
  const variants: HTMLCanvasElement[] = [];
  for (let variant = 1; variant <= VARIANTS; variant++) {
    const canvas = document.createElement('canvas');
    canvas.width = FIRE.width;
    canvas.height = FIRE.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    ctx.drawImage(image, FIRE.x, FIRE.y, FIRE.width, FIRE.height, 0, 0, FIRE.width, FIRE.height);
    const pixels = ctx.getImageData(0, 0, FIRE.width, FIRE.height);
    const data = pixels.data;
    for (let y = 0; y < FIRE.height; y++) {
      for (let x = 0; x < FIRE.width; x++) {
        const i = (y * FIRE.width + x) * 4;
        if (!isFlame(data[i], data[i + 1], data[i + 2])) continue;
        // Whole art pixels dim together, so the flame changes shape instead of shimmering.
        const cellX = Math.floor((FIRE.x + x) / pitch);
        const cellY = Math.floor((FIRE.y + y) / pitch);
        if (chance(cellX, cellY, variant) > 0.4) continue;
        data[i] = Math.round(data[i] * 0.8);
        data[i + 1] = Math.round(data[i + 1] * 0.72);
        data[i + 2] = Math.round(data[i + 2] * 0.72);
      }
    }
    ctx.putImageData(pixels, 0, 0);
    variants.push(canvas);
  }
  return variants;
}

/** Which variant shows at `now` (0 = the original flame). */
export function fireFrame(now: number, reducedMotion: boolean): number {
  return reducedMotion ? 0 : SEQUENCE[Math.floor(now / FIRE_FRAME_MS) % SEQUENCE.length];
}
