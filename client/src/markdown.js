// Render admin-authored markdown (the story/obituary) to safe HTML.
// Content is written by trusted family via /admin, but we sanitize anyway.

import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ breaks: true });

export function renderMarkdown(src) {
  if (!src) return '';
  return DOMPurify.sanitize(marked.parse(String(src)));
}
