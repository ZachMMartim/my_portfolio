import ReactMarkdown from "react-markdown";
import "./Markdown.css";

// The chat answers arrive as markdown. Nothing asks the model for it -- the
// system prompt in functions/persona.js is itself written in markdown, so the
// model mirrors the format it was handed. Rendering that string straight into
// a <span> printed literal ** and folded every newline away, because HTML
// collapses whitespace and a span is inline.
//
// react-markdown does not render raw HTML unless rehype-raw is added, and it
// runs hrefs through a URL transform, so nothing the model returns can inject
// markup. The overrides below add no behaviour -- they exist only to hang the
// terminal panel's classes off the elements react-markdown generates.

// Chat turns sit inside the page, so a model that opens with "# Projects"
// should not outrank the page's own headings. Everything lands in h4-h6.
const heading = (level) => {
  const Tag = `h${Math.min(level + 3, 6)}`;
  const Heading = ({ children }) => <Tag className="ask-md-heading">{children}</Tag>;
  return Heading;
};

const components = {
  p: ({ children }) => <p className="ask-md-p">{children}</p>,
  strong: ({ children }) => <strong className="ask-md-strong">{children}</strong>,
  ul: ({ children }) => <ul className="ask-md-list">{children}</ul>,
  ol: ({ children }) => <ol className="ask-md-list">{children}</ol>,
  blockquote: ({ children }) => <blockquote className="ask-md-quote">{children}</blockquote>,
  hr: () => <hr className="ask-md-rule" />,

  // Fenced blocks keep the chip styling off: .ask-md-pre .ask-md-code undoes
  // the inline background and border in CSS rather than branching here, which
  // is what lets both cases share one component.
  pre: ({ children }) => <pre className="ask-md-pre">{children}</pre>,
  code: ({ className, children }) => (
    <code className={`ask-md-code${className ? ` ${className}` : ""}`}>{children}</code>
  ),

  a: ({ href, children }) => (
    <a className="ask-md-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),

  h1: heading(1),
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),
  h5: heading(5),
  h6: heading(6),
};

const Markdown = ({ children }) => (
  <div className="ask-md">
    <ReactMarkdown components={components}>{children}</ReactMarkdown>
  </div>
);

export default Markdown;
