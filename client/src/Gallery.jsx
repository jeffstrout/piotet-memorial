import { useState, useCallback } from 'react';
import { PhotoFrame } from './components.jsx';
import Lightbox from './Lightbox.jsx';

// A grid of photo frames that open a lightbox on click.
export default function Gallery({ photos, gridClass = 'photo-grid' }) {
  const [open, setOpen] = useState(null);
  const nav = useCallback(
    (d) => setOpen((i) => (i + d + photos.length) % photos.length),
    [photos.length],
  );

  return (
    <>
      <div className={gridClass}>
        {photos.map((p, i) => (
          <PhotoFrame key={p.id ?? i} photo={p} onClick={() => setOpen(i)} />
        ))}
      </div>
      {open !== null && (
        <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onNav={nav} />
      )}
    </>
  );
}
