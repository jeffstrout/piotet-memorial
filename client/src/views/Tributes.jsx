import { Eyebrow, BackLink, TributeCard } from '../components.jsx';

export default function Tributes({ site, tributes, go }) {
  const intro = site?.intros?.tributes || {};
  return (
    <div className="view-enter">
      <BackLink go={go} />
      <div className="center">
        <Eyebrow>Tributes</Eyebrow>
        <h1 className="page-title">{intro.title || 'What people remember'}</h1>
        <p className="subtitle">
          {intro.subtitle ||
            'Memories shared by the family, friends, and the many people whose final days he brightened.'}
        </p>
      </div>

      {tributes.length > 0 ? (
        <div className="tribute-grid tribute-grid--page">
          {tributes.map((t) => <TributeCard key={t.id} tribute={t} />)}
        </div>
      ) : (
        <p className="subtitle">No memories were shared.</p>
      )}

      <p className="closed-note">
        {tributes.length > 0
          ? 'The tribute book is closed. These memories remain as they were shared.'
          : 'The tribute book is closed.'}
      </p>
    </div>
  );
}
