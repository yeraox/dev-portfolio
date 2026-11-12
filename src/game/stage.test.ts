import { describe, expect, it } from 'vitest';
import { SCENE, fitScale, stageLayout, tallReservedHeight, titleNameSize, toStage } from './stage';

describe('stageLayout', () => {
  // TS concept — a tuple type in a test table: [width, height, dpr, mode, scale, uiUnit].
  const cases: [number, number, number, 'wide' | 'tall', number, number][] = [
    [1440, 900, 1, 'wide', 2, 4], // laptop: 1280×720, the size the windows were approved at
    [1920, 1080, 1, 'wide', 3, 6], // bigger screens: thicker frames, like the scene's pixels
    [2560, 1440, 1, 'wide', 4, 8],
    [1280, 720, 2, 'wide', 2, 4],
    [844, 390, 2, 'wide', 1, 2], // phone held sideways
    [390, 844, 2, 'tall', 1, 2], // phone: the middle 360 px at 1 CSS px = 2 screen px
    [390, 844, 3, 'tall', 1, 2],
    [768, 1024, 2, 'tall', 2, 4], // tablet
  ];
  it.each(cases)('%i×%i @%ix → %s, scale %f, --u %ipx', (w, h, dpr, mode, scale, u) => {
    const layout = stageLayout(w, h, dpr);
    expect(layout.mode).toBe(mode);
    expect(layout.scale).toBeCloseTo(scale);
    expect(layout.uiUnit).toBe(u);
  });

  it('keeps whole screen pixels per scene pixel when it costs at most 20 % of the size', () => {
    const full = { x: 0, y: 0, width: SCENE.width, height: SCENE.height };
    expect(fitScale(1440, 900, full, 1)).toBe(2); // 2.25 fits; 2 is 89 % of it
    expect(fitScale(1366, 657, full, 1)).toBeCloseTo(1.825); // 1 would be 55 %: exact fit instead
  });

  it('never makes the scene bigger than the screen', () => {
    for (const [w, h, dpr] of [[1366, 657, 1], [1536, 730, 1.25], [360, 640, 3], [1024, 600, 1]]) {
      const { camera, scale, mode } = stageLayout(w, h, dpr);
      expect(camera.width * scale).toBeLessThanOrEqual(w + 0.001);
      if (mode === 'wide') expect(camera.height * scale).toBeLessThanOrEqual(h + 0.001);
    }
  });

  it.each([
    [390, 844, 2],
    [390, 664, 3], // phone with the browser bars showing
    [768, 1024, 2],
    [820, 1180, 2],
  ])('fits scene + banner + HUD on a %i×%i portrait screen', (w, h, dpr) => {
    const { camera, scale, uiUnit } = stageLayout(w, h, dpr);
    expect(camera.height * scale + tallReservedHeight(uiUnit)).toBeLessThanOrEqual(h);
  });

  it('shows the middle of the scene on portrait screens', () => {
    const { camera } = stageLayout(390, 844, 2);
    expect(camera.x + camera.width / 2).toBe(SCENE.width / 2);
  });

  it.each([
    // [width, height, dpr, text, small, display, title]
    [1440, 900, 1, 26, 21, 30, 40],
    [1920, 1080, 1, 39, 32, 50, 60],
    [390, 844, 2, 16, 14, 20, 20], // phone: readable minimums
    [768, 1024, 2, 26, 21, 30, 40],
  ])('grows the text with the scene on %i×%i', (w, h, dpr, text, small, display, title) => {
    const layout = stageLayout(w, h, dpr);
    expect([layout.textSize, layout.textSmall, layout.displaySize, layout.titleSize]).toEqual([text, small, display, title]);
  });

  it.each([
    [1440, 900, 1, 120],
    [1920, 1080, 1, 180],
    [390, 844, 2, 60], // phone: as big as fits in one line
    [768, 1024, 2, 120],
    [320, 568, 2, 50],
  ])('sizes the title name on %i×%i: %i px, inside the screen', (w, h, dpr, size) => {
    expect(titleNameSize(stageLayout(w, h, dpr))).toBe(size);
    expect(size * 5.46).toBeLessThanOrEqual(w * 0.9);
  });

  it('turns scene pixels into stage CSS pixels', () => {
    const layout = stageLayout(390, 844, 2); // camera starts at x 140, scale 1
    expect(toStage(320, 100, layout)).toEqual({ left: 180, top: 100 });
  });
});
