// Tributes guestbook — public submit + read, admin moderation.
//
//   GET  /api/tributes            → approved tributes, newest first (public)
//   POST /api/tributes            → submit a memory; stored as 'pending' (public)
//   GET  /api/admin/tributes      → all tributes for moderation (admin)
//   POST /api/admin/tributes/:id  → { action: 'approve' | 'reject' } (admin)
//
// Moderation guard: admin routes require  Authorization: Bearer <ADMIN_TOKEN>.

import { Router } from 'express';
import { pool } from '../db.js';

export const tributesRouter = Router();
export const adminRouter = Router();

const MAX_AUTHOR = 80;
const MAX_QUOTE = 1000;

// ── Public ───────────────────────────────────────────────────────────────────
tributesRouter.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, author, quote, created_at
         FROM tributes
        WHERE status = 'approved'
        ORDER BY created_at DESC`,
    );
    res.json({ tributes: rows });
  } catch (err) {
    next(err);
  }
});

tributesRouter.post('/', async (req, res, next) => {
  try {
    const author = String(req.body?.author ?? '').trim();
    const quote = String(req.body?.quote ?? '').trim();

    if (!author || !quote) {
      return res.status(400).json({ error: 'Both a name and a memory are required.' });
    }
    if (author.length > MAX_AUTHOR || quote.length > MAX_QUOTE) {
      return res.status(400).json({ error: 'Your memory is a little too long.' });
    }

    await pool.query(
      `INSERT INTO tributes (author, quote, status) VALUES ($1, $2, 'pending')`,
      [author, quote],
    );
    // Deliberately no echo of the row — it isn't public until approved.
    res.status(201).json({ ok: true, message: 'Thank you. Your memory will appear once reviewed.' });
  } catch (err) {
    next(err);
  }
});

// ── Admin (moderation) — mounted behind requireAdmin in index.js ─────────────
adminRouter.get('/tributes', async (req, res, next) => {
  try {
    const status = req.query.status; // optional filter: pending|approved|rejected
    const { rows } = status
      ? await pool.query(
          `SELECT * FROM tributes WHERE status = $1 ORDER BY created_at DESC`,
          [status],
        )
      : await pool.query(`SELECT * FROM tributes ORDER BY created_at DESC`);
    res.json({ tributes: rows });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/tributes/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const action = req.body?.action;
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Bad id' });

    if (action === 'approve') {
      await pool.query(
        `UPDATE tributes SET status = 'approved', approved_at = now() WHERE id = $1`,
        [id],
      );
    } else if (action === 'reject') {
      await pool.query(
        `UPDATE tributes SET status = 'rejected', approved_at = NULL WHERE id = $1`,
        [id],
      );
    } else {
      return res.status(400).json({ error: "action must be 'approve' or 'reject'" });
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
