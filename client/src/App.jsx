import { useEffect, useState, useCallback } from 'react';
import { Header, Footer } from './components.jsx';
import Home from './views/Home.jsx';
import Story from './views/Story.jsx';
import Pictures from './views/Pictures.jsx';
import Songs from './views/Songs.jsx';
import Tributes from './views/Tributes.jsx';
import { getSite, getSongs, getPhotos, getTributes } from './api.js';
import {
  fallbackSite, fallbackSongs, fallbackPhotos, fallbackTributes,
} from './fallback.js';

const VIEWS = new Set(['home', 'story', 'pictures', 'songs', 'tributes']);

export default function App() {
  const [view, setView] = useState('home');
  const [site, setSite] = useState(fallbackSite);
  const [songs, setSongs] = useState(fallbackSongs);
  const [photos, setPhotos] = useState(fallbackPhotos);
  const [tributes, setTributes] = useState(fallbackTributes);

  // Content loads from the API; fallbacks keep the site whole if it's offline.
  useEffect(() => {
    getSite().then(setSite).catch(() => {});
    getSongs().then(setSongs).catch(() => {});
    getPhotos().then((d) => setPhotos(d.photos)).catch(() => {});
  }, []);

  const loadTributes = useCallback(() => {
    getTributes()
      .then((d) => { if (d.tributes?.length) setTributes(d.tributes); })
      .catch(() => {});
  }, []);
  useEffect(() => { loadTributes(); }, [loadTributes]);

  const go = useCallback((next) => {
    setView(VIEWS.has(next) ? next : 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="desk">
      <div className="sheet">
        <div className="sheet__keyline">
          <div className="sheet__inner">
            <Header view={view} go={go} />

            {view === 'home' && (
              <Home site={site} songs={songs} photos={photos} tributes={tributes} go={go} />
            )}
            {view === 'story' && <Story site={site} go={go} />}
            {view === 'pictures' && <Pictures site={site} photos={photos} go={go} />}
            {view === 'songs' && <Songs site={site} songs={songs} go={go} />}
            {view === 'tributes' && (
              <Tributes site={site} tributes={tributes} go={go} onSubmitted={loadTributes} />
            )}

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
