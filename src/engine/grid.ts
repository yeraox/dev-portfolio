// Pixel grids: each string is one row, each character one pixel ('.' = transparent).
// These helpers build sprite frames from other frames, so animations only redraw what changes.

// TS concept — `readonly string[]`: an array that can't be modified after it's created.
// Every helper returns a NEW grid instead of changing the one it receives.
export type FrameGrid = readonly string[];

export const TRANSPARENT = '.';

/** Builds a left-right symmetric grid from its left half (each row is mirrored). */
export function sym(leftHalf: readonly string[]): FrameGrid {
  return leftHalf.map((row) => row + [...row].reverse().join(''));
}

/** Replaces the rows starting at `y`. */
export function withRows(grid: FrameGrid, y: number, rows: readonly string[]): FrameGrid {
  return grid.map((row, i) => (i >= y && i < y + rows.length ? rows[i - y] : row));
}

/** Draws `patch` over the grid with its top-left corner at (x, y).
 *  A space in the patch keeps the pixel underneath; '.' makes it transparent. */
export function paste(grid: FrameGrid, x: number, y: number, patch: readonly string[]): FrameGrid {
  return grid.map((row, gy) => {
    const patchRow = patch[gy - y];
    if (patchRow === undefined) return row;
    const chars = [...row];
    [...patchRow].forEach((ch, i) => {
      const gx = x + i;
      if (ch !== ' ' && gx >= 0 && gx < chars.length) chars[gx] = ch;
    });
    return chars.join('');
  });
}

/** Moves rows `from`..`to` down by `by` pixels; the gap left at the top becomes transparent.
 *  Used for "breathing" and walk bob. */
export function shiftRowsDown(grid: FrameGrid, from: number, to: number, by = 1): FrameGrid {
  return grid.map((row, y) => {
    if (y < from || y > to + by) return row;
    const source = y - by;
    return source < from ? TRANSPARENT.repeat(row.length) : grid[source];
  });
}

/** Lifts a block (columns x0..x1, rows from..to) up by `by` pixels — e.g. a foot leaving the
 *  ground. Transparent pixels of the moved block don't erase what is above it. */
export function liftColumns(
  grid: FrameGrid,
  x0: number,
  x1: number,
  from: number,
  to: number,
  by = 1,
): FrameGrid {
  const out = grid.map((row) => [...row]);
  for (let y = from - by; y <= to; y++) {
    for (let x = x0; x <= x1; x++) {
      const source = y + by <= to ? grid[y + by][x] : TRANSPARENT;
      if (y < from && source === TRANSPARENT) continue;
      out[y][x] = source;
    }
  }
  return out.map((row) => row.join(''));
}

/** Swaps two colors inside rows from..to (e.g. near leg ↔ far leg shading). */
export function swapColors(grid: FrameGrid, a: string, b: string, from: number, to: number): FrameGrid {
  return grid.map((row, y) => {
    if (y < from || y > to) return row;
    return [...row].map((ch) => (ch === a ? b : ch === b ? a : ch)).join('');
  });
}

/** Mirrors rows from..to horizontally around column `cx` (e.g. the hips): turns a side-view
 *  stride into the opposite stride, so one drawing gives both walk poses. */
export function mirrorRows(grid: FrameGrid, from: number, to: number, cx: number): FrameGrid {
  return grid.map((row, y) => {
    if (y < from || y > to) return row;
    return [...row].map((_, x) => row[Math.round(2 * cx - x)] ?? TRANSPARENT).join('');
  });
}

/** Horizontal centre of the filled pixels of one row. */
export function rowCenter(row: string): number {
  const first = row.search(/[^.]/);
  let last = row.length - 1;
  while (last > first && row[last] === TRANSPARENT) last--;
  return (first + last) / 2;
}

/** First and last filled rows of a grid. */
export function filledRows(grid: FrameGrid): { top: number; bottom: number } {
  const top = grid.findIndex((row) => /[^.]/.test(row));
  let bottom = grid.length - 1;
  while (bottom > top && !/[^.]/.test(grid[bottom])) bottom--;
  return { top, bottom };
}
