// Copies the portfolio content into functions/content so it deploys with the
// function. Firebase uploads only this directory, so the JSON that the pages
// render from has to be physically present here.
//
// Runs as a predeploy hook in firebase.json, so a deploy can never ship a
// persona built from stale content.

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "portfolio-frontend", "src", "content");
const DEST = path.join(__dirname, "content");

const FILES = [
  "experience.json",
  "projects.json",
  "resume.json",
  "selectedWork.json",
  "skills.json",
];

fs.mkdirSync(DEST, { recursive: true });

let copied = 0;
for (const file of FILES) {
  const from = path.join(SRC, file);
  if (!fs.existsSync(from)) {
    console.error(`sync-content: missing ${from}`);
    process.exit(1);
  }
  fs.copyFileSync(from, path.join(DEST, file));
  copied += 1;
}

console.log(`sync-content: copied ${copied} content files into functions/content`);
