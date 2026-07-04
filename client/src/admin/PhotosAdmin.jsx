import { useEffect, useState, useCallback } from 'react';
import * as api from './adminApi.js';
import MediaField from './MediaField.jsx';

function PhotoCard({ photo, cfg, index, count, onChanged, onMove }) {
  const [d, setD] = useState({
    kind: photo.kind, srcKey: photo.srcKey, posterKey: photo.posterKey,
    caption: photo.caption, alt: photo.alt, published: photo.published,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const set = (k, v) => { setD((p) => ({ ...p, [k]: v })); setMsg(''); };

  async function save() {
    setSaving(true); setMsg('');
    try { await api.updatePhoto(photo.id, d); setMsg('Saved ✓'); onChanged(); }
    catch (e) { setMsg(e.message); }
    finally { setSaving(false); }
  }
  async function togglePublish() {
    try { await api.updatePhoto(photo.id, { ...d, published: !d.published }); set('published', !d.published); onChanged(); }
    catch (e) { setMsg(e.message); }
  }
  async function remove() {
    if (!confirm('Delete this photo permanently? (Use “Hide” to keep it but remove it from the site.)')) return;
    try { await api.deletePhoto(photo.id); onChanged(); } catch (e) { setMsg(e.message); }
  }

  return (
    <div className={`media-card${d.published ? '' : ' is-hidden'}`}>
      <div className="media-card__ord">
        <button disabled={index === 0} onClick={() => onMove(index, -1)} aria-label="Move up">↑</button>
        <span>{index + 1}</span>
        <button disabled={index === count - 1} onClick={() => onMove(index, 1)} aria-label="Move down">↓</button>
      </div>
      <div className="media-card__body">
        <label className="admin-field">
          <span>Type</span>
          <select value={d.kind} onChange={(e) => set('kind', e.target.value)}>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>
        </label>
        <MediaField
          label={d.kind === 'video' ? 'Video file' : 'Image file'}
          value={d.srcKey} folder={d.kind === 'video' ? 'videos' : 'photos'}
          accept={d.kind === 'video' ? 'video/*' : 'image/*'}
          isImage={d.kind !== 'video'}
          uploadsEnabled={cfg.enabled} cdnBase={cfg.cdnBase}
          onChange={(v) => set('srcKey', v)}
        />
        {d.kind === 'video' && (
          <MediaField
            label="Poster still (shown before play)"
            value={d.posterKey} folder="posters" accept="image/*"
            uploadsEnabled={cfg.enabled} cdnBase={cfg.cdnBase}
            onChange={(v) => set('posterKey', v)}
          />
        )}
        <label className="admin-field">
          <span>Caption / description</span>
          <input type="text" value={d.caption} onChange={(e) => set('caption', e.target.value)} />
        </label>
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

export default function PhotosAdmin({ onAuthError }) {
  const [photos, setPhotos] = useState(null);
  const [cfg, setCfg] = useState({ enabled: false, cdnBase: '' });
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api.getPhotos().then((d) => setPhotos(d.photos))
      .catch((e) => (e.status === 401 ? onAuthError() : setError(e.message)));
  }, [onAuthError]);

  useEffect(() => {
    api.getUploadConfig().then(setCfg).catch(() => {});
    load();
  }, [load]);

  async function add() {
    try { await api.createPhoto({ kind: 'photo' }); load(); }
    catch (e) { e.status === 401 ? onAuthError() : setError(e.message); }
  }

  // Move a card up/down and persist the new order.
  async function move(index, dir) {
    const next = [...photos];
    const j = index + dir;
    [next[index], next[j]] = [next[j], next[index]];
    setPhotos(next);
    try { await api.reorderPhotos(next.map((p) => p.id)); }
    catch (e) { setError(e.message); load(); }
  }

  if (error) return <p className="admin-error">{error}</p>;
  if (!photos) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="media-admin">
      <div className="media-admin__head">
        <p>
          The gallery, in display order. All media is portrait (3:4).
          {!cfg.enabled && ' Uploads aren’t configured yet — paste storage keys for now.'}
        </p>
        <button className="btn" onClick={add}>+ Add photo</button>
      </div>
      {photos.length === 0 ? (
        <p className="admin-empty">No photos yet. Click “Add photo”.</p>
      ) : (
        photos.map((p, i) => (
          <PhotoCard key={p.id} photo={p} cfg={cfg} index={i} count={photos.length} onChanged={load} onMove={move} />
        ))
      )}
    </div>
  );
}
