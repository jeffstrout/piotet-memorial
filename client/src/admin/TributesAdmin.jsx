import { useEffect, useState, useCallback } from 'react';
import { getTributes, moderateTribute, deleteTribute } from './adminApi.js';

const FILTERS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function TributesAdmin({ onAuthError }) {
  const [filter, setFilter] = useState('pending');
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(
    (status) => {
      setRows(null);
      setError('');
      getTributes(status)
        .then((d) => setRows(d.tributes))
        .catch((err) => (err.status === 401 ? onAuthError() : setError(err.message)));
    },
    [onAuthError],
  );

  useEffect(() => { load(filter); }, [filter, load]);

  async function act(id, action) {
    setBusyId(id);
    try {
      await moderateTribute(id, action);
      setRows((rs) => rs.filter((r) => r.id !== id)); // drops out of the current filter
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    if (!confirm('Permanently delete this tribute? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await deleteTribute(id);
      setRows((rs) => rs.filter((r) => r.id !== id));
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="admin-tributes">
      <div className="admin-tabs admin-tabs--sub">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? 'is-active' : ''}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="admin-error">{error}</p>}
      {!rows ? (
        <p className="admin-loading">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="admin-empty">Nothing {filter}.</p>
      ) : (
        <ul className="admin-tribute-list">
          {rows.map((t) => (
            <li key={t.id} className="admin-tribute">
              <blockquote>{t.quote}</blockquote>
              <cite>— {t.author}</cite>
              <div className="admin-tribute__actions">
                {filter !== 'approved' && (
                  <button className="btn" disabled={busyId === t.id} onClick={() => act(t.id, 'approve')}>
                    Approve
                  </button>
                )}
                {filter !== 'rejected' && (
                  <button className="btn btn--ghost" disabled={busyId === t.id} onClick={() => act(t.id, 'reject')}>
                    Reject
                  </button>
                )}
                <button className="admin-danger" disabled={busyId === t.id} onClick={() => remove(t.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
