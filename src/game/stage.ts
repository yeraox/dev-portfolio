// How the 640×360 scene fits the screen (DESIGN.md §2). Pure functions → unit tests.
export const SCENE = { width: 640, height: 360 } as const;

/** The part of the scene that is visible, in scene pixels. */
export type Camera = { x: number; y: number; width: number; height: number };

export type StageLayout = {
  mode: 'wide' | 'tall'; // tall = portrait screens: banner above the scene, HUD below it
  camera: Camera;
  scale: number; // CSS px per scene px
  uiUnit: number; // --u: CSS px per UI pixel (window frames, bevels, gaps)
  // Type sizes in CSS px. They grow with the scene, so a window reads the same on every screen.
  textSize: number; // window text (Pixelify Sans)
  textSmall: number; // meta lines, help line
  displaySize: number; // game labels, banner, headings inside windows (Jersey 10)
  titleSize: number; // window titles (Jersey 10)
  portraitZoom: number; // CSS px per portrait pixel in the HUD
  viewport: { width: number; height: number }; // the window, in CSS px
  dpr: number; // screen pixels per CSS px (the canvas draws in screen pixels)
};

// Portrait screens show the middle 360 px of the scene (the ring, Yeray and Null fit in 290),
// bigger, and keep room above and below it for the banner and the HUD.
const TALL_CAMERA_WIDTH = 360;

/** CSS px the banner and the compact HUD take around the scene in tall mode. They are drawn in
 *  UI pixels, so they grow with --u (measured: 176 px at --u 2, 264 px at --u 4). */
export function tallReservedHeight(uiUnit: number): number {
  return 88 + 44 * uiUnit;
}

const uiUnitFor = (scale: number) => Math.min(8, Math.max(2, Math.round(2 * scale)));

/**
 * CSS px per scene px. Preferred: a whole number of the screen's own pixels per scene pixel
 * (every pixel the same size). If that leaves the scene smaller than 80 % of what fits, the exact
 * fit wins: bigger, with pixels that may differ by one screen pixel.
 */
export function fitScale(availableWidth: number, availableHeight: number, camera: Camera, dpr: number): number {
  const fit = Math.min(availableWidth / camera.width, availableHeight / camera.height);
  const whole = Math.floor(fit * dpr);
  return whole >= 1 && whole >= fit * dpr * 0.8 ? whole / dpr : fit;
}

export function stageLayout(viewportWidth: number, viewportHeight: number, dpr: number): StageLayout {
  const tall = viewportWidth < viewportHeight;
  const camera: Camera = tall
    ? { x: (SCENE.width - TALL_CAMERA_WIDTH) / 2, y: 0, width: TALL_CAMERA_WIDTH, height: SCENE.height }
    : { x: 0, y: 0, width: SCENE.width, height: SCENE.height };
  let scale = fitScale(viewportWidth, viewportHeight - (tall ? tallReservedHeight(2) : 0), camera, dpr);
  if (tall && uiUnitFor(scale) > 2) {
    // A bigger scene means bigger UI pixels, so a taller banner and HUD: fit again with that room.
    scale = fitScale(viewportWidth, viewportHeight - tallReservedHeight(uiUnitFor(scale)), camera, dpr);
  }
  // One UI pixel = two scene pixels (the 320×180 grid the windows were designed on), 2–8 CSS px.
  const uiUnit = uiUnitFor(scale);
  // Text: 13 scene px (26 px on a 1440 laptop), never under 16 px. Jersey 10 is drawn on a 10 px
  // grid, so its sizes stay multiples of 10.
  const textSize = Math.max(16, Math.round(13 * scale));
  const textSmall = Math.max(14, Math.round(10.5 * scale));
  const displaySize = 10 * Math.max(2, Math.round(1.5 * scale));
  const titleSize = 10 * Math.max(2, Math.round(2 * scale));
  // HUD portraits: one portrait pixel per UI pixel's half (1× on most screens, 2× from 1920 px),
  // so they stay a frame in the corner instead of competing with the characters.
  const portraitZoom = Math.max(1, Math.round(scale / 2));
  const viewport = { width: viewportWidth, height: viewportHeight };
  return { mode: tall ? 'tall' : 'wide', camera, scale, uiUnit, textSize, textSmall, displaySize, titleSize, portraitZoom, viewport, dpr };
}

// "YERAY CATURLA" in Jersey 10 is 5.46 times as wide as its font size.
const NAME_WIDTH_PER_PX = 5.46;

/** The title screen's name size: 60 scene px (120 px on a 1440 laptop), but never wider than 90 %
 *  of the screen, and always a multiple of 10 px (Jersey 10's pixel grid), at least 40. */
export function titleNameSize(layout: StageLayout): number {
  const byScene = Math.round(6 * layout.scale);
  const byWidth = Math.floor((0.9 * layout.viewport.width) / NAME_WIDTH_PER_PX / 10);
  return 10 * Math.max(4, Math.min(byScene, byWidth));
}

/** A scene position → CSS px inside the stage. */
export function toStage(x: number, y: number, layout: StageLayout): { left: number; top: number } {
  return { left: (x - layout.camera.x) * layout.scale, top: (y - layout.camera.y) * layout.scale };
}
