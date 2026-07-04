# CLAUDE.md — Vincent Piotet Memorial

Guidance for working in this repo.

## What this is
A memorial website for Vincent Piotet (1935–2026). Warm "engraved keepsake"
aesthetic (navy / antique gold / parchment, humanist serifs). Built from a
design handoff bundle; the visual spec is authoritative — preserve fidelity.

## Architecture (mirrors the DO path of jeffstrout/split-flap)
- **client/** — React 18 + Vite static site. Five views (`home`, `story`,
  `pictures`, `songs`, `tributes`) switched by state in `src/App.jsx`; no router
  library. Design system lives in `src/theme.css` (CSS custom properties) +
  `src/components.jsx` + `src/icons.jsx`.
- **server/** — Node + Express API (`type: module`, Node 20+). Serves static
  content manifests and the Postgres-backed tributes guestbook.
- **DigitalOcean App Platform** via `.do/app.yaml`: static site + API + managed
  Postgres. `deploy_on_push: true` → push to `main` auto-deploys.
- **Media** (audio/photos/video) lives in **DO Spaces + CDN**, never in git.
  Referenced by relative key; `server/src/content.js` prefixes `MEDIA_CDN_BASE`.

## Conventions
- **Square corners everywhere** (`border-radius: 0`) except the circular portrait.
  Don't introduce rounded corners.
- **Colors/type come from CSS variables** in `theme.css`. Don't hardcode hex in
  components — add or reuse a token.
- **Icons** are inline SVGs in `icons.jsx` (24px grid, 1.6px stroke, currentColor,
  default 1em). No icon fonts, **no emoji**.
- **Responsive** via `clamp()` / media queries — never the prototype's
  em-inheritance trick.
- Content copy is placeholder until the family supplies it (obituary, service
  details, real songs/photos). See README "Content still to supply".

## Tributes moderation
Submissions POST as `pending` and are hidden from the public list until an admin
approves them via `POST /api/admin/tributes/:id` (`Authorization: Bearer $ADMIN_TOKEN`).
Never expose pending tributes on public endpoints.

## Local dev
`server`: `npm install && npm run dev` (needs Postgres + `.env`).
`client`: `npm install && npm run dev` (proxies `/api` → :3001). The client
renders with static fallbacks (`src/fallback.js`) if the API is down.

## Verify before committing
- `cd client && npm run build` must pass.
- Server: `node src/index.js` boots and `/api/health` returns `{status:"ok"}`.
