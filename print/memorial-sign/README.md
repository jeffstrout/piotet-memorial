# "Memorial" sign (full page, landscape)

A single full-page sign in the memorial's design language (see
`../../Vincent-Piotet-Style-Guide.pdf`). Not folded.

## Files
- `memorial-sign.html` — editable source (arrow points **left**).
- `memorial-sign-right.html` — same, arrow points **right**.
- `Vincent-Piotet-Memorial-Sign.pdf` — print-ready, **left** arrow.
- `Vincent-Piotet-Memorial-Sign-Right.pdf` — print-ready, **right** arrow.

Both print-ready PDFs are hardened for printing: text is flattened to vector
outlines and the file is re-distilled through Ghostscript, so there are no font
dependencies. If you regenerate from the HTML with Chrome, re-apply that step
(see below) before printing.

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
Edit the HTML, then re-render and print-harden (outline text + re-distill):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=12000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="_tmp.pdf" "file://$PWD/memorial-sign.html"
gs -q -dNOPAUSE -dBATCH -sDEVICE=ps2write -dNoOutputFonts -o _tmp.ps _tmp.pdf
gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress \
  -dCompatibilityLevel=1.4 -o Vincent-Piotet-Memorial-Sign.pdf _tmp.ps
rm -f _tmp.pdf _tmp.ps
```

Fonts (Cinzel / Cormorant Garamond) load from Google Fonts at render time, so
keep a network connection when regenerating.
