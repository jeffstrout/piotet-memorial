# Vincent Piotet Memorial

**Live at → https://www.vincepiotet.com**

A memorial website for **Vincent Piotet (1935–2026)**. Visitors can read his story,
browse a photo/video gallery, listen to and download the ~250 songs he recorded,
leave a tribute, and find service details. Family members edit the entire site
themselves through a password-protected admin — no code changes, no redeploys.

The visual language is a warm, classical **"engraved keepsake"** — deep navy,
antique gold, and aged parchment in humanist serifs (Cinzel / Cormorant Garamond /
EB Garamond). See `Vincent-Piotet-Style-Guide.pdf` in the repo root.

## Architecture

Modeled on the DigitalOcean path of [`jeffstrout/split-flap`](https://github.com/jeffstrout/split-flap):
a **static React/Vite client** + a **Node/Express API**, deployed together on
**DigitalOcean App Platform**, plus:

- **Managed Postgres** — editable site content, the moderated tributes guestbook,
  the gallery, the songbook, and anonymous page-view analytics.
- **DigitalOcean Spaces + CDN** — audio, photos, and video. Media is stored by
  relative key and resolved to a CDN URL at runtime (`MEDIA_CDN_BASE`), so real
  files drop into Spaces without a code change. Binaries never live in git.

**Auto-deploy:** `.do/app.yaml` sets `deploy_on_push: true` — every push to `main`
rebuilds and redeploys automatically. Data-only changes (uploads, edits) are made
through the admin API and need no deploy.

**Client routing** is view-state based but wired into browser history (pushState /
popstate), so the Back button and shareable deep links (`/songs`, `/pictures`, …)
work. The SPA is served for all paths via App Platform's `catchall_document`.

```
piotet-memorial/
├── .do/app.yaml                 # DO App Platform spec (static site + API + Postgres + domain)
├── Vincent-Piotet-Style-Guide.pdf
├── print/memorial-program/      # the printed bifold service program (source + PDFs)
├── print/photo-sheet/           # printed photo keepsake (4-up sheets + PDF)
├── print/Photos/                # source family photos for the photo-sheet
├── client/                      # React 18 + Vite → static site
│   └── src/
│       ├── App.jsx              # view routing + history + page-view tracking
│       ├── views/               # Home, Story, Pictures, Songs, Tributes
│       ├── Gallery.jsx, Lightbox.jsx   # photo/video gallery + click-to-enlarge
│       ├── player.js            # shared single-track audio player (songbook)
│       ├── markdown.js          # obituary Markdown → sanitized HTML
│       ├── components.jsx, icons.jsx, theme.css   # design system
│       ├── api.js, fallback.js
│       └── admin/               # the /admin editor app (see below)
│   └── public/portrait.jpg      # hero portrait (static asset)
└── server/                      # Node + Express API (DO deploys this subtree only)
    ├── src/
    │   ├── index.js             # route wiring
    │   ├── routes/              # tributes, content, media, uploads, analytics
    │   ├── middleware/admin-auth.js
    │   ├── site-content.js, media-store.js, content.js, db.js
    ├── content/*.json           # static fallback copy/manifests
    └── db/schema.sql            # all tables (applied on startup)
```

## Local development

Requires Node 20+ and a local Postgres.

```bash
# 1) API
cd server && npm install
cp ../.env.example .env          # DATABASE_URL, ADMIN_TOKEN, MEDIA_CDN_BASE, SPACES_*
npm run dev                      # → http://localhost:3001

# 2) Client (separate terminal)
cd client && npm install
npm run dev                      # → http://localhost:5173  (proxies /api → :3001)
```

The client renders fully even if the API is down (static fallbacks in
`client/src/fallback.js`). An empty DB simply renders empty sections.

## Data model (Postgres)

Tables are created/altered on startup by `server/src/db.js` running `db/schema.sql`:

- **`content_blocks`** (`key`, `data` JSONB) — editable copy: `person`, `service`,
  `story` (Markdown), `intros` (page headings), `songbook` (total + download-all key).
- **`tributes`** — guestbook: `pending` → `approved`/`rejected`; starts empty
  (no placeholder seeding).
- **`photos`** — gallery: `kind` (photo|video), `src_key`, `thumb_key`, `poster_key`,
  `caption`, `sort_order`, `published`.
- **`songs`** — songbook: `title`, `note`, `duration`, `audio_key`, `sort_order`, `published`.
- **`page_views`** — anonymous analytics (`path`, random `visitor` id, `ua`, `created_at`).

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET  | `/api/health`, `/api/version` | Health + baked commit/build time. |
| GET  | `/api/site` | Assembled site copy (DB-backed, static fallback). |
| GET  | `/api/photos` | Published gallery (DB-backed, static fallback). |
| GET  | `/api/songs` | Songbook: total, download-all URL, items. |
| GET/POST | `/api/tributes` | Approved list · submit a memory (→ `pending`). |
| POST | `/api/track` | Record an anonymous page view (bots dropped). |
| GET/PUT | `/api/admin/content[/:key]` | Editable content blocks (admin). |
| — | `/api/admin/photos[...]`, `/songs[...]`, `/songbook` | Gallery + songbook CRUD/reorder (admin). |
| GET/POST/DELETE | `/api/admin/tributes[/:id]` | List · approve/reject · hard-delete (admin). |
| GET/POST | `/api/admin/uploads/config`, `/uploads/sign` | Presigned Spaces upload (admin). |
| GET | `/api/admin/stats` | Traffic aggregates for the Traffic tab (admin). |

Admin routes require `Authorization: Bearer $ADMIN_TOKEN`; unset → 401.

## The admin editor (`/admin`)

One password (`ADMIN_TOKEN`). Tabs:

- **Site text** — name/dates/tagline, **hero portrait**, service details (line
  breaks honored), the obituary (Markdown + live preview), and page headings
  (these titles also drive the matching home-page sections).
- **Photos** — add/caption/reorder/hide/delete tiles (photo or video); upload
  files (when Spaces is configured) or paste a key. Clicking a tile opens a
  lightbox with the full image + caption.
- **Songs** — per-song title/note/duration/audio, reorder/hide/delete, plus the
  stated total and the "Download all" archive.
- **Tributes** — pending / approved / rejected queues with approve, reject, and
  permanent delete.
- **Traffic** — self-hosted, privacy-friendly analytics: total/unique/rolling
  view counts, a 14-day daily chart, by-page breakdown, and recent visits. No
  third-party trackers, no cookies, no IP storage; obvious bots are ignored.

## Media pipeline (bulk uploads)

Large batches (songs, photos) are optimized locally and synced to Spaces, then the
DB is populated via the admin API:

- **Songs:** `sips`/`ffmpeg`-free flow — filenames → clean titles, durations via
  `afinfo`, `aws s3 sync` to `songs/`, records created via `POST /api/admin/songs`.
  Files carry `Content-Disposition: attachment` so downloads save with clean
  names; playback (`<audio>`) ignores that header. A zip of all songs lives at
  `downloads/` and is wired to the "Download all" button.
- **Photos:** `sips` converts HEIC/PNG → JPEG (EXIF orientation honored by the
  browser), resizes to ~1500px, portrait shots crop to the 3:4 tile via CSS
  `object-fit: cover`, and the lightbox shows the full image. Landscape group
  shots are pre-cropped to 3:4.
- **Ordering:** a numeric filename prefix sets the initial order on (re)process;
  after that, order lives in the DB and is editable via the admin ↑/↓ arrows.
- After replacing same-key objects, purge the CDN: `doctl compute cdn flush <id> --files "photos/*"`.

## Deploy & operations (DigitalOcean)

App id `8b2eca84-318b-43ca-adc2-a5f701d5cb82` (region `nyc`). `doctl` manages it.

**Provisioned:** Space `piotet-memorial` (nyc3) + CDN
`piotet-memorial.nyc3.cdn.digitaloceanspaces.com`; a full-access Spaces key
(`piotet-app`) wired as encrypted `SPACES_KEY`/`SPACES_SECRET`; a public-read
bucket policy + CORS on the Space; `ADMIN_TOKEN` set as an encrypted env var.

**Env vars** (`.do/app.yaml` + encrypted secrets in the dashboard): `DATABASE_URL`
(auto), `ALLOWED_ORIGINS`, `ADMIN_TOKEN`, `MEDIA_CDN_BASE`, `SPACES_BUCKET/REGION/
ENDPOINT`, `SPACES_KEY`, `SPACES_SECRET`.

**Custom domain:** `www.vincepiotet.com` is a PRIMARY domain on the app; DNS at
GoDaddy (`www` CNAME → the app's `*.ondigitalocean.app` host). The apex
`vincepiotet.com` uses GoDaddy Forwarding → `https://www.vincepiotet.com` (note:
GoDaddy only forwards the `http` apex, so a directly-typed `https://vincepiotet.com`
won't redirect — the shared URL is `www`). DO auto-issues/renews the TLS cert.

## Content status

- ✅ Live domain + TLS, editable content, hero portrait, service details.
- ✅ 237 songs uploaded (play/download + download-all zip).
- ✅ Tributes guestbook (empty, moderated).
- ✅ Photo gallery with lightbox (initial batch loaded).
- ⏳ Remaining photos and **videos** (gallery already supports `kind='video'`
  with a poster still; adding video posters/transcodes needs `ffmpeg`).
- ⏳ Final obituary copy (still placeholder/short).

## Credit

Design from the "Vince Piotet Memorial" handoff bundle, rebuilt here as production
React/Express per that spec (the prototype's streaming-HTML runtime is not ported).
