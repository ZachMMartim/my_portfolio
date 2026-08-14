// Projects.jsx — split browser (direction 2a)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { asset, assets } from "../../assets/assetMap";
import { PROJECTS as PROJECT_DATA } from "../../content/projects";
import { FaGithub } from "react-icons/fa";
import AskBar from "../../components/AskBar/AskBar";
import "./Projects.css";

/* ------------------------------------------------------------------
   Content lives here. Each project:
     kind      short label shown in the list column
     kindTone  "accent" highlights it (awards, capstone) | "" = muted
     date      short string for the date column
     tags      tech chips in the detail pane
     groups    which filters it belongs to
     images    [0] = list thumbnail, rest = detail gallery
     private   shows a "private" note and hides the repo button
   ------------------------------------------------------------------ */
const PROJECTS = PROJECT_DATA.map((p) => ({
  ...p,
  images: assets(p.imageKeys),
  video: asset(p.videoKey),
}));

const FILTERS = [
  { id: "all", label: "--all", test: () => true },
  {
    id: "award",
    label: "--award-winning",
    test: (p) => p.kindTone === "accent" && p.kind !== "capstone",
  },
  { id: "ai-ml", label: "--ai-ml", test: (p) => p.groups.includes("ai-ml") },
  { id: "web", label: "--web", test: (p) => p.groups.includes("web") },
  { id: "games", label: "--games", test: (p) => p.groups.includes("games") },
];

const Projects = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);

  const activeFilter = FILTERS.find((f) => f.id === filter) || FILTERS[0];
  const visible = PROJECTS.filter(activeFilter.test);
  const selected =
    visible.find((p) => p.id === selectedId) || visible[0] || PROJECTS[0];

  // A private repo is marked, not linked. A live demo can still be public.
  const showRepo = Boolean(selected.githuburl) && !selected.private;
  const showDemo =
    Boolean(selected.url) && selected.url !== selected.githuburl;

  // Keep a valid selection when the filter narrows the list.
  useEffect(() => {
    if (!visible.some((p) => p.id === selectedId) && visible[0]) {
      setSelectedId(visible[0].id);
    }
  }, [filter, selectedId, visible]);

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
          <nav className="term-nav">
            <button
              className="term-nav-link"
              type="button"
              onClick={() => navigate("/landing")}
            >
              home
            </button>
            <button className="term-nav-link is-active" type="button">
              projects
            </button>
            <button
              className="term-nav-link"
              type="button"
              onClick={() => navigate("/DigitalResume")}
            >
              resume
            </button>
            <button
              className="term-nav-link"
              type="button"
              onClick={() => navigate("/Skills")}
            >
              skills
            </button>
          </nav>
        </header>

        {/* ---- page intro + filters ---- */}
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
          <div className="filter-row">
            {FILTERS.map((f) => {
              const count = PROJECTS.filter(f.test).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`flag ${filter === f.id ? "is-active" : ""}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- split: list + detail ---- */}
        <div className="projects-split">
          <div className="proj-list-pane">
            <div className="list-head">
              <span>name</span>
              <span>kind</span>
              <span className="right">date</span>
            </div>
            <ul className="proj-list">
              {visible.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`proj-row ${
                      p.id === selected.id ? "is-selected" : ""
                    }`}
                    onClick={() => setSelectedId(p.id)}
                    aria-current={p.id === selected.id}
                  >
                    <span className="proj-lead">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt="" className="proj-thumb" />
                      ) : (
                        <span className="proj-thumb proj-thumb--empty" />
                      )}
                      <span className="proj-id">
                        <span className="proj-name">
                          {p.name}
                          {p.private && (
                            <span className="proj-private"> · private</span>
                          )}
                        </span>
                        <span className="proj-stack">{p.stack}</span>
                      </span>
                    </span>
                    <span
                      className={`proj-kind ${
                        p.kindTone === "accent" ? "accent" : ""
                      }`}
                    >
                      {p.kind}
                    </span>
                    <span className="proj-date">{p.date}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <aside className="detail-pane" key={selected.id}>
            <p className="detail-path">~/projects/{selected.id}</p>

            {selected.images[0] ? (
              <img
                src={selected.images[0]}
                alt={selected.name}
                className="detail-hero"
              />
            ) : (
              <div className="detail-hero detail-hero--empty">
                {selected.id} — screenshot
              </div>
            )}

            <div className="detail-head">
              <h2 className="detail-name">{selected.name}</h2>
              <p className="detail-meta">{selected.meta}</p>
              <p className="detail-description">{selected.description}</p>
            </div>

            {selected.highlights.length > 0 && (
              <div className="detail-block">
                <p className="detail-label">highlights</p>
                <ul className="detail-highlights">
                  {selected.highlights.map((h) => (
                    <li key={h}>
                      <span className="chevron" aria-hidden="true">
                        ›
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selected.images.length > 1 && (
              <div className="detail-block">
                <p className="detail-label">gallery</p>
                <div className="detail-gallery">
                  {selected.images.slice(1).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${selected.name} screenshot ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {selected.video && (
              <div className="detail-block">
                <p className="detail-label">demo</p>
                <video src={selected.video} controls className="detail-video" />
              </div>
            )}

            <div className="detail-tags">
              {selected.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>

            <div className="detail-actions">
              {showRepo && (
                <a
                  className="btn btn-primary"
                  href={selected.githuburl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub aria-hidden="true" /> view repo
                </a>
              )}
              {showDemo && (
                <a
                  className="btn btn-ghost"
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  live demo
                </a>
              )}
              {!showRepo && !showDemo && (
                <span className="detail-note">
                  private repo — happy to walk through it
                </span>
              )}
            </div>
          </aside>
        </div>
        <AskBar />
      </div>
    </div>
  );
};

export default Projects;
