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
