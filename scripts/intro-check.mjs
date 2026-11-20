// Check of the cave intro: screenshots while Yeray and Null walk out of the cave, how long
// it lasts, SKIP INTRO at any moment (button, key, click, tap), the camp afterwards (ring, banner,
// HUD, focus, nothing moving), returning visitors, /#title, reduced motion and the pause when the
// tab is hidden.
// Usage: npm run check:intro -- [url]   (default http://localhost:5173/)
import { mkdirSync } from 'node:fs';
import { DESKTOP, PHONE, SIZES, chromium, createChecks, newPage, siteUrl } from './lib/browser.mjs';

const url = siteUrl();
const OUT = '.screenshots/fase-6';
const { check, done } = createChecks();

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
/** A fresh page at `size` (in Spanish), not loaded yet. */
const open = (size, extra = {}) => newPage(browser, size, 'es', extra);
const goto = async (page, hash = '') => {
  await page.goto(`${url}${hash}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
};
const inIntro = async (page) => (await page.locator('[data-scene="intro"]').count()) === 1;
const inCamp = async (page) => (await page.getByRole('menu').count()) === 1;
const onTitle = (page) => page.getByRole('heading', { level: 1, name: 'YERAY CATURLA', exact: true }).isVisible();
/** Press a key on the title and wait until the intro scene is on screen. */
const startIntro = async (page) => {
  await page.keyboard.press('a');
  await page.waitForSelector('[data-scene="intro"]');
};

// ---------- Screenshots: walking out of the cave, then the camp ----------
let shotErrors = 0;
for (const size of SIZES) {
  const { context, page, errors } = await open(size);
  await goto(page);
  const box = async () => page.locator('[data-scene] > div').nth(size.width === 1440 ? 0 : 1).boundingBox();
  await startIntro(page);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}/intro-${size.width}.png` });
  const stageDuring = await box();
  await page.getByRole('menu').waitFor({ timeout: 8000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/campamento-tras-intro-${size.width}.png` });
  const stageAfter = await box();
  check(
    `nothing moves when the banner and HUD appear (${size.width})`,
    JSON.stringify(stageDuring) === JSON.stringify(stageAfter),
    `${JSON.stringify(stageDuring)} → ${JSON.stringify(stageAfter)}`,
  );
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) check(`no horizontal overflow at ${size.width}`, false);
  shotErrors += errors.length;
  await context.close();
}
check('intro rendered at 3 sizes without console errors', shotErrors === 0, `${shotErrors}`);

// ---------- Length, what shows during and after ----------
{
  const { context, page, errors } = await open(DESKTOP);
  await goto(page);
  await startIntro(page);
  const started = Date.now();
  const skip = page.getByRole('button', { name: 'SKIP INTRO' });
  check('SKIP INTRO is visible from the intro’s first frame', await skip.isVisible());
  check('no menu, banner or HUD during the intro', !(await inCamp(page)) && !(await page.getByText('Yeray', { exact: true }).isVisible()));
  await page.getByRole('menu').waitFor({ timeout: 8000 });
  const length = Date.now() - started;
  check('the intro lasts 4–6 s', length >= 4000 && length <= 6000, `${(length / 1000).toFixed(2)} s`);
  await page.waitForTimeout(400);
  check('then the ring, the banner and the HUD are there, and SKIP INTRO is gone', (await page.getByRole('menuitem').count()) >= 4 && (await page.getByText('Yeray', { exact: true }).isVisible()) && (await skip.count()) === 0);
  check('the focus lands on the ring’s active slot', await page.evaluate(() => document.activeElement?.getAttribute('data-active') === 'true'));
  const activeLabel = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  const before = await activeLabel();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  check('the ring answers the keyboard right away', (await activeLabel()) !== before, `${before} → ${await activeLabel()}`);
  check('no console errors', errors.length === 0, errors.join(' | '));
  await context.close();
}

// ---------- SKIP at any moment ----------
for (const [label, at, how] of [
  ['SKIP INTRO while it is still fading in', 100, 'button'],
  ['SKIP INTRO halfway', 1800, 'button'],
  // The intro scene lasts ~4.5 s: 3.7 s leaves room for a busy machine (4.1 s sometimes missed it).
  ['SKIP INTRO at the very end', 3700, 'button'],
  ['Escape skips', 1500, 'escape'],
  ['any key skips', 1500, 'key'],
  ['a click on the scene skips', 1500, 'click'],
]) {
  const { context, page } = await open(DESKTOP);
  await goto(page);
  await startIntro(page);
  await page.waitForTimeout(at);
  // A short timeout: if the button is already gone, this check fails instead of the whole script.
  if (how === 'button') await page.getByRole('button', { name: 'SKIP INTRO' }).click({ timeout: 2000 }).catch(() => {});
  if (how === 'escape') await page.keyboard.press('Escape');
  if (how === 'key') await page.keyboard.press('x');
  if (how === 'click') await page.mouse.click(400, 600);
  await page.waitForTimeout(700); // the fade (if any) and the ring opening
  check(label, (await inCamp(page)) && !(await inIntro(page)));
  await context.close();
}
{
  const { context, page } = await open(PHONE);
  await goto(page);
  await page.getByRole('button', { name: 'PRESS START' }).tap();
  await page.waitForSelector('[data-scene="intro"]');
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'SKIP INTRO' }).tap();
  await page.waitForTimeout(700);
  check('a tap on SKIP INTRO skips (phone)', await inCamp(page));
  await context.close();
}

// ---------- Returning visitors and /#title ----------
{
  const { context, page } = await open(DESKTOP);
  await goto(page);
  await page.getByRole('button', { name: 'SKIP INTRO' }).click(); // the title's: straight to the camp
  await page.getByRole('menu').waitFor();
  // The visit counts once the camp is fully on screen (the ring is already there during the fade).
  await page.waitForFunction(() => !document.querySelector('[data-darkness]'));
  check('SKIP INTRO on the title goes to the camp without an intro', !(await inIntro(page)));
  await goto(page);
  check('the second visit opens straight in the camp', (await inCamp(page)) && !(await onTitle(page)));
  await goto(page, '#title');
  await page.reload({ waitUntil: 'networkidle' }); // only the #part changed: the page needs a reload, like in a browser
  check('/#title shows the title again', await onTitle(page));
  await context.close();
}

// ---------- Straight into the camp: the intro's drawings are not downloaded ----------
{
  const { context, page } = await open(DESKTOP);
  const images = [];
  page.on('request', (request) => request.resourceType() === 'image' && images.push(request.url()));
  await goto(page, '#camp');
  await page.waitForTimeout(500);
  check('a link to the camp downloads no walking drawings of Null', !images.some((u) => /null-(front|side)/.test(u)), images.filter((u) => /null-/.test(u)).join(' '));
  await context.close();
}

// ---------- Reduced motion: no walk ----------
{
  const { context, page } = await open(DESKTOP, { reducedMotion: 'reduce' });
  await goto(page);
  await page.evaluate(() => {
    window.__sawIntro = false;
    new MutationObserver(() => {
      if (document.querySelector('[data-scene="intro"]')) window.__sawIntro = true;
    }).observe(document.body, { subtree: true, childList: true, attributes: true });
  });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  check('reduced motion: PRESS START goes straight to the camp, no walk', (await inCamp(page)) && !(await page.evaluate(() => window.__sawIntro)));
  await context.close();
}

// ---------- A hidden tab pauses the intro ----------
{
  const { context, page } = await open(DESKTOP);
  await goto(page);
  await startIntro(page);
  const started = Date.now();
  await page.waitForTimeout(1000);
  const setHidden = (hidden) =>
    page.evaluate((value) => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => value });
      document.dispatchEvent(new Event('visibilitychange'));
    }, hidden);
  await setHidden(true);
  await page.waitForTimeout(2500);
  await setHidden(false);
  await page.getByRole('menu').waitFor({ timeout: 10000 });
  const length = Date.now() - started;
  check('switching tabs pauses the intro (it ends ~2.5 s later)', length >= 6500, `${(length / 1000).toFixed(2)} s`);
  await context.close();
}

await browser.close();
done();
