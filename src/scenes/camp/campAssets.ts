// The camp's images, loaded once and shared: the title screen starts the download while the visitor
// looks at it, so the camp (and its intro) is ready the moment the transition reveals it.
import { NULL_DOG, YERAY } from '../../assets/characters/characters';
import { preloadPoses } from '../../engine/drawCharacter';
import { CAMP } from './campLayout';
import { fireVariants } from './fireFlicker';
import { INTRO_POSES } from './intro';

export type CampBackground = { image: HTMLImageElement; fire: HTMLCanvasElement[] };

let background: Promise<CampBackground> | null = null;

/** Yeray's camp image and the campfire's flicker variants made from it (downloaded once). */
export function loadCampBackground(): Promise<CampBackground> {
  background ??= (async () => {
    const image = new Image();
    image.src = CAMP.background.image.src;
    await image.decode();
    return { image, fire: fireVariants(image) };
  })();
  return background;
}

// What the still camp draws. The intro's poses include these (it ends with them).
export const CAMP_POSES = [YERAY.idle, NULL_DOG.sit];

/** Everything the camp and its intro draw (the title calls this). Safe to call many times. */
export function preloadCamp(): Promise<unknown> {
  return Promise.all([loadCampBackground(), preloadPoses(INTRO_POSES)]);
}
