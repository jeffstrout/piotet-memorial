// Admin API client. The password IS the ADMIN_TOKEN; we store it locally and
// send it as a Bearer token. A 401 anywhere means the token is wrong/expired —
// callers clear it and return to the login screen.

const BASE = import.meta.env.VITE_API_BASE || '/api';
const TOKEN_KEY = 'piotet_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    const e = new Error('Unauthorized');
    e.status = 401;
    throw e;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${method} ${path} failed`);
  return data;
}

// Verify the current token by making a cheap authenticated request.
export const verifyToken = () => req('GET', '/admin/content');

export const getContent = () => req('GET', '/admin/content');
export const saveBlock = (key, data) => req('PUT', `/admin/content/${key}`, { data });

export const getTributes = (status) =>
  req('GET', `/admin/tributes${status ? `?status=${encodeURIComponent(status)}` : ''}`);
export const moderateTribute = (id, action) =>
  req('POST', `/admin/tributes/${id}`, { action });

// ── Gallery (photos) ─────────────────────────────────────────────────────────
export const getPhotos = () => req('GET', '/admin/photos');
export const createPhoto = (d) => req('POST', '/admin/photos', d);
export const updatePhoto = (id, d) => req('PUT', `/admin/photos/${id}`, d);
export const deletePhoto = (id) => req('DELETE', `/admin/photos/${id}`);
export const reorderPhotos = (ids) => req('POST', '/admin/photos/reorder', { ids });

// ── Songbook (songs) ─────────────────────────────────────────────────────────
export const getSongs = () => req('GET', '/admin/songs');
export const createSong = (d) => req('POST', '/admin/songs', d);
export const updateSong = (id, d) => req('PUT', `/admin/songs/${id}`, d);
export const deleteSong = (id) => req('DELETE', `/admin/songs/${id}`);
export const reorderSongs = (ids) => req('POST', '/admin/songs/reorder', { ids });
export const saveSongbook = (data) => req('PUT', '/admin/songbook', { data });

// ── Media uploads (DO Spaces, presigned) ─────────────────────────────────────
export const getUploadConfig = () => req('GET', '/admin/uploads/config');

// Ask the API for a presigned URL, then PUT the file straight to Spaces.
// Returns the stored key + its public CDN URL.
export async function uploadFile(file, folder) {
  const { url, key, publicUrl } = await req('POST', '/admin/uploads/sign', {
    filename: file.name,
    contentType: file.type || 'application/octet-stream',
    folder,
  });
  // The presigned URL signs only `host`, so we send just the file plus a plain
  // Content-Type (unsigned — Spaces still stores it). No x-amz-acl header:
  // public read is granted by the Space's bucket policy, not per object.
  const put = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  });
  if (!put.ok) throw new Error(`Upload failed (${put.status})`);
  return { key, publicUrl };
}
