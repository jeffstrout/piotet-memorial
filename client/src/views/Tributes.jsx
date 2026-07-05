import { useState } from 'react';
import { Eyebrow, BackLink, TributeCard } from '../components.jsx';
import { HeartIcon } from '../icons.jsx';
import { postTribute } from '../api.js';

export default function Tributes({ site, tributes, go, onSubmitted }) {
  const intro = site?.intros?.tributes || {};
  const [author, setAuthor] = useState('');
  const [quote, setQuote] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!author.trim() || !quote.trim() || busy) return;
    setBusy(true);
    setStatus('');
    try {
      const res = await postTribute({ author, quote });
      setStatus(res.message || 'Thank you. Your memory will appear once reviewed.');
      setAuthor('');
      setQuote('');
      onSubmitted?.();
    } catch (err) {
      setStatus(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="view-enter">
      <BackLink go={go} />
      <div className="center">
        <Eyebrow>Tributes</Eyebrow>
        <h1 className="page-title">{intro.title || 'What people remember'}</h1>
        <p className="subtitle">
          {intro.subtitle ||
            'Memories shared by the family, friends, and the many people whose final days he brightened.'}
        </p>
      </div>

      <div className="tribute-grid tribute-grid--page">
        {tributes.map((t) => <TributeCard key={t.id} tribute={t} />)}
      </div>

      {/* Leave a memory — dark plaque form */}
      <div className="plaque">
        <div className="plaque__inner">
          <Eyebrow onDark>Leave a memory</Eyebrow>
          <h2 className="section-title section-title--on-dark">Share your story of Vincent</h2>
          <form className="memory-form" onSubmit={submit}>
            <input
              type="text"
              placeholder="Your name"
              value={author}
              maxLength={80}
              onChange={(e) => setAuthor(e.target.value)}
              aria-label="Your name"
            />
            <div>
              <textarea
                placeholder="Write your memory of Vincent…"
                value={quote}
                maxLength={1000}
                onChange={(e) => setQuote(e.target.value)}
                aria-label="Your memory"
              />
              <div className={`memory-form__count${quote.length > 900 ? ' is-warn' : ''}`} aria-hidden="true">
                {quote.length} / 1000
              </div>
            </div>
            <div className="memory-form__status" role="status">{status}</div>
            <div>
              <button className="btn" type="submit" disabled={busy}>
                <HeartIcon /> {busy ? 'Posting…' : 'Post your memory'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
