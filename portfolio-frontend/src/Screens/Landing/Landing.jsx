// Landing.jsx — terminal-first front page (direction 1b)
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import linkedinpfp from "../../assets/images/linkedinpfp.png";
import { asset } from "../../assets/assetMap";
import EXPERIENCE from "../../content/experience.json";
import SELECTED_WORK from "../../content/selectedWork.json";
import AskBar from "../../components/AskBar/AskBar";
import TermNav from "../../components/Navigation/TermNav";
import "./Landing.css";

const TAGLINE = "software engineer — production systems, end to end";

// Asset keys resolve to real imports here so the JSX below is unchanged.
const PROJECTS = SELECTED_WORK.map((p) => ({ ...p, image: asset(p.imageKey) }));

const Landing = () => {
  const navigate = useNavigate();
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
    link.href = "/assets/Files/ZachMartimResume-2026Q3.pdf";
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
          <TermNav active="home" />
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
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => navigate("/projects")}
                >
                  cd projects/
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

          {/* ---- Experience ---- */}
          <section className="block">
            <p className="prompt muted">$ cat experience.txt</p>
            <div className="exp-grid">
              {EXPERIENCE.map((job) => (
                <article className="exp-card" key={job.org}>
                  <h2 className="exp-org">{job.org}</h2>
                  <p className={`exp-dates ${job.current ? "accent" : ""}`}>
                    {job.role} · {job.dates}
                  </p>
                  <p className="exp-blurb">{job.blurb}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ---- Selected work ---- */}
          <section className="block">
            <p className="prompt muted">$ ls -l projects/ | head -3</p>
            <ul className="proj-list">
              {PROJECTS.map((p) => (
                <li className="proj-row" key={p.name}>
                  <div className="proj-lead">
                    {p.image ? (
                      <img src={p.image} alt="" className="proj-thumb" />
                    ) : (
                      <span className="proj-thumb proj-thumb--empty" />
                    )}
                    <h3 className="proj-name">{p.name}</h3>
                  </div>
                  <p className="proj-blurb">{p.blurb}</p>
                  <p className="proj-tag">{p.tag}</p>
                </li>
              ))}
            </ul>
            <button
              className="btn btn-ghost proj-all"
              type="button"
              onClick={() => navigate("/projects")}
            >
              see all projects →
            </button>
          </section>
        </div>
        <AskBar />
      </div>
    </div>
  );
};

export default Landing;
