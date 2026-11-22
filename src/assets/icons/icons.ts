// The ring's icons (made by `npm run icons` from references/icons/). Every slot (the sections, the
// CV and the SETTINGS gear) and both languages' flags need one: this type turns a missing icon into
// a compile error.
import type { SlotId } from '../../content/sections';
import type { Locale } from '../../content/types';
import { ICON_IMAGES, type IconImage } from './icons.gen';

export type { IconImage };

// TS concept — a union inside `Record`: the keys are every SlotId, plus every Locale ('es' | 'en',
// the flags in SETTINGS).
export const ICONS: Record<SlotId | Locale, IconImage> = ICON_IMAGES;

/** A light outline one scene pixel wide around an icon, with no blur (a CSS `filter`): four hard
 *  copies of its shape, one pixel to each side, under it. The dark icons (vest, silhouette,
 *  telephone) would vanish on dark ground without it. Used by the ring and the title's CV. */
export function iconOutline(scenePixel: number): string {
  const sides = [`${scenePixel}px 0`, `${-scenePixel}px 0`, `0 ${scenePixel}px`, `0 ${-scenePixel}px`];
  return sides.map((side) => `drop-shadow(${side} 0 var(--stone-3))`).join(' ');
}
