// Postgres access + schema bootstrap for the tributes guestbook.
//
// On DigitalOcean, DATABASE_URL is injected from the attached managed DB and
// requires TLS. Locally it points at a plain Postgres and TLS is off.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;

// DO's managed PG presents a cert that isn't in the default CA bundle; accept it
// (rejectUnauthorized:false) only when talking to a remote (non-localhost) DB.
const isRemote = connectionString && !/localhost|127\.0\.0\.1/.test(connectionString);

export const pool = new Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});

// Apply db/schema.sql and seed a few approved tributes if the table is empty, so
// a fresh deploy shows a populated guestbook rather than a blank page.
export async function initDb() {
  if (!connectionString) {
    console.warn('[db] DATABASE_URL not set — tributes API will be unavailable.');
    return;
  }
  const schemaPath = join(__dirname, '..', 'db', 'schema.sql');
  const schema = await readFile(schemaPath, 'utf8');
  await pool.query(schema);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM tributes');
  if (rows[0].n === 0) {
    const seedPath = join(__dirname, '..', 'content', 'tributes.seed.json');
    const { tributes } = JSON.parse(await readFile(seedPath, 'utf8'));
    for (const t of tributes) {
      await pool.query(
        `INSERT INTO tributes (author, quote, status, approved_at)
         VALUES ($1, $2, 'approved', now())`,
        [t.author, t.quote],
      );
    }
    console.log(`[db] seeded ${tributes.length} approved tributes`);
  }
  console.log('[db] ready');
}
