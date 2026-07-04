import { Eyebrow, BackLink, Divider } from '../components.jsx';

export default function Story({ site, go }) {
  const { story } = site;
  return (
    <div className="view-enter">
      <BackLink go={go} />
      <div className="center">
        <Eyebrow>{story.eyebrow}</Eyebrow>
        <h1 className="page-title">{story.title}</h1>
      </div>
      <Divider />
      <div className="story-body">
        {story.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="pull-quote">&ldquo;{story.pullQuote}&rdquo;</p>
    </div>
  );
}
