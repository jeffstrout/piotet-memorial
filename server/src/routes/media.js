// Gallery + songbook routes (Milestone 2).
//   Public:  GET /api/photos, GET /api/songs   (DB-backed, static fallback)
//   Admin:   full CRUD + reorder + songbook meta, behind requireAdmin.

import { Router } from 'express';
import {
  listPublicPhotos, listAllPhotos, createPhoto, updatePhoto, deletePhoto,
  listPublicSongs, listAllSongs, createSong, updateSong, deleteSong,
  getSongbookMeta, saveSongbookMeta, reorder,
} from '../media-store.js';

// ── Public handlers ──────────────────────────────────────────────────────────
export async function publicPhotos(_req, res, next) {
  try { res.json({ photos: await listPublicPhotos() }); } catch (err) { next(err); }
}
export async function publicSongs(_req, res, next) {
  try { res.json(await listPublicSongs()); } catch (err) { next(err); }
}

// ── Admin ────────────────────────────────────────────────────────────────────
export const adminMediaRouter = Router();
const num = (v) => Number.parseInt(v, 10);

// Photos
adminMediaRouter.get('/photos', async (_req, res, next) => {
  try { res.json({ photos: await listAllPhotos() }); } catch (err) { next(err); }
});
adminMediaRouter.post('/photos', async (req, res, next) => {
  try { res.status(201).json(await createPhoto(req.body || {})); } catch (err) { next(err); }
});
adminMediaRouter.put('/photos/:id', async (req, res, next) => {
  try {
    const row = await updatePhoto(num(req.params.id), req.body || {});
    row ? res.json(row) : res.status(404).json({ error: 'Not found' });
  } catch (err) { next(err); }
});
adminMediaRouter.delete('/photos/:id', async (req, res, next) => {
  try { await deletePhoto(num(req.params.id)); res.json({ ok: true }); } catch (err) { next(err); }
});
adminMediaRouter.post('/photos/reorder', async (req, res, next) => {
  try { await reorder('photos', (req.body?.ids || []).map(num)); res.json({ ok: true }); } catch (err) { next(err); }
});

// Songs
adminMediaRouter.get('/songs', async (_req, res, next) => {
  try {
    res.json({ songs: await listAllSongs(), meta: await getSongbookMeta() });
  } catch (err) { next(err); }
});
adminMediaRouter.post('/songs', async (req, res, next) => {
  try { res.status(201).json(await createSong(req.body || {})); } catch (err) { next(err); }
});
adminMediaRouter.put('/songs/:id', async (req, res, next) => {
  try {
    const row = await updateSong(num(req.params.id), req.body || {});
    row ? res.json(row) : res.status(404).json({ error: 'Not found' });
  } catch (err) { next(err); }
});
adminMediaRouter.delete('/songs/:id', async (req, res, next) => {
  try { await deleteSong(num(req.params.id)); res.json({ ok: true }); } catch (err) { next(err); }
});
adminMediaRouter.post('/songs/reorder', async (req, res, next) => {
  try { await reorder('songs', (req.body?.ids || []).map(num)); res.json({ ok: true }); } catch (err) { next(err); }
});
adminMediaRouter.put('/songbook', async (req, res, next) => {
  try {
    const data = req.body?.data;
    if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Body must be { data }.' });
    await saveSongbookMeta(data);
    res.json({ ok: true });
  } catch (err) { next(err); }
});
