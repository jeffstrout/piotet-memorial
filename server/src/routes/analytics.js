// Built-in, privacy-friendly traffic counter.
//   POST /api/track            record an anonymous page view (public)
//   GET  /api/admin/stats      aggregates for the admin Traffic tab (admin)
//
// Tracking is client-side JS, so crawlers that don't run JS aren't counted; we
// also drop obvious bot user-agents. No IP addresses are stored.

import { Router } from 'express';
import { pool } from '../db.js';

export const trackRouter = Router();
export const adminStatsRouter = Router();

const BOT = /bot|crawl|spider|slurp|bing|google|yandex|baidu|duckduck|facebookexternalhit|embedly|preview|monitor|pingdom|uptime|curl|wget|headless|lighthouse/i;
const VIEWS = new Set(['home', 'story', 'pictures', 'songs', 'tributes']);

trackRouter.post('/', async (req, res) => {
  try {
    const ua = (req.get('user-agent') || '').slice(0, 300);
    if (BOT.test(ua)) return res.json({ ok: true });
    let path = String(req.body?.path || '').slice(0, 40);
    if (!VIEWS.has(path)) path = 'other';
    const visitor = String(req.body?.visitor || '').slice(0, 64) || null;
    await pool.query('INSERT INTO page_views (path, visitor, ua) VALUES ($1, $2, $3)', [path, visitor, ua]);
  } catch { /* never surface tracking errors to visitors */ }
  res.json({ ok: true });
});

adminStatsRouter.get('/stats', async (_req, res, next) => {
  try {
    const rows = (sql) => pool.query(sql).then((r) => r.rows);
    const [totals] = await rows(`
      SELECT
        count(*)::int AS views,
        count(DISTINCT visitor)::int AS visitors,
        count(*) FILTER (WHERE created_at >= now() - interval '24 hours')::int AS views_24h,
        count(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS views_7d,
        count(*) FILTER (WHERE created_at >= now() - interval '30 days')::int AS views_30d,
        count(DISTINCT visitor) FILTER (WHERE created_at >= now() - interval '7 days')::int AS visitors_7d
      FROM page_views`);
    const byPage = await rows(`SELECT path, count(*)::int AS views FROM page_views GROUP BY path ORDER BY views DESC`);
    const daily = await rows(`
      SELECT to_char((created_at AT TIME ZONE 'America/Chicago')::date, 'YYYY-MM-DD') AS day,
             count(*)::int AS views,
             count(DISTINCT visitor)::int AS visitors
      FROM page_views
      WHERE created_at >= now() - interval '14 days'
      GROUP BY 1 ORDER BY 1`);
    const recent = await rows(`SELECT path, ua, created_at FROM page_views ORDER BY created_at DESC LIMIT 15`);
    res.json({ totals: totals || {}, byPage, daily, recent });
  } catch (err) {
    next(err);
  }
});
