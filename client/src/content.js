// Production content, imported at build time. Snapshot of the public site
// (approved tributes only; no private fields). Edit these JSON files and
// redeploy; nothing is fetched at runtime.

import contentBlocks from './data/content_blocks.json';
import photosDoc from './data/photos.json';
import songsDoc from './data/songs.json';
import tributesDoc from './data/tributes.json';

export const site = contentBlocks;
export const photos = photosDoc.photos;
export const songs = songsDoc;
export const tributes = tributesDoc.tributes;
