import { useEffect, useState, useCallback } from 'react';
import * as api from './adminApi.js';
import MediaField from './MediaField.jsx';

function SongCard({ song, cfg, index, count, onChanged, onMove }) {
  const [d, setD] = useState({
    title: song.title, note: song.note, duration: song.duration,
    audioKey: song.audioKey, published: song.published,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const set = (k, v) => { setD((p) => ({ ...p, [k]: v })); setMsg(''); };

  async function save() {
    setSaving(true); setMsg('');
    try { await api.updateSong(song.id, d); setMsg('Saved ✓'); onChanged(); }
    catch (e) { setMsg(e.message); } finally { setSaving(false); }
  }
  async function togglePublish() {
    try { await api.updateSong(song.id, { ...d, published: !d.published }); set('published', !d.published); onChanged(); }
    catch (e) { setMsg(e.message); }
  }
  async function remove() {
    if (!confirm('Delete this song permanently? (Use “Hide” to keep it off the site.)')) return;
    try { await api.deleteSong(song.id); onChanged(); } catch (e) { setMsg(e.message); }
  }

  return (
    <div className={`media-card${d.published ? '' : ' is-hidden'}`}>
      <div className="media-card__ord">
        <button disabled={index === 0} onClick={() => onMove(index, -1)} aria-label="Move up">↑</button>
        <span>{index + 1}</span>
        <button disabled={index === count - 1} onClick={() => onMove(index, 1)} aria-label="Move down">↓</button>
      </div>
      <div className="media-card__body">
        <div className="media-card__grid">
          <label className="admin-field"><span>Title</span>
            <input type="text" value={d.title} onChange={(e) => set('title', e.target.value)} /></label>
          <label className="admin-field"><span>Duration</span>
            <input type="text" placeholder="3:12" value={d.duration} onChange={(e) => set('duration', e.target.value)} /></label>
        </div>
        <label className="admin-field"><span>Note (italic subtitle)</span>
          <input type="text" value={d.note} onChange={(e) => set('note', e.target.value)} /></label>
        <MediaField
          label="Audio file" value={d.audioKey} folder="audio" accept="audio/*"
          isImage={false} uploadsEnabled={cfg.enabled} cdnBase={cfg.cdnBase}
          onChange={(v) => set('audioKey', v)}
        />
        <div className="media-card__actions">
          <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button className="btn btn--ghost" onClick={togglePublish}>{d.published ? 'Hide' : 'Publish'}</button>
          <button className="admin-danger" onClick={remove}>Delete</button>
          <span className="admin-savemsg">{msg}{!d.published && ' · hidden'}</span>
        </div>
      </div>
    </div>
  );
}

function SongbookMeta({ meta, cfg, onSaved }) {
  const [d, setD] = useState({ total: meta.total ?? '', downloadAllKey: meta.downloadAllKey ?? '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function save() {
    setSaving(true); setMsg('');
    try {
      await api.saveSongbook({
        total: d.total === '' ? null : Number(d.total),
        downloadAllKey: d.downloadAllKey || null,
      });
      setMsg('Saved ✓'); onSaved?.();
    } catch (e) { setMsg(e.message); } finally { setSaving(false); }
  }

  return (
    <section className="admin-block">
      <div className="admin-block__head">
        <h2>Collection</h2>
        <p>The stated total (“Two hundred and fifty songs”) and the “Download all” archive.</p>
      </div>
      <label className="admin-field"><span>Stated total</span>
        <input type="number" value={d.total} onChange={(e) => setD((p) => ({ ...p, total: e.target.value }))} /></label>
      <MediaField
        label="“Download all” archive (.zip)" value={d.downloadAllKey} folder="downloads"
        accept=".zip" isImage={false} uploadsEnabled={cfg.enabled} cdnBase={cfg.cdnBase}
        onChange={(v) => setD((p) => ({ ...p, downloadAllKey: v }))}
      />
      <div className="admin-block__actions">
        <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save collection'}</button>
        <span className="admin-savemsg">{msg}</span>
      </div>
    </section>
  );
}

export default function SongsAdmin({ onAuthError }) {
  const [songs, setSongs] = useState(null);
  const [meta, setMeta] = useState({ total: '', downloadAllKey: '' });
  const [cfg, setCfg] = useState({ enabled: false, cdnBase: '' });
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api.getSongs().then((d) => { setSongs(d.songs); setMeta(d.meta || {}); })
      .catch((e) => (e.status === 401 ? onAuthError() : setError(e.message)));
  }, [onAuthError]);

  useEffect(() => {
    api.getUploadConfig().then(setCfg).catch(() => {});
    load();
  }, [load]);

  async function add() {
    try { await api.createSong({ title: 'New song' }); load(); }
    catch (e) { e.status === 401 ? onAuthError() : setError(e.message); }
  }
  async function move(index, dir) {
    const next = [...songs];
    const j = index + dir;
    [next[index], next[j]] = [next[j], next[index]];
    setSongs(next);
    try { await api.reorderSongs(next.map((s) => s.id)); }
    catch (e) { setError(e.message); load(); }
  }

  if (error) return <p className="admin-error">{error}</p>;
  if (!songs) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="media-admin">
      <SongbookMeta meta={meta} cfg={cfg} onSaved={load} />
      <div className="media-admin__head">
        <p>
          The songbook, in display order.
          {!cfg.enabled && ' Uploads aren’t configured yet — paste storage keys for now.'}
        </p>
        <button className="btn" onClick={add}>+ Add song</button>
      </div>
      {songs.length === 0 ? (
        <p className="admin-empty">No songs yet. Click “Add song”.</p>
      ) : (
        songs.map((s, i) => (
          <SongCard key={s.id} song={s} cfg={cfg} index={i} count={songs.length} onChanged={load} onMove={move} />
        ))
      )}
    </div>
  );
}
