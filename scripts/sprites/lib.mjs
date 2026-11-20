// Shared by the sprite tools (cutout.mjs → single images, walk.mjs → walk cycles): load a
// reference, remove its background, find its figures, rebuild each one on its native pixel grid and
// clean it up. Dev tools only: needs ffmpeg/ffprobe.
import { execFileSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const REFS = join(ROOT, 'references');
export const BG_TOLERANCE = 72; // also swallows the light anti-aliased fringe around each figure

// ---------- image io ----------
export function loadImage(file) {
  const path = join(REFS, file);
  const [w, h] = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path])
    .toString().trim().split(',').map(Number);
  const data = execFileSync('ffmpeg', ['-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 28 });
  return { w, h, data, at: (x, y) => { const i = (y * w + x) * 3; return [data[i], data[i + 1], data[i + 2]]; } };
}

/** Saves a grid of [r, g, b] colours (null = transparent) as a PNG. */
export function writePng(path, grid) {
  const h = grid.length, w = grid[0].length;
  const buf = Buffer.alloc(w * h * 4);
  grid.forEach((row, y) => row.forEach((c, x) => {
    if (!c) return;
    const i = (y * w + x) * 4;
    buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255;
  }));
  const raw = `${path}.rgba`;
  writeFileSync(raw, buf);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${w}x${h}`, '-i', raw, '-pix_fmt', 'rgba', path]);
  rmSync(raw);
}

export const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

// ---------- 2. background ----------
export function backgroundMask(img, crop) {
  const { w, h, at } = img;
  const [cx0, cy0, cx1, cy1] = crop ?? [0, 0, w, h];
  const border = [];
  for (let x = cx0; x < cx1; x++) border.push(at(x, cy0), at(x, cy1 - 1));
  for (let y = cy0; y < cy1; y++) border.push(at(cx0, y), at(cx1 - 1, y));
  const bg = [0, 1, 2].map((c) => border.map((p) => p[c]).sort((a, b) => a - b)[border.length >> 1]);
  const mask = new Uint8Array(w * h); // 1 = background
  for (let i = 0; i < w * h; i++) {
    const x = i % w, y = (i / w) | 0;
    if (x < cx0 || y < cy0 || x >= cx1 || y >= cy1) mask[i] = 1;
  }
  // Background = what is connected to the image borders (generous tolerance, so the soft
  // anti-aliased fringe goes too)…
  const stack = [];
  for (let x = cx0; x < cx1; x++) stack.push([x, cy0], [x, cy1 - 1]);
  for (let y = cy0; y < cy1; y++) stack.push([cx0, y], [cx1 - 1, y]);
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < cx0 || y < cy0 || x >= cx1 || y >= cy1) continue;
    const i = y * w + x;
    if (mask[i] || dist2(at(x, y), bg) > BG_TOLERANCE ** 2) continue;
    mask[i] = 1;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  // …plus enclosed gaps (between an arm and the body) only when they are almost exactly the
  // background colour — a light grey t-shirt must never be mistaken for background.
  for (let y = cy0; y < cy1; y++) for (let x = cx0; x < cx1; x++) if (dist2(at(x, y), bg) < 30 ** 2) mask[y * w + x] = 1;
  return mask;
}

// ---------- 3. figures ----------
export function figures(img, mask, minShare) {
  const { w, h } = img;
  const label = new Int32Array(w * h).fill(-1);
  const boxes = [];
  for (let start = 0; start < w * h; start++) {
    if (mask[start] || label[start] >= 0) continue;
    const id = boxes.length;
    const box = { x0: w, y0: h, x1: 0, y1: 0, n: 0 };
    const stack = [start];
    label[start] = id;
    while (stack.length) {
      const i = stack.pop();
      const x = i % w, y = (i / w) | 0;
      box.n++; box.x0 = Math.min(box.x0, x); box.x1 = Math.max(box.x1, x); box.y0 = Math.min(box.y0, y); box.y1 = Math.max(box.y1, y);
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const j = ny * w + nx;
        if (!mask[j] && label[j] < 0) { label[j] = id; stack.push(j); }
      }
    }
    boxes.push(box);
  }
  const biggest = Math.max(...boxes.map((b) => b.n));
  const kept = boxes.filter((b) => b.n >= biggest * minShare);
  // row by row (figures whose vertical centres are close share a row), then left to right
  kept.sort((a, b) => a.y0 - b.y0);
  const rows = [];
  for (const b of kept) {
    const row = rows.find((r) => Math.abs((r[0].y0 + r[0].y1) / 2 - (b.y0 + b.y1) / 2) < (b.y1 - b.y0) / 2);
    if (row) row.push(b); else rows.push([b]);
  }
  return rows.flatMap((r) => r.sort((a, b) => a.x0 - b.x0));
}

// ---------- 4. pitch ----------
export function detectPitch(img, box) {
  const { at } = img;
  const diff = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  const ex = new Float64Array(box.x1 - box.x0 + 1);
  const ey = new Float64Array(box.y1 - box.y0 + 1);
  for (let y = box.y0; y <= box.y1; y++) for (let x = box.x0; x < box.x1; x++) if (diff(at(x, y), at(x + 1, y)) > 60) ex[x - box.x0]++;
  for (let x = box.x0; x <= box.x1; x++) for (let y = box.y0; y < box.y1; y++) if (diff(at(x, y), at(x, y + 1)) > 60) ey[y - box.y0]++;
  const score = (e, p) => {
    let re = 0, im = 0, tot = 0;
    e.forEach((v, i) => { const a = (2 * Math.PI * (i + 0.5)) / p; re += v * Math.cos(a); im += v * Math.sin(a); tot += v; });
    return tot ? Math.hypot(re, im) / tot : 0;
  };
  let best = 0, bestP = 8;
  for (let p = 3; p <= 30; p += 0.05) {
    const s = score(ex, p) + score(ey, p);
    if (s > best + 1e-9) { best = s; bestP = p; }
  }
  // Prefer the fundamental: if half the pitch scores almost as well, the edges sit on every pixel.
  while (bestP / 2 >= 3 && score(ex, bestP / 2) + score(ey, bestP / 2) > best * 0.85) bestP /= 2;
  return bestP;
}

// ---------- 5. native grid ----------
export function nativeGrid(img, mask, box, pitch) {
  const bw = box.x1 - box.x0 + 1, bh = box.y1 - box.y0 + 1;
  const nw = Math.max(1, Math.round(bw / pitch)), nh = Math.max(1, Math.round(bh / pitch));
  const cells = [];
  for (let ny = 0; ny < nh; ny++) {
    const row = [];
    for (let nx = 0; nx < nw; nx++) {
      const cx = box.x0 + ((nx + 0.5) * bw) / nw, cy = box.y0 + ((ny + 0.5) * bh) / nh;
      const r = Math.max(1, (pitch * 0.3) | 0);
      const pts = [];
      let bgCount = 0, total = 0;
      for (let y = Math.round(cy - r); y <= Math.round(cy + r); y++) for (let x = Math.round(cx - r); x <= Math.round(cx + r); x++) {
        total++;
        if (mask[y * img.w + x]) bgCount++; else pts.push(img.at(x, y));
      }
      if (bgCount > total / 2 || pts.length === 0) { row.push(null); continue; }
      row.push([0, 1, 2].map((c) => pts.map((p) => p[c]).sort((a, b) => a - b)[pts.length >> 1]));
    }
    cells.push(row);
  }
  return cells;
}

// Some reference sheets draw a light, cool (bluish) "sticker" outline OUTSIDE the dark outline.
// Peel light bluish pixels that touch the background, a couple of rings deep. The t-shirt is a
// warm white (more red than blue), so it is never peeled.
export function peelLightFringe(cells, rings = 2) {
  const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  let grid = cells;
  for (let r = 0; r < rings; r++) {
    grid = grid.map((row, y) => row.map((c, x) => {
      if (!c || lum(c) < 110 || c[2] <= c[0] + 6) return c;
      const touchesBg = [grid[y - 1]?.[x], grid[y + 1]?.[x], row[x - 1], row[x + 1]].some((n) => n === null || n === undefined);
      return touchesBg ? null : c;
    }));
  }
  return grid;
}


// ---------- 6. clean-up ----------
/** A pixel that is mostly the sheet's teal background, mixed into the outline when an image without
 *  a regular grid is snapped to one. The navy outline (too dark) and the glasses' blue (much bluer
 *  than green) are kept. */
export const isBackgroundTinted = ([r, g, b]) => g > r + 15 && b > r + 15 && b - g < 30 && r + g + b >= 150;

export function dropTinted(grid) {
  return grid.map((row) => row.map((c) => (c && isBackgroundTinted(c) ? null : c)));
}

/** Pixel groups not touching the figure (4-connected), largest first by size. */
export function islands(grid) {
  const h = grid.length, w = grid[0].length;
  const seen = grid.map((r) => r.map(() => false));
  const groups = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (seen[y][x] || !grid[y][x]) continue;
    const cells = [];
    const stack = [[x, y]];
    seen[y][x] = true;
    while (stack.length) {
      const [cx, cy] = stack.pop();
      cells.push([cx, cy]);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && !seen[ny][nx] && grid[ny][nx]) { seen[ny][nx] = true; stack.push([nx, ny]); }
      }
    }
    groups.push(cells);
  }
  return groups.sort((a, b) => b.length - a.length);
}

/** Drops tiny islands (≤ 3 pixels not touching the figure), e.g. a JPEG speck above the hair. */
export function removeIslands(grid) {
  const out = grid.map((r) => r.slice());
  for (const cells of islands(grid)) if (cells.length <= 3) for (const [x, y] of cells) out[y][x] = null;
  return out;
}
