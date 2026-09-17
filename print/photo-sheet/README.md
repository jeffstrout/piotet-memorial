# Photo sheet (printed handout)

A simple keepsake sheet of Vince's photos — **four per page**, each with a thin
gold keyline to match the memorial's design language (see
`../../Vincent-Piotet-Style-Guide.pdf`).

## Files
- `photos-print.html` — the editable source.
- `Vincent-Piotet-Photos.pdf` — the print-ready output (6 pages, 24 photos).
- `p01.jpg` … `p24.jpg` — the photos, normalized for print (HEIC→JPEG, rotated
  to the correct orientation, resized to 1600 px on the long edge). Source
  originals live in `../Photos/`.

## Format
- **US Letter, portrait (8.5 × 11 in)**, a 2 × 2 grid per page.
- Photos are shown **whole** (never cropped) — `object-fit: contain` — so mixed
  portrait/landscape shots all fit; the gold keyline hugs each actual photo.
- Order follows the numbered `p##.jpg` files. To reorder, renumber the files
  (or edit the `<img src>` order in the HTML).

## Printing
- **Single-sided**, **portrait**, **actual size / 100% — no "fit to page"
  scaling**.

## Editing / regenerating
Edit `photos-print.html`, then re-render with headless Chrome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=20000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="Vincent-Piotet-Photos.pdf" "file://$PWD/photos-print.html"
```

To re-normalize from the source originals in `../Photos/`:

```bash
i=0; for f in $(ls -1 ../Photos | grep -v '^README' | sort); do i=$((i+1)); \
  sips -s format jpeg -Z 1600 "../Photos/$f" --out "$(printf p%02d.jpg $i)"; done
```
