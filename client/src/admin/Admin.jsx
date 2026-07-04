import { useEffect, useState, useCallback } from 'react';
import { getToken, setToken, clearToken, verifyToken } from './adminApi.js';
import ContentEditor from './ContentEditor.jsx';
import PhotosAdmin from './PhotosAdmin.jsx';
import SongsAdmin from './SongsAdmin.jsx';
import TributesAdmin from './TributesAdmin.jsx';
import './admin.css';

const TABS = [
  { key: 'content', label: 'Site text' },
  { key: 'photos', label: 'Photos' },
  { key: 'songs', label: 'Songs' },
  { key: 'tributes', label: 'Tributes' },
];

export default function Admin() {
  const [authed, setAuthed] = useState(null); // null = checking
  const [tab, setTab] = useState('content');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  // On load, validate any stored token.
  useEffect(() => {
    if (!getToken()) { setAuthed(false); return; }
    verifyToken().then(() => setAuthed(true)).catch(() => { clearToken(); setAuthed(false); });
  }, []);

  const onAuthError = useCallback(() => { clearToken(); setAuthed(false); }, []);

  async function login(e) {
    e.preventDefault();
    if (!password.trim()) return;
    setChecking(true);
    setError('');
    setToken(password.trim());
    try {
      await verifyToken();
      setPassword('');
      setAuthed(true);
    } catch {
      clearToken();
      setError('That password was not accepted.');
    } finally {
      setChecking(false);
    }
  }

  function logout() {
    clearToken();
    setAuthed(false);
  }

  if (authed === null) {
    return <div className="admin-shell"><p className="admin-loading">Checking…</p></div>;
  }

  if (!authed) {
    return (
      <div className="admin-shell admin-shell--login">
        <form className="admin-login" onSubmit={login}>
          <h1>Piotet Memorial</h1>
          <p>Editor sign-in</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button className="btn" type="submit" disabled={checking}>
            {checking ? 'Signing in…' : 'Sign in'}
          </button>
          {error && <p className="admin-error">{error}</p>}
          <a className="admin-back" href="/">← Back to the site</a>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header__brand">Piotet Memorial · Editor</div>
        <nav className="admin-tabs">
          {TABS.map((t) => (
            <button key={t.key} className={tab === t.key ? 'is-active' : ''} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-header__right">
          <a className="admin-viewsite" href="/" target="_blank" rel="noreferrer">View site ↗</a>
          <button className="admin-logout" onClick={logout}>Sign out</button>
        </div>
      </header>

      <main className="admin-main">
        {tab === 'content' && <ContentEditor onAuthError={onAuthError} />}
        {tab === 'photos' && <PhotosAdmin onAuthError={onAuthError} />}
        {tab === 'songs' && <SongsAdmin onAuthError={onAuthError} />}
        {tab === 'tributes' && <TributesAdmin onAuthError={onAuthError} />}
      </main>
    </div>
  );
}
