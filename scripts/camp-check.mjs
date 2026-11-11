// Phase-3 walkthrough of the camp, the way a visitor uses it: keyboard only on a laptop and touch
// only on a phone. Prints ✓/✗ per check and saves screenshots in .screenshots/ (git-ignored).
// Usage: npm run check:camp -- [url]   (default http://localhost:5173/)
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:5173/';
let failures = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? `  (${detail})` : ''}`);
};

mkdirSync('.screenshots', { recursive: true });
const browser = await chromium.launch();
const activeLabel = (page) => page.locator('[role="menuitem"][data-active="true"]').getAttribute('aria-label');
const focusIsActiveItem = (page) =>
  page.evaluate(() => document.activeElement?.getAttribute('data-active') === 'true');

// ---------- Keyboard only (1440×900) ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.goto(url, { waitUntil: 'networkidle' });

  const count = await page.getByRole('menuitem').count();
  check('the ring shows 4–6 sections', count >= 4 && count <= 6, `${count}`);
  check('the menu has an accessible name', (await page.getByRole('menu').getAttribute('aria-label')) !== null);

  const first = await activeLabel(page);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  const second = await activeLabel(page);
  check('→ brings the next section to the top', second !== first, `${first} → ${second}`);
  check('focus follows the section at the top', await focusIsActiveItem(page));
  const expectedTitle = second?.split(': ')[1] ?? '—';
  check('the banner names the active section', await page.getByText(expectedTitle, { exact: true }).isVisible(), expectedTitle);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(250);
  check('← turns back', (await activeLabel(page)) === first);
  await page.screenshot({ path: '.screenshots/camp-check-ring-1440.png' });

  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const dialog = page.getByRole('dialog');
  check('Enter opens the section window', await dialog.isVisible());
  const title = await dialog.getByRole('heading').textContent();
  check('the window is named after its section', first?.endsWith(title ?? '—') ?? false, title ?? '');
  await page.screenshot({ path: '.screenshots/camp-check-window-1440.png' });

  let trapped = true;
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    trapped &&= await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')));
  }
  check('Tab stays inside the open window', trapped);
  await page.keyboard.press('ArrowRight'); // must not turn the ring behind the window
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check('Esc closes the window', (await dialog.count()) === 0);
  check('the ring did not move while the window was open', (await activeLabel(page)) === first);
  check('focus goes back to the ring', await focusIsActiveItem(page));

  check('no console errors', errors.length === 0, errors.join(' | '));
  await page.close();
}

// ---------- Touch only (phone 390×844) ----------
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const before = await activeLabel(page);

  const box = await page.locator('main canvas').first().boundingBox();
  const cdp = await context.newCDPSession(page);
  const y = box.y + box.height * 0.85;
  const touch = (type, x) =>
    cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  await touch('touchStart', box.x + box.width * 0.75);
  for (let step = 1; step <= 6; step++) await touch('touchMove', box.x + box.width * (0.75 - step * 0.08));
  await touch('touchEnd');
  await page.waitForTimeout(300);
  const after = await activeLabel(page);
  check('a swipe to the left turns the ring', after !== before, `${before} → ${after}`);
  check('the swipe did not open a window', (await page.getByRole('dialog').count()) === 0);

  const target = page.locator('[role="menuitem"]:not([data-active="true"])').first();
  const tapped = await target.getAttribute('aria-label');
  await target.tap();
  await page.waitForTimeout(450);
  const dialog = page.getByRole('dialog');
  check('tapping a section opens it', await dialog.isVisible(), tapped ?? '');
  await page.screenshot({ path: '.screenshots/camp-check-window-390.png' });
  await dialog.getByRole('button').tap();
  await page.waitForTimeout(450);
  check('the close button closes it', (await dialog.count()) === 0);
  check('the tapped section is now at the top', (await activeLabel(page)) === tapped);
  await context.close();
}

await browser.close();
console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
