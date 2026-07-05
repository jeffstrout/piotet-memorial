import { Eyebrow, BackLink } from '../components.jsx';
import Gallery from '../Gallery.jsx';

export default function Pictures({ site, photos, go }) {
  const intro = site?.intros?.pictures || {};
  return (
    <div className="view-enter">
      <BackLink go={go} />
      <div className="center">
        <Eyebrow>Photos &amp; videos</Eyebrow>
        <h1 className="page-title">{intro.title || 'A life in pictures'}</h1>
        <p className="subtitle">
          {intro.subtitle ||
            'Photographs and video from across Vincent’s life, gathered by his family.'}
        </p>
      </div>
      {photos.length > 0 ? (
        <Gallery photos={photos} gridClass="photo-grid" />
      ) : (
        <p className="subtitle" style={{ marginTop: '1.5rem' }}>
          Photos and videos will be added here soon.
        </p>
      )}
    </div>
  );
}
