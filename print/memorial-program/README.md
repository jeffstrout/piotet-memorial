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
  portrait, name, full dates, the **Service** block (celebration of life, date
  and time, place, officiant), and the site URL at the foot.
- **Page 2 (back):** masthead with full dates, then two columns — **His Story**
  (left; live-site title “I just work here”, print-length obituary from the
  bifold) and **Order of Service** (right) — with the family gratitude line,
  Hospice note, and site URL along the foot.

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

## Copy notes

The **letter** program takes its copy from this bifold and from the live site
(`https://www.vincepiotet.com/api/site`). The bifold files are unchanged.

Letter, filled:

- **Dates:** February 23, 1935 · July 2, 2026. Birth is in both obituaries
  (“born on February 23, 1935”). The death date is the site tagline, “Graduated
  to Heaven on July 2, 2026”. The site `person.born` / `person.died` fields are
  still years only.
- **Service block** (front): live site plaque — “Celebration of life”, “July 25th
  at 4:00 pm”, “Bethel Bible Church - Downtown”, “202 S. Broadway, Tyler, Texas”.
  **Officiating: Rev. Lucas Ignacio Kabel** is only in the bifold’s parked Service
  comment; the live site does not name an officiant. The parked block’s street
  line (“202 S Broadway Ave / Tyler, TX 75702”) is not printed; the letter uses
  the live site address.
- **His Story:** eyebrow “His Story” and title “I just work here” are the live
  site story heading. The column body is the bifold’s print-length obituary. The
  live obituary is about 1,550 words and does not fit this sheet with the order
  of service.
- **Gratitude:** “With love and gratitude from our family.” — the bifold’s closing
  line. Neither source has a verse or poem to put in its place.
- **Hospice line** (back footer) follows the live site: “In lieu of flowers, all
  are welcome to make a donation to The Hospice of East Texas.”

Bifold, still as printed:

- Dates shown as years only: **1935 · 2026**.
- Obituary heading reads **“His Story”** (no “I just work here” title).
- The Service / Officiating block is parked in an HTML comment in `program.html`,
  not printed. The Hospice line on the bifold back cover is the older wording
  (“please consider a donation”).
- Back cover uses the same gratitude line.

To adjust the cover photo crop, change `object-position` on the portrait `<img>`.
