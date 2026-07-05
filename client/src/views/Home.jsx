import {
  Eyebrow, Divider, DatesRule, TextLink, SongRow, TributeCard,
} from '../components.jsx';
import Gallery from '../Gallery.jsx';
import { MusicIcon, DownloadIcon, CalendarIcon, PinIcon, HeartIcon } from '../icons.jsx';

export default function Home({ site, songs, photos, tributes, go }) {
  const { person, service } = site;
  const homePhotos = photos.filter((p) => p.type === 'photo').slice(0, 6);

  return (
    <div className="view-enter">
      {/* Hero — no action buttons */}
      <section className="hero">
        {person.portrait ? (
          <img className="hero__portrait" src={person.portrait} alt={`Portrait of ${person.name}`} />
        ) : (
          <div className="hero__portrait" role="img" aria-label={`Portrait of ${person.name}`} />
        )}
        <Eyebrow>{person.eyebrow}</Eyebrow>
        <h1 className="hero__name">{person.name}</h1>
        <DatesRule born={person.born} died={person.died} />
        <p className="hero__tagline">{person.tagline}</p>
      </section>

      {/* Celebration of life — dark plaque */}
      <div className="plaque">
        <div className="plaque__inner">
          <Eyebrow onDark>{service.eyebrow}</Eyebrow>
          <h2 className="section-title section-title--on-dark">{service.title}</h2>
          <div className="plaque__rows">
            <div>
              <div className="plaque__row-label"><CalendarIcon /> Date &amp; time</div>
              <div className="plaque__row-value">{service.dateTime}</div>
            </div>
            <div>
              <div className="plaque__row-label"><PinIcon /> Location</div>
              <div className="plaque__row-value">{service.location}</div>
            </div>
          </div>
        </div>
      </div>

      {/* His story teaser */}
      <section className="section">
        <Eyebrow>{site.story.eyebrow}</Eyebrow>
        <h2 className="section-title">{site.story.title}</h2>
        <p className="section__lead">{site.story.lead}</p>
        <div className="section__actions">
          <TextLink onClick={() => go('story')}>Read his full story</TextLink>
        </div>
      </section>

      <Divider />

      {/* Pictures */}
      <section className="section">
        <Eyebrow>Pictures</Eyebrow>
        <h2 className="section-title">A life in pictures</h2>
        {homePhotos.length > 0 ? (
          <Gallery photos={homePhotos} gridClass="photo-grid photo-grid--home" />
        ) : (
          <p className="section__lead">Photographs will be added here soon.</p>
        )}
        {homePhotos.length > 0 && (
          <div className="section__actions">
            <TextLink onClick={() => go('pictures')}>See all photos &amp; videos</TextLink>
          </div>
        )}
      </section>

      {/* Songs — dark songbook plaque */}
      <div className="plaque">
        <div className="plaque__inner">
          <Eyebrow onDark>His songbook</Eyebrow>
          <h2 className="section-title section-title--on-dark">Two hundred and fifty songs</h2>
          <div className="songlist">
            {songs.items.slice(0, 4).map((s) => (
              <SongRow key={s.index} song={s} onDark />
            ))}
          </div>
          <div className="section__actions">
            {songs.downloadAllUrl ? (
              <a className="btn" href={songs.downloadAllUrl} download>
                <DownloadIcon /> Download all {songs.total}
              </a>
            ) : (
              <button className="btn" disabled><DownloadIcon /> Download all {songs.total}</button>
            )}
            <TextLink onClick={() => go('songs')}>View the full songbook</TextLink>
          </div>
        </div>
      </div>

      {/* Tributes */}
      <section className="section">
        <Eyebrow>Tributes</Eyebrow>
        <h2 className="section-title">What people remember</h2>
        {tributes.length > 0 && (
          <div className="tribute-grid tribute-grid--home">
            {tributes.slice(0, 2).map((t) => <TributeCard key={t.id} tribute={t} />)}
          </div>
        )}
        {tributes.length === 0 && (
          <p className="section__lead">Be the first to share a memory of Vincent.</p>
        )}
        <div className="section__actions">
          <button className="btn btn--ghost" onClick={() => go('tributes')}>
            <HeartIcon /> Leave a memory
          </button>
          {tributes.length > 0 && (
            <TextLink onClick={() => go('tributes')}>Read all tributes</TextLink>
          )}
        </div>
      </section>
    </div>
  );
}
