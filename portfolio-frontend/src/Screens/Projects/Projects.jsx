// Projects.jsx — split browser (direction 2a)
import { useEffect, useState } from "react";
import Bemvindos from "../../assets/images/bem-vindos.png";
import Buildurpc from "../../assets/images/BuildUrPC.png";
import difofguas from "../../assets/images/diffofgaussian.png";
import docscanner from "../../assets/images/docscanner.png";
import Dreamscape from "../../assets/images/Dreamscapelogo.png";
import edgedet from "../../assets/images/edgedetection.png";
import focussync from "../../assets/images/FocusSync.png";
import fpt from "../../assets/images/fourpointtransformdewarp.png";
import qrover from "../../assets/images/QRover.png";
import TanukiHunt from "../../assets/images/TanukiHunt.png";
import pcbuildervideo from "../../assets/videos/FinalProjectVideoDemo.mp4";
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
const PROJECTS = [
  {
    id: "lumen",
    name: "Lumen",
    stack: "React · TypeScript · Vertex AI",
    kind: "capstone",
    kindTone: "accent",
    date: "2026",
    meta: "senior capstone · team lead, 3 engineers · Jan 2026 – present",
    description:
      "A medical simulation platform for OSCE practice. An LLM authoring harness generates a full scenario — patient persona, rubric, conditional feedback — through a 3-stage conversation, replacing a 45-field manual form.",
    highlights: [
      "Plugin-based case system, 9 slide types behind a discriminated-union config",
      "Real-time speech engine: PCM16 capture at 16 kHz, gapless 24 kHz playback",
      "Built alongside 2 medical students across the full build",
    ],
    tags: ["React", "TypeScript", "Firebase", "Vertex AI"],
    groups: ["ai-ml", "web"],
    images: [],
    private: true,
  },
  {
    id: "rover-q",
    name: "Rover-Q",
    stack: "Three.js · Q-learning",
    kind: "1st place",
    kindTone: "accent",
    date: "Oct 2025",
    meta: "1st place · University of Utah × Redo Hackathon",
    description:
      "Uses Q-learning reinforcement learning to let a Mars rover find the best path from a start location to a target through rough terrain, modeled in a 3D Mars-like landscape powered by Three.js.",
    highlights: [],
    tags: ["JavaScript", "Three.js", "Reinforcement learning"],
    groups: ["ai-ml", "web"],
    images: [qrover],
    url: "https://github.com/ZeroTheNerd/CrimsonHacksFinal",
    githuburl: "https://github.com/ZeroTheNerd/CrimsonHacksFinal",
  },
  {
    id: "meeting-jira",
    name: "Meeting → Jira",
    stack: "LLM pipeline · Jira API",
    kind: "1st place",
    kindTone: "accent",
    date: "Dec 2025",
    meta: "1st place · TicketMaster Hack the SDLC",
    description:
      "An AI system converting meeting recordings into structured, ready-to-import Jira tickets that users can edit or adopt directly.",
    highlights: [],
    tags: ["Python", "LLM", "Jira API"],
    groups: ["ai-ml"],
    images: [],
    private: true,
  },
  {
    id: "prelaunch-analytics",
    name: "Pre-Launch Product Analytics",
    stack: "Agentic AI · profile-driven agents",
    kind: "3rd place",
    kindTone: "accent",
    date: "Aug 2025",
    meta: "3rd place · Redo Agentic AI Hackathon",
    description:
      "An agentic AI platform modeling user behavior through profile-driven agents, letting companies forecast product performance and optimize e-commerce strategy before launch.",
    highlights: [],
    tags: ["Python", "Agents", "LLM"],
    groups: ["ai-ml"],
    images: [],
    private: true,
  },
  {
    id: "autoscanner",
    name: "Autoscanner",
    stack: "Python · OpenCV · OCR",
    kind: "coursework",
    kindTone: "",
    date: "2025",
    meta: "digital image processing",
    description:
      "Scans book pages using a mobile camera. Detects and isolates the page area, flattens curled pages, pre-processes for OCR, and runs an OCR pipeline to extract searchable text.",
    highlights: [
      "Detecting and isolating the page area",
      "Flattening curled pages using a four-point transform dewarp",
      "OCR pipeline extracts searchable text from each image",
    ],
    tags: ["Python", "OpenCV", "OCR"],
    groups: ["ai-ml"],
    images: [docscanner, edgedet, difofguas, fpt],
    url: "https://github.com/ZeroTheNerd/auto_scanner",
    githuburl: "https://github.com/ZeroTheNerd/auto_scanner",
  },
  {
    id: "focussync",
    name: "FocusSync",
    stack: "React · AppSync · GraphQL",
    kind: "side project",
    kindTone: "",
    date: "wip",
    meta: "side project · work in progress",
    description:
      "A Pomodoro app with React and Node on the frontend, AWS AppSync and GraphQL behind it.",
    highlights: [],
    tags: ["React", "Node.js", "AppSync", "GraphQL"],
    groups: ["web"],
    images: [focussync],
    githuburl: "https://github.com/jelston11/pmdo_frontend",
    private: true,
  },
  {
    id: "tanuki-hunt",
    name: "Tanuki Hunt: Swiped Spirits",
    stack: "Unity · C#",
    kind: "game jam",
    kindTone: "",
    date: "2024",
    meta: "game jam · Ludum Dare 56",
    description:
      "A stealth platformer made in Unity for the Ludum Dare 56 game jam. Playable on itch.io.",
    highlights: [],
    tags: ["Unity", "C#"],
    groups: ["games"],
    images: [TanukiHunt],
    url: "https://lunaruu.itch.io/tanuki-hunt-stolen",
    githuburl: "https://github.com/AlmityTuhm/LudumDare56",
  },
  {
    id: "dream-scape",
    name: "Dream Scape",
    stack: "Unity · FPS",
    kind: "game jam",
    kindTone: "",
    date: "2023",
    meta: "game jam · team of engineers",
    description:
      "An FPS shooter developed with a few other engineers for one of my university's game jams. The linked repo is a public copy; the original has 186 commits.",
    highlights: [],
    tags: ["Unity", "C#"],
    groups: ["games"],
    images: [Dreamscape],
    url: "https://almitytuhm.itch.io/dream-scape",
    githuburl: "https://github.com/ZeroTheNerd/dream_scape",
  },
  {
    id: "pc-builder",
    name: "PC Builder Simulator",
    stack: "C++ · Qt · Box2D",
    kind: "coursework",
    kindTone: "",
    date: "2024",
    meta: "coursework · Software Development 2",
    description:
      "A Qt app written in C++ using Box2D physics, built as the final project for my Software Development 2 class. The repo is private, so there's a demo video instead.",
    highlights: [],
    tags: ["C++", "Qt", "Box2D"],
    groups: ["games"],
    images: [Buildurpc],
    video: pcbuildervideo,
    private: true,
  },
  {
    id: "portuguese-portfolio",
    name: "Portuguese Portfolio",
    stack: "Bootstrap · HTML/CSS",
    kind: "personal",
    kindTone: "",
    date: "2022",
    meta: "personal · where I started",
    description:
      "A portfolio site for my journey learning Portuguese, hosted locally with Bootstrap. Not the most technical thing here, but it's a reminder of where I started — Portuguese is my dad's mother tongue and a language I still study.",
    highlights: [],
    tags: ["Bootstrap", "HTML", "CSS"],
    groups: ["web"],
    images: [Bemvindos],
    url: "https://github.com/ZeroTheNerd/portuguese_portfolio",
    githuburl: "https://github.com/ZachMartim/zachportfolio.github.io",
  },
];

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
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);

  const activeFilter = FILTERS.find((f) => f.id === filter) || FILTERS[0];
  const visible = PROJECTS.filter(activeFilter.test);
  const selected =
    visible.find((p) => p.id === selectedId) || visible[0] || PROJECTS[0];

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
        </div>
      </div>
    </div>
  );
};

export default Projects;
