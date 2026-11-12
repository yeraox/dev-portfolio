// The title screen's night landscape, drawn in code from the palette as flat silhouettes: a dark
// sky in dithered bands with stars, a thin blue glow on the horizon, the cave mountain (its mouth
// is where the intro starts in phase 6) and a pine forest in front. One "art pixel" = 2 scene px.
import { UI_PALETTE, type UiColor } from '../../styles/palette';

/** Repeatable "random" number in [0, 1) for a pixel. */
function noise(x: number, y: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const checker = (x: number, y: number, a: UiColor, b: UiColor): UiColor => ((x + y) % 2 === 0 ? a : b);

/**
 * Whether art pixel (x, y) falls inside one of the firs. Each fir is a pointed triangle (one pixel
 * at the tip) whose sides step back in at four branch tiers, and is wider at the base than its
 * neighbours are apart, so the trees always touch.
 */
function inForest(x: number, y: number, ground: number, height: number, centre: number, width: number): boolean {
  const spacing = Math.max(5, Math.round(height * 0.035));
  const nearest = Math.floor(x / spacing);
  for (let i = nearest - 3; i <= nearest + 3; i++) {
    const treeX = i * spacing + Math.round(noise(i, 3) * spacing * 0.6);
    if (Math.abs(treeX - centre) < width * 0.09) continue; // the clearing: whole trees only
    const treeHeight = Math.round(height * (0.07 + 0.09 * noise(i, 7)));
    const depth = (y - (ground - treeHeight)) / treeHeight; // 0 at the tip, 1 at the ground
    if (depth < 0) continue;
    const tier = (depth * 4) % 1; // each branch tier starts narrower and spreads out
    const halfWidth = depth * treeHeight * 0.34 * (0.68 + 0.32 * tier);
    if (Math.abs(x - treeX) <= halfWidth) return true;
  }
  return false;
}

/** The colour of art pixel (x, y) in a width × height landscape. */
function colorAt(x: number, y: number, width: number, height: number): UiColor {
  const horizon = Math.round(height * 0.7);
  const ground = Math.round(height * 0.84);
  const centre = width / 2;

  // The forest in front: pointed firs that overlap into one dense, jagged treeline (lone narrow
  // trees with round tops read as something else entirely), with a clearing in front of the cave.
  if (y < ground && inForest(x, y, ground, height, centre, width)) return 'night-0';
  if (y >= ground) return y >= height - 2 ? 'ink' : 'night-0';

  // The cave mountain: highest in the middle, with gentle bumps, down to the ground.
  const spread = Math.max(0, 1 - Math.abs(x - centre) / (width * 0.42));
  const ridge = horizon - Math.round(height * 0.24 * spread ** 1.6 + 3 * Math.sin(x / 9) * spread + 2 * noise(x, 1));
  if (y >= ridge) {
    // The cave mouth at the foot of the mountain.
    const arch = ((x - centre) / (width * 0.035)) ** 2 + ((y - ground) / (height * 0.09)) ** 2;
    if (arch < 0.75) return 'night-0';
    if (arch < 1) return 'ink';
    return 'night-1';
  }

  // Sky: night bands lighter toward the horizon (so the mountain, in night-1, stands out against
  // night-2 behind it), dithered where they meet, a glow line on the horizon, and stars.
  if (y === horizon - 1) return 'horizon';
  const t = y / horizon;
  if (t > 0.92) return checker(x, y, 'night-2', 'horizon');
  if (t > 0.62) return 'night-2';
  if (t > 0.56) return checker(x, y, 'night-1', 'night-2');
  if (t > 0.44) return 'night-1';
  if (t > 0.38) return checker(x, y, 'night-0', 'night-1');
  const star = noise(x, y);
  if (star < 0.003) return 'text-dim';
  if (star < 0.007) return 'horizon-hi';
  return 'night-0';
}

/** The landscape as a canvas of width × height art pixels (one canvas pixel each). */
export function drawTitleBackground(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const image = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const hex = UI_PALETTE[colorAt(x, y, width, height)];
      const i = (y * width + x) * 4;
      image.data[i] = parseInt(hex.slice(1, 3), 16);
      image.data[i + 1] = parseInt(hex.slice(3, 5), 16);
      image.data[i + 2] = parseInt(hex.slice(5, 7), 16);
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}
