// DB-backed editable site content (the "text CMS").
//
// Content lives in the `content_blocks` table, one row per key. The family edits
// it via /admin, so changes are instant — no redeploy. If the DB is unavailable
// or a block is missing, we fall back to the static seed in content/site.json so
// the site always renders.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_PATH = join(__dirname, '..', 'content', 'site.json');

// The blocks that make up the site copy, in edit order.
export const CONTENT_KEYS = ['person', 'service', 'story', 'intros'];

let seedCache = null;
export async function loadSeed() {
  if (!seedCache) seedCache = JSON.parse(await readFile(SEED_PATH, 'utf8'));
  return seedCache;
}

// Assemble the full site object from the DB, backfilling any missing block from
// the seed. Returns the seed wholesale if the DB can't be reached.
export async function getSite() {
  const seed = await loadSeed();
  try {
    const { rows } = await pool.query('SELECT key, data FROM content_blocks');
    const byKey = Object.fromEntries(rows.map((r) => [r.key, r.data]));
    const site = {};
    for (const key of CONTENT_KEYS) site[key] = byKey[key] ?? seed[key];
    return site;
  } catch {
    return seed;
  }
}

// All blocks for the admin editor (DB value if present, else seed default).
export async function getAllBlocks() {
  const seed = await loadSeed();
  const { rows } = await pool.query('SELECT key, data, updated_at FROM content_blocks');
  const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));
  return CONTENT_KEYS.map((key) => ({
    key,
    data: byKey[key]?.data ?? seed[key],
    updatedAt: byKey[key]?.updated_at ?? null,
  }));
}

export async function saveBlock(key, data) {
  if (!CONTENT_KEYS.includes(key)) {
    const err = new Error(`Unknown content block: ${key}`);
    err.status = 400;
    throw err;
  }
  await pool.query(
    `INSERT INTO content_blocks (key, data, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [key, data],
  );
}

// Seed content_blocks from the static file on first init (idempotent).
export async function seedContentBlocks() {
  const seed = await loadSeed();
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM content_blocks');
  if (rows[0].n > 0) return 0;
  for (const key of CONTENT_KEYS) {
    if (seed[key] === undefined) continue;
    await pool.query(
      'INSERT INTO content_blocks (key, data) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [key, seed[key]],
    );
  }
  return CONTENT_KEYS.length;
}
