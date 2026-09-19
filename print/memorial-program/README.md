# Memorial service program (printed handout)

Order-of-service handouts for Vincent Piotet's memorial, in the site's design
language (see `../../Vincent-Piotet-Style-Guide.pdf`). Two formats ship side by
side — pick the one that matches how you will print:

| | Landscape bifold | Letter duplex |
| --- | --- | --- |
| Source | `program.html` (this folder) | `letter/program.html` |
| Size | **11 × 8.5 in, landscape** | **8.5 × 11 in, portrait** |
| Sheets | One sheet, folded in half (four panels) | One sheet, printed **double-sided** (no fold) |
| Combined PDF | `Vincent-Piotet-Memorial-Program.pdf` | `letter/Vincent-Piotet-Memorial-Program-Letter.pdf` |
| Split PDFs | `Program-Page1-OUTSIDE.pdf` / `Program-Page2-INSIDE.pdf` | `letter/Program-Letter-Page1-FRONT.pdf` / `letter/Program-Letter-Page2-BACK.pdf` |

Do not replace one format with the other. The bifold is the folded pew handout;
the letter file is for printers and families who want a conventional duplex
letter page.

Shared cover photo: `portrait.png` (the letter HTML references `../portrait.png`).

Background is intentionally **unprinted** on both formats — print on cream /
parchment stock (~`#EFE7D4`) so the paper provides the color.

---

## Landscape bifold (this folder)

- **11 × 8.5 in, landscape**, two 5.5 × 8.5 panels per sheet.
- Panels are numbered as the reader encounters them once folded:
  **1** front cover · **2** inside left · **3** inside right · **4** back.
- **Sheet 1 (outside):** panel 4 (back cover) | panel 1 (front cover).
- **Sheet 2 (inside):** panel 2 (obituary — "His Story") | panel 3 (order of service).

Print **double-sided (flip on short edge)**, then **fold down the middle**.
Do a test on plain paper first; if the inside misaligns with the cover, switch
the duplex setting to **flip on long edge**.

Split-page files are for printers that will not reliably duplex the combined
PDF. Print page 1, flip the sheet, print page 2 on the back, then fold.
Regenerate splits with: `pdfseparate Vincent-Piotet-Memorial-Program.pdf page-%d.pdf`

The Service / Officiating / Share in the Ministry block that used to sit on the
inside left, before the obituary took that page, is parked in an HTML comment at
the end of sheet 2 in `program.html` — remove the comment markers to bring it back
(it needs a panel of its own, so the layout would have to grow to a second sheet).

## Letter duplex (`letter/`)

- **8.5 × 11 in, portrait**, two pages on one sheet.
- **Page 1 (front):** cover — gold star, "Celebrating the life of", circular
  portrait, name, dates, and the site URL at the foot.
- **Page 2 (back):** masthead, then two columns — **His Story** (left) and **Order
  of Service** (right) — with the family gratitude line, Hospice note, and site
  URL along the foot.

Print **double-sided, portrait, flip on long edge** (the usual long-edge duplex
for a portrait letter page), **actual size / 100% — no "fit to page" scaling**.
Do a test sheet first; if the back is upside down, switch to flip on short edge.

Split-page files (`Program-Letter-Page1-FRONT.pdf` / `Program-Letter-Page2-BACK.pdf`)
are for printers that will not duplex the combined PDF: print page 1, flip the
sheet on the long edge, print page 2 on the back.

---

## Editing & regenerating the PDFs

Edit the HTML, then re-render with headless Chrome. Fonts (Cinzel / Cormorant
Garamond / EB Garamond) load from Google Fonts at render time, so keep a network
connection when regenerating.

**Bifold** (run from this folder):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=12000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="Vincent-Piotet-Memorial-Program.pdf" \
  "file://$PWD/program.html"
```

**Letter duplex** (run from `letter/`):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=12000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="Vincent-Piotet-Memorial-Program-Letter.pdf" \
  "file://$PWD/program.html"
```

To split the letter PDF into front/back files (requires Poppler `pdfseparate`):

```bash
pdfseparate Vincent-Piotet-Memorial-Program-Letter.pdf page-%d.pdf
mv page-1.pdf Program-Letter-Page1-FRONT.pdf
mv page-2.pdf Program-Letter-Page2-BACK.pdf
```

On Linux the same Chrome flags work with `google-chrome` or `chromium`.

## Still to confirm (placeholders / verbatim from the reference)

These notes apply to **both** formats — they share the same copy.

- Obituary heading currently reads **"His Story"** (matches the website section).
- Dates shown as years only: **1935 · 2026**. Add full month/day if wanted.
- The service time/place and the Hospice of East Texas note are **not currently
  printed as a full Service / Officiating block**. The Hospice "in lieu of
  flowers" line does appear (bifold back cover; letter back footer). The parked
  Service block lives only in the bifold HTML comment.
- Back / footer uses a simple "With love and gratitude from the family." line —
  swap for a favorite verse/poem/second photo if desired.
- To adjust the cover photo crop, change `object-position` on the portrait `<img>`.
