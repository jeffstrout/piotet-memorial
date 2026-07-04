import { Eyebrow, BackLink, PhotoFrame } from '../components.jsx';

export default function Pictures({ photos, go }) {
  return (
    <div className="view-enter">
      <BackLink go={go} />
      <div className="center">
        <Eyebrow>Photos &amp; videos</Eyebrow>
        <h1 className="page-title">A life in pictures</h1>
        <p className="subtitle">
          Photographs and video from across Vincent&rsquo;s life, gathered by his family.
        </p>
      </div>
      <div className="photo-grid">
        {photos.map((p) => <PhotoFrame key={p.id} photo={p} />)}
      </div>
    </div>
  );
}
