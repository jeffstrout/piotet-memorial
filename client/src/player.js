// Tiny shared audio player so the songbook plays one track at a time.
// Components subscribe via useSyncExternalStore and re-render on play/pause.

let audio = null;
let snapshot = { url: null, playing: false };
const listeners = new Set();

function emit() {
  snapshot = { url: audio ? audio.src : null, playing: !!(audio && !audio.paused && !audio.ended) };
  listeners.forEach((fn) => fn());
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot() {
  return snapshot;
}

// Play the given url, toggling pause if it's already the current track.
export function toggle(url) {
  if (!url) return;
  if (audio && audio.src === url) {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
    return; // 'play'/'pause' events call emit()
  }
  if (audio) audio.pause();
  audio = new Audio(url);
  ['play', 'pause', 'ended', 'error'].forEach((e) => audio.addEventListener(e, emit));
  audio.play().catch(() => {});
  emit();
}
