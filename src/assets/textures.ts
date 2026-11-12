// Pixel-art textures for the window system, generated from the palette as tiny SVGs.
// They are built once when the module loads (a few microseconds) and used as CSS background /
// border images, scaled by --u. No image files to download.
import { UI_PALETTE, type UiColor } from '../styles/palette';

// TS concept — a function type: `PixelFn` is "a function that takes x and y and returns a
// palette color name, or null for a transparent pixel".
type PixelFn = (x: number, y: number) => UiColor | null;

export type Texture = {
  width: number;
  height: number;
  colors: UiColor[]; // every color the texture uses (tests check them)
  url: string; // CSS-ready `url("data:image/svg+xml,…")`
};

export function makeTexture(width: number, height: number, pixel: PixelFn): Texture {
  const rects: string[] = [];
  const used = new Set<UiColor>();
  for (let y = 0; y < height; y++) {
    // Merge runs of the same color on a row into one <rect> to keep the SVG small.
    let x = 0;
    while (x < width) {
      const color = pixel(x, y);
      let run = 1;
      while (x + run < width && pixel(x + run, y) === color) run++;
      if (color) {
        used.add(color);
        rects.push(`<rect x="${x}" y="${y}" width="${run}" height="1" fill="${UI_PALETTE[color]}"/>`);
      }
      x += run;
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${rects.join('')}</svg>`;
  return {
    width,
    height,
    colors: [...used],
    url: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
  };
}

// Small deterministic random generator, so the stone looks the same on every load.
function seededRandom(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 32×32 seamless granite: fine grain in two dark stone tones + rare ink pits.
 *  Only colors that keep window text above WCAG AA (see CONTRAST_PAIRS). */
function stoneTile(): Texture {
  const size = 32;
  const cell = 2; // small cells = fine granite grain (4 looked like camouflage)
  const cells = size / cell;
  const random = seededRandom(1995);
  const grid = Array.from({ length: cells * cells }, () => random());
  const jitter = Array.from({ length: size * size }, () => random());
  const at = (cx: number, cy: number) => grid[((cy + cells) % cells) * cells + ((cx + cells) % cells)];

  return makeTexture(size, size, (x, y) => {
    // Value noise: blend the 4 surrounding cell values (wraps around → seamless tile).
    const gx = x / cell;
    const gy = y / cell;
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const fx = gx - x0;
    const fy = gy - y0;
    const top = at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx;
    const bottom = at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx;
    const value = (top * (1 - fy) + bottom * fy) * 0.75 + jitter[y * size + x] * 0.25;
    if (value < 0.1) return 'ink';
    return value > 0.6 ? 'stone-1' : 'stone-0'; // mostly dark, lighter flecks
  });
}

/** 2×2 checkerboard: the 16-bit way to mix two colors without a gradient. */
function ditherTile(a: UiColor, b: UiColor): Texture {
  return makeTexture(2, 2, (x, y) => ((x + y) % 2 === 0 ? a : b));
}

/** 18×18 nine-slice for `border-image`: 6×6 gold knots in the corners, twisted rope on the
 *  edges (6 px thick, repeats every 6 px), transparent center. */
function ropeFrame(): Texture {
  const c = 6;
  const twist = (s: number): UiColor => {
    if (s === 0) return 'gold-4';
    if (s <= 2) return 'gold-3';
    if (s <= 4) return 'gold-2';
    return 'gold-1';
  };
  return makeTexture(c * 3, c * 3, (x, y) => {
    const cx = Math.floor(x / c);
    const cy = Math.floor(y / c);
    const lx = x % c;
    const ly = y % c;
    if (cx === 1 && cy === 1) return null; // center stays empty
    const isCorner = cx !== 1 && cy !== 1;
    if (isCorner) {
      if (lx === 0 || ly === 0 || lx === c - 1 || ly === c - 1) return 'ink';
      if (lx === 1 && ly === 1) return 'gold-4';
      if (lx + ly <= 3) return 'gold-3';
      if (lx + ly >= 7) return 'gold-1';
      return 'gold-2';
    }
    const horizontal = cx === 1; // top or bottom edge
    const across = horizontal ? ly : lx; // position across the rope's thickness
    const along = horizontal ? x : y; // position along the rope
    if (across === 0 || across === c - 1) return 'ink';
    return twist((along + across) % c);
  });
}

export const STONE_TILE = stoneTile();
export const BANNER_DITHER = ditherTile('blue-1', 'blue-2');
export const ROPE_FRAME = ropeFrame();
export const ROPE_SLICE = 6; // art pixels per nine-slice cell

/** Selection brackets: four blue-3 corners of an 8×8 nine-slice (3-px corner cells). */
function bracketFrame(): Texture {
  return makeTexture(8, 8, (x, y) => {
    const edgeX = x === 0 || x === 7;
    const edgeY = y === 0 || y === 7;
    const nearCornerX = x < 3 || x > 4;
    const nearCornerY = y < 3 || y > 4;
    return (edgeX && nearCornerY) || (edgeY && nearCornerX) ? 'blue-3' : null;
  });
}

export const BRACKETS = bracketFrame();
export const BRACKET_SLICE = 3; // art pixels per nine-slice corner

// 4×4 ordered (Bayer) dither: which pixels go dark first in the scene transition.
const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** The transition's middle steps: ¼, ½ and ¾ of the pixels in night-0 (step 0 = clear, 4 = solid). */
export const DARKEN_STEPS = [4, 8, 12].map((level) =>
  makeTexture(4, 4, (x, y) => (BAYER_4[y][x] < level ? 'night-0' : null)),
);
