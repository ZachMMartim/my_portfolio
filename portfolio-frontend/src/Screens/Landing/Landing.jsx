// Landing.jsx — terminal-first front page (direction 1b)
import { useEffect, useRef, useState } from "react";
import "./Landing.css";

const TAGLINE = "software engineer — production systems, end to end";

const Landing = () => {
  const [typed, setTyped] = useState("");
  const timers = useRef([]);

  // Typewriter for the tagline. Respects reduced-motion, cleans up on unmount.
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduce) {
      setTyped(TAGLINE);
      return undefined;
    }

    let i = 0;
    const start = setTimeout(() => {
      const tick = setInterval(() => {
        i += 1;
        setTyped(TAGLINE.slice(0, i));
        if (i >= TAGLINE.length) clearInterval(tick);
      }, 42);
      timers.current.push(tick);
    }, 300);
    timers.current.push(start);

    return () => {
      timers.current.forEach((t) => {
        clearTimeout(t);
        clearInterval(t);
      });
      timers.current = [];
    };
  }, []);

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/assets/Files/ZachMResume.pdf";
    link.download = "ZachMartimResume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

        <div className="term-body">
          {/* ---- Hero ---- */}
          <section className="hero">
            <div className="hero-main">
              <p className="prompt">
                <span className="prompt-sigil">$</span> whoami
              </p>
              <h1 className="hero-name">Zach Martim</h1>
              <p className="hero-tagline">
                {typed}
                <span className="caret" aria-hidden="true">
                  _
                </span>
              </p>
              <p className="hero-pitch">
                New-grad software engineer graduating December 2026. Three years
                of engineering internships, three hackathon wins, and a habit of
                building the unglamorous parts — auth, multi-tenancy, data
                pipelines — properly.
              </p>
              <div className="hero-actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleDownloadResume}
                >
                  ./resume.pdf
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Landing;
