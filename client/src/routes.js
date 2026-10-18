// Path ↔ view mapping shared by the browser app and the build-time prerender.
// There is no router library: each view is a path, and each path is a static page.

export const VIEWS = ['home', 'story', 'pictures', 'songs', 'tributes'];
const VIEW_SET = new Set(VIEWS);

export function viewFromPath(pathname = '/') {
  const p = String(pathname).replace(/^\/+|\/+$/g, '');
  return VIEW_SET.has(p) ? p : 'home';
}

export function pathForView(view) {
  return view === 'home' ? '/' : `/${view}`;
}

// Ordinary left click navigates in-app. Modified clicks keep the browser default
// so open-in-new-tab still loads the prerendered page.
export function isPlainLeftClick(event) {
  return (
    event.button === 0
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey
  );
}

export function followLink(event, go, view) {
  if (!isPlainLeftClick(event)) return;
  event.preventDefault();
  go(view);
}

export function titleFor(view, site) {
  const name = site?.person?.name || 'Vincent Piotet';
  if (view === 'story') return `${site?.story?.title || 'His story'} · ${name}`;
  if (view === 'pictures') return `${site?.intros?.pictures?.title || 'Pictures'} · ${name}`;
  if (view === 'songs') return `${site?.intros?.songs?.title || 'Songs'} · ${name}`;
  if (view === 'tributes') return `${site?.intros?.tributes?.title || 'Tributes'} · ${name}`;
  return name;
}
