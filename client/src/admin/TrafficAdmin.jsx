import { useEffect, useState } from 'react';
import { getStats } from './adminApi.js';

const PAGE_LABELS = {
  home: 'Home', story: 'His story', pictures: 'Pictures',
  songs: 'Songs', tributes: 'Tributes', other: 'Other',
};

const device = (ua = '') => (/Mobi|Android|iPhone|iPad/i.test(ua) ? 'Mobile' : 'Desktop');
const timeAgo = (iso) => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

function Stat({ n, label }) {
  return (
    <div className="stat">
      <div className="stat__n">{n ?? 0}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

export default function TrafficAdmin({ onAuthError }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStats()
      .then(setData)
      .catch((e) => (e.status === 401 ? onAuthError() : setError(e.message)));
  }, [onAuthError]);

  if (error) return <p className="admin-error">{error}</p>;
  if (!data) return <p className="admin-loading">Loading…</p>;

  const t = data.totals || {};
  const maxDaily = Math.max(1, ...data.daily.map((d) => d.views));
  const maxPage = Math.max(1, ...data.byPage.map((p) => p.views));

  return (
    <div className="traffic">
      {t.views === 0 && (
        <p className="admin-empty">No visits recorded yet — check back once the site has been shared.</p>
      )}

      <div className="stat-row">
        <Stat n={t.views} label="Total views" />
        <Stat n={t.visitors} label="Unique visitors" />
        <Stat n={t.views_7d} label="Views · last 7 days" />
        <Stat n={t.views_24h} label="Views · last 24 hours" />
      </div>

      <section className="admin-block">
        <div className="admin-block__head"><h2>Daily views</h2><p>Last 14 days (Central time).</p></div>
        <div className="bars">
          {data.daily.length === 0 ? (
            <p className="admin-empty">No data yet.</p>
          ) : data.daily.map((d) => (
            <div className="bars__col" key={d.day} title={`${d.day}: ${d.views} views, ${d.visitors} visitors`}>
              <div className="bars__bar" style={{ height: `${(d.views / maxDaily) * 100}%` }} />
              <div className="bars__x">{d.day.slice(5)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-block">
        <div className="admin-block__head"><h2>By page</h2></div>
        {data.byPage.map((p) => (
          <div className="pagebar" key={p.path}>
            <span className="pagebar__label">{PAGE_LABELS[p.path] || p.path}</span>
            <span className="pagebar__track"><span className="pagebar__fill" style={{ width: `${(p.views / maxPage) * 100}%` }} /></span>
            <span className="pagebar__n">{p.views}</span>
          </div>
        ))}
      </section>

      <section className="admin-block">
        <div className="admin-block__head"><h2>Recent visits</h2></div>
        <table className="recent">
          <tbody>
            {data.recent.map((r, i) => (
              <tr key={i}>
                <td>{PAGE_LABELS[r.path] || r.path}</td>
                <td className="recent__dev">{device(r.ua)}</td>
                <td className="recent__time">{timeAgo(r.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
