// Postgres access + schema bootstrap for the tributes guestbook.
//
// On DigitalOcean, DATABASE_URL is injected from the attached managed DB and
// requires TLS. Locally it points at a plain Postgres and TLS is off.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';
import { seedContentBlocks } from './site-content.js';

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const rawUrl = process.env.DATABASE_URL;
const isRemote = rawUrl && !/localhost|127\.0\.0\.1/.test(rawUrl);

// DO's managed PG is signed by DO's own CA (not in the system bundle), and its
// DATABASE_URL carries `sslmode=require` — which newer pg treats as verify-full
// and rejects. Strip sslmode so our `ssl` config governs TLS, then accept the
// DO-signed cert: the connection stays TLS-encrypted, it's just not chain-
// verified (DO injects the CA in a form Node won't validate reliably, and the
// DB is only reachable over DO's private network).
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
const ssl = isRemote ? { rejectUnauthorized: false } : false;

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

  // Tributes are NOT seeded — the guestbook starts empty and fills with real
  // memories from visitors (moderated via /admin).

  const seeded = await seedContentBlocks();
  if (seeded) console.log(`[db] seeded ${seeded} content blocks`);

  console.log('[db] ready');
}
