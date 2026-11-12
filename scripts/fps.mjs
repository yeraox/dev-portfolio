// Frame-rate and response check (performance budget, docs/plan-de-fases.md): counts real screen
// refreshes while the ring turns non-stop, at normal CPU speed and with the CPU slowed down 4× (a
// modest phone), and times how long the page takes to answer keys and clicks (the INP idea).
// Budget: 60 fps normally, ≥ 30 fps steady at 4×, answers in < 200 ms.
// Usage: npm run fps -- [url]   (best against the production build: npm run build && npx vite preview)
import { chromium } from 'playwright';

// The title screen comes first; any #hash skips it and goes straight to the camp.
const url = `${(process.argv[2] ?? 'http://localhost:4173/').replace(/#.*$/, '')}#camp`;
const SECONDS = 5;

const browser = await chromium.launch();
for (const cpu of [1, 4]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const cdp = await page.context().newCDPSession(page);
  await page.goto(url, { waitUntil: 'networkidle' });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });

  // Turn the ring every 150 ms (faster than one turn takes) while the page records frame times.
  const turning = setInterval(() => page.keyboard.press('ArrowRight').catch(() => {}), 150);
  const frames = await page.evaluate(
    (seconds) =>
      new Promise((resolve) => {
        const times = [];
        const end = performance.now() + seconds * 1000;
        const tick = (now) => {
          times.push(now);
          if (now < end) requestAnimationFrame(tick);
          else resolve(times.slice(1).map((t, i) => t - times[i]));
        };
        requestAnimationFrame(tick);
      }),
    SECONDS,
  );
  clearInterval(turning);

  const sorted = [...frames].sort((a, b) => a - b);
  const average = frames.reduce((sum, ms) => sum + ms, 0) / frames.length;
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const slow = frames.filter((ms) => ms > 1000 / 30 + 1).length;
  console.log(
    `CPU ×${cpu}: ${(1000 / average).toFixed(1)} fps average · 95 % of frames under ${p95.toFixed(1)} ms · ` +
      `${slow} of ${frames.length} frames slower than 30 fps`,
  );

  // Response time: from the key or click to the next painted frame (Event Timing API).
  await page.evaluate(() => {
    window.__slowest = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__slowest = Math.max(window.__slowest, entry.duration);
    }).observe({ type: 'event', durationThreshold: 16, buffered: true });
  });
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }
  await page.locator('[role="menuitem"]').nth(1).click();
  await page.waitForTimeout(400);
  const slowest = await page.evaluate(() => window.__slowest);
  console.log(`CPU ×${cpu}: slowest answer to a key or click ${slowest > 0 ? `${Math.round(slowest)} ms` : 'under 16 ms'}`);
  await page.close();
}
await browser.close();
