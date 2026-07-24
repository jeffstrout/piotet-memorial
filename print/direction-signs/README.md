# Direction signs (folded)

Wayfinding signs for the memorial service, in the memorial's design language
(see `../../Vincent-Piotet-Style-Guide.pdf`). Same fold-in-half construction as
the reserved chair card.

## Files
- `directions.html` — editable source (all three signs).
- `Vincent-Piotet-Direction-Signs.pdf` — all three on one PDF (3 pages).
- `Sign-Third-Floor.pdf`, `Sign-Arrow-Right.pdf`, `Sign-Arrow-Left.pdf` — the
  signs split out individually, for printing several of just one.

## The three signs
All three read **Memorial / 3rd Floor**; the arrow signs add a pointer beneath.
1. **Memorial · 3rd Floor** (no arrow — the "you're here" sign)
2. **Memorial · 3rd Floor · →** (arrow pointing right)
3. **Memorial · 3rd Floor · ←** (arrow pointing left)

Each carries a small "Vincent Piotet · Celebration of Life" line.

## Format
- **US Letter, landscape (11 × 8.5 in), one page per sign.**
- Folded **across the middle** (at 4.25 in). The **upper half is printed rotated
  180°** so the sign reads right-side-up from *both* sides once folded — it can
  stand as a tent or drape over a rail/easel. Faint gold fold ticks mark the
  midline at the left/right edges.
- Background is intentionally **unprinted** — print on cream/parchment stock
  (~`#EFE7D4`) so the paper supplies the color, matching the program.

### How the arrow reads on each side
Because the top half is rotated to read upright on the back, an arrow points the
**opposite on-page direction on the two faces** — e.g. the "right" sign shows a
right arrow on the front and a left arrow on the back. This is the correct
behavior for a two-sided sign at a decision point: a guest approaching from
either direction is pointed toward the *same* physical spot. (Consequently the
"right" and "left" sheets are mirror images — one two-sided arrow sign already
shows both directions; print whichever, and face the correct side out.)

If instead you want **both faces pointing the same on-page direction**, say so
and it can be built that way.

## Printing
- **Single-sided** (the reverse stays blank), **landscape**, **actual size /
  100% — no "fit to page" scaling**.
- **Cardstock** recommended so the sign holds its shape.
- Fold in half along the tick marks, printed side facing **out** on both sides.

## Editing / regenerating
Edit `directions.html`, then re-render:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=12000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="Vincent-Piotet-Direction-Signs.pdf" "file://$PWD/directions.html"
pdfseparate Vincent-Piotet-Direction-Signs.pdf sign-%d.pdf   # to re-split
```

To add another sign (e.g. a different floor or an "Elevator" pointer), copy one
of the three `<div class="sheet">` blocks and change the directive line.

Fonts (Cinzel / Cormorant Garamond) load from Google Fonts at render time, so
keep a network connection when regenerating.
