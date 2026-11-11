// PROVISIONAL camp background, drawn in code from the palette until Yeray's generated camp
// image arrives (docs/fondo-campamento.md). Deliberately plain: rock wall with the cave mouth,
// dark tree masses, ground and a clearing. Same size as the real one will be: 320×180 pixels,
// each one 2×2 scene pixels.
import { UI_PALETTE, type UiColor } from '../../styles/palette';

export const BACKGROUND = { width: 320, height: 180, pixel: 2 } as const;

/** Repeatable "random" number in [0, 1) for a pixel, so the speckles never change. */
function noise(x: number, y: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const inEllipse = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) =>
  ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;

// Tree masses on both sides, behind the camp: [x, y, radius].
const TREES: [number, number, number][] = [
  [14, 34, 36],
  [56, 14, 28],
  [74, 58, 22],
  [306, 34, 36],
  [264, 14, 28],
  [246, 58, 22],
];

function colorAt(x: number, y: number): UiColor {
  const n = noise(x, y);
  const wallEdge = 54 + Math.round(5 * Math.sin(x / 9) + 3 * noise(x, 0));

  for (const [tx, ty, r] of TREES) {
    const d = inEllipse(x, y, tx, ty, r, r * 0.9);
    if (d < 1) return d < 0.5 && x - tx < -r * 0.2 && y - ty < -r * 0.2 && (x + y) % 2 === 0 ? 'forest-1' : 'forest-0';
  }

  if (y < wallEdge) {
    // The cave mouth: an arch in the middle of the rock wall.
    const arch = inEllipse(x, y, 160, 56, 22, 34);
    if (arch < 0.82) return 'night-0';
    if (arch < 1) return 'ink';
    if (n < 0.03) return 'stone-1';
    return n > 0.993 ? 'ink' : 'stone-0';
  }
  if (y === wallEdge) return 'ink'; // the wall's foot casts a hard line on the ground

  // Ground, with a trodden clearing in front of the cave.
  const clearing = inEllipse(x, y, 160, 132, 104, 42);
  if (clearing < 0.8) return n < 0.02 ? 'forest-1' : 'earth-0';
  if (clearing < 1) return (x + y) % 2 === 0 ? 'earth-0' : 'forest-1';
  if (n < 0.025) return 'forest-0';
  return n > 0.99 ? 'forest-2' : 'forest-1';
}

/** The provisional background as a 320×180 canvas (one canvas pixel per background pixel). */
export function provisionalBackground(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = BACKGROUND.width;
  canvas.height = BACKGROUND.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const image = ctx.createImageData(BACKGROUND.width, BACKGROUND.height);
  for (let y = 0; y < BACKGROUND.height; y++) {
    for (let x = 0; x < BACKGROUND.width; x++) {
      const hex = UI_PALETTE[colorAt(x, y)];
      const i = (y * BACKGROUND.width + x) * 4;
      image.data[i] = parseInt(hex.slice(1, 3), 16);
      image.data[i + 1] = parseInt(hex.slice(3, 5), 16);
      image.data[i + 2] = parseInt(hex.slice(5, 7), 16);
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}
