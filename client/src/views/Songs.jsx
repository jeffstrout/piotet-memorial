import { Eyebrow, BackLink, SongRow } from '../components.jsx';
import { DownloadIcon } from '../icons.jsx';

export default function Songs({ songs, go }) {
  return (
    <div className="view-enter">
      <BackLink go={go} />
      <div className="center">
        <Eyebrow>His songbook</Eyebrow>
        <h1 className="page-title">Two hundred and fifty songs</h1>
        <p className="subtitle">
          A selection of the songs Vincent recorded. Play any of them, or download
          the whole collection to keep.
        </p>
        <div className="section__actions">
          <button className="btn"><DownloadIcon /> Download all {songs.total} songs</button>
        </div>
      </div>

      <div className="songlist songlist--card">
        {songs.items.map((s) => <SongRow key={s.index} song={s} />)}
        <p className="songlist__foot">
          Showing {songs.items.length} of {songs.total} — the full collection is available to download.
        </p>
      </div>
    </div>
  );
}
