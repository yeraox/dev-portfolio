// One window per section, each in its own file that the browser downloads only when the window
// first opens (React.lazy). preloadWindow() starts that download early, e.g. when its icon
// reaches the top of the ring, so the window is ready by the time it is opened.
import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { SectionId } from '../content/sections';

// TS concept — a function type in a Record: for every section, a function returning the promise
// of a module whose default export is a component.
const LOADERS: Record<SectionId, () => Promise<{ default: ComponentType }>> = {
  projects: () => import('./ProjectsWindow'),
  stack: () => import('./StackWindow'),
  profile: () => import('./ProfileWindow'),
  contact: () => import('./ContactWindow'),
  about: () => import('./DraftWindow'),
};

export const WINDOWS: Record<SectionId, LazyExoticComponent<ComponentType>> = {
  projects: lazy(LOADERS.projects),
  stack: lazy(LOADERS.stack),
  profile: lazy(LOADERS.profile),
  contact: lazy(LOADERS.contact),
  about: lazy(LOADERS.about),
};

export function preloadWindow(section: SectionId): void {
  LOADERS[section]().catch(() => {
    // A failed preload is retried by React.lazy when the window opens.
  });
}
