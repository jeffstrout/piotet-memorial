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
