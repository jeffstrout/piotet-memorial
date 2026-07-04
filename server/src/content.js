// Loads the static content manifests (site, songs, photos) and resolves relative
// media keys to absolute CDN URLs. Read once at startup — content is static.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', '..', 'content');

const CDN = (process.env.MEDIA_CDN_BASE || '').replace(/\/$/, '');

// Turn a relative Spaces key (e.g. "songs/001.mp3") into a full CDN URL.
// Falsy keys pass through as null so the client can show a placeholder.
export const mediaUrl = (key) => (key ? `${CDN}/${key}` : null);

const load = async (name) =>
  JSON.parse(await readFile(join(CONTENT_DIR, name), 'utf8'));

export async function loadContent() {
  const [site, songsDoc, photosDoc] = await Promise.all([
    load('site.json'),
    load('songs.json'),
    load('photos.json'),
  ]);

  const songs = songsDoc.songs.map((s) => ({
    index: s.index,
    title: s.title,
    note: s.note,
    duration: s.duration,
    audioUrl: mediaUrl(s.audioKey),
    downloadUrl: mediaUrl(s.downloadKey),
  }));

  const photos = photosDoc.photos.map((p) => ({
    id: p.id,
    type: p.type,
    alt: p.alt || '',
    src: mediaUrl(p.srcKey),
    poster: mediaUrl(p.posterKey),
  }));

  return {
    site,
    songs: { total: songsDoc.total, downloadAllUrl: mediaUrl(songsDoc.downloadAllKey), items: songs },
    photos,
  };
}
