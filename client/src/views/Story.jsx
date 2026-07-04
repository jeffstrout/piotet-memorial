import { Eyebrow, BackLink, Divider } from '../components.jsx';
import { renderMarkdown } from '../markdown.js';

export default function Story({ site, go }) {
  const { story } = site;
  // Prefer the markdown `body`; fall back to legacy `paragraphs` if present.
  const html = story.body
    ? renderMarkdown(story.body)
    : (story.paragraphs || []).map((p) => `<p>${p}</p>`).join('');

  return (
    <div className="view-enter">
      <BackLink go={go} />
      <div className="center">
        <Eyebrow>{story.eyebrow}</Eyebrow>
        <h1 className="page-title">{story.title}</h1>
      </div>
      <Divider />
      <div className="story-body" dangerouslySetInnerHTML={{ __html: html }} />
      {story.pullQuote && (
        <p className="pull-quote">&ldquo;{story.pullQuote}&rdquo;</p>
      )}
    </div>
  );
}
