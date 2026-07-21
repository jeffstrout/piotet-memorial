# "Reserved" chair card

A fold-over card that drapes across the back of a chair to reserve seating at the
service, in the memorial's design language (see `../../Vincent-Piotet-Style-Guide.pdf`).

## Files
- `reserved.html` — editable source.
- `Reserved-Chair-Card.pdf` — print-ready.

## Format
- **US Letter, landscape (11 × 8.5 in), one page.**
- Folded **across the middle** (at 4.25 in) and hung over the chair back — the fold
  sits on top of the chair, a panel hangs down each side.
- The **upper half is printed rotated 180°** so that, once folded, the card reads
  right-side-up from *both* sides. Faint gold tick marks at the left/right edges
  mark the fold line.
- Background is intentionally **unprinted** — print on cream/parchment stock
  (~`#EFE7D4`) so the paper supplies the color, matching the service program.

## Printing
- **Single-sided** (the reverse stays blank), **landscape**, **actual size / 100% —
  no "fit to page" scaling**.
- **Cardstock** is recommended so the card holds its shape over the chair back.
- Fold in half along the tick marks, printed side facing **out** on both sides.

## Editing
Change the wording in `reserved.html` (both panels — upper and lower carry the same
text), then re-render:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=12000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="Reserved-Chair-Card.pdf" "file://$PWD/reserved.html"
```

Fonts (Cinzel / Cormorant Garamond) load from Google Fonts at render time, so keep
a network connection when regenerating.
