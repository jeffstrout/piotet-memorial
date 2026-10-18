import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { site } from './content.js';
import { titleFor, viewFromPath } from './routes.js';

// Build-time render of one route. The prerender script injects `html` into
// dist/<route>/index.html so the page content is present before JavaScript runs.
export function render(url) {
  const view = viewFromPath(url);
  const html = renderToString(
    <StrictMode>
      <App initialPath={url} />
    </StrictMode>,
  );
  return { html, title: titleFor(view, site) };
}
