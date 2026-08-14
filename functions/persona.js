// Builds the system prompt from the same content the site renders.
//
// This replaces the SUMMARY and LINKEDIN_INFO strings that were typed by hand
// into the old Supabase edge function and then drifted -- 8 of the 10 projects
// on the site, Lumen among them, were missing from them.
//
// The whole portfolio is roughly 3.4k tokens, so all of it goes in the prompt.
// There is no retrieval step because at this size there is nothing to retrieve
// from: the entire corpus fits in context many times over.

const EXPERIENCE = require("./content/experience.json");
const PROJECTS = require("./content/projects.json");
const ENTRIES = require("./content/resume.json");
const SELECTED_WORK = require("./content/selectedWork.json");
const SKILLS = require("./content/skills.json");

const NAME = "Zach Martim";
const EMAIL = "zachmartim101@gmail.com";

const bullet = (s) => `  - ${s}`;
const join = (parts) => parts.filter(Boolean).join("\n");

const renderExperience = () =>
  EXPERIENCE.map((job) =>
    join([
      `### ${job.org} — ${job.role}`,
      `${job.dates}${job.current ? " (current)" : ""}`,
      job.blurb,
    ])
  ).join("\n\n");

const renderProjects = () =>
  PROJECTS.map((p) =>
    join([
      `### ${p.name}`,
      p.stack && `Stack: ${p.stack}`,
      p.meta,
      p.description,
      p.highlights && p.highlights.map(bullet).join("\n"),
      p.tags && `Tags: ${p.tags.join(", ")}`,
      p.url && `Live: ${p.url}`,
      p.githuburl && `Source: ${p.githuburl}`,
      p.private &&
        "The repo for this one is private — offer to walk through it rather than promising a link.",
    ])
  ).join("\n\n");

const renderCareerLog = () =>
  ENTRIES.map((e) => {
    const when = [e.start, e.end].filter(Boolean).join(" – ");
    const head = [e.title, e.org].filter(Boolean).join(" · ");
    return join([
      `### ${head}${when ? ` (${when})` : ""}`,
      e.type && `Type: ${e.type}`,
      e.meta,
      e.description,
      e.bullets && e.bullets.map(bullet).join("\n"),
      e.awards && e.awards.map((a) => bullet(`${a.place} — ${a.text}`)).join("\n"),
      e.note,
      e.tags && `Tags: ${e.tags.join(", ")}`,
    ]);
  }).join("\n\n");

const renderSkillTable = (label, rows) =>
  join([
    `### ${label}`,
    rows
      .map((s) => bullet(`${s.name}${s.since ? ` (since ${s.since})` : ""} — ${s.evidence}`))
      .join("\n"),
  ]);

const renderSkills = () =>
  [
    renderSkillTable("Languages", SKILLS.LANGUAGES),
    renderSkillTable("Frameworks", SKILLS.FRAMEWORKS),
    renderSkillTable("Infrastructure and data", SKILLS.INFRASTRUCTURE),
    `### Also familiar with\n${SKILLS.ALSO.map(bullet).join("\n")}`,
  ].join("\n\n");

const renderSelectedWork = () =>
  SELECTED_WORK.map((p) => bullet(`${p.name} — ${p.blurb} (${p.tag})`)).join("\n");

function buildPersona() {
  return `You are ${NAME}, answering questions on your own portfolio site. Speak in the first person as ${NAME}, not as an assistant describing him.

Everything you know about ${NAME} is below. It is generated from the same content the site renders, so it is current. Ground every answer in it.

Rules:
- Be direct and concrete. A specific detail from a real project beats a general claim about being passionate or hardworking.
- Never invent a project, employer, date, metric or technology. If it is not below, you do not know it.
- When you cannot answer, say so plainly and call record_unknown_question so ${NAME} can fill the gap. Do this even for trivial or off-topic questions.
- You are talking to recruiters and engineers. Match the register: plain language for recruiters, real specifics for engineers.
- If someone shows hiring interest, ask for their email and record it with record_user_details. ${NAME} is reachable directly at ${EMAIL}.
- Keep answers to a few sentences unless asked to go deeper. This renders in a small terminal panel, not a document.

## Currently

${NAME} is a new-grad software engineer graduating December 2026 from the University of Utah (Computer Science, AI/ML focus, GPA 3.6), based in Salt Lake City and open to new-grad SWE roles. Reachable at ${EMAIL}, linkedin.com/in/zachmartim, github.com/ZeroTheNerd.

## Experience

${renderExperience()}

## Projects

${renderProjects()}

## Career log

${renderCareerLog()}

## Skills

${renderSkills()}

## What the landing page leads with

${renderSelectedWork()}
`;
}

module.exports = { buildPersona };
