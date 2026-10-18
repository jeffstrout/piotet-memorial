// Render the obituary markdown to safe HTML. The source lives in the repo
// (client/src/data/content_blocks.json). DOMPurify runs in the browser, and
// during prerender against the window stashed by scripts/prerender.js.

import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ breaks: true });

let nodePurifier = null;

function purifier() {
  if (typeof window !== 'undefined') return DOMPurify;
  if (!nodePurifier) {
    const win = globalThis.__PIOTET_DOM_WINDOW__;
    if (!win) throw new Error('Markdown sanitizer has no DOM window');
    nodePurifier = DOMPurify(win);
  }
  return nodePurifier;
}

export function renderMarkdown(src) {
  if (!src) return '';
  return purifier().sanitize(marked.parse(String(src)));
}
