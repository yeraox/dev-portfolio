// What the browser checks share (check:*, shots, fps): the three agreed screen sizes, the address
// under test, the ✓/✗ tally and a fresh browser page with the errors it logs.
export { chromium } from 'playwright';

// The three agreed sizes. Phone and tablet are emulated as touch devices, like the real thing (no
// hover, coarse pointer).
export const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
export const TABLET = { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
export const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false };
export const SIZES = [PHONE, TABLET, DESKTOP];

/** The address to test: the command's first argument (without any #hash), or `fallback`. */
export function siteUrl(fallback = 'http://localhost:5173/') {
  return (process.argv[2] ?? fallback).replace(/#.*$/, '');
}

/** `check` prints ✓ or ✗ for one check; `done` prints the total and ends the process (exit code 1
 *  if anything failed). */
export function createChecks() {
  let failures = 0;
  const check = (name, ok, detail = '') => {
    if (!ok) failures++;
    console.log(`${ok ? '✓' : '✗'} ${name}${detail ? `  (${detail})` : ''}`);
  };
  const done = () => {
    console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
    process.exit(failures === 0 ? 0 : 1);
  };
  return { check, done };
}

/** A fresh browser context at one of the SIZES, in Spanish or English, with its page and the
 *  errors the page logs. `extra`: more context options (reducedMotion…). */
export async function newPage(browser, size, lang = 'es', extra = {}) {
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
  return { context, page, errors };
}
