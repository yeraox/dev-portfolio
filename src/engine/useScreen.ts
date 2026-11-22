// Live facts about the screen, read with useSyncExternalStore (React's way to follow something
// that lives outside React and can change at any moment).
import { useMemo, useSyncExternalStore } from 'react';
import { stageLayout, type StageLayout } from '../game/stage';

function onResize(notify: () => void) {
  window.addEventListener('resize', notify);
  return () => window.removeEventListener('resize', notify);
}

// A string snapshot: React compares it with ===, so it only re-renders when a number changes.
const viewportKey = () =>
  `${document.documentElement.clientWidth} ${document.documentElement.clientHeight} ${window.devicePixelRatio}`;

/** How the scene fits the current window; updates on resize, zoom and rotation. */
export function useStageLayout(): StageLayout {
  const key = useSyncExternalStore(onResize, viewportKey);
  return useMemo(() => {
    const [width, height, dpr] = key.split(' ').map(Number);
    return stageLayout(width, height, dpr);
  }, [key]);
}
