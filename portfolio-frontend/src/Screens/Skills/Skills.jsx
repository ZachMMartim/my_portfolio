// Skills.jsx — evidence table (direction 4a)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Skills.css";

/* ------------------------------------------------------------------
   Every skill cites where it was used, so the claim is checkable.
     since        first hands-on year (languages table only)
     evidence     project or role that proves it
     production   true = shipped to a real user, drives --production-only
   ------------------------------------------------------------------ */
const LANGUAGES = [
  {
    name: "TypeScript",
    since: "2024",
    evidence: "Cimento analytics service · Lumen · this portfolio",
    production: true,
  },
  {
    name: "Python",
    since: "2021",
    evidence: "Autoscanner OCR pipeline · Rover-Q · ML and AI coursework",
    production: true,
  },
  {
    name: "Go",
    since: "2026",
    evidence: "Cimento — bluemonday sanitization gate at send time",
    production: true,
  },
  {
    name: "SQL",
    since: "2023",
    evidence: "Multi-tenant Aurora Postgres schemas · Database Systems",
    production: true,
  },
  {
    name: "C++ / C",
    since: "2022",
    evidence: "PC Builder Simulator (Qt, Box2D) · Computer Systems",
    production: false,
  },
  {
    name: "C#",
    since: "2023",
    evidence: "Tanuki Hunt · Dream Scape · .NET/MAUI",
    production: false,
  },
  {
    name: "Java",
    since: "2022",
    evidence: "Data Structures & Algorithms coursework",
    production: false,
  },
];

const FRAMEWORKS = [
  {
    name: "React",
    evidence: "Lumen · FocusSync · this portfolio",
    production: true,
  },
  {
    name: "Next.js",
    evidence: "Cimento executive analytics service",
    production: true,
  },
  {
    name: "Firebase Functions",
    evidence: "Lumen publish pipeline and membership layer",
    production: true,
  },
  {
    name: "Node.js · FastAPI",
    evidence: "FocusSync backend · hackathon services",
    production: false,
  },
  {
    name: "Unity",
    evidence: "Tanuki Hunt · Dream Scape",
    production: false,
  },
];

const INFRASTRUCTURE = [
  {
    name: "AWS",
    evidence:
      "ECS, ECR, ALB, RDS Proxy, Secrets Manager at Cimento; AppSync on FocusSync",
    production: true,
  },
  {
    name: "Terraform",
    evidence: "23 resources provisioning the analytics service",
    production: true,
  },
  {
    name: "Docker · Actions",
    evidence: "Dockerized CI/CD pipeline at Cimento",
    production: true,
  },
  {
    name: "PostgreSQL",
    evidence: "Multi-tenant Aurora, schema-scoped Kysely client",
    production: true,
  },
  {
    name: "ServiceNow",
    evidence: "Three years on the University of Utah platform",
    production: true,
  },
];

const ALSO = [
  "OAuth 2.1 / OIDC",
  "multi-tenancy",
  "GraphQL",
  "REST APIs",
  "reinforcement learning",
  "digital image processing",
  "real-time audio",
  "Agile",
];

const Skills = () => {
  const navigate = useNavigate();
  const [productionOnly, setProductionOnly] = useState(false);

  const keep = (rows) =>
    productionOnly ? rows.filter((r) => r.production) : rows;

  const languages = keep(LANGUAGES);
  const frameworks = keep(FRAMEWORKS);
  const infrastructure = keep(INFRASTRUCTURE);

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
            <button
              className="term-nav-link"
              type="button"
              onClick={() => navigate("/DigitalResume")}
            >
              resume
            </button>
            <button className="term-nav-link is-active" type="button">
              skills
            </button>
            <button
              className="term-nav-link"
              type="button"
              onClick={() => navigate("/Extra")}
            >
              extras
            </button>
          </nav>
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

        <div className="skills-body">
          {/* ---- languages: full-width table with a since column ---- */}
          <section className="skills-group">
            <h2 className="group-head">
              <span className="group-label">languages</span>
              <span className="group-rule" />
            </h2>
            <div className="lang-head">
              <span>name</span>
              <span>since</span>
              <span>where I used it</span>
            </div>
            <div className="lang-rows">
              {languages.map((s) => (
                <div className="lang-row" key={s.name}>
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-since">{s.since}</span>
                  <span className="skill-evidence">{s.evidence}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ---- two narrower tables side by side ---- */}
          <div className="skills-columns">
            <section className="skills-group">
              <h2 className="group-head">
                <span className="group-label">frameworks</span>
                <span className="group-rule" />
              </h2>
              <div className="pair-rows">
                {frameworks.map((s) => (
                  <div className="pair-row" key={s.name}>
                    <span className="skill-name sm">{s.name}</span>
                    <span className="skill-evidence">{s.evidence}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="skills-group">
              <h2 className="group-head">
                <span className="group-label">infrastructure &amp; data</span>
                <span className="group-rule" />
              </h2>
              <div className="pair-rows">
                {infrastructure.map((s) => (
                  <div className="pair-row" key={s.name}>
                    <span className="skill-name sm">{s.name}</span>
                    <span className="skill-evidence">{s.evidence}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="skills-group">
            <h2 className="group-head">
              <span className="group-label">also</span>
              <span className="group-rule" />
            </h2>
            <div className="chips">
              {ALSO.map((c) => (
                <span className="chip" key={c}>
                  {c}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Skills;
