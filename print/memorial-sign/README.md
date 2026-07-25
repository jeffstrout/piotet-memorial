# "Memorial" sign (full page, landscape)

A single full-page sign in the memorial's design language (see
`../../Vincent-Piotet-Style-Guide.pdf`). Not folded.

## Files
- `memorial-sign.html` — editable source.
- `Vincent-Piotet-Memorial-Sign.pdf` — print-ready.

## Format
- **US Letter, landscape (11 × 8.5 in), one page.**
- "MEMORIAL" set large at the top in Cinzel navy, with a gold star, rule, and a
  small "Vincent Piotet · Celebration of Life" line beneath. Gold keyline frame.
- The lower portion is left open for additional content (still to come).
- Background is intentionally **unprinted** — print on cream/parchment stock
  (~`#EFE7D4`) so the paper supplies the color, matching the rest of the suite.

## Printing
- **Single-sided**, **landscape**, **actual size / 100% — no "fit to page".**
- **Cardstock** recommended.

## Editing / regenerating
Edit `memorial-sign.html`, then re-render:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=12000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="Vincent-Piotet-Memorial-Sign.pdf" "file://$PWD/memorial-sign.html"
```

Fonts (Cinzel / Cormorant Garamond) load from Google Fonts at render time, so
keep a network connection when regenerating.
