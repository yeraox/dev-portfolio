// Option A: Yeray's big references used AS THEY ARE. Each figure is rebuilt on its native pixel
// grid (one pixel per pseudo-pixel the image was drawn with, original colours, JPEG noise and
// background removed) and saved as a tiny transparent PNG, shown later scaled by a whole number
// with `image-rendering: pixelated` — it looks exactly like the reference, at a few KB.
// Walk cycles come from his walk sheets through the "sello" (walk.mjs, docs/animacion-caminar.md).
//
// Yeray's skin is re-toned lighter (skin.mjs): only the skin pixels of his images. His HUD
// portrait is his in-game face itself (the front drawing, enlarged by the HUD), so it has no file.
//
//   node scripts/sprites/cutout.mjs              → src/assets/characters/*.png + characters.gen.ts
//   node scripts/sprites/cutout.mjs --skin=2     → the same with another skin tone (1, 2, 3 or none)
//   Exits with an error when a walk image or a skin change fails its quality checks.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, backgroundMask, detectPitch, figures, loadImage, nativeGrid, peelLightFringe, removeIslands, writePng } from './lib.mjs';
import { SKIN_TONES, checkRecolor, measureSkin, recolorSkin } from './skin.mjs';
import { buildIdle } from './idle.mjs';
import { buildWalk } from './walk.mjs';

// Yeray's skin tone (skin.mjs): 2, "claro", his choice on 2026-11-19. `null` = the references' own.
const SKIN_TONE = 2;
const skinArg = process.argv.find((arg) => arg.startsWith('--skin='))?.slice('--skin='.length);
const toneId = skinArg === undefined ? SKIN_TONE : skinArg === 'none' ? null : Number(skinArg);
const tone = toneId === null ? null : SKIN_TONES[toneId];
if (toneId !== null && !tone) {
  console.error(`✗ unknown skin tone "${skinArg}" (use 1, 2, 3 or none)`);
  process.exit(1);
}
console.log(`skin tone: ${tone ? `${toneId} (${tone.label})` : 'the references\' own'}`);
// In the walk images (110–113 rows), skin is only ever above the knees.
const SKIN_MAX_ROW = 90;

const OUT_DIR = join(ROOT, 'src/assets/characters');

// Single images. name → reference (paths relative to references/). `pitch` = the image's pixel
// size when the automatic detection gets it wrong; `pick` = which figures of a multi-figure sheet
// to keep; `whole` = the picture is used entire, background included (nothing is cut out), minus
// `inset` pixels of its own frame on every side.
const IMAGES = [
  { name: 'null-sit', file: 'grandes/null.jpg', pitch: 10.75 },
  { name: 'null-side', file: 'grandes/null_caminando.jpg' },
  // Null's HUD portrait: his square picture on its 7.5 px grid (the detection is fooled
  // by the gold frame, drawn on a coarser one), without that frame: the HUD's stone frames it.
  { name: 'null-portrait', file: 'portraits/portrait_null.jpg', pitch: 7.5, whole: true, inset: 11 },
];

// Walk sheets (see buildWalk in walk.mjs). Frames are numbered from 0, left to right. `head` and
// `waist` are rows/columns of the reference frame's native grid, read from its material map.
// Each image is one drawing at one bob height; the 8-frame cycles reuse them (characters.ts).
// All images of a walk go into ONE png, stacked top to bottom (`sheet`): the identical head
// compresses almost for free (43 KB instead of 108 KB) and no frame waits for its own download.
const WALKS = [
  {
    sheet: 'yeray-front-walk',
    skin: true,
    file: 'grandes/front_walk_animation.png',
    pitch: 6.6, // → 110 px tall, the same scale as before
    align: 'head', // the step toward the camera puts that foot lower: align by the head
    reference: 0,
    head: { rows: 38, jaw: [[38, 39, 15, 27]] },
    waist: 70,
    images: {
      'yeray-front': { frame: 0, bob: 0 }, // idle and "up"
      'yeray-front-pass': { frame: 0, bob: 1 },
      'yeray-front-step-left': { frame: 1, bob: 1 }, // his left leg forward
      'yeray-front-step-left-down': { frame: 1, bob: 2 },
      'yeray-front-step-right': { frame: 1, bob: 1, mirror: true },
      'yeray-front-step-right-down': { frame: 1, bob: 2, mirror: true },
    },
  },
  {
    sheet: 'yeray-side-walk',
    skin: true,
    file: 'grandes/sidewalk_animation.png',
    pitch: 5.36, // → 110 px tall, like the front view (its grid also reads as 85 px)
    align: 'ground',
    reference: 0,
    head: { rows: 37, jaw: [[37, 38, 23, 37], [39, 40, 26, 37]] },
    waist: 70,
    images: {
      'yeray-side': { frame: 0, bob: 0 }, // idle and "up"
      'yeray-side-pass': { frame: 0, bob: 1 },
      'yeray-side-step-a': { frame: 1, bob: 1 }, // near leg forward
      'yeray-side-step-a-down': { frame: 1, bob: 2 },
      'yeray-side-step-b': { frame: 2, bob: 1 }, // far leg forward
      'yeray-side-step-b-down': { frame: 2, bob: 2 },
    },
  },
  // Null walking towards the camera: his 8-frame sheet, drawn at the resolution of his
  // sitting picture (pitch 3.75 → ~55×96, shown at half a scene px per pixel like the sitting
  // one, so he no longer grows when he sits down). Like Yeray's front walk: the still drawing's
  // head stamped on every image, one step (frame 3: a forepaw reaching down, the other lifted)
  // and the same step mirrored for the other side, the body bobbing 0–2 px.
  {
    sheet: 'null-front-walk',
    file: 'grandes/null_front_walk_animation.jpg',
    pitch: 3.75,
    align: 'head', // the paw stepping towards the camera reaches lower: align by the head
    reference: 0,
    head: { rows: 45, jaw: [] }, // ears to the end of the beard (row 44)
    waist: 70, // the legs part from here down
    images: {
      'null-front': { frame: 0, bob: 0 }, // standing and "up"
      'null-front-pass': { frame: 0, bob: 1 },
      'null-front-step-a': { frame: 3, bob: 1 },
      'null-front-step-a-down': { frame: 3, bob: 2 },
      'null-front-step-b': { frame: 3, bob: 1, mirror: true },
      'null-front-step-b-down': { frame: 3, bob: 2, mirror: true },
    },
  },
];

