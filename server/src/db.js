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

const rawUrl = process.env.DATABASE_URL;
const isRemote = rawUrl && !/localhost|127\.0\.0\.1/.test(rawUrl);

// DO's managed PG is signed by DO's own CA (not in the system bundle), and its
// DATABASE_URL carries `sslmode=require` — which newer pg treats as verify-full
// and rejects. Strip sslmode so our `ssl` config governs TLS, and verify against
// DO's CA when it's provided (CA_CERT binding); otherwise accept the DO-signed
// cert (the link is still TLS-encrypted, just not chain-verified).
function stripSslmode(url) {
  try {
    const u = new URL(url);
    u.searchParams.delete('sslmode');
    return u.toString();
  } catch {
    return url;
  }
}

const connectionString = isRemote ? stripSslmode(rawUrl) : rawUrl;
const ssl = isRemote
  ? process.env.CA_CERT
    ? { ca: process.env.CA_CERT }
    : { rejectUnauthorized: false }
  : false;

export const pool = new Pool({ connectionString, ssl });

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
