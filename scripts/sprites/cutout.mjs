// Option A: Yeray's big references used AS THEY ARE. Each figure is rebuilt on its native pixel
// grid (one pixel per pseudo-pixel the image was drawn with, original colours, JPEG noise and
// background removed) and saved as a tiny transparent PNG, shown later scaled by a whole number
// with `image-rendering: pixelated` — it looks exactly like the reference, at a few KB.
// Walk cycles come from his walk sheets through the "sello" (walk.mjs, docs/animacion-caminar.md).
//
//   node scripts/sprites/cutout.mjs   → src/assets/characters/*.png + characters.gen.ts
//   Exits with an error when a walk image fails its quality checks.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, backgroundMask, detectPitch, figures, loadImage, nativeGrid, peelLightFringe, removeIslands } from './lib.mjs';
import { buildWalk } from './walk.mjs';

const OUT_DIR = join(ROOT, 'src/assets/characters');

// Single images. name → reference (paths relative to references/). `pitch` = the image's pixel
// size when the automatic detection gets it wrong; `pick` = which figures of a multi-figure sheet
// to keep.
const IMAGES = [
  { name: 'yeray-arms', file: 'grandes/brazos_cruzados_yeray.jpg', pitch: 11.6 },
  { name: 'yeray-portrait', file: 'grandes/retrato_yeray.jpg', pitch: 11.65, crop: [0, 0, 752, 1190] },
  { name: 'null-sit', file: 'grandes/null.jpg', pitch: 10.75 },
  { name: 'null-side', file: 'grandes/null_caminando.jpg' },
  { name: 'null-front', file: 'grandes/null_frente.jpg', pick: [0, 1, 2] },
  { name: 'null-portrait', file: 'null-concept.png', crop: [800, 520, 1020, 750] },
];

// Walk sheets (see buildWalk in walk.mjs). Frames are numbered from 0, left to right. `head` and
// `waist` are rows/columns of the reference frame's native grid, read from its material map.
// Each image is one drawing at one bob height; the 8-frame cycles reuse them (characters.ts).
// All images of a walk go into ONE png, stacked top to bottom (`sheet`): the identical head
// compresses almost for free (43 KB instead of 108 KB) and no frame waits for its own download.
const WALKS = [
  {
    sheet: 'yeray-front-walk',
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
];

function writePng(path, grid) {
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

// Remove only what this script makes: characters.ts and characters.test.ts live here too.
mkdirSync(OUT_DIR, { recursive: true });
for (const f of readdirSync(OUT_DIR)) if (f.endsWith('.png') || f === 'characters.gen.ts') rmSync(join(OUT_DIR, f));
// entry = one named image: which png it lives in, its size, the row its feet stand on and the
// row where it starts inside the png (y > 0 only in walk sheets).
const entries = [];
const save = (name, grid, ground, note) => {
  writePng(join(OUT_DIR, `${name}.png`), grid);
  entries.push({ name, file: name, width: grid[0].length, height: grid.length, ground, y: 0 });
  console.log(`${name}.png  ${grid[0].length}×${grid.length}  ${note}`);
};

for (const image of IMAGES) {
  const img = loadImage(image.file);
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
const failures = [];
for (const walk of WALKS) {
  const { images, ground, checks } = buildWalk(walk);
  const height = images[0].grid.length;
  writePng(join(OUT_DIR, `${walk.sheet}.png`), images.flatMap(({ grid }) => grid));
  images.forEach(({ name, grid }, i) => entries.push({ name, file: walk.sheet, width: grid[0].length, height, ground, y: i * height }));
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

const id = (name) => name.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const files = [...new Set(entries.map((e) => e.file))];
const ts = [
  '// GENERATED by scripts/sprites/cutout.mjs — do not edit by hand.',
  '// Option A: the reference images on their native pixel grid. Sizes are in image pixels:',
  '// ground = the row the feet stand on (the scene anchors each sprite there); y = the row where the',
  '// image starts inside its png (walk sheets stack several images in one png).',
  ...files.map((f) => `import ${id(f)} from './${f}.png';`),
  '',
  'export type CharacterImage = { src: string; width: number; height: number; ground: number; y: number };',
  '',
  'export const CHARACTER_IMAGES = {',
  ...entries.map((e) => `  '${e.name}': { src: ${id(e.file)}, width: ${e.width}, height: ${e.height}, ground: ${e.ground}, y: ${e.y} },`),
  '} satisfies Record<string, CharacterImage>;',
  '',
].join('\n');
writeFileSync(join(OUT_DIR, 'characters.gen.ts'), ts);
console.log(`→ src/assets/characters/ (${entries.length} images) + characters.gen.ts`);
if (failures.length) {
  console.error(`✗ ${failures.length} walk image(s) failed their checks: ${failures.join(', ')}`);
  process.exit(1);
}
