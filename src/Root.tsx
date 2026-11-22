import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from 'react';
import App from './App';

// Dev-only pages (/dev/...). `import.meta.env.DEV` is `false` in production builds, so Vite
// replaces this with `{}` and drops the page code from the published bundle.
// TS concept — `Record<string, X>`: "an object whose keys are any string and values are X".
const DEV_PAGES: Record<string, LazyExoticComponent<ComponentType>> = import.meta.env.DEV
  ? {
      '/dev/personajes': lazy(() => import('./dev/CharactersDemo')),
      '/dev/textos': lazy(() => import('./dev/TextsReview')),
    }
  : {};

export default function Root() {
  const DevPage = DEV_PAGES[window.location.pathname.replace(/\/$/, '')];
  if (DevPage) {
    return (
      <Suspense fallback={null}>
        <DevPage />
      </Suspense>
    );
  }
  return <App />;
}
