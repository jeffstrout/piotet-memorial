import { useEffect, useState, useCallback } from 'react';
import { Header, Footer } from './components.jsx';
import Home from './views/Home.jsx';
import Story from './views/Story.jsx';
import Pictures from './views/Pictures.jsx';
import Songs from './views/Songs.jsx';
import Tributes from './views/Tributes.jsx';
import { getSite, getSongs, getPhotos, getTributes, track } from './api.js';
import { fallbackSite, fallbackSongs, fallbackPhotos } from './fallback.js';

const VIEWS = new Set(['home', 'story', 'pictures', 'songs', 'tributes']);
const viewFromPath = () => {
  const p = window.location.pathname.replace(/^\/+|\/+$/g, '');
  return VIEWS.has(p) ? p : 'home';
};
const pathForView = (v) => (v === 'home' ? '/' : `/${v}`);

export default function App() {
  const [view, setView] = useState(viewFromPath);
  const [site, setSite] = useState(fallbackSite);
  const [songs, setSongs] = useState(fallbackSongs);
  const [photos, setPhotos] = useState(fallbackPhotos);
  const [tributes, setTributes] = useState([]);

  // Content loads from the API; fallbacks keep the site whole if it's offline.
  useEffect(() => {
    getSite().then(setSite).catch(() => {});
    getSongs().then(setSongs).catch(() => {});
    getPhotos().then((d) => setPhotos(d.photos)).catch(() => {});
  }, []);

  const loadTributes = useCallback(() => {
    // Always reflect the real list — an empty guestbook should render empty,
    // not fall back to placeholders.
    getTributes()
      .then((d) => setTributes(d.tributes || []))
      .catch(() => {});
  }, []);
  useEffect(() => { loadTributes(); }, [loadTributes]);

  const go = useCallback((next) => {
    const v = VIEWS.has(next) ? next : 'home';
    if (v !== viewFromPath()) window.history.pushState({ view: v }, '', pathForView(v));
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Browser back/forward → sync the view from the URL.
  useEffect(() => {
    const onPop = () => setView(viewFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Record a page view whenever the view changes (anonymous, no cookies).
  useEffect(() => { track(view); }, [view]);

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
