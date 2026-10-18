# Photos (source originals)

Raw family photos used for memorial print work. These are the source assets
behind `../photo-sheet/` (the 4-up keepsake sheets) and related print pieces.
Filenames are unchanged from Drive, including spaces and original extensions
(`.JPG` / `.jpg` / `.jpeg` / `.HEIC` / `.heic`).

The numbered `p01.jpg` … `p24.jpg` copies in `../photo-sheet/` are
print-normalized (HEIC→JPEG, oriented, 1600 px on the long edge). Re-normalize
from this folder if the originals change — see `../photo-sheet/README.md`.

Before committing anything in this folder, strip location and identifying
camera/owner metadata (make, model, serial, owner, EXIF/XMP/IPTC). Keep the
orientation tag, HEIF rotation, and color profile so the photo still displays
upright, without re-encoding:

```bash
exiftool -overwrite_original -all= -tagsFromFile @ \
  -Orientation -QuickTime:Rotation -icc_profile \
  -ext jpg -ext jpeg -ext JPG -ext HEIC -ext heic -ext png .
```

A file named `.heic` that is actually a JPEG has to be rewritten as a JPEG
(ExifTool will not write a HEIC container onto JPEG bytes). Do not rename the
committed file.

## Files (24)

- `2012-08-25 19.19.46.JPG`
- `20171007_141454.jpg`
- `20171007_141503.jpg`
- `20190223_133916_001.jpg`
- `7B7884AE-8ECE-4F9F-BF5A-A74D29F7DDC7.jpg`
- `999468_10153180863700463_907269575_n.jpg`
- `AP1GczMhilw7-81L8QVTpOoWxM7L3XUjk14JGes6z--o9MToN4-uM5oJBzSQvPXjFbxxSm-b5QuTV4yiKyGuMdlMjnSrVz2KwzA=w1216-h1620-s-no.jpeg`
- `DSC02164.JPG`
- `IMG_0283_Original.JPG`
- `IMG_0475.jpeg`
- `IMG_0996.JPG`
- `IMG_1179.heic`
- `IMG_1270.HEIC`
- `IMG_1682.JPG`
- `IMG_20260706_202610_587.jpg`
- `IMG_20260706_202830_432.jpg`
- `IMG_20260706_203223_688.jpg`
- `IMG_20260706_204025_294.jpg`
- `IMG_20260706_220530_507.jpg`
- `IMG_4320.heic`
- `IMG_5483.JPG`
- `IMG_7422.JPG`
- `IMG_8141.heic`
- `IMG_8321.heic`
