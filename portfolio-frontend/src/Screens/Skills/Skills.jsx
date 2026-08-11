// Skills.jsx — evidence table (direction 4a)
import { useState } from "react";
import "./Skills.css";

const Skills = () => {
  const [productionOnly, setProductionOnly] = useState(false);

  return (
    <div className="skills">
      <div className="term-window">
        <header className="term-header">
          <div className="term-dots" aria-hidden="true">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="term-title">zach@portfolio — ~/skills</span>
        </header>

        <div className="skills-intro">
          <div className="intro-copy">
            <p className="prompt">
              <span className="prompt-sigil">$</span> cat skills.json
              --with-evidence
            </p>
            <h1 className="skills-title">What I work with</h1>
            <p className="skills-lede">
              No self-assigned percentages. Each line names where I've shipped
              with it, so you can check the claim against the project or the
              role.
            </p>
          </div>
          <div className="intro-actions">
            <button
              type="button"
              className={`flag ${!productionOnly ? "is-active" : ""}`}
              onClick={() => setProductionOnly(false)}
            >
              --all
            </button>
            <button
              type="button"
              className={`flag ${productionOnly ? "is-active" : ""}`}
              onClick={() => setProductionOnly(true)}
            >
              --production-only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