const failures = [];

/** The first row with a visible pixel (where the hair starts, in a character). */
const firstRow = (grid) => grid.findIndex((row) => row.some(Boolean));

/** Re-tones the skin of one image or sheet (no change while no tone is chosen) and checks it.
 *  `ramp`: the brightness of its own skin (measured), or another image's to match its colours. */
function retone(name, grids, maxRow, ramp = tone ? measureSkin(grids, maxRow) : null) {
  if (!tone) return grids;
  const out = grids.map((grid) => recolorSkin(grid, tone, ramp, maxRow));
  const results = grids.map((grid, i) => checkRecolor(grid, out[i], maxRow));
  const problems = results.flatMap((r) => r.problems);
  const changed = results.reduce((sum, r) => sum + r.changed, 0);
  console.log(`  skin ${name}: ${problems.length ? '✗ ' + problems.join('; ') : `✓ ${changed} skin px re-toned, nothing else touched`} (brightness ${ramp.shadow.toFixed(0)} / ${ramp.main.toFixed(0)} / ${ramp.light.toFixed(0)})`);
  if (problems.length) failures.push(`skin ${name}`);
  return out;
}

// Remove only what this script makes: characters.ts and characters.test.ts live here too.
mkdirSync(OUT_DIR, { recursive: true });
for (const f of readdirSync(OUT_DIR)) if (f.endsWith('.png') || f === 'characters.gen.ts') rmSync(join(OUT_DIR, f));
// entry = one named image: which png it lives in, its size, the row its feet stand on and the
// row where it starts inside the png (y > 0 only in walk sheets).
const entries = [];
// Every drawing, for the idle actions built on a still one: name → { grid: as the reference draws
// it, final: as the game shows it (Yeray's skin re-toned), ground, ramp: its skin's brightness }.
const stills = new Map();
const save = (name, grid, ground, note) => {
  stills.set(name, { grid, final: grid, ground, ramp: null });
  writePng(join(OUT_DIR, `${name}.png`), grid);
  entries.push({ name, file: name, width: grid[0].length, height: grid.length, ground, y: 0, top: firstRow(grid) });
  console.log(`${name}.png  ${grid[0].length}×${grid.length}  ${note}`);
};

for (const image of IMAGES) {
  const img = loadImage(image.file);
  if (image.whole) {
    const full = nativeGrid(img, new Uint8Array(img.w * img.h), { x0: 0, y0: 0, x1: img.w - 1, y1: img.h - 1 }, image.pitch);
    const inset = image.inset ?? 0;
    const grid = full.slice(inset, full.length - inset).map((row) => row.slice(inset, row.length - inset));
    save(image.name, grid, grid.length - 1, `(whole picture without ${inset} px of frame, pitch ${image.pitch.toFixed(2)} px)`);
    continue;
  }
  const mask = backgroundMask(img, image.crop);
  const found = figures(img, mask, 0.25);
  const pitch = image.pitch ?? detectPitch(img, found[0]);
  found.forEach((box, i) => {
    if (image.pick && !image.pick.includes(i)) return;
    const grid = removeIslands(peelLightFringe(nativeGrid(img, mask, box, pitch)));
    const name = found.length > 1 ? `${image.name}-${i}` : image.name;
    save(name, grid, grid.length - 1, `(pitch ${pitch.toFixed(2)} px)`);
  });
}

