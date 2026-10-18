# Vincent Piotet Memorial

**Live at → https://www.vincepiotet.com**

A memorial website for **Vincent Piotet (1935–2026)**. Visitors can read his story,
browse the photo gallery, listen to and download the songs he recorded, read the
tributes that were shared, and find the service details.

The visual language is a warm, classical **"engraved keepsake"** — deep navy,
antique gold, and aged parchment in humanist serifs (Cinzel / Cormorant Garamond /
EB Garamond). See `Vincent-Piotet-Style-Guide.pdf` in the repo root.

## Architecture

A **fully static** React 18 + Vite site on **DigitalOcean App Platform**. There is
no server and no database at runtime.

- Page copy, the gallery, the songbook, and the approved tributes live in
  `client/src/data/*.json` and are imported at build time.
- `npm run build` pre-renders Home, Story, Pictures, Songs, and Tributes to
  `dist/index.html`, `dist/story/index.html`, `dist/pictures/index.html`,
  `dist/songs/index.html`, and `dist/tributes/index.html`, so each page's content
  is in the HTML. The app still switches views in the browser (pushState /
  popstate) when you follow a link; a direct URL or refresh serves that route's
  file. Unknown paths fall back to the home page (`catchall_document`).
- **DigitalOcean Spaces + CDN** holds the audio, photos, and the download-all
  archive. The data files store the full CDN URLs
  (`https://piotet-memorial.nyc3.cdn.digitaloceanspaces.com/...`). Binaries are
  not in git.
- The tribute book is **closed**. The approved tributes are frozen in
  `tributes.json`. There is no submission form and no visitor counter.

```
piotet-memorial/
├── .do/app.yaml                 # DO App Platform spec (static site + domains)
├── Vincent-Piotet-Style-Guide.pdf
├── print/                       # printed program, signs, photo sheet (not the site)
└── client/                      # React 18 + Vite → static site
    └── src/
        ├── App.jsx              # view routing + history
        ├── entry-server.jsx     # build-time renderToString
        ├── content.js           # imports src/data/*.json
        ├── data/                # content_blocks, photos, songs, tributes
        ├── views/               # Home, Story, Pictures, Songs, Tributes
        ├── Gallery.jsx, Lightbox.jsx
        ├── player.js            # shared single-track audio player
        ├── markdown.js          # obituary Markdown → sanitized HTML
        ├── routes.js            # path ↔ view, document titles
        └── components.jsx, icons.jsx, theme.css
```

## Updating content

Edit the JSON under `client/src/data/` and push to `main`. App Platform rebuilds
the static site (once `.do/app.yaml` has been applied — see Deploy). No database,
no admin UI.

| File | What it is |
| --- | --- |
| `content_blocks.json` | Name, dates, portrait, service details, obituary Markdown, page headings. |
| `photos.json` | Gallery items (`src` / `thumb` are CDN URLs). |
| `songs.json` | Songbook: `items`, the stated `total`, and `downloadAllUrl`. |
| `tributes.json` | Approved tributes only (`id`, `author`, `quote`). Do not add private fields. |

New photos or songs: upload the file to the existing Space (public-read, same key
style as the current objects), put the CDN URL in the JSON, and push. After
replacing an object at a key that is already cached, purge the CDN:
`doctl compute cdn flush <id> --files "photos/*"`.

The hero portrait is the static file `client/public/portrait.jpg` (referenced as
`/portrait.jpg`).

## Local development

Requires Node 20+.

```bash
cd client && npm install
npm run dev          # → http://localhost:5173
npm run build        # client bundle + per-route HTML in dist/
npm run preview      # serve dist/
```

## Deploy (DigitalOcean)

App id `8b2eca84-318b-43ca-adc2-a5f701d5cb82` (region `nyc`).

`.do/app.yaml` describes a **static site only** (component `web`), the `www`
domain, and an apex → `https://www.vincepiotet.com` redirect (301, path
preserved). **App Platform does not apply this file by itself.** `deploy_on_push`
rebuilds whatever components are in the spec that is already live. To make the
live app match the file:

```bash
doctl apps update 8b2eca84-318b-43ca-adc2-a5f701d5cb82 --spec .do/app.yaml
```

Apply that only after a `pg_dump` of the production database is archived
somewhere outside this repo. The update removes the Express service and the
managed Postgres database.

**Media:** Space `piotet-memorial` (nyc3), CDN
`piotet-memorial.nyc3.cdn.digitaloceanspaces.com`.

**Domains:** `www.vincepiotet.com` is PRIMARY. `vincepiotet.com` is an ALIAS that
redirects to `https://www`. GoDaddy's HTTP-only forwarder does not cover
`https://vincepiotet.com`; the apex DNS record has to point at App Platform
(A/ALIAS to the app ingress) for that redirect to run. DO issues the TLS certs.

## Content snapshot

Exported from the public API on `https://www.vincepiotet.com` (approved tributes
only; `created_at` dropped because the page does not show it):

- 4 content blocks (`person`, `service`, `story`, `intros`)
- 45 photos
- 233 published songs in the list; the songbook's stated total is 237 (the
  "Download all 237" label on the live site)
- 11 approved tributes

## Credit

Design from the "Vince Piotet Memorial" handoff bundle, rebuilt here as a
production React site.
