import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeftIcon, ArrowRightIcon } from './icons.jsx';

// Full-screen enlarged view for a gallery photo/video, with caption + prev/next.
export default function Lightbox({ photos, index, onClose, onNav }) {
  const photo = photos[index];
  const many = photos.length > 1;
  const nav = useCallback((d) => onNav(d), [onNav]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && many) nav(-1);
      else if (e.key === 'ArrowRight' && many) nav(1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden'; // lock background scroll
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, nav, many]);

  if (!photo) return null;

  return createPortal(
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox__close" onClick={onClose} aria-label="Close">×</button>
      {many && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={(e) => { e.stopPropagation(); nav(-1); }}
          aria-label="Previous"
        >
          <ArrowLeftIcon />
        </button>
      )}
      <figure className="lightbox__frame" onClick={(e) => e.stopPropagation()}>
        {photo.type === 'video' ? (
          <video src={photo.src} poster={photo.poster} controls autoPlay playsInline />
        ) : (
          <img src={photo.src} alt={photo.alt || photo.caption || ''} />
        )}
        {photo.caption && <figcaption className="lightbox__caption">{photo.caption}</figcaption>}
      </figure>
      {many && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={(e) => { e.stopPropagation(); nav(1); }}
          aria-label="Next"
        >
          <ArrowRightIcon />
        </button>
      )}
    </div>,
    document.body,
  );
}
