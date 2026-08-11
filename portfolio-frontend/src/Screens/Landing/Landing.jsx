// Landing.jsx — terminal-first front page (direction 1b)
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import linkedinpfp from "../../assets/images/linkedinpfp.png";
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

            <aside className="id-card">
              <img
                src={linkedinpfp}
                alt="Zach Martim"
                className="id-photo"
                loading="lazy"
              />
              <dl className="id-meta">
                <div>
                  <dt>loc</dt>
                  <dd>Salt Lake City, UT</dd>
                </div>
                <div>
                  <dt>edu</dt>
                  <dd>
                    U of U — CS, AI/ML
                    <br />
                    GPA 3.6 · Dec 2026
                  </dd>
                </div>
                <div>
                  <dt>status</dt>
                  <dd className="accent">open to new-grad SWE</dd>
                </div>
              </dl>
              <div className="id-rule" />
              <ul className="id-links">
                <li>
                  <a
                    href="https://www.linkedin.com/in/zachmartim"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin aria-hidden="true" />
                    linkedin.com/in/zachmartim
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ZeroTheNerd"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub aria-hidden="true" />
                    github.com/ZeroTheNerd
                  </a>
                </li>
                <li>
                  <a href="mailto:zachmartim101@gmail.com">
                    <MdEmail aria-hidden="true" />
                    zachmartim101@gmail.com
                  </a>
                </li>
              </ul>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Landing;
