// Editable site content routes.
//
//   GET  /api/site               → assembled site copy (public; DB w/ seed fallback)
//   GET  /api/admin/content      → all editable blocks (admin)
//   PUT  /api/admin/content/:key → replace one block's data (admin)
//
// Admin routes mount under the shared /api/admin router, so they inherit its
// Bearer-token guard.

import { Router } from 'express';
import { getSite, getAllBlocks, saveBlock } from '../site-content.js';

export const siteRouter = Router();
export const adminContentRouter = Router();

// ── Public ───────────────────────────────────────────────────────────────────
siteRouter.get('/', async (_req, res, next) => {
  try {
    res.json(await getSite());
  } catch (err) {
    next(err);
  }
});

// ── Admin ────────────────────────────────────────────────────────────────────
adminContentRouter.get('/content', async (_req, res, next) => {
  try {
    res.json({ blocks: await getAllBlocks() });
  } catch (err) {
    next(err);
  }
});

adminContentRouter.put('/content/:key', async (req, res, next) => {
  try {
    const data = req.body?.data;
    if (data === undefined || typeof data !== 'object' || data === null) {
      return res.status(400).json({ error: 'Body must be { data: <object> }.' });
    }
    await saveBlock(req.params.key, data);
    res.json({ ok: true });
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message });
    next(err);
  }
});
