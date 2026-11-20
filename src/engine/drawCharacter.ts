// Draws the phase-2 character poses (PNG sheets + poses in characters.ts) on a scene canvas.
// The canvas works in screen pixels, so even Null sitting (drawn with half-size pixels) stays
// crisp wherever the screen has enough pixels for it.
import { CHARACTER_IMAGES, type CharacterImageName, type Pose } from '../assets/characters/characters';

const loaded = new Map<string, HTMLImageElement>();

function imageFor(src: string): HTMLImageElement {
  let image = loaded.get(src);
  if (!image) {
    image = new Image();
    image.src = src;
    loaded.set(src, image);
  }
  return image;
}

/** Starts downloading every image the poses use; resolves when all can be drawn. */
export function preloadPoses(poses: Pose[]): Promise<void> {
  const sources = new Set(poses.flatMap((pose) => pose.frames.map((frame) => CHARACTER_IMAGES[frame].src)));
  return Promise.all([...sources].map((src) => imageFor(src).decode().catch(() => undefined))).then(() => undefined);
}

// A pose that starts "now" can be asked for a few ms BEFORE it started: the game loop's `now` is
// when the screen frame began, which may be earlier than the performance.now() that started the
// pose. A negative time would ask for frames[-1] (nothing), so it counts as its first moment.
const sinceStart = (elapsed: number) => Math.max(0, elapsed);

/** Which image of the pose shows `elapsed` ms after it started. */
export function poseFrame(pose: Pose, elapsed: number): CharacterImageName {
  return pose.frames[Math.floor(sinceStart(elapsed) / pose.ms) % pose.frames.length];
}

/** 1 when a breathing pose is in its "down" half, else 0 (1 scene px, like PixelSprite's bob). */
export function poseBob(pose: Pose, elapsed: number, reducedMotion: boolean): number {
  if (!pose.bob || reducedMotion) return 0;
  return Math.floor(sinceStart(elapsed) / pose.ms) % 2;
}

export type Placement = {
  x: number; // scene px: horizontal centre of the image
  ground: number; // scene px: the line the feet stand on
  flip?: boolean;
};

/** Draws `frame` of `pose` with its feet on `place.ground`, `bob` scene px lower. */
export function drawPose(
  ctx: CanvasRenderingContext2D,
  pose: Pose,
  frame: CharacterImageName,
  bob: number,
  place: Placement,
  zoom: number, // canvas pixels per scene pixel
  origin: { x: number; y: number }, // scene px at the canvas's top-left corner
): void {
  const image = CHARACTER_IMAGES[frame];
  const element = imageFor(image.src);
  if (!element.complete || element.naturalWidth === 0) return;
  const width = image.width * pose.pixelSize;
  const height = image.height * pose.pixelSize;
  const left = place.x - width / 2;
  const top = place.ground - (image.ground + 1) * pose.pixelSize + bob;
  // Whole canvas pixels, so no image pixel is ever split between two screen pixels.
  const dx = Math.round((left - origin.x) * zoom);
  const dy = Math.round((top - origin.y) * zoom);
  const dw = Math.round(width * zoom);
  const dh = Math.round(height * zoom);
  if (place.flip) {
    ctx.save();
    ctx.translate(dx + dw, dy);
    ctx.scale(-1, 1);
    ctx.drawImage(element, 0, image.y, image.width, image.height, 0, 0, dw, dh);
    ctx.restore();
  } else {
    ctx.drawImage(element, 0, image.y, image.width, image.height, dx, dy, dw, dh);
  }
}

/**
 * A ground shadow: an ellipse of `color` pixels in a checkerboard (half of them), the 16-bit way
 * to darken without transparency. Drawn in whole scene pixels under a character's feet.
 */
export function drawShadow(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  ground: number,
  radiusX: number,
  radiusY: number,
  color: string,
  zoom: number,
  origin: { x: number; y: number },
): void {
  ctx.fillStyle = color;
  const left = Math.round(centerX - radiusX);
  const top = Math.round(ground - radiusY);
  for (let y = top; y <= Math.round(ground + radiusY); y++) {
    for (let x = left; x <= Math.round(centerX + radiusX); x++) {
      const inside = ((x + 0.5 - centerX) / radiusX) ** 2 + ((y + 0.5 - ground) / radiusY) ** 2 <= 1;
      if (!inside || (x + y) % 2 !== 0) continue;
      const dx = Math.round((x - origin.x) * zoom);
      const dy = Math.round((y - origin.y) * zoom);
      ctx.fillRect(dx, dy, Math.round((x + 1 - origin.x) * zoom) - dx, Math.round((y + 1 - origin.y) * zoom) - dy);
    }
  }
}
