// DigitalResume.jsx — career log (direction 3b)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import byulogo from "../../assets/images/Byulogo.png";
import Ulogo from "../../assets/images/Ulogored.png";
import AskBar from "../../components/AskBar/AskBar";
import "./DigitalResume.css";

/* ------------------------------------------------------------------
   One spine, newest first. Each entry:
     type     work | education | project | award  (drives the filters)
     head     true = current position, gets the HEAD badge + filled dot
     start    left column, top line
     end      left column, second line
     bullets  rendered inside a card, prefixed with "+"
     logo     optional school/company mark
   ------------------------------------------------------------------ */
const ENTRIES = [
  {
    id: "cimento",
    type: "work",
    head: true,
    start: "Jan 2026",
    end: "present",
    title: "Software Engineer Intern",
    org: "Cimento AI",
    meta: "Salt Lake City, UT · 7 months",
    bullets: [
      "Executive analytics service in Next.js and TypeScript — 15 metrics, 4 views, multi-tenant Aurora Postgres.",
      "Schema-scoped Kysely client on one shared pool, parallelized so a failing tenant can't break reporting.",
      "Production MCP server as an OAuth 2.1 resource server, 8 read-only tools, tenant-scoped audit logging.",
      "23 Terraform resources with a Dockerized GitHub Actions pipeline and a read-only database role.",
    ],
    tags: ["Next.js", "TypeScript", "Go", "Terraform", "Aurora Postgres"],
  },
  {
    id: "lumen",
    type: "project",
    start: "Jan 2026",
    end: "capstone",
    title: "Lumen — senior capstone",
    badge: "team lead, 3 engineers",
    description:
      "Medical simulation platform: LLM scenario authoring replacing a 45-field form, a plugin-based case system with 9 slide types, and a real-time speech-to-speech audio engine.",
  },
  {
    id: "hackathons",
    type: "award",
    start: "Dec 2025",
    end: "Aug 2025",
    title: "Three hackathon placements",
    awards: [
      {
        place: "1st",
        text: "Waystar Hack the SDLC — meeting recordings into Jira tickets",
      },
      {
        place: "1st",
        text: "University of Utah × Redo — Rover-Q, Q-learning path planning",
      },
      {
        place: "3rd",
        text: "Redo Agentic AI — pre-launch product analytics",
      },
    ],
  },
  {
    id: "servicenow",
    type: "work",
    start: "Dec 2022",
    end: "Jan 2026",
    title: "Software Engineer Intern",
    org: "ServiceNow · University of Utah",
    meta: "Salt Lake City, UT · 3 years 2 months",
    bullets: [
      "Workflows, forms, KPIs, reports and modules on a team of 15+ developers.",
      "150+ system bugs resolved across university IT infrastructure.",
      "Cisco ISE integration via the ERS REST API through MID Servers.",
    ],
    tags: ["ServiceNow", "JavaScript", "REST APIs", "Flow Designer"],
  },
  {
    id: "utah",
    type: "education",
    start: "Aug 2022",
    end: "Dec 2026",
    title: "University of Utah",
    logo: Ulogo,
    description:
      "B.S. Computer Science, AI/ML and Information tracks · GPA 3.6",
    note:
      "Adv. AI · Machine Learning · Algorithms · Database Systems · Computer Systems · Digital Image Processing",
  },
  {
    id: "byu",
    type: "education",
    start: "Aug 2021",
    end: "Apr 2022",
    title: "Brigham Young University",
    logo: byulogo,
    description:
      "B.S. Computer Science — transferred to the University of Utah",
  },
];

const FILTERS = [
  { id: "all", label: "--all", test: () => true },
  { id: "work", label: "--work", test: (e) => e.type === "work" },
  {
    id: "education",
    label: "--education",
    test: (e) => e.type === "education",
  },
  { id: "projects", label: "--projects", test: (e) => e.type === "project" },
  { id: "awards", label: "--awards", test: (e) => e.type === "award" },
];

const DigitalResume = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const active = FILTERS.find((f) => f.id === filter) || FILTERS[0];
  const visible = ENTRIES.filter(active.test);

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/assets/Files/ZachMartimResume-2026Q3.pdf";
    link.download = "ZachMartimResume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="resume">
      <div className="term-window">
        <header className="term-header">
          <div className="term-dots" aria-hidden="true">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="term-title">
            zach@portfolio — git log --career
          </span>
          <nav className="term-nav">
            <button
              className="term-nav-link"
              type="button"
              onClick={() => navigate("/landing")}
            >
              home
            </button>
            <button
              className="term-nav-link"
              type="button"
              onClick={() => navigate("/projects")}
            >
              projects
            </button>
            <button className="term-nav-link is-active" type="button">
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

        <div className="resume-intro">
          <div className="intro-copy">
            <p className="prompt">
              <span className="prompt-sigil">$</span> git log --career --graph
            </p>
            <h1 className="resume-title">Career log</h1>
            <p className="resume-lede">
              Four years, newest first. Work, school and the projects that came
              out of them, on one branch.
            </p>
          </div>
          <div className="intro-actions">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`flag ${filter === f.id ? "is-active" : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
            <button
              type="button"
              className="flag flag-download"
              onClick={handleDownloadResume}
            >
              download .pdf
            </button>
          </div>
        </div>

        <div className="log">
          {visible.map((e, i) => {
            const last = i === visible.length - 1;
            return (
              <article className={`log-entry ${last ? "is-last" : ""}`} key={e.id}>
                <div className="log-dates">
                  <span className={e.head ? "accent" : ""}>{e.start}</span>
                  <span className="log-dates-end">{e.end}</span>
                </div>

                <div className="log-graph" aria-hidden="true">
                  <span
                    className={`log-dot ${
                      e.head ? "is-head" : e.type === "project" ? "is-open" : ""
                    }`}
                  />
                  {!last && <span className="log-line" />}
                </div>

                <div className="log-body">
                  <div className="log-head">
                    {e.head && <span className="head-badge">HEAD</span>}
                    {e.logo && <img src={e.logo} alt="" className="log-logo" />}
                    <h2 className="log-title">{e.title}</h2>
                    {e.org && <span className="log-org">{e.org}</span>}
                    {e.badge && <span className="log-badge">{e.badge}</span>}
                  </div>

                  {e.meta && <p className="log-meta">{e.meta}</p>}

                  {e.description && (
                    <p className="log-description">{e.description}</p>
                  )}
                  {e.note && <p className="log-note">{e.note}</p>}

                  {e.bullets && (
                    <div className="log-card">
                      {e.bullets.map((b) => (
                        <p className="log-bullet" key={b}>
                          <span className="plus" aria-hidden="true">
                            +
                          </span>
                          {b}
                        </p>
                      ))}
                      {e.tags && (
                        <div className="log-tags">
                          {e.tags.map((t) => (
                            <span className="tag" key={t}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {e.awards && (
                    <div className="log-awards">
                      {e.awards.map((a) => (
                        <p className="log-award" key={a.text}>
                          <span className="award-place">{a.place}</span>
                          {a.text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <AskBar />
      </div>
    </div>
  );
};

export default DigitalResume;
