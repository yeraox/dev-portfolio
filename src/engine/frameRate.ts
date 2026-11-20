// The safety net of the performance budget (BRIEF.md): if a device can't keep 60 fps, the game
// drops to a steady 30 (the game loop then runs every other screen refresh) instead of stuttering.
// Animations are timed by the clock, not by counting frames, so they keep their speed. Pure
// function → tested in frameRate.test.ts.

const SLOW_FRAME_MS = 1000 / 45; // frames that come slower than 45 fps on average: struggling
const SETTLE_FRAMES = 60; // judge only after a second of frames (the first ones are always slow)
const PAUSE_MS = 250; // a gap this long is a pause (hidden tab, debugger), not a slow frame
const HALF_RATE_MS = 1000 / 30 - 4; // at 30 fps, with some slack for timing jitter
const SMOOTHING = 0.1; // each new frame moves the average 10 % of the way

export type FrameRate = {
  average: number; // ms between screen refreshes, smoothed
  frames: number; // frames measured so far
  halved: boolean; // running at 30 fps (for the rest of the visit)
  lastTick: number; // when the last refresh came (-1: none yet)
  lastRun: number; // when the game loop last ran (-1: never)
};

export const FIRST_FRAME_RATE: FrameRate = { average: 1000 / 60, frames: 0, halved: false, lastTick: -1, lastRun: -1 };

/** One screen refresh at `now`: the updated measure, and whether the game loop runs this time. */
export function onRefresh(rate: FrameRate, now: number): { rate: FrameRate; run: boolean } {
  const gap = rate.lastTick < 0 ? 0 : now - rate.lastTick;
  let { average, frames, halved } = rate;
  if (gap > 0 && gap < PAUSE_MS) {
    average += (gap - average) * SMOOTHING;
    frames += 1;
    if (!halved && frames >= SETTLE_FRAMES && average > SLOW_FRAME_MS) halved = true;
  }
  const run = !halved || rate.lastRun < 0 || now - rate.lastRun >= HALF_RATE_MS;
  return { rate: { average, frames, halved, lastTick: now, lastRun: run ? now : rate.lastRun }, run };
}
