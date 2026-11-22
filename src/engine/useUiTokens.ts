import { useLayoutEffect } from 'react';
import type { StageLayout } from '../game/stage';

/** The interface follows the scene's zoom (DESIGN.md, "Layout"): UI pixel, type sizes and the stage's size
 *  (windows cover it) are set on the page, before it paints, for every screen to use. */
export function useUiTokens(layout: StageLayout): void {
  useLayoutEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--u', `${layout.uiUnit}px`);
    root.setProperty('--text-size', `${layout.textSize}px`);
    root.setProperty('--text-small', `${layout.textSmall}px`);
    root.setProperty('--display-size', `${layout.displaySize}px`);
    root.setProperty('--title-size', `${layout.titleSize}px`);
    root.setProperty('--stage-width', `${layout.camera.width * layout.scale}px`);
    root.setProperty('--stage-height', `${layout.camera.height * layout.scale}px`);
  }, [layout]);
}
