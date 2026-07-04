// Vincent Piotet Memorial — API server (Express).
//
// Serves static content manifests (songs, gallery, site copy) and the moderated
// tributes guestbook. Media itself lives in DO Spaces + CDN; we only hand out
// resolved URLs. Mirrors the split-flap server shape (Express, /api/health,
// /api/version) so deploys and health checks behave the same on DO.

import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import { loadContent } from './content.js';
import { requireAdmin } from './middleware/admin-auth.js';
import { tributesRouter, adminRouter } from './routes/tributes.js';
import { siteRouter, adminContentRouter } from './routes/content.js';

const PORT = process.env.PORT || 3001;
const APP_COMMIT = process.env.GIT_SHA || 'dev';
const APP_BUILD_TIME = process.env.BUILD_TIME || 'dev';

const app = express();
app.use(express.json({ limit: '32kb' }));

// CORS: allow the configured static-site origin(s). Same-origin in production
// (client and API share the App's domain), so this mainly matters in local dev.
const allowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowed.length === 0 || allowed.includes(origin)
        ? cb(null, true)
        : cb(null, false),
  }),
);

// Content is static — load once at boot.
let content = { site: {}, songs: { items: [] }, photos: [] };

// ── Health / version (parity with split-flap) ────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/version', (_req, res) =>
  res.json({ commit: APP_COMMIT, buildTime: APP_BUILD_TIME }),
);

// ── Content ──────────────────────────────────────────────────────────────────
app.use('/api/site', siteRouter);                                  // DB-backed, editable
app.get('/api/songs', (_req, res) => res.json(content.songs));     // static (Milestone 2)
app.get('/api/photos', (_req, res) => res.json({ photos: content.photos }));

// ── Tributes (Postgres-backed, moderated) ────────────────────────────────────
app.use('/api/tributes', tributesRouter);

// ── Admin surface — everything here is behind the Bearer-token guard ─────────
const admin = express.Router();
admin.use(requireAdmin);
admin.use(adminRouter);          // tribute moderation
admin.use(adminContentRouter);   // editable site content
app.use('/api/admin', admin);

// ── Errors ───────────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[api] error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

async function start() {
  try {
    content = await loadContent();
    console.log(`[api] content loaded — ${content.songs.items.length} songs, ${content.photos.length} photos`);
  } catch (err) {
    console.error('[api] failed to load content:', err);
  }
  try {
    await initDb();
  } catch (err) {
    console.error('[api] db init failed (tributes disabled):', err);
  }
  app.listen(PORT, () => console.log(`[api] listening on :${PORT}`));
}

start();
