# Memorial service program (printed handout)

A bifold order-of-service handout for Vincent Piotet's memorial, in the site's
design language (see `../../Vincent-Piotet-Style-Guide.pdf`).

## Files
- `program.html` — the editable source. Text lives near the top of the `<body>`.
- `portrait.png` — the cover photo (referenced by `program.html`).
- `Vincent-Piotet-Memorial-Program.pdf` — the print-ready output (both pages).
- `Program-Page1-OUTSIDE.pdf` / `Program-Page2-INSIDE.pdf` — the two pages split
  into single-page files, for printers that won't reliably duplex the combined
  PDF. Print page 1, flip the sheet, print page 2 on the back, then fold.
  Regenerate with: `pdfseparate Vincent-Piotet-Memorial-Program.pdf page-%d.pdf`

## Format
- **11 × 8.5 in, landscape**, two 5.5 × 8.5 panels per sheet.
- Panels are numbered as the reader encounters them once folded:
  **1** front cover · **2** inside left · **3** inside right · **4** back.
- **Sheet 1 (outside):** panel 4 (back cover) | panel 1 (front cover).
- **Sheet 2 (inside):** panel 2 (obituary — "His Story") | panel 3 (order of service).
- Background is intentionally **unprinted** — print on cream/parchment stock
  (~`#EFE7D4`) so the paper provides the color.

The Service / Officiating / Share in the Ministry block that used to sit on the
inside left, before the obituary took that page, is parked in an HTML comment at
the end of sheet 2 in `program.html` — remove the comment markers to bring it back
(it needs a panel of its own, so the layout would have to grow to a second sheet).

## Printing
Print **double-sided (flip on short edge)**, then **fold down the middle**.
Do a test on plain paper first; if the inside misaligns with the cover, switch
the duplex setting to **flip on long edge**.

## Editing & regenerating the PDF
Edit `program.html`, then re-render with headless Chrome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=12000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="Vincent-Piotet-Memorial-Program.pdf" \
  "file://$PWD/program.html"
```

Fonts (Cinzel / Cormorant Garamond / EB Garamond) load from Google Fonts at
render time, so keep a network connection when regenerating.

## Still to confirm (placeholders / verbatim from the reference)
- Obituary heading currently reads **"His Story"** (matches the website section).
- Dates shown as years only: **1935 · 2026**. Add full month/day if wanted.
- The service time/place and the Hospice of East Texas note are **not currently
  printed anywhere** — see the parked block noted above.
- Back cover uses a simple "With love and gratitude from the family." line —
  swap for a favorite verse/poem/second photo if desired.
- To adjust the cover photo crop, change `object-position` on the portrait `<img>`.
