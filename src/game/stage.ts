// How the 640×360 scene fits the screen (DESIGN.md §2). Pure functions → unit tests.
export const SCENE = { width: 640, height: 360 } as const;

/** The part of the scene that is visible, in scene pixels. */
export type Camera = { x: number; y: number; width: number; height: number };

export type StageLayout = {
  mode: 'wide' | 'tall'; // tall = portrait screens: banner above the scene, HUD below it
  camera: Camera;
  scale: number; // CSS px per scene px
  uiUnit: number; // --u: CSS px per UI pixel (window frames, bevels, gaps)
  portraitZoom: number; // CSS px per portrait pixel in the HUD
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

const uiUnitFor = (scale: number) => Math.min(4, Math.max(2, Math.round(2 * scale)));

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
  // One UI pixel = two scene pixels (the 320×180 grid the windows were designed on), 2–4 CSS px.
  const uiUnit = uiUnitFor(scale);
  // HUD portraits: one portrait pixel per UI pixel's half (1× on most screens, 2× from 1920 px),
  // so they stay a frame in the corner instead of competing with the characters.
  const portraitZoom = Math.max(1, Math.round(scale / 2));
  return { mode: tall ? 'tall' : 'wide', camera, scale, uiUnit, portraitZoom, dpr };
}

/** A scene position → CSS px inside the stage. */
export function toStage(x: number, y: number, layout: StageLayout): { left: number; top: number } {
  return { left: (x - layout.camera.x) * layout.scale, top: (y - layout.camera.y) * layout.scale };
}
