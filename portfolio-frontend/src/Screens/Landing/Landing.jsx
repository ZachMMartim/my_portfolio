// Landing.jsx — terminal-first front page (direction 1b)
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing">
      <div className="term-window">
        <header className="term-header">
          <div className="term-dots" aria-hidden="true">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="term-title">zach@portfolio — zsh</span>
        </header>

        <div className="term-body" />
      </div>
    </div>
  );
};

export default Landing;
