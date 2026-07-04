// Reusable presentational pieces shared across the five views.

import {
  MusicIcon, PlayIcon, DownloadIcon, StarIcon, QuoteIcon,
  ImageIcon, ArrowRightIcon, ArrowLeftIcon,
} from './icons.jsx';

const NAV = [
  { key: 'story', label: 'His story' },
  { key: 'pictures', label: 'Pictures' },
  { key: 'songs', label: 'Songs' },
  { key: 'tributes', label: 'Tributes' },
];

export function Header({ view, go }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => go('home')} aria-label="Vincent Piotet — home">
        <MusicIcon />
        Vincent Piotet
      </button>
      <nav className="site-nav">
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => go(n.key)}
            aria-current={view === n.key}
          >
            {n.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <StarIcon />
      <p>Vincent Piotet · 1935 – 2026</p>
    </footer>
  );
}

export const Eyebrow = ({ children, onDark }) => (
  <p className={`eyebrow${onDark ? ' eyebrow--on-dark' : ''}`}>{children}</p>
);

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="divider__line" />
      <StarIcon />
      <span className="divider__line" />
    </div>
  );
}

export function DatesRule({ born, died }) {
  return (
    <div className="dates-rule" aria-hidden="true">
      <span className="dates-rule__line" />
      <span className="dates-rule__text">{born} · {died}</span>
      <span className="dates-rule__line" />
    </div>
  );
}

export const BackLink = ({ go }) => (
  <button className="tlink tlink--back" onClick={() => go('home')}>
    <ArrowLeftIcon />
    Back to home
  </button>
);

export const TextLink = ({ children, onClick }) => (
  <button className="tlink" onClick={onClick}>
    {children}
    <ArrowRightIcon />
  </button>
);

export function PhotoFrame({ photo }) {
  const isVideo = photo.type === 'video';
  const media = isVideo ? photo.poster : photo.src;
  return (
    <figure className="photo-frame">
      <div className="photo-frame__media">
        {media ? (
          <img src={media} alt={photo.alt || ''} loading="lazy" />
        ) : (
          <div className="photo-frame__placeholder">
            <ImageIcon />
            <span>{isVideo ? 'Video' : 'Photo'}</span>
          </div>
        )}
        {isVideo && (
          <span className="play-badge"><PlayIcon /></span>
        )}
      </div>
    </figure>
  );
}

export function SongRow({ song, onDark }) {
  return (
    <div className={`song-row${onDark ? ' on-dark' : ''}`}>
      <span className="song-row__index">
        {String(song.index).padStart(2, '0')}
      </span>
      <button className="play-btn" aria-label={`Play ${song.title}`}>
        <PlayIcon />
      </button>
      <div className="song-row__main">
        <div className="song-row__title">{song.title}</div>
        {song.note && <div className="song-row__note">{song.note}</div>}
      </div>
      <span className="song-row__duration">{song.duration}</span>
      <button className="icon-btn" aria-label={`Download ${song.title}`}>
        <DownloadIcon />
      </button>
    </div>
  );
}

export function TributeCard({ tribute }) {
  return (
    <blockquote className="tribute-card">
      <span className="icon-quote"><QuoteIcon /></span>
      <p className="tribute-card__quote">{tribute.quote}</p>
      <cite className="tribute-card__author">{tribute.author}</cite>
    </blockquote>
  );
}
