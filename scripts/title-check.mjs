// Phase-5 check of the title screen: screenshots in both languages at the three sizes, and how it
// starts (key, click, tap → the intro; SKIP INTRO → the camp), what must NOT start it (Tab, the language buttons), the
// dithered transition, the camp preloading, links that skip the title and reduced motion.
// Usage: npm run check:title -- [url]   (default http://localhost:5173/)
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const url = (process.argv[2] ?? 'http://localhost:5173/').replace(/#.*$/, '');
const OUT = '.screenshots/fase-5';
const SIZES = [
  { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
];
const desktop = SIZES[2];

let failures = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? `  (${detail})` : ''}`);
};

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const open = async (lang, size, hash = '', extra = {}) => {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.deviceScaleFactor,
    isMobile: size.isMobile,
    hasTouch: size.hasTouch,
    locale: lang === 'es' ? 'es-ES' : 'en-US',
    ...extra,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.goto(`${url}${hash}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { context, page, errors };
};
const onTitle = (page) => page.getByRole('heading', { level: 1, name: 'YERAY CATURLA', exact: true }).isVisible();
const inCamp = async (page) => (await page.getByRole('menu').count()) === 1;
// Starting plays the cave intro (phase 6); SKIP INTRO goes straight to the camp.
const inIntro = async (page) => (await page.locator('[data-scene="intro"]').count()) === 1;
const press = (page) => page.getByRole('button', { name: 'PRESS START' });

// ---------- Screenshots (with PRESS START lit) ----------
let shotErrors = 0;
for (const lang of ['es', 'en']) {
  for (const size of SIZES) {
    const { context, page, errors } = await open(lang, size);
    await page.waitForFunction(() => {
      const button = [...document.querySelectorAll('button')].find((b) => b.textContent === 'PRESS START');
      return button && getComputedStyle(button).visibility === 'visible';
    });
    // `animations: 'disabled'` freezes the blink at its first (lit) frame for the picture.
    await page.screenshot({ path: `${OUT}/titulo-${lang}-${size.width}.png`, animations: 'disabled' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (overflow) check(`no horizontal overflow at ${size.width} (${lang})`, false);
    shotErrors += errors.length;
    await context.close();
  }
}
check('6 title screens rendered without console errors', shotErrors === 0, `${shotErrors}`);

// ---------- Keyboard ----------
{
  const { context, page, errors } = await open('es', desktop);
  check('the title is real text (h1 "YERAY CATURLA")', await onTitle(page));
  check('Spanish browser: Spanish credits', (await page.locator('main p').first().innerText()).startsWith('DESARROLLADOR BACKEND'));
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  check('the first Tab stop is the CV link (VER CV), and it does not start', (await onTitle(page)) && (await page.evaluate(() => document.activeElement?.textContent)) === 'VER CV');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  check('Tab moves to the language buttons without starting', (await onTitle(page)) && (await page.evaluate(() => document.activeElement?.textContent))?.startsWith('ES'));
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  check('Enter on EN switches the language and does not start', (await onTitle(page)) && (await page.evaluate(() => document.documentElement.lang)) === 'en');
  check('…the credits are now in English', (await page.locator('main p').first().innerText()).startsWith('BACKEND DEVELOPER'));
  // Watch the transition's darkness steps.
  await page.evaluate(() => {
    window.__steps = new Set();
    const watch = () => {
      const cover = document.querySelector('[data-darkness]');
      if (cover) window.__steps.add(cover.getAttribute('data-darkness'));
      requestAnimationFrame(watch);
    };
    watch();
  });
  await page.keyboard.press('a');
  await page.waitForTimeout(1200);
  const steps = await page.evaluate(() => [...window.__steps].sort().join(','));
  check('any other key starts (the intro plays)', !(await onTitle(page)) && (await inIntro(page)));
  check('the transition darkens in dithered steps and clears again', steps === '0,1,2,3,4', steps);
  check('the cover is gone afterwards', (await page.locator('[data-darkness]').count()) === 0);
  check('no console errors', errors.length === 0, errors.join(' | '));
  await context.close();
}

// ---------- Mouse, SKIP INTRO, touch ----------
{
  const { context, page } = await open('es', desktop);
  await page.mouse.click(60, 450); // the sky, away from every control
  await page.waitForTimeout(1200);
  check('a click anywhere starts', await inIntro(page));
  await context.close();
}
{
  const { context, page } = await open('es', desktop);
  await page.getByRole('button', { name: 'SKIP INTRO' }).click();
  await page.waitForTimeout(1200);
  check('SKIP INTRO goes straight to the camp', (await inCamp(page)) && !(await inIntro(page)));
  await context.close();
}
{
  const { context, page } = await open('es', SIZES[0]);
  await press(page).tap();
  await page.waitForTimeout(1200);
  check('a tap on PRESS START starts (phone)', await inIntro(page));
  await context.close();
}

// ---------- The camp downloads while the title is on screen ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES' });
  const page = await context.newPage();
  const images = [];
  page.on('request', (request) => request.resourceType() === 'image' && images.push(request.url()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  check('the camp image and characters download during the title', images.some((u) => /camp/.test(u)) && images.some((u) => /yeray-front-walk/.test(u)));
  await context.close();
}

// ---------- Links skip the title; reduced motion ----------
{
  const { context, page } = await open('es', desktop, '#comms');
  check('a window link (/#comms) skips the title', !(await onTitle(page)) && (await page.getByRole('dialog').count()) === 1);
  await context.close();
}
{
  const { context, page } = await open('es', desktop, '', { reducedMotion: 'reduce' });
  const animation = await press(page).evaluate((b) => getComputedStyle(b).animationName);
  check('reduced motion: PRESS START does not blink', animation === 'none', animation);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);
  check('reduced motion: the camp appears at once, without the intro', (await inCamp(page)) && !(await inIntro(page)));
  await context.close();
}

await browser.close();
console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
