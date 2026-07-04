// DB-backed gallery + songbook (Milestone 2). Media binaries live in DO Spaces;
// here we store keys + metadata and resolve keys to CDN URLs for the client.
// Public reads fall back to the static manifests if the DB is unreachable, so
// the site never goes blank.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from './db.js';
import { mediaUrl } from './content.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', 'content');
const readJson = async (name) => JSON.parse(await readFile(join(CONTENT_DIR, name), 'utf8'));

// ── Shaping rows for the client ──────────────────────────────────────────────
const publicPhoto = (r) => ({
  id: r.id,
  type: r.kind,               // client PhotoFrame expects `type`
  src: mediaUrl(r.src_key),
  poster: mediaUrl(r.poster_key),
  alt: r.alt || r.caption || '',
  caption: r.caption || '',
});
const adminPhoto = (r) => ({
  id: r.id, kind: r.kind, srcKey: r.src_key || '', posterKey: r.poster_key || '',
  caption: r.caption || '', alt: r.alt || '', sortOrder: r.sort_order, published: r.published,
  src: mediaUrl(r.src_key), poster: mediaUrl(r.poster_key),
});
const publicSong = (r, i) => ({
  index: i + 1,
  title: r.title,
  note: r.note,
  duration: r.duration,
  audioUrl: mediaUrl(r.audio_key),
  downloadUrl: mediaUrl(r.audio_key),
});
const adminSong = (r) => ({
  id: r.id, title: r.title, note: r.note, duration: r.duration,
  audioKey: r.audio_key || '', sortOrder: r.sort_order, published: r.published,
  audioUrl: mediaUrl(r.audio_key),
});

// ── Photos ───────────────────────────────────────────────────────────────────
export async function listPublicPhotos() {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM photos WHERE published ORDER BY sort_order, id',
    );
    return rows.map(publicPhoto);
  } catch {
    const doc = await readJson('photos.json'); // static fallback
    return doc.photos.map((p) => ({
      id: p.id, type: p.type, src: mediaUrl(p.srcKey), poster: mediaUrl(p.posterKey), alt: p.alt || '', caption: '',
    }));
  }
}
export async function listAllPhotos() {
  const { rows } = await pool.query('SELECT * FROM photos ORDER BY sort_order, id');
  return rows.map(adminPhoto);
}
export async function createPhoto(d) {
  const { rows } = await pool.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM photos');
  const { rows: out } = await pool.query(
    `INSERT INTO photos (kind, src_key, poster_key, caption, alt, sort_order, published)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [d.kind === 'video' ? 'video' : 'photo', d.srcKey || null, d.posterKey || null,
     d.caption || '', d.alt || '', rows[0].n, d.published !== false],
  );
  return adminPhoto(out[0]);
}
export async function updatePhoto(id, d) {
  const { rows } = await pool.query(
    `UPDATE photos SET
       kind = COALESCE($2, kind),
       src_key = $3, poster_key = $4,
       caption = COALESCE($5, caption),
       alt = COALESCE($6, alt),
       published = COALESCE($7, published)
     WHERE id = $1 RETURNING *`,
    [id, d.kind, d.srcKey ?? null, d.posterKey ?? null, d.caption, d.alt, d.published],
  );
  return rows[0] ? adminPhoto(rows[0]) : null;
}
export const deletePhoto = (id) => pool.query('DELETE FROM photos WHERE id = $1', [id]);

// ── Songs ────────────────────────────────────────────────────────────────────
export async function getSongbookMeta() {
  try {
    const { rows } = await pool.query("SELECT data FROM content_blocks WHERE key = 'songbook'");
    if (rows[0]) return rows[0].data;
  } catch { /* fall through */ }
  return { total: null, downloadAllKey: null };
}
export async function saveSongbookMeta(data) {
  await pool.query(
    `INSERT INTO content_blocks (key, data, updated_at) VALUES ('songbook', $1, now())
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [data],
  );
}
export async function listPublicSongs() {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM songs WHERE published ORDER BY sort_order, id',
    );
    const meta = await getSongbookMeta();
    return {
      total: meta.total || rows.length,
      downloadAllUrl: mediaUrl(meta.downloadAllKey),
      items: rows.map(publicSong),
    };
  } catch {
    const doc = await readJson('songs.json'); // static fallback
    return {
      total: doc.total,
      downloadAllUrl: mediaUrl(doc.downloadAllKey),
      items: doc.songs.map((s, i) => ({
        index: i + 1, title: s.title, note: s.note, duration: s.duration,
        audioUrl: mediaUrl(s.audioKey), downloadUrl: mediaUrl(s.downloadKey),
      })),
    };
  }
}
export async function listAllSongs() {
  const { rows } = await pool.query('SELECT * FROM songs ORDER BY sort_order, id');
  return rows.map(adminSong);
}
export async function createSong(d) {
  const { rows } = await pool.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM songs');
  const { rows: out } = await pool.query(
    `INSERT INTO songs (title, note, duration, audio_key, sort_order, published)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [d.title || '', d.note || '', d.duration || '', d.audioKey || null, rows[0].n, d.published !== false],
  );
  return adminSong(out[0]);
}
export async function updateSong(id, d) {
  const { rows } = await pool.query(
    `UPDATE songs SET
       title = COALESCE($2, title),
       note = COALESCE($3, note),
       duration = COALESCE($4, duration),
       audio_key = $5,
       published = COALESCE($6, published)
     WHERE id = $1 RETURNING *`,
    [id, d.title, d.note, d.duration, d.audioKey ?? null, d.published],
  );
  return rows[0] ? adminSong(rows[0]) : null;
}
export const deleteSong = (id) => pool.query('DELETE FROM songs WHERE id = $1', [id]);

// Reorder any of the two tables from an ordered array of ids.
export async function reorder(table, ids) {
  if (!['photos', 'songs'].includes(table)) throw Object.assign(new Error('bad table'), { status: 400 });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < ids.length; i++) {
      await client.query(`UPDATE ${table} SET sort_order = $1 WHERE id = $2`, [i + 1, ids[i]]);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// ── Seeding on first init ────────────────────────────────────────────────────
export async function seedMedia() {
  let seeded = 0;
  const { rows: pc } = await pool.query('SELECT COUNT(*)::int AS n FROM photos');
  if (pc[0].n === 0) {
    const doc = await readJson('photos.json');
    let i = 1;
    for (const p of doc.photos) {
      await pool.query(
        `INSERT INTO photos (kind, src_key, poster_key, caption, alt, sort_order)
         VALUES ($1, $2, $3, '', $4, $5)`,
        [p.type === 'video' ? 'video' : 'photo', p.srcKey || null, p.posterKey || null, p.alt || '', i++],
      );
    }
    seeded += doc.photos.length;
  }
  const { rows: sc } = await pool.query('SELECT COUNT(*)::int AS n FROM songs');
  if (sc[0].n === 0) {
    const doc = await readJson('songs.json');
    let i = 1;
    for (const s of doc.songs) {
      await pool.query(
        `INSERT INTO songs (title, note, duration, audio_key, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [s.title, s.note, s.duration, s.audioKey || null, i++],
      );
    }
    await saveSongbookMeta({ total: doc.total, downloadAllKey: doc.downloadAllKey });
    seeded += doc.songs.length;
  }
  return seeded;
}
