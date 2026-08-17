import ReactMarkdown from "react-markdown";
import "./Markdown.css";

// Renders the assistant's markdown. Overrides only attach the panel's classes.
// See docs/decisions/askbar-markdown.md

// Clamped to h4-h6 so a model heading can't outrank the page's own.
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

  // Fences drop the inline chip styling in CSS, not here.
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
