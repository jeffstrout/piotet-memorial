import { useState, useCallback, useEffect } from 'react';
import { PhotoFrame } from './components.jsx';
import Lightbox from './Lightbox.jsx';

// A grid of photo frames that open a lightbox on click.
export default function Gallery({ photos, gridClass = 'photo-grid' }) {
  const [open, setOpen] = useState(null);
  const nav = useCallback(
    (d) => setOpen((i) => (i + d + photos.length) % photos.length),
    [photos.length],
  );

  // Push a history entry when opening so the browser Back button closes the
  // lightbox (same URL, so it doesn't change the page underneath).
  const openAt = (i) => {
    setOpen(i);
    window.history.pushState({ lb: true }, '');
  };
  const close = useCallback(() => {
    setOpen(null);
    if (window.history.state?.lb) window.history.back();
  }, []);

  // Back/forward while open → close the lightbox.
  useEffect(() => {
    if (open === null) return undefined;
    const onPop = () => setOpen(null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [open]);

  return (
    <>
      <div className={gridClass}>
        {photos.map((p, i) => (
          <PhotoFrame key={p.id ?? i} photo={p} onClick={() => openAt(i)} />
        ))}
      </div>
      {open !== null && (
        <Lightbox photos={photos} index={open} onClose={close} onNav={nav} />
      )}
    </>
  );
}
