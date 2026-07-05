# CLAUDE.md — Vincent Piotet Memorial

Guidance for working in this repo.

## What this is
A memorial website for Vincent Piotet (1935–2026), **live at
https://www.vincepiotet.com**. Warm "engraved keepsake" aesthetic (navy / antique
gold / parchment, humanist serifs). Built from a design handoff bundle; the visual
spec is authoritative — preserve fidelity. See README.md for the full picture.

## Architecture (mirrors the DO path of jeffstrout/split-flap)
- **client/** — React 18 + Vite static site. Five views (`home`, `story`,
  `pictures`, `songs`, `tributes`) switched by state in `src/App.jsx`, wired into
  browser history (pushState/popstate) so Back and deep links (`/songs`, …) work;
  no router library. Design system lives in `src/theme.css` (CSS custom
  properties) + `src/components.jsx` + `src/icons.jsx`. `src/admin/` is the
  password-protected editor app (rendered when the path starts with `/admin`).
- **server/** — Node + Express API (`type: module`, Node 20+). Postgres-backed
  editable content, tributes, gallery, songbook, and page-view analytics; static
  `content/*.json` is only a fallback when the DB is unreachable.
- **DigitalOcean App Platform** via `.do/app.yaml`: static site + API + managed
  Postgres + the `www.vincepiotet.com` domain. `deploy_on_push: true` → push to
  `main` auto-deploys. Data-only changes go through the admin API (no deploy).
- **Media** (audio/photos/video) lives in **DO Spaces + CDN**, never in git.
  Referenced by relative key; `server/src/content.js` `mediaUrl()` prefixes
  `MEDIA_CDN_BASE` and URL-encodes the key.

## Conventions
- **Square corners everywhere** (`border-radius: 0`) except the circular portrait.
  Don't introduce rounded corners.
- **Colors/type come from CSS variables** in `theme.css`. Don't hardcode hex in
  components — add or reuse a token.
- **Icons** are inline SVGs in `icons.jsx` (24px grid, 1.6px stroke, currentColor,
  default 1em). No icon fonts, **no emoji**.
- **Responsive** via `clamp()` / media queries — never the prototype's
  em-inheritance trick.
- **No placeholder seeding.** Photos, songs, and tributes start empty in a fresh
  DB and fill from real content; don't reintroduce dev seed data (it would show
  fake content in production). Content blocks (site text) do seed sensible defaults.
- **Overlays render via portals** to `document.body` (see `Lightbox.jsx`) so
  `position: fixed` isn't broken by a transformed ancestor (`.view-enter`).

## Tributes moderation
Submissions POST as `pending` and are hidden from the public list until an admin
approves them via `POST /api/admin/tributes/:id` (`Authorization: Bearer $ADMIN_TOKEN`);
there's also a hard `DELETE`. Never expose pending tributes on public endpoints.

## Media pipeline
Bulk media is optimized locally (`sips`), synced to Spaces (`aws s3 sync`), and
loaded into the DB via the admin API — not committed to git. Photos: convert
HEIC/PNG→JPEG, ~1500px, portrait 3:4 (CSS crops the tile, lightbox shows full).
Songs: `Content-Disposition: attachment` for clean downloads. After replacing
same-key objects, purge the CDN (`doctl compute cdn flush <id> --files "…"`).
`ADMIN_TOKEN` is `GPP` (weak/temporary — rotate before wide sharing).

## Local dev
`server`: `npm install && npm run dev` (needs Postgres + `.env`).
`client`: `npm install && npm run dev` (proxies `/api` → :3001). The client
renders with static fallbacks (`src/fallback.js`) if the API is down.

## Verify before committing
- `cd client && npm run build` must pass.
- Server: `node src/index.js` boots and `/api/health` returns `{status:"ok"}`.
