import { useEffect, useState } from 'react';
import { getContent, saveBlock } from './adminApi.js';
import { renderMarkdown } from '../markdown.js';

// Friendly titles/blurbs for each content block.
const BLOCK_META = {
  person: { title: 'Name & hero', blurb: 'The name, dates, and tagline on the home page.' },
  service: { title: 'Service details', blurb: 'The celebration-of-life plaque. Use “To be announced” until set.' },
  story: { title: 'His story', blurb: 'The obituary. The story body accepts Markdown (blank line = new paragraph, *italics*, **bold**).' },
  intros: { title: 'Page headings', blurb: 'Titles and subtitles for the Pictures, Songs, and Tributes pages.' },
};

const humanize = (k) =>
  k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();

// Immutably set a value at a nested path.
function setIn(obj, path, value) {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const base = obj && typeof obj === 'object' ? obj : {};
  return { ...base, [head]: setIn(base[head], rest, value) };
}

function Field({ fieldKey, value, path, onChange }) {
  const id = path.join('.');

  // Nested object → a labeled group.
  if (value && typeof value === 'object') {
    return (
      <fieldset className="admin-group">
        <legend>{humanize(fieldKey)}</legend>
        {Object.entries(value).map(([k, v]) => (
          <Field key={k} fieldKey={k} value={v} path={[...path, k]} onChange={onChange} />
        ))}
      </fieldset>
    );
  }

  if (typeof value === 'number') {
    return (
      <label className="admin-field">
        <span>{humanize(fieldKey)}</span>
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(path, e.target.value === '' ? '' : Number(e.target.value))}
        />
      </label>
    );
  }

  // The story body: Markdown editor with a live preview.
  if (fieldKey === 'body') {
    return (
      <label className="admin-field admin-field--md">
        <span>{humanize(fieldKey)} (Markdown)</span>
        <div className="admin-md">
          <textarea
            id={id}
            rows={14}
            value={value || ''}
            onChange={(e) => onChange(path, e.target.value)}
          />
          <div
            className="admin-md__preview story-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        </div>
      </label>
    );
  }

  const long = typeof value === 'string' && (value.length > 60 || value.includes('\n'));
  return (
    <label className="admin-field">
      <span>{humanize(fieldKey)}</span>
      {long ? (
        <textarea id={id} rows={3} value={value || ''} onChange={(e) => onChange(path, e.target.value)} />
      ) : (
        <input id={id} type="text" value={value ?? ''} onChange={(e) => onChange(path, e.target.value)} />
      )}
    </label>
  );
}

function BlockForm({ block }) {
  const meta = BLOCK_META[block.key] || { title: block.key, blurb: '' };
  const [data, setData] = useState(block.data);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const onChange = (path, value) => {
    setData((d) => setIn(d, path, value));
    setMsg('');
  };

  async function save() {
    setSaving(true);
    setMsg('');
    try {
      await saveBlock(block.key, data);
      setMsg('Saved ✓');
    } catch (err) {
      setMsg(err.message || 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-block">
      <div className="admin-block__head">
        <h2>{meta.title}</h2>
        {meta.blurb && <p>{meta.blurb}</p>}
      </div>
      {Object.entries(data).map(([k, v]) => (
        <Field key={k} fieldKey={k} value={v} path={[k]} onChange={onChange} />
      ))}
      <div className="admin-block__actions">
        <button className="btn" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <span className="admin-savemsg">{msg}</span>
      </div>
    </section>
  );
}

export default function ContentEditor({ onAuthError }) {
  const [blocks, setBlocks] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getContent()
      .then((d) => setBlocks(d.blocks))
      .catch((err) => (err.status === 401 ? onAuthError() : setError(err.message)));
  }, [onAuthError]);

  if (error) return <p className="admin-error">{error}</p>;
  if (!blocks) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-blocks">
      {blocks.map((b) => <BlockForm key={b.key} block={b} />)}
    </div>
  );
}
