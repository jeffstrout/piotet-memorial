import { Eyebrow, BackLink, PhotoFrame } from '../components.jsx';

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
      <div className="photo-grid">
        {photos.map((p) => <PhotoFrame key={p.id} photo={p} />)}
      </div>
    </div>
  );
}
