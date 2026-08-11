// Projects.jsx — split browser (direction 2a)
import "./Projects.css";

const Projects = () => {
  return (
    <div className="projects">
      <div className="term-window">
        <header className="term-header">
          <div className="term-dots" aria-hidden="true">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="term-title">zach@portfolio — ~/projects</span>
        </header>

        {/* ---- page intro ---- */}
        <div className="projects-intro">
          <p className="prompt">
            <span className="prompt-sigil">$</span> ls ~/projects --sort=recent
          </p>
          <h1 className="projects-title">Things I've built</h1>
          <p className="projects-lede">
            Coursework, capstone, hackathon weekends and game jams. A few repos
            are private — those are marked, and there's usually a demo video
            instead.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
