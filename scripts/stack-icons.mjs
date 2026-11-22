// The STACK window's technology icons (Yeray's choice). Brand logos come from
// Simple Icons (CC0, the `simple-icons` dev dependency): each SVG is drawn 8 times bigger in a
// browser canvas and reduced to a 16×16 grid with no smoothing — a pixel is on when the logo covers
// at least half of it (a few logos read better with another share, noted below) — in one palette colour (`text`). Technologies without a logo there (SQL,
// REST APIs, and Java, Oracle, AWS and WSL, whose owners had them removed) get a generic pixel icon
// drawn here. All icons go into ONE png (an atlas), so the window downloads a single small file.
//
//   npm run stack-icons   → src/assets/stack/stack-icons.png + stack-icons.gen.ts
//   Exits with an error when an icon fails its checks. The site never depends on Simple Icons.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const SIZE = 16; // icon pixels a side
const SUPER = 8; // drawn 8× bigger first, then each 8×8 block becomes one pixel
const OUT_DIR = 'src/assets/stack';

// The colour: `text` in the UI palette (src/styles/palette.ts, the single source of truth).
const palette = readFileSync('src/styles/palette.ts', 'utf8');
const hex = palette.match(/^\s*text: '#([0-9a-f]{6})'/m)?.[1];
if (!hex) throw new Error('palette: `text` not found');
const COLOUR = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));

// Generic icons, 16×16 ('#' = on). Drawn here because there is no logo to use.
const GENERIC = {
  // SQL: a table with a header row.
  sql: [
    '................',
    '................',
    '.##############.',
    '.##############.',
    '.##############.',
    '.#.....#......#.',
    '.#.....#......#.',
    '.##############.',
    '.#.....#......#.',
    '.#.....#......#.',
    '.##############.',
    '.#.....#......#.',
    '.#.....#......#.',
    '.##############.',
    '................',
    '................',
  ],
  // REST APIs: a request and its answer.
  rest: [
    '................',
    '.........#......',
    '.........##.....',
    '.###########....',
    '.############...',
    '.###########....',
    '.........##.....',
    '.........#......',
    '......#.........',
    '.....##.........',
    '....###########.',
    '...############.',
    '....###########.',
    '.....##.........',
    '......#.........',
    '................',
  ],
  // Java: a steaming cup of coffee.
  java: [
    '................',
    '.....#...#......',
    '....#...#.......',
    '.....#...#......',
    '....#...#.......',
    '................',
    '..#########.....',
    '..#########.##..',
    '..#########..#..',
    '..#########..#..',
    '..#########.##..',
    '...#######......',
    '....#####.......',
    '.############...',
    '..##########....',
    '................',
  ],
  // AWS: a cloud.
  aws: [
    '................',
    '................',
    '................',
    '........###.....',
    '......#######...',
    '..###.########..',
    '.##############.',
    '################',
    '################',
    '################',
    '.##############.',
    '................',
    '................',
    '................',
    '................',
    '................',
  ],
  // WSL: a terminal window with its prompt.
  wsl: [
    '................',
    '................',
    '.##############.',
    '.##############.',
    '.#............#.',
    '.#.#..........#.',
    '.#..#.........#.',
    '.#...#........#.',
    '.#..#.........#.',
    '.#.#...####...#.',
    '.#............#.',
    '.##############.',
    '................',
    '................',
    '................',
    '................',
  ],
  // Oracle Database: a database (stacked discs).
  oracle: [
    '................',
    '...##########...',
    '..############..',
    '..############..',
    '...##########...',
    '................',
    '...##########...',
    '..############..',
    '..############..',
    '...##########...',
    '................',
    '...##########...',
    '..############..',
    '..############..',
    '...##########...',
    '................',
  ],
};

// The atlas order: TechId → a Simple Icons slug or a generic icon above.
const ICONS = [
  ['javascript', 'javascript'],
  ['java', null],
  ['python', 'python', 0.65], // a higher threshold opens the gap between the two snakes
  ['sql', null],
  ['nodejs', 'nodedotjs'],
  ['express', 'express'],
  ['rest', null],
  ['react', 'react'],
  ['postgresql', 'postgresql', 0.25], // a lower one keeps the elephant's thin outline
  ['docker', 'docker'],
  ['aws', null],
  ['linux', 'linux', 0.35], // the penguin's outline, without loose dots
  ['wsl', null],
  ['git', 'git'],
  ['github', 'github'],
  ['php', 'php'],
  ['typescript', 'typescript'],
  ['django', 'django'],
  ['html', 'html5'],
  ['css', 'css'],
  ['oracle', null],
  ['mongodb', 'mongodb'],
  ['terraform', 'terraform'],
];

