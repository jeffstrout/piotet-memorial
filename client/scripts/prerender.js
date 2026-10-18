// After the client and SSR builds, write one HTML file per route so direct
// URLs (/story, /pictures, /songs, /tributes) carry that page's content.
// DigitalOcean App Platform serves a directory's index_document for the
// extensionless path, and catchall_document covers anything else.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(clientRoot, 'dist');
const ssrEntry = path.join(clientRoot, 'dist-ssr', 'entry-server.js');

// DOMPurify needs a window during the Node render. Keep it off the global
// `window` so React stays on the server render path.
const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.__PIOTET_DOM_WINDOW__ = dom.window;

const { render } = await import(pathToFileURL(ssrEntry).href);

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const placeholder = '<div id="root"></div>';
if (!template.includes(placeholder)) {
  throw new Error('dist/index.html is missing <div id="root"></div>');
}

const routes = [
  { url: '/', file: 'index.html' },
  { url: '/story', file: 'story/index.html' },
  { url: '/pictures', file: 'pictures/index.html' },
  { url: '/songs', file: 'songs/index.html' },
  { url: '/tributes', file: 'tributes/index.html' },
];

function escapeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

for (const route of routes) {
  const { html, title } = render(route.url);
  if (!html || !html.includes('sheet__inner')) {
    throw new Error(`Prerender produced empty markup for ${route.url}`);
  }
  let page = template.replace(placeholder, `<div id="root">${html}</div>`);
  page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(title)}</title>`);
  const outFile = path.join(distDir, route.file);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, page);
  console.log(`[prerender] ${route.url} → ${route.file} (${html.length} chars)`);
}
