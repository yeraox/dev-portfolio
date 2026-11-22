// Review screenshots at the three agreed viewport sizes.
// Usage: npm run shots -- <url> <name>
//   e.g. npm run shots -- http://localhost:5173/dev/personajes personajes
// Output: .screenshots/<name>-<width>.png (git-ignored)
import { mkdirSync } from 'node:fs';
import { SIZES, chromium } from './lib/browser.mjs';

const [url, name = 'page'] = process.argv.slice(2);
if (!url) {
  console.error('Usage: npm run shots -- <url> <name>');
  process.exit(1);
}

mkdirSync('.screenshots', { recursive: true });
const browser = await chromium.launch();
for (const { width, height, deviceScaleFactor, isMobile, hasTouch } of SIZES) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor, isMobile, hasTouch });
  const errors = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  const file = `.screenshots/${name}-${width}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(
    `${file}  horizontal-overflow=${overflow}  console-errors=${errors.length}` +
      (errors.length ? `\n  ${errors.join('\n  ')}` : ''),
  );
  await page.close();
}
await browser.close();