// Simple Icons: every icon object has a `slug` and a 24×24 `path`.
const simpleIcons = createRequire(import.meta.url)('simple-icons');
const bySlug = new Map(Object.values(simpleIcons).filter((icon) => icon?.slug).map((icon) => [icon.slug, icon]));

// How much of a pixel the logo must cover to light it (some logos read better a bit off ½).
const THRESHOLD = 0.5;

// Logos → 16×16 on/off grids, in a real browser canvas.
const browser = await chromium.launch();
const page = await browser.newPage();
const logos = await page.evaluate(
  ({ logos, size, superSample }) =>
    logos.map(({ d, threshold }) => {
      const big = size * superSample;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = big;
      const ctx = canvas.getContext('2d');
      ctx.scale(big / 24, big / 24);
      ctx.fill(new Path2D(d));
      const alpha = ctx.getImageData(0, 0, big, big).data;
      const rows = [];
      for (let y = 0; y < size; y++) {
        let row = '';
        for (let x = 0; x < size; x++) {
          let sum = 0;
          for (let dy = 0; dy < superSample; dy++) for (let dx = 0; dx < superSample; dx++) {
            sum += alpha[(((y * superSample + dy) * big) + x * superSample + dx) * 4 + 3];
          }
          row += sum / (superSample * superSample * 255) >= threshold ? '#' : '.';
        }
        rows.push(row);
      }
      return rows;
    }),
  {
    logos: ICONS.filter(([, slug]) => slug).map(([, slug, threshold]) => ({ d: bySlug.get(slug)?.path ?? '', threshold: threshold ?? THRESHOLD })),
    size: SIZE,
    superSample: SUPER,
  },
);
await browser.close();

const failures = [];
let logoIndex = 0;
const grids = ICONS.map(([id, slug]) => {
  if (!slug) return { id, rows: GENERIC[id], source: 'generic (drawn here)' };
  const icon = bySlug.get(slug);
  if (!icon) failures.push(`${id}: "${slug}" is not in simple-icons`);
  return { id, rows: logos[logoIndex++], source: `Simple Icons: ${icon?.title ?? slug}` };
});

// Checks: 16×16, and enough pixels to read (the reduction did not erase the logo).
for (const { id, rows, source } of grids) {
  const on = rows.join('').split('#').length - 1;
  const ok = rows.length === SIZE && rows.every((row) => row.length === SIZE) && on >= 20;
  console.log(`${ok ? '✓' : '✗'} ${id.padEnd(11)} ${String(on).padStart(3)} px  ${source}`);
  if (!ok) failures.push(id);
}

// The atlas: one row of 16×16 icons, transparent around them.
const width = SIZE * grids.length;
const rgba = Buffer.alloc(width * SIZE * 4);
grids.forEach(({ rows }, i) => rows.forEach((row, y) => [...row].forEach((cell, x) => {
  if (cell !== '#') return;
  const at = (y * width + i * SIZE + x) * 4;
  rgba[at] = COLOUR[0]; rgba[at + 1] = COLOUR[1]; rgba[at + 2] = COLOUR[2]; rgba[at + 3] = 255;
})));
mkdirSync(OUT_DIR, { recursive: true });
const raw = `${OUT_DIR}/stack-icons.rgba`;
writeFileSync(raw, rgba);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${width}x${SIZE}`, '-i', raw, '-pix_fmt', 'rgba', `${OUT_DIR}/stack-icons.png`]);
rmSync(raw);

writeFileSync(`${OUT_DIR}/stack-icons.gen.ts`, [
  '// GENERATED by scripts/stack-icons.mjs — do not edit by hand.',
  '// The STACK window\'s icons: one row of 16×16 icons in one png; each number is its place in it.',
  "import type { TechId } from '../../content/types';",
  "import atlas from './stack-icons.png';",
  '',
  `export const STACK_ATLAS = { src: atlas, size: ${SIZE}, count: ${grids.length} };`,
  '',
  '// TS concept — `satisfies Record<TechId, number>`: every technology must have its icon; a new',
  '// TechId without one is a compile error here.',
  'export const STACK_ICONS = {',
  ...grids.map(({ id }, i) => `  ${id}: ${i},`),
  '} satisfies Record<TechId, number>;',
  '',
].join('\n'));
console.log(`→ ${OUT_DIR}/stack-icons.png (${grids.length} icons) + stack-icons.gen.ts`);
if (failures.length) {
  console.error(`✗ ${failures.join(', ')}`);
  process.exit(1);
}
