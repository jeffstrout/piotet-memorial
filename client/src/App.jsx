import { useEffect, useState, useCallback } from 'react';
import { Header, Footer } from './components.jsx';
import Home from './views/Home.jsx';
import Story from './views/Story.jsx';
import Pictures from './views/Pictures.jsx';
import Songs from './views/Songs.jsx';
import Tributes from './views/Tributes.jsx';
import { site, songs, photos, tributes } from './content.js';
import { viewFromPath, pathForView, titleFor } from './routes.js';

export default function App({ initialPath }) {
  const [view, setView] = useState(() =>
    viewFromPath(
      initialPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    ),
  );

  const go = useCallback((next) => {
    const v = viewFromPath(pathForView(next));
    if (v !== viewFromPath(window.location.pathname)) {
      window.history.pushState({ view: v }, '', pathForView(v));
    }
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onPop = () => setView(viewFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    document.title = titleFor(view, site);
  }, [view]);

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
              <Tributes site={site} tributes={tributes} go={go} />
            )}

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
