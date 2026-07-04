import { useState, useRef } from 'react';
import { uploadFile } from './adminApi.js';

// A single media slot: upload a file to Spaces (when configured) OR paste an
// existing key. Shows a thumbnail preview when the key resolves to an image.
export default function MediaField({
  label, value, folder, accept, uploadsEnabled, cdnBase, isImage = true, onChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Accept either a storage key (prefix the CDN) or a full pasted URL.
  const previewUrl = value
    ? (/^https?:\/\//.test(value) ? value : (cdnBase ? `${cdnBase}/${value}` : null))
    : null;

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { key } = await uploadFile(file, folder);
      onChange(key);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="media-field">
      <span className="media-field__label">{label}</span>
      <div className="media-field__row">
        {isImage && previewUrl ? (
          <img className="media-field__thumb" src={previewUrl} alt="" />
        ) : (
          <div className="media-field__thumb media-field__thumb--empty">
            {value ? '♪' : '—'}
          </div>
        )}
        <div className="media-field__controls">
          {uploadsEnabled && (
            <>
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={onPick}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn btn--ghost"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? 'Uploading…' : 'Upload file'}
              </button>
            </>
          )}
          <input
            type="text"
            className="media-field__key"
            placeholder={uploadsEnabled ? 'or paste a storage key' : 'storage key (e.g. photos/01.jpg)'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}
