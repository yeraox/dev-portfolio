// Yeray's skin tone. His generated references draw his skin darker than it is, so the
// generator re-tones ONLY the skin pixels of his images (walk sheets and portrait): same pixels,
// same shapes, same frames; nothing is drawn. Repeatable: `npm run characters` does it every time.
//
// How:
//   1. A pixel is skin when its colour has skin proportions (green and blue against red) and it is
//      above the knees (boots and trousers have browns too). Eye whites, irises, hair, beard,
//      glasses, vest, backpack and the portrait's frame fall outside those proportions.
//   2. Each image measures its own skin: the brightness of its shadow, its main tone and its
//      light (5th, 50th and 99th percentiles). So a darker picture (the portrait) and a lighter
//      one (the walks) end on the same colours.
//   3. Each skin pixel takes the colour of the chosen tone at its brightness, between the tone's
//      shadow, main and light colours: the shading keeps its order from dark to light.

/** Skin proportions: g/r 0.57–0.78 and b/r 0.36–0.62, not too dark (r ≥ 90). */
export const isSkin = (c) => Boolean(c) && c[0] >= 90 && c[1] / c[0] >= 0.57 && c[1] / c[0] <= 0.78 && c[2] / c[0] >= 0.36 && c[2] / c[0] <= 0.62;

const brightness = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;

// The tones Yeray chooses from (shadow, main, light). `null` = keep the references' colours.
export const SKIN_TONES = {
  1: { label: 'bronceado', shadow: [156, 104, 80], main: [214, 160, 122], light: [236, 192, 154] },
  2: { label: 'claro', shadow: [170, 118, 96], main: [228, 178, 142], light: [246, 208, 176] },
  3: { label: 'muy claro', shadow: [184, 132, 112], main: [240, 196, 166], light: [252, 222, 198] },
};

/** Is grid[y][x] a skin pixel? Rows from `maxRow` down (legs, boots) never are. */
const skinAt = (grid, x, y, maxRow) => y < maxRow && isSkin(grid[y][x]);

/** The brightness of the shadow, main tone and light of the skin in these grids (one image, or
 *  every image of a walk sheet together, so its frames stay identical to each other). */
export function measureSkin(grids, maxRow) {
  const values = [];
  for (const grid of grids) grid.forEach((row, y) => row.forEach((_, x) => skinAt(grid, x, y, maxRow) && values.push(brightness(row[x]))));
  values.sort((a, b) => a - b);
  const at = (q) => values[Math.floor(q * (values.length - 1))];
  return { shadow: at(0.05), main: at(0.5), light: at(0.99), pixels: values.length };
}

const mix = (a, b, t) => a.map((v, i) => Math.max(0, Math.min(255, Math.round(v + (b[i] - v) * t))));

/** The tone's colour for a skin pixel of brightness `y`, given the image's own `ramp`. */
function toneFor(y, ramp, tone) {
  if (y <= ramp.main) return mix(tone.shadow, tone.main, Math.max(-0.5, (y - ramp.shadow) / (ramp.main - ramp.shadow)));
  return mix(tone.main, tone.light, Math.min(1.2, (y - ramp.main) / (ramp.light - ramp.main)));
}

/** A copy of `grid` with its skin re-toned. Every other pixel stays exactly as it was. */
export function recolorSkin(grid, tone, ramp, maxRow = Infinity) {
  return grid.map((row, y) => row.map((c, x) => (skinAt(grid, x, y, maxRow) ? toneFor(brightness(c), ramp, tone) : c)));
}

/** Checks the promise of this file: same size, same transparent pixels, and the only pixels
 *  that changed were skin. Returns what is wrong (empty = fine) and how many pixels changed. */
export function checkRecolor(before, after, maxRow = Infinity) {
  const problems = [];
  let changed = 0;
  if (before.length !== after.length || before[0].length !== after[0].length) problems.push('size changed');
  before.forEach((row, y) => row.forEach((c, x) => {
    const d = after[y]?.[x];
    if (Boolean(c) !== Boolean(d)) problems.push(`transparency changed at ${x},${y}`);
    else if (c && (c[0] !== d[0] || c[1] !== d[1] || c[2] !== d[2])) {
      changed++;
      if (!skinAt(before, x, y, maxRow)) problems.push(`non-skin pixel changed at ${x},${y}`);
    }
  }));
  return { problems: problems.slice(0, 5), changed };
}
