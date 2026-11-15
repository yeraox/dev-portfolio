// One window per section, each in its own file that the browser downloads only when the window
// first opens (React.lazy). preloadWindow() starts that download early, e.g. when its icon
// reaches the top of the ring, so the window is ready by the time it is opened.
import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { SectionId } from '../content/sections';

// TS concept — a function type in a Record: for every section, a function returning the promise
// of a module whose default export is a component.
const LOADERS: Record<SectionId, () => Promise<{ default: ComponentType }>> = {
  equip: () => import('./EquipWindow'),
  alchemy: () => import('./AlchemyWindow'),
  stats: () => import('./StatsWindow'),
  comms: () => import('./CommsWindow'),
  buffs: () => import('./DraftWindow'),
  craft: () => import('./DraftWindow'),
};

export const WINDOWS: Record<SectionId, LazyExoticComponent<ComponentType>> = {
  equip: lazy(LOADERS.equip),
  alchemy: lazy(LOADERS.alchemy),
  stats: lazy(LOADERS.stats),
  comms: lazy(LOADERS.comms),
  buffs: lazy(LOADERS.buffs),
  craft: lazy(LOADERS.craft),
};

export function preloadWindow(section: SectionId): void {
  LOADERS[section]().catch(() => {
    // A failed preload is retried by React.lazy when the window opens.
  });
}
