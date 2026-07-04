# Vincent Piotet Memorial

A memorial website for **Vincent Piotet (1935–2026)** — a musician who played guitar
in hospice for twenty-one years and recorded roughly 250 of the songs he played.
Visitors can read his story, browse photos and video, listen to and download his
songs, leave a tribute, and find service details.

The visual language is a warm, classical **"engraved keepsake"** — deep navy,
antique gold, and aged parchment in humanist serifs (Cinzel / Cormorant Garamond /
EB Garamond).

## Architecture

Modeled on the DigitalOcean path of [`jeffstrout/split-flap`](https://github.com/jeffstrout/split-flap):
a **static React/Vite client** + a **Node/Express API**, deployed together on
**DigitalOcean App Platform**. Two additions the memorial needs:

- **Managed Postgres** — the tributes guestbook, with moderation (submissions are
  hidden until approved).
- **DigitalOcean Spaces + CDN** — the ~250 audio files, photos, and video. Media
  is referenced by relative key and resolved to a CDN URL at runtime, so real
  files drop into Spaces without a code change.

**Auto-deploy:** `.do/app.yaml` sets `deploy_on_push: true` — every push to `main`
makes App Platform rebuild and redeploy automatically (the hands-off update
behavior from split-flap, native to DO — no Watchtower needed for a hosted app).

```
piotet-memorial/
├── .do/app.yaml          # DO App Platform spec (static site + API + Postgres)
├── client/               # React 18 + Vite → static site
│   └── src/
│       ├── views/        # Home, Story, Pictures, Songs, Tributes
│       ├── components.jsx, icons.jsx, theme.css   # design system
│       └── api.js, fallback.js
└── server/               # Node + Express API (self-contained — DO deploys this subtree)
    ├── src/
    │   ├── index.js      # /api/health, /api/version, /api/{site,songs,photos}
    │   ├── routes/tributes.js   # public submit/read + admin moderation
    │   ├── db.js, content.js
    ├── content/          # static manifests (site copy, songs, photos, tribute seed)
    └── db/schema.sql     # tributes table
```

## Local development

Requires Node 20+ and (for tributes) a local Postgres.

```bash
# 1) API
cd server
npm install
cp ../.env.example .env          # set DATABASE_URL, ADMIN_TOKEN, MEDIA_CDN_BASE
npm run dev                      # → http://localhost:3001

# 2) Client (separate terminal)
cd client
npm install
npm run dev                      # → http://localhost:5173  (proxies /api → :3001)
```

The client renders fully even with the API down — it falls back to static
placeholder content (see `client/src/fallback.js`).

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET  | `/api/health` | Health check (used by DO). |
| GET  | `/api/version` | Baked `commit` / `buildTime`. |
| GET  | `/api/site` | Person, service, story copy. |
| GET  | `/api/songs` | Songbook manifest (CDN URLs). |
| GET  | `/api/photos` | Gallery manifest (CDN URLs). |
| GET  | `/api/tributes` | Approved tributes, newest first. |
| POST | `/api/tributes` | Submit a memory → stored `pending`. |
| GET  | `/api/admin/tributes` | All tributes (needs `Authorization: Bearer $ADMIN_TOKEN`). |
| POST | `/api/admin/tributes/:id` | `{ "action": "approve" \| "reject" }` (admin). |

## Deploy (DigitalOcean)

```bash
doctl apps create --spec .do/app.yaml
# set the ADMIN_TOKEN secret and confirm DATABASE_URL binding in the dashboard
```

Then pushing to `main` auto-deploys.

## Content still to supply (from the family)

- Obituary / life-story copy (`server/content/site.json` → `story`).
- Service date, time, and location (currently "To be announced").
- ~250 audio files + the "download all" zip → **DO Spaces**, keys per `server/content/songs.json`.
- Portrait photos and video → **DO Spaces**, keys per `server/content/photos.json` (all portrait 3:4).
- Hero portrait image.

## Credit

Design from the "Vince Piotet Memorial" handoff bundle. Rebuilt here as production
React/Express per that spec (the prototype's streaming-HTML runtime is not ported).
