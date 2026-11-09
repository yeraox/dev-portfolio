import { Suspense, lazy } from 'react';
import App from './App';

// Dev-only pages (/dev/...). `import.meta.env.DEV` is `false` in production builds, so Vite
// drops this branch — and the page code — from the published bundle.
const Specimen = import.meta.env.DEV ? lazy(() => import('./dev/Specimen')) : null;

export default function Root() {
  if (Specimen && window.location.pathname.startsWith('/dev/specimen')) {
    return (
      <Suspense fallback={null}>
        <Specimen />
      </Suspense>
    );
  }
  return <App />;
}