// Walk images + quality checks (docs/animacion-caminar.md §4).
for (const walk of WALKS) {
  const built = buildWalk(walk);
  const { ground, checks } = built;
  // The whole sheet is re-toned together, so its frames stay identical to each other (the
  // stamped head included: the same colour always becomes the same colour).
  const drawn = built.images.map(({ grid }) => grid);
  const ramp = walk.skin && tone ? measureSkin(drawn, SKIN_MAX_ROW) : null;
  const toned = walk.skin ? retone(walk.sheet, drawn, SKIN_MAX_ROW, ramp) : null;
  const images = toned ? built.images.map((image, i) => ({ ...image, grid: toned[i] })) : built.images;
  images.forEach(({ name, grid }, i) => stills.set(name, { grid: drawn[i], final: grid, ground, ramp }));
  const height = images[0].grid.length;
  writePng(join(OUT_DIR, `${walk.sheet}.png`), images.flatMap(({ grid }) => grid));
  images.forEach(({ name, grid }, i) => entries.push({ name, file: walk.sheet, width: grid[0].length, height, ground, y: i * height, top: firstRow(grid) }));
  console.log(`${walk.sheet}.png  ${images[0].grid[0].length}×${height * images.length}  (${images.length} images, ${walk.file})`);
  for (const c of checks) {
    const feetOk = c.align === 'ground' ? c.feet === c.ground : c.feet >= c.ground;
    const problems = [
      c.headDiff > 0 && `head differs from the stamp in ${c.headDiff} px`,
      c.bob !== c.wantBob && `bob ${c.bob} px instead of ${c.wantBob}`,
      c.tinted > 0 && `${c.tinted} background-tinted px`,
      c.specks > 0 && `${c.specks} loose specks`,
      !feetOk && `feet end on row ${c.feet}, ground is ${c.ground}`,
    ].filter(Boolean);
    console.log(`  check ${c.name}: ${problems.length ? '✗ ' + problems.join('; ') : `✓ head identical, bob ${c.bob}, no specks, feet on the ground`}`);
    if (problems.length) failures.push(c.name);
  }
}

// Idle actions (idle.mjs): what each character does when left alone. Each one
// is built on the character's in-game still drawing (`base`): only what changes in the sheet is
// laid over it. `mode`: 'changed' takes every changed pixel; 'added' only what the frame adds
// outside the figure (a tail). `frames`: the sheet frames used (frame 0 and the last one are the
// still pose). `skin`: re-toned like Yeray's still drawing, with ITS ramp, so every pixel of the
// drawing keeps exactly its in-game colour. `redrawn: 1`: the sheet redraws what does not move up
// to 1 px off (Yeray's: his vest, his right side), and that is not a change. Not for Null: his fur
// is so even that his turned head would pass for the still one. `region: 2`: each change comes
// with 2 px of its surroundings from the same frame (a whole hand with its mug). `face`: Yeray's
// inner face in his still drawing (brows to chin, inside the ears); when a frame's face moves, all
// of it is laid over (brows, eyes, glasses and moustache move together). `together`: outside the
// face only one thing moves (his arm with its hand and mug); a patch far from it (a boot, the other
// shoulder, redrawn differently in one frame) is noise and would flicker.
const YERAY_FACE = { x: [9, 35], y: [16, 37] };
const IDLES = [
  { name: 'null-tilt', base: 'null-sit', file: 'grandes/reposo/ladear_cabeza.jpg', pitch: 6.6, frames: [1], mode: 'changed' },
  { name: 'null-tail', base: 'null-sit', file: 'grandes/reposo/mover_cola.jpg', pitch: 4.4, frames: [1, 2, 3], mode: 'added' },
  { name: 'null-scratch', base: 'null-sit', file: 'grandes/reposo/rascar_oreja.jpg', pitch: 5.6, frames: [1, 2, 3], mode: 'changed' },
  // Yeray's, drawn from his in-game still drawing (2026-11-20). The first sheets (gafas.jpg,
  // cafe.jpg, pensar.jpg) redrew him 42–45 % differently and are not used.
  { name: 'yeray-glasses', base: 'yeray-front', file: 'grandes/reposo/gafas_new.jpg', pitch: 5.2, frames: [1, 2, 3], mode: 'changed', skin: true, redrawn: 1, region: 2, face: YERAY_FACE, together: true },
  { name: 'yeray-coffee', base: 'yeray-front', file: 'grandes/reposo/cafe_new.jpg', pitch: 5.2, frames: [1, 2, 3, 4], mode: 'changed', skin: true, redrawn: 1, region: 2, face: YERAY_FACE, together: true },
  { name: 'yeray-think', base: 'yeray-front', file: 'grandes/reposo/pensar_new.jpg', pitch: 5.2, frames: [1, 2, 3], mode: 'changed', skin: true, redrawn: 1, region: 2, face: YERAY_FACE, together: true },
];
// How well a sheet must fit the in-game drawing:
//   figure: share of different pixels between the sheet's first frame and the drawing. A redrawn
//     figure (the first sheets: 42–45 %) is stopped here. 'added' only takes what sticks out (a
//     tail), so the body may differ more (mover_cola.jpg draws Null 4 % smaller).
//   seam: share of the drawing's pixels around what is laid over it that differ from the sheet
//     (idle.mjs). Above it, a cut would show where the pasted pixels meet the drawing.
const FIT = {
  changed: { figure: 0.12, seam: 0.06 },
  added: { figure: 0.25, seam: Infinity },
};
const sameColour = (a, b) => (a && b ? a[0] === b[0] && a[1] === b[1] && a[2] === b[2] : !a && !b);

