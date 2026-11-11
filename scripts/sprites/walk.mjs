// Walk cycles from a sheet of frames, with the "sello" (stamp) approved on 2026-11-11
// (docs/animacion-caminar.md). Nothing is painted: every pixel comes from the reference sheet.
//   1. Every frame of the sheet is rebuilt on its native pixel grid (like cutout.mjs).
//   2. All frames share ONE fixed canvas, aligned by the head (and by the ground in side views),
//      symmetric around the head so mirroring or flipping never moves it.
//   3. The head of the reference frame is stamped, pixel for pixel, on every frame: glasses, eyes,
//      moustache and hair can never flicker.
//   4. The body bobs by whole pixels: everything above the waist, plus the arms as a whole, moves
//      down 0–2 px while the legs stay planted on the ground.
//   5. Optional mirror (front view: the step with the other leg). The head is never mirrored.
import { backgroundMask, dropTinted, figures, isBackgroundTinted, islands, loadImage, nativeGrid, peelLightFringe, removeIslands } from './lib.mjs';

const SAME = 45; // colour distance (sum of the three channels) under which two pixels match
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const ARM_ROWS = 16; // how far below the waist a hanging arm may reach

const same = (a, b) => (!a && !b) || (Boolean(a && b) && Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < SAME);
const isSkin = (c) => Boolean(c) && c[0] > 70 && c[0] > c[1] + 18 && c[1] > c[2] + 6;
const isKhaki = (c) => Boolean(c) && Math.abs(c[0] - c[1]) < 20 && c[1] > c[2] + 12 && c[0] + c[1] + c[2] > 250;
const blank = (w, h, fill = null) => Array.from({ length: h }, () => Array(w).fill(fill));

/** Is (x, y) — in reference-frame grid coordinates — part of the head? Every row above
 *  `head.rows`, plus the jaw boxes [row0, row1, col0, col1] (inclusive). */
function inHead(head, x, y) {
  if (y < 0) return false;
  if (y < head.rows) return true;
  return head.jaw.some(([r0, r1, c0, c1]) => y >= r0 && y <= r1 && x >= c0 && x <= c1);
}

/** Whole-pixel shift (dx, dy) that best lays `frame`'s head over `ref`'s head:
 *  frame[y + dy][x + dx] ≈ ref[y][x]. Returns how many head pixels still differ. */
function matchHead(ref, frame, head) {
  let best = { bad: Infinity, dx: 0, dy: 0 };
  for (let dy = -4; dy <= 4; dy++) for (let dx = -16; dx <= 16; dx++) {
    let bad = 0;
    for (let y = 0; y < ref.length; y++) for (let x = 0; x < ref[0].length; x++) {
      if (inHead(head, x, y) && !same(ref[y][x], frame[y + dy]?.[x + dx] ?? null)) bad++;
    }
    if (bad < best.bad) best = { bad, dx, dy };
  }
  return best;
}

/** Bob: moves everything above `waistRow` — and each arm hanging below it, whole — down `shift`
 *  pixels. The legs stay where they are; the moved waist simply covers the top rows of the
 *  trousers, which reads as bent knees. Moving arms whole avoids breaking a swinging forearm. */
function bobBody(grid, waistRow, shift) {
  const h = grid.length, w = grid[0].length;
  // 1. The arms below the waist: skin connected to the skin just above the waist line…
  const arm = blank(w, h, false);
  const stack = [];
  for (let x = 0; x < w; x++) if (isSkin(grid[waistRow - 1]?.[x])) { arm[waistRow - 1][x] = true; stack.push([x, waistRow - 1]); }
  while (stack.length) {
    const [x, y] = stack.pop();
    for (const [dx, dy] of N4) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= w || ny < waistRow - 1 || ny >= waistRow + ARM_ROWS) continue;
      if (arm[ny][nx] || !isSkin(grid[ny][nx])) continue;
      arm[ny][nx] = true;
      stack.push([nx, ny]);
    }
  }
  // 2. …so each column is cut below its hand (plus the hand's dark shading and outline, up to 3
  //    rows that are not trousers), or at the waist when no arm hangs there.
  const touchesKhaki = (x, y) => N4.some(([dx, dy]) => isKhaki(grid[y + dy]?.[x + dx]));
  const cut = Array(w).fill(waistRow);
  for (let x = 0; x < w; x++) {
    let last = -1;
    for (let y = waistRow; y < h; y++) if (arm[y][x]) last = y;
    if (last < 0) continue;
    let end = last;
    while (end - last < 3 && grid[end + 1]?.[x] && !isKhaki(grid[end + 1][x]) && !touchesKhaki(x, end + 1)) end++;
    cut[x] = end + 1;
  }
  const cutWide = cut.map((c, x) => Math.max(c, cut[x - 1] ?? 0, cut[x + 1] ?? 0)); // arm's side outline too
  // 3. Legs stay; the rest is drawn `shift` pixels lower, on top.
  const out = blank(w, h);
  for (let x = 0; x < w; x++) for (let y = cutWide[x]; y < h; y++) out[y][x] = grid[y][x];
  for (let x = 0; x < w; x++) for (let y = 0; y < cutWide[x]; y++) {
    if (grid[y][x] && y + shift < h) out[y + shift][x] = grid[y][x];
  }
  return out;
}

