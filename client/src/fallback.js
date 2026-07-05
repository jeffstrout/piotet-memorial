// Static fallback content so the site renders fully even before the API is
// reachable (e.g. static-only preview, or the API still booting). Mirrors the
// shape the API returns. Real data always wins when the fetch succeeds.

export const fallbackSite = {
  person: {
    name: 'Vincent Piotet',
    born: 1935,
    died: 2026,
    eyebrow: 'In loving memory of',
    tagline:
      'For twenty-one years he brought his guitar to the bedsides of hospice, and filled the quiet hours with music.',
  },
  service: {
    eyebrow: 'Service',
    title: 'Celebration of life',
    dateTime: 'To be announced',
    location: 'To be announced',
  },
  story: {
    eyebrow: 'His story',
    title: 'A quiet life, richly played',
    lead:
      'For twenty-one years, Vincent carried his guitar into the quietest rooms of the hospice and played until the silence softened. This is the story of a man who believed music belonged at every bedside.',
    body:
      'Placeholder paragraph one. The full obituary will be written with the family.\n\nPlaceholder paragraph two. His years of work, the people he loved, and how the guitar became a companion through all of it.\n\nPlaceholder paragraph three. The hospice years — twenty-one of them — and the roughly two hundred and fifty songs he recorded along the way.\n\nPlaceholder paragraph four. The smaller things: his favorite songs, the Tuesdays he never missed, the way a room changed when he began to play.\n\nPlaceholder paragraph five. A closing that gathers the life together and hands it to those who remember him.',
    pullQuote: 'He believed no one should be alone with silence.',
  },
  intros: {
    pictures: {
      title: 'A life in pictures',
      subtitle: 'Photographs and video from across Vincent’s life, gathered by his family.',
    },
    songs: {
      title: 'Two hundred and fifty songs',
      subtitle:
        'A selection of the songs Vincent recorded. Play any of them, or download the whole collection to keep.',
    },
    tributes: {
      title: 'What people remember',
      subtitle:
        'Memories shared by the family, friends, and the many people whose final days he brightened.',
    },
  },
};

export const fallbackSongs = {
  total: 250,
  downloadAllUrl: null,
  items: [
    { index: 1, title: 'Somewhere Over the Rainbow', note: 'A room favorite', duration: '3:12' },
    { index: 2, title: 'You Are My Sunshine', note: 'Sing-along', duration: '2:41' },
    { index: 3, title: 'Amazing Grace', note: 'Traditional', duration: '4:05' },
    { index: 4, title: 'Moon River', note: 'Evenings', duration: '3:28' },
    { index: 5, title: 'What a Wonderful World', note: 'Requested often', duration: '2:57' },
    { index: 6, title: 'Danny Boy', note: 'Traditional', duration: '3:44' },
    { index: 7, title: 'The Tennessee Waltz', note: 'Slow waltz', duration: '3:10' },
    { index: 8, title: 'Blue Skies', note: 'Standard', duration: '2:33' },
    { index: 9, title: 'Autumn Leaves', note: 'Instrumental', duration: '3:52' },
    { index: 10, title: 'Fly Me to the Moon', note: 'Uptempo', duration: '2:48' },
    { index: 11, title: 'Georgia on My Mind', note: 'Requested often', duration: '3:39' },
    { index: 12, title: 'Unchained Melody', note: 'Ballad', duration: '3:36' },
    { index: 13, title: 'Stardust', note: 'Standard', duration: '4:12' },
    { index: 14, title: "Can't Help Falling in Love", note: 'Sing-along', duration: '2:55' },
    { index: 15, title: 'The Way You Look Tonight', note: 'Standard', duration: '3:18' },
    { index: 16, title: 'Bridge Over Troubled Water', note: 'A room favorite', duration: '4:30' },
  ],
};

// 12 portrait frames; items 8 and 11 are video (per the design spec).
export const fallbackPhotos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  type: i + 1 === 8 || i + 1 === 11 ? 'video' : 'photo',
  src: null,
  poster: null,
  alt: '',
}));

// No tribute fallback: the guestbook shows only real, moderated memories (empty
// until the family and friends add them).
