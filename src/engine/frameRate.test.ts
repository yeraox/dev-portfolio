import { describe, expect, it } from 'vitest';
import { FIRST_FRAME_RATE, onRefresh, type FrameRate } from './frameRate';

/** Feeds refreshes `gap` ms apart; returns the final state and how many of them ran the game. */
function play(start: FrameRate, gap: number, count: number, from = 0) {
  let rate = start;
  let runs = 0;
  for (let i = 0; i < count; i++) {
    const step = onRefresh(rate, from + i * gap);
    rate = step.rate;
    if (step.run) runs++;
  }
  return { rate, runs };
}

describe('frame-rate safety net', () => {
  it('keeps every frame on a device that holds 60 fps', () => {
    const { rate, runs } = play(FIRST_FRAME_RATE, 1000 / 60, 600);
    expect(rate.halved).toBe(false);
    expect(runs).toBe(600);
  });

  it('drops to 30 fps when frames keep coming slower than 45 fps', () => {
    const slow = play(FIRST_FRAME_RATE, 30, 120).rate;
    expect(slow.halved).toBe(true);
    // Back at 60 Hz refreshes, the game now runs on every other one: 30 times a second.
    const { runs } = play(slow, 1000 / 60, 60, 10_000);
    expect(runs).toBe(30);
  });

  it('does not judge on the first second of frames', () => {
    expect(play(FIRST_FRAME_RATE, 30, 40).rate.halved).toBe(false);
  });

  it('treats a long gap (a hidden tab) as a pause, not as a slow frame', () => {
    let rate = play(FIRST_FRAME_RATE, 1000 / 60, 100).rate;
    rate = onRefresh(rate, rate.lastTick + 5000).rate; // back after 5 s away
    expect(rate.halved).toBe(false);
    expect(rate.average).toBeLessThan(20);
  });
});
