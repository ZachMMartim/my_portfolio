// Projects.jsx — split browser (direction 2a)
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { asset, assets } from "../../assets/assetMap";
import PROJECT_DATA from "../../content/projects.json";
import { FaGithub } from "react-icons/fa";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import AskBar from "../../components/AskBar/AskBar";
import TermNav from "../../components/Navigation/TermNav";
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

/* The game's own design box. Its shell frames it at this size on desktop and it
   never reads window dimensions, so on a short phone the bottom row is clipped
   rather than compressed. See docs/decisions/card-fullscreen.md. */
const GAME_W = 430;
const GAME_H = 932;

const COMPACT = "(max-width: 700px)";

/* The native Fullscreen API is enhancement only — iOS Safari does not offer it
   for non-video elements, and the CSS mode already fills the viewport. Every
   call is best-effort and failure is ignored. */
const fullscreenElement = () =>
  document.fullscreenElement || document.webkitFullscreenElement || null;

const requestFullscreen = (el) => {
  const fn = el?.requestFullscreen || el?.webkitRequestFullscreen;
  if (fn) Promise.resolve(fn.call(el)).catch(() => {});
};

const exitFullscreen = () => {
  if (!fullscreenElement()) return;
  const fn = document.exitFullscreen || document.webkitExitFullscreen;
  if (fn) Promise.resolve(fn.call(document)).catch(() => {});
};

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  // The project currently open in the play overlay, or null. Holds the project
  // itself so the overlay describes what is playing, not what is selected.
  const [playing, setPlaying] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [scale, setScale] = useState(1);
  const shellRef = useRef(null);
  const stageRef = useRef(null);

  const activeFilter = FILTERS.find((f) => f.id === filter) || FILTERS[0];
  const visible = PROJECTS.filter(activeFilter.test);
  const selected =
    visible.find((p) => p.id === selectedId) || visible[0] || PROJECTS[0];

  // A private repo is marked, not linked. A live demo can still be public.
  const showRepo = Boolean(selected.githuburl) && !selected.private;
  const showDemo =
    Boolean(selected.url) && selected.url !== selected.githuburl;
  // A playUrl is served from this site's own public/ folder, so it runs in an
  // overlay here rather than opening a tab.
  const showPlay = Boolean(selected.playUrl);

  // Keep a valid selection when the filter narrows the list.
  useEffect(() => {
    if (!visible.some((p) => p.id === selectedId) && visible[0]) {
      setSelectedId(visible[0].id);
    }
  }, [filter, selectedId, visible]);

  // Honour ?play=<id> on load so a demo can be linked to directly. Guarded on
  // playUrl so a stale id is ignored rather than opening an empty overlay.
  useEffect(() => {
    const wanted = searchParams.get("play");
    if (!wanted) return;
    const target = PROJECTS.find((p) => p.id === wanted && p.playUrl);
    if (!target) return;
    setSelectedId(target.id);
    setPlaying(target);
  }, [searchParams]);

  // Tracked rather than read once, so a rotation re-fits instead of stranding
  // the game at a scale computed for the other orientation.
  useEffect(() => {
    const mq = window.matchMedia?.(COMPACT);
    if (!mq) return undefined;
    setIsCompact(mq.matches);
    const sync = (e) => setIsCompact(e.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Phones open fullscreen — the windowed shell is barely usable at that size.
  // CSS only: requestFullscreen needs a gesture and this runs from an effect.
  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia?.(COMPACT).matches) setIsFullscreen(true);
  }, [playing]);

  // The visitor can leave fullscreen with F11 or the browser's own affordance,
  // so the button's state follows the document rather than only our clicks.
  useEffect(() => {
    const sync = () => {
      if (!fullscreenElement()) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  // The page behind would otherwise scroll under the overlay on touch.
  useEffect(() => {
    if (!playing) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [playing]);

  // Scaling the whole document down is the only fit that cannot clip the action
  // row, because the game's layout is fixed and will not compress. Compact only:
  // on a desktop the game already frames itself and needs no help.
  const scaled = isFullscreen && isCompact;

  useEffect(() => {
    if (!playing || !scaled) return undefined;
    const el = stageRef.current;
    if (!el) return undefined;
    const fit = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      // Never above 1 — upscaling a 1.7MB canvas game only makes it blurry.
      setScale(Math.min(width / GAME_W, height / GAME_H, 1));
    };
    fit();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [playing, scaled]);

  // This click is a real gesture, so it is the only place native fullscreen can
  // be asked for.
  const toggleFullscreen = useCallback(() => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    if (next) requestFullscreen(shellRef.current);
    else exitFullscreen();
  }, [isFullscreen]);

  // Every close path routes through here, so the param never outlives the
  // overlay and a refresh cannot reopen a game the visitor dismissed.
  const closePlay = useCallback(() => {
    // Otherwise the browser stays fullscreen on the portfolio behind the game.
    exitFullscreen();
    setIsFullscreen(false);
    setPlaying(null);
    if (searchParams.has("play")) {
      searchParams.delete("play");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Escape closes the demo. The overlay covers the whole page, so leaving the
  // keyboard without a way out would trap anyone not using a mouse.
  useEffect(() => {
    if (!playing) return undefined;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      // In native fullscreen the browser already spends Escape on leaving it;
      // closing here too would dismiss the game on that same press.
      if (fullscreenElement()) return;
      closePlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, closePlay]);

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
          <TermNav active="projects" />
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
              {showPlay && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setPlaying(selected)}
                >
                  <span aria-hidden="true">▶</span> play now
                </button>
              )}
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
              {!showRepo && !showDemo && !showPlay && (
                <span className="detail-note">
                  private repo — happy to walk through it
                </span>
              )}
            </div>
          </aside>
        </div>
        <AskBar />
      </div>

      {playing && (
        <div
          className={`play-overlay ${isFullscreen ? "is-fullscreen" : ""}`}
          onClick={closePlay}
          role="dialog"
          aria-modal="true"
          aria-label={`${playing.name} — playable demo`}
        >
          <div
            ref={shellRef}
            className={`play-shell ${isFullscreen ? "is-fullscreen" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="play-bar">
              <span className="play-path">~/projects/{playing.id} — running</span>
              <div className="play-actions">
                <button
                  type="button"
                  className="play-fullscreen"
                  onClick={toggleFullscreen}
                  aria-pressed={isFullscreen}
                  aria-label={
                    isFullscreen ? "Leave fullscreen" : "Play fullscreen"
                  }
                >
                  {isFullscreen ? (
                    <MdFullscreenExit aria-hidden="true" />
                  ) : (
                    <MdFullscreen aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  className="play-close"
                  onClick={closePlay}
                  aria-label="Close the demo"
                >
                  ×
                </button>
              </div>
            </div>
            {/* The game is a separate document under public/, so it keeps its own
                fonts, audio and localStorage without touching the portfolio. */}
            <div className="play-stage" ref={stageRef}>
              <iframe
                src={playing.playUrl}
                title={`${playing.name} demo`}
                style={
                  scaled
                    ? {
                        width: `${GAME_W}px`,
                        height: `${GAME_H}px`,
                        transform: `scale(${scale})`,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
