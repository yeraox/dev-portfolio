import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/global.css';
import Root from './Root';

// TS concept — the `!` after getElementById tells TS "this is never null here".
// It's safe because index.html always contains <div id="root">.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
