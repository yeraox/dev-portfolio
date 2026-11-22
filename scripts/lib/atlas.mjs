// What the windows' 16×16 icon scripts share (`npm run stack-icons`, `npm run hobby-icons`): the
// colour they are drawn in, the checks every icon passes and the one-row atlas png they make.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

export const SIZE = 16; // icon pixels a side

/** The `text` colour of the UI palette (src/styles/palette.ts, the single source of truth). */
export function textColour() {
  const palette = readFileSync('src/styles/palette.ts', 'utf8');
  const hex = palette.match(/^\s*text: '#([0-9a-f]{6})'/m)?.[1];
  if (!hex) throw new Error('palette: `text` not found');
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

/** 16×16 and enough pixels to read. Prints ✓/✗ per icon; returns the ids that failed. */
export function checkGrids(grids) {
  const failures = [];
  for (const { id, rows, source } of grids) {
    const on = rows.join('').split('#').length - 1;
    const ok = rows.length === SIZE && rows.every((row) => row.length === SIZE) && on >= 20;
    console.log(`${ok ? '✓' : '✗'} ${id.padEnd(11)} ${String(on).padStart(3)} px  ${source}`);
    if (!ok) failures.push(id);
  }
  return failures;
}

/** One row of 16×16 icons ('#' = on, in `colour`), transparent around them, as `<dir>/<name>.png`. */
export function writeAtlas(grids, colour, dir, name) {
  const width = SIZE * grids.length;
  const rgba = Buffer.alloc(width * SIZE * 4);
  grids.forEach(({ rows }, i) => rows.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell !== '#') return;
    const at = (y * width + i * SIZE + x) * 4;
    rgba[at] = colour[0]; rgba[at + 1] = colour[1]; rgba[at + 2] = colour[2]; rgba[at + 3] = 255;
  })));
  mkdirSync(dir, { recursive: true });
  const raw = `${dir}/${name}.rgba`;
  writeFileSync(raw, rgba);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${width}x${SIZE}`, '-i', raw, '-pix_fmt', 'rgba', `${dir}/${name}.png`]);
  rmSync(raw);
}
