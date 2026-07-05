// Thin API client. VITE_API_BASE is '/api' in production (same origin on DO) and
// proxied to the Express server in dev (see vite.config.js).

const BASE = import.meta.env.VITE_API_BASE || '/api';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

export const getSite = () => get('/site');
export const getSongs = () => get('/songs');
export const getPhotos = () => get('/photos');
export const getTributes = () => get('/tributes');

// Record an anonymous page view (fire-and-forget). A random per-browser id in
// localStorage lets us count unique visitors without cookies or IPs.
export function track(path) {
  try {
    let v = localStorage.getItem('piotet_v');
    if (!v) {
      v = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('piotet_v', v);
    }
    fetch(`${BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, visitor: v }),
      keepalive: true,
    }).catch(() => {});
  } catch { /* ignore */ }
}

export async function postTribute({ author, quote }) {
  const res = await fetch(`${BASE}/tributes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, quote }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Could not post your memory.');
  return data;
}
