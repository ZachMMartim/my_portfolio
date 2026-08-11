// DigitalResume.jsx — career log (direction 3b)
import { useState } from "react";
import "./DigitalResume.css";

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
  const [filter, setFilter] = useState("all");

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/assets/Files/ZachMResume.pdf";
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
      </div>
    </div>
  );
};

export default DigitalResume;