for (const idle of IDLES) {
  const still = stills.get(idle.base);
  const { images, checks, firstVsBase, side, up } = buildIdle(idle, still.grid);
  let grids = images.map((grid, i) => (i === 0 ? grid : removeIslands(grid)));
  if (idle.skin) grids = retone(idle.name, grids, SKIN_MAX_ROW + up, still.ramp);
  const height = grids[0].length;
  writePng(join(OUT_DIR, `${idle.name}.png`), grids.flat());
  const ground = still.ground + up;
  grids.forEach((grid, i) => entries.push({ name: `${idle.name}-${i}`, file: idle.name, width: grid[0].length, height, ground, y: i * height, top: firstRow(grid) }));
  console.log(`${idle.name}.png  ${grids[0][0].length}×${height * grids.length}  (${grids.length} images, ${idle.file}, on ${idle.base})`);

  const fit = FIT[idle.mode];
  // Image 0 is the in-game still drawing, pixel for pixel (skin tone included): no jump at the
  // start or the end of the action.
  const same = still.final.every((row, y) => row.every((c, x) => sameColour(c, grids[0][y + up][x + side])));
  console.log(`  check ${idle.name}: ${same ? '✓' : '✗'} starts from ${idle.base} exactly, as the game shows it`);
  if (!same) failures.push(`${idle.name} still`);
  const fits = firstVsBase <= fit.figure;
  console.log(`  check ${idle.name}: ${fits ? '✓' : '✗'} its first frame differs from ${idle.base} in ${(firstVsBase * 100).toFixed(1)} % of the pixels (max ${fit.figure * 100} %)`);
  if (!fits) failures.push(idle.name);
  for (const c of checks) {
    const problems = [
      c.pasted === 0 && 'nothing changed',
      c.seam > fit.seam && `its seam differs from ${idle.base} in ${(c.seam * 100).toFixed(1)} % (max ${fit.seam * 100} %)`,
    ].filter(Boolean);
    const seam = fit.seam === Infinity ? '' : `, seam ${(c.seam * 100).toFixed(1)} %`;
    console.log(`  check ${idle.name}, sheet frame ${c.frame}: ${problems.length ? '✗ ' + problems.join('; ') : `✓ ${c.pasted} px laid over ${idle.base}${seam}, ${c.dropped} px of noise left out`}`);
    if (problems.length) failures.push(`${idle.name} frame ${c.frame}`);
  }
}

const id = (name) => name.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const files = [...new Set(entries.map((e) => e.file))];
const ts = [
  '// GENERATED by scripts/sprites/cutout.mjs — do not edit by hand.',
  '// Option A: the reference images on their native pixel grid. Sizes are in image pixels:',
  '// ground = the row the feet stand on (the scene anchors each sprite there); y = the row where the',
  '// image starts inside its png (walk sheets stack several images in one png); top = its first',
  '// visible row (the HUD frames Yeray\'s face from there).',
  ...files.map((f) => `import ${id(f)} from './${f}.png';`),
  '',
  'export type CharacterImage = { src: string; width: number; height: number; ground: number; y: number; top: number };',
  '',
  'export const CHARACTER_IMAGES = {',
  ...entries.map((e) => `  '${e.name}': { src: ${id(e.file)}, width: ${e.width}, height: ${e.height}, ground: ${e.ground}, y: ${e.y}, top: ${e.top} },`),
  '} satisfies Record<string, CharacterImage>;',
  '',
].join('\n');
writeFileSync(join(OUT_DIR, 'characters.gen.ts'), ts);
console.log(`→ src/assets/characters/ (${entries.length} images) + characters.gen.ts`);
if (failures.length) {
  console.error(`✗ ${failures.length} image(s) failed their checks: ${failures.join(', ')}`);
  process.exit(1);
}
