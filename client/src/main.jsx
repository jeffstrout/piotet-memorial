import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './theme.css';

const rootEl = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production pages are prerendered, so hydrate them. `vite dev` serves an empty
// root, which is a normal client render.
if (rootEl.hasChildNodes()) hydrateRoot(rootEl, app);
else createRoot(rootEl).render(app);
