// The ring menu's icons from Yeray's references (references/icons/*.jpg, 1024×1024 pixel art).
// They are drawn with 80–250 pixels a side, but a ring slot is SIZE scene pixels, so each icon is
// cut out of its background and reduced to the scene's pixel grid: one icon pixel = one scene
// pixel, the same size as Yeray's and Null's pixels. Nothing is drawn by hand: every pixel is the
// average of the reference pixels it covers, and its colours are the reference's own.
//
//   npm run icons   → src/assets/icons/*.png + icons.gen.ts
//   Exits with an error when an icon fails its checks.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, dist2, loadImage, removeIslands, writePng } from './lib.mjs';

const OUT_DIR = join(ROOT, 'src/assets/icons');

// The longest side of every icon, in scene pixels. Must match RING.icon (src/game/ring.ts); a test
// checks it.
const SIZE = 28;

// name in the code → reference. EQUIP's vest is the stack (Yeray's gear) and ALCHEMY's flask the
// projects. The gear is the SETTINGS slot; the two flags are the languages inside it (Spain for
// Spanish, the UK for English).
const ICONS = [
  { name: 'projects', file: 'icons/alchemy_icon.jpg' },
  { name: 'stack', file: 'icons/equip_icon.jpg' },
  { name: 'profile', file: 'icons/stats_icon.jpg' },
  { name: 'contact', file: 'icons/contact_icon.jpg' },
  { name: 'about', file: 'icons/aboutme_icon.jpg' },
  { name: 'cv', file: 'icons/cv_icon.jpg' },
  { name: 'settings', file: 'icons/engranaje.jpg' },
  { name: 'es', file: 'icons/spain_icon.jpg' },
  { name: 'en', file: 'icons/uk_icon.jpg' },
];

// Background removal. The backgrounds are a flat dark olive, close to the darkest icons (the
// silhouette, the telephone, the green vest), so a plain colour tolerance would eat them. Instead
// the fill spreads from the image's border only through small steps between neighbours (STEP)
// and only over colours near the background (CAP): it stops at each icon's dark outline.
const STEP = 14;
const CAP = 45;

/** 1 = background: what the border-connected fill reaches. */
function backgroundByEdges(img) {
  const { w, h, at } = img;
  const border = [];
  for (let x = 0; x < w; x++) border.push(at(x, 0), at(x, h - 1));
  for (let y = 0; y < h; y++) border.push(at(0, y), at(w - 1, y));
  const bg = [0, 1, 2].map((c) => border.map((p) => p[c]).sort((a, b) => a - b)[border.length >> 1]);
  const mask = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push([x, 0, x, 0], [x, h - 1, x, h - 1]);
  for (let y = 0; y < h; y++) stack.push([0, y, 0, y], [w - 1, y, w - 1, y]);
  while (stack.length) {
    const [x, y, fromX, fromY] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h || mask[y * w + x]) continue;
    const colour = at(x, y);
    if (dist2(colour, at(fromX, fromY)) > STEP ** 2 || dist2(colour, bg) > CAP ** 2) continue;
    mask[y * w + x] = 1;
    stack.push([x + 1, y, x, y], [x - 1, y, x, y], [x, y + 1, x, y], [x, y - 1, x, y]);
  }
  return mask;
}

/** The icon's box (what is not background). */
function contentBox(mask, w, h) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let i = 0; i < w * h; i++) {
    if (mask[i]) continue;
    const x = i % w, y = (i / w) | 0;
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  return { x0, y0, x1, y1 };
}

/** Reduces the box to the scene grid (longest side = SIZE). Each new pixel is the average colour
 *  of the icon pixels under it, and exists only if the icon covers at least half of it. */
function reduce(img, mask, box) {
  const bw = box.x1 - box.x0 + 1, bh = box.y1 - box.y0 + 1;
  const step = Math.max(bw, bh) / SIZE; // reference pixels per scene pixel
  const w = Math.max(1, Math.round(bw / step)), h = Math.max(1, Math.round(bh / step));
  const grid = [];
  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      const sx0 = box.x0 + Math.floor((x * bw) / w), sx1 = box.x0 + Math.floor(((x + 1) * bw) / w);
      const sy0 = box.y0 + Math.floor((y * bh) / h), sy1 = box.y0 + Math.floor(((y + 1) * bh) / h);
      const sum = [0, 0, 0];
      let inside = 0, total = 0;
      for (let sy = sy0; sy < sy1; sy++) for (let sx = sx0; sx < sx1; sx++) {
        total++;
        if (mask[sy * img.w + sx]) continue;
        const c = img.at(sx, sy);
        sum[0] += c[0]; sum[1] += c[1]; sum[2] += c[2];
        inside++;
      }
      row.push(inside * 2 >= total ? sum.map((v) => Math.round(v / inside)) : null);
    }
    grid.push(row);
  }
  return grid;
}

// Remove only what this script makes.
mkdirSync(OUT_DIR, { recursive: true });
for (const f of readdirSync(OUT_DIR)) if (f.endsWith('.png') || f === 'icons.gen.ts') rmSync(join(OUT_DIR, f));

const failures = [];
const entries = [];
for (const icon of ICONS) {
  const img = loadImage(icon.file);
  const mask = backgroundByEdges(img);
  const box = contentBox(mask, img.w, img.h);
  const grid = removeIslands(reduce(img, mask, box));
  const w = grid[0].length, h = grid.length;
  writePng(join(OUT_DIR, `${icon.name}.png`), grid);
  entries.push({ name: icon.name, width: w, height: h });

  // Checks: the longest side is SIZE, the icon fills its box (the background did not eat it) and
  // the cut-out touches all four sides of its box (nothing but background was cropped).
  const filled = grid.flat().filter(Boolean).length / (w * h);
  const touches = [grid[0].some(Boolean), grid[h - 1].some(Boolean), grid.some((r) => r[0]), grid.some((r) => r[w - 1])].every(Boolean);
  const problems = [
    Math.max(w, h) !== SIZE && `longest side ${Math.max(w, h)} instead of ${SIZE}`,
    filled < 0.4 && `only ${Math.round(filled * 100)} % filled`,
    !touches && 'does not reach every side of its box',
  ].filter(Boolean);
  console.log(`${icon.name}.png  ${w}×${h}  ${Math.round(filled * 100)} % filled  from ${icon.file} (${box.x1 - box.x0 + 1}×${box.y1 - box.y0 + 1})  ${problems.length ? '✗ ' + problems.join('; ') : '✓'}`);
  if (problems.length) failures.push(icon.name);
}

const ts = [
  '// GENERATED by scripts/sprites/icons.mjs — do not edit by hand.',
  "// The ring's icons, cut out of Yeray's references and reduced to the scene grid (1 px = 1 scene px).",
  ...entries.map((e) => `import ${e.name} from './${e.name}.png';`),
  '',
  'export type IconImage = { src: string; width: number; height: number };',
  '',
  'export const ICON_IMAGES = {',
  ...entries.map((e) => `  ${e.name}: { src: ${e.name}, width: ${e.width}, height: ${e.height} },`),
  '} satisfies Record<string, IconImage>;',
  '',
].join('\n');
writeFileSync(join(OUT_DIR, 'icons.gen.ts'), ts);
console.log(`→ src/assets/icons/ (${entries.length} icons) + icons.gen.ts`);
if (failures.length) {
  console.error(`✗ ${failures.length} icon(s) failed their checks: ${failures.join(', ')}`);
  process.exit(1);
}
