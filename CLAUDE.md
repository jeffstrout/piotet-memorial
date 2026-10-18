# CLAUDE.md — Vincent Piotet Memorial

Guidance for working in this repo.

## What this is
A memorial website for Vincent Piotet (1935–2026), **live at
https://www.vincepiotet.com**. Warm "engraved keepsake" aesthetic (navy / antique
gold / parchment, humanist serifs). Built from a design handoff bundle; the visual
spec is authoritative — preserve fidelity. See README.md for the full picture.

## Architecture
- **client/** — React 18 + Vite static site. Five views (`home`, `story`,
  `pictures`, `songs`, `tributes`) switched by state in `src/App.jsx`, wired into
  browser history (pushState/popstate) so Back and deep links (`/songs`, …) work;
  no router library. `npm run build` also pre-renders each view to its own
  `dist/<route>/index.html` (`src/entry-server.jsx` + `scripts/prerender.js`) so
  the HTML contains the page. Design system lives in `src/theme.css` (CSS custom
  properties) + `src/components.jsx` + `src/icons.jsx`.
- **Content** is `client/src/data/*.json`, imported by `src/content.js`. No
  runtime `/api` calls, no server, no database.
- **DigitalOcean App Platform** via `.do/app.yaml`: static site only, plus the
  `www.vincepiotet.com` domain and an apex → `https://www` redirect. The file is
  not auto-applied; `doctl apps update <id> --spec .do/app.yaml` pushes it.
  `deploy_on_push: true` rebuilds the static site on push to `main` once that
  spec is what is live.
- **Media** (audio/photos/video) lives in **DO Spaces + CDN**
  (`https://piotet-memorial.nyc3.cdn.digitaloceanspaces.com`), never in git. The
  data files store full CDN URLs.

## Conventions
- **Square corners everywhere** (`border-radius: 0`) except the circular portrait.
  Don't introduce rounded corners.
- **Colors/type come from CSS variables** in `theme.css`. Don't hardcode hex in
  components — add or reuse a token.
- **Icons** are inline SVGs in `icons.jsx` (24px grid, 1.6px stroke, currentColor,
  default 1em). No icon fonts, **no emoji**.
- **Responsive** via `clamp()` / media queries — never the prototype's
  em-inheritance trick.
- **No placeholder content.** `src/data` is the production snapshot. Don't replace
  photos, songs, or tributes with invented samples.
- **Overlays render via portals** to `document.body` (see `Lightbox.jsx`) so
  `position: fixed` isn't broken by a transformed ancestor (`.view-enter`).
- **Tributes are closed.** `tributes.json` is approved tributes only (`id`,
  `author`, `quote`). Do not add a submission form, and do not commit emails,
  IPs, moderation status, or anything the public page does not show.

## Updating content
Edit the JSON files and push. To add media, upload to the existing Space and
reference the CDN URL. After replacing a same-key object, purge the CDN
(`doctl compute cdn flush <id> --files "…"`).

## Local dev
`client`: `npm install && npm run dev`. `npm run build` must pass before
committing (it produces the per-route HTML). Serve `dist/` and open `/`,
`/story`, `/pictures`, `/songs`, and `/tributes` directly.