/**
 * Builds every image of one walk sheet. `walk` (see WALKS in cutout.mjs):
 *   file, pitch      the sheet and its pixel size
 *   align            'head' (front: feet may move in depth) or 'ground' (side: soles on one line)
 *   reference        the frame whose head is stamped everywhere (it is also the idle pose)
 *   head             { rows, jaw } head area of the reference frame, in its native grid
 *   waist            first row of the reference frame that stays planted when the body bobs
 *   images           { name: { frame, bob, mirror? } }
 * Returns { images: [{ name, grid }], ground, checks }.
 */
export function buildWalk(walk) {
  const img = loadImage(walk.file);
  const mask = backgroundMask(img);
  const boxes = figures(img, mask, 0.25);
  const specs = Object.entries(walk.images);
  const frames = [...new Set([walk.reference, ...specs.map(([, s]) => s.frame)])];
  const grids = new Map(frames.map((f) => [f, dropTinted(peelLightFringe(nativeGrid(img, mask, boxes[f], walk.pitch)))]));
  const ref = grids.get(walk.reference);

  // Where each frame sits, in reference-grid coordinates. d0 = how much lower its head already is.
  const place = new Map();
  for (const [f, g] of grids) {
    const m = f === walk.reference ? { dx: 0, dy: 0 } : matchHead(ref, g, walk.head);
    const y = walk.align === 'ground' ? ref.length - g.length : -m.dy;
    place.set(f, { x: -m.dx, y, d0: y + m.dy });
  }

  // Symmetry axis = centre of the reference head (×2 so it stays a whole number).
  let hx0 = Infinity, hx1 = -Infinity;
  ref.forEach((row, y) => row.forEach((c, x) => { if (c && y < walk.head.rows) { hx0 = Math.min(hx0, x); hx1 = Math.max(hx1, x); } }));
  const axis2 = hx0 + hx1;
  const mirrored = specs.some(([, s]) => s.mirror);
  const headAt = (x, y) => inHead(walk.head, x, y) || (mirrored && inHead(walk.head, axis2 - x, y));

  // One canvas for all images, symmetric around the axis, 1 px margin left and right.
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [, s] of specs) {
    const p = place.get(s.frame), g = grids.get(s.frame);
    const x0 = s.mirror ? axis2 - (p.x + g[0].length - 1) : p.x;
    minX = Math.min(minX, x0); maxX = Math.max(maxX, x0 + g[0].length - 1);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y + g.length - 1);
  }
  const half2 = Math.max(axis2 - 2 * minX, 2 * maxX - axis2) + 2;
  const left = (axis2 - half2) / 2, width = half2 + 1, top = minY, height = maxY - top + 1;
  const ground = ref.length - 1 - top;

  /** A frame pasted on the canvas (mirrored = row reversed: the canvas is symmetric). */
  function onCanvas(f, mirror) {
    const p = place.get(f), g = grids.get(f);
    const out = blank(width, height);
    g.forEach((row, y) => row.forEach((c, x) => { out[p.y - top + y][p.x - left + x] = c; }));
    return mirror ? out.map((row) => row.slice().reverse()) : out;
  }

  const refCanvas = onCanvas(walk.reference, false);
  const inStamp = (cx, cy, d0) => headAt(cx + left, cy + top - d0);

  const images = [];
  const checks = [];
  for (const [name, s] of specs) {
    const { d0 } = place.get(s.frame);
    const shift = s.bob - d0;
    if (shift < 0) throw new Error(`${name}: frame ${s.frame} already sits ${d0} px low, more than bob ${s.bob}`);
    // Clear this frame's own head, bob the body, then stamp the reference head at the bob height.
    const canvas = onCanvas(s.frame, s.mirror).map((row, cy) => row.map((c, cx) => (inStamp(cx, cy, d0) ? null : c)));
    const body = bobBody(canvas, walk.waist + d0 - top, shift);
    for (let cy = 0; cy < height; cy++) for (let cx = 0; cx < width; cx++) {
      if (inStamp(cx, cy, 0) && cy + s.bob < height && refCanvas[cy][cx]) body[cy + s.bob][cx] = refCanvas[cy][cx];
    }
    const grid = removeIslands(body);
    images.push({ name, grid });

    // Quality checks (docs/animacion-caminar.md §4).
    let headDiff = 0;
    for (let cy = 0; cy < height; cy++) for (let cx = 0; cx < width; cx++) {
      if (inStamp(cx, cy, 0) && !same(refCanvas[cy][cx], grid[cy + s.bob]?.[cx] ?? null)) headDiff++;
    }
    const firstRow = (g) => g.findIndex((row) => row.some(Boolean));
    const lastRow = (g) => g.length - 1 - [...g].reverse().findIndex((row) => row.some(Boolean));
    checks.push({
      name,
      size: `${width}×${height}`,
      bob: firstRow(grid) - firstRow(refCanvas),
      wantBob: s.bob,
      headDiff,
      tinted: grid.flat().filter((c) => c && isBackgroundTinted(c)).length,
      specks: islands(grid).filter((cells) => cells.length <= 3).length,
      feet: lastRow(grid),
      ground,
      align: walk.align,
    });
  }
  return { images, ground, checks };
}
