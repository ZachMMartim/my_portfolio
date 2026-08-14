// Portfolio content, kept apart from the components that render it so the
// persona prompt can be generated from the same source. Adding a project here
// reaches both the page and the chatbot.
//
// Images are referenced by key, not by import: this module is read at build
// time by Node, which cannot resolve webpack asset imports. Components map the
// keys back to real assets.

export const SELECTED_WORK = [
  {
    name: "Lumen",
    blurb:
      "Medical simulation platform — plugin-based OSCE cases, LLM scenario authoring, and a 16 kHz speech-to-speech audio engine.",
    tag: "capstone · team lead, 3 eng",
    imageKey: null,
  },
  {
    name: "Rover-Q",
    blurb:
      "Q-learning reinforcement learning agent that plans a Mars rover's best path, visualized live in the browser.",
    tag: "1st · U of U × Redo",
    imageKey: "QRover",
  },
  {
    name: "Meeting → Jira",
    blurb:
      "AI system converting meeting recordings into structured, ready-to-import Jira tickets users can edit or adopt directly.",
    tag: "1st · Hack the SDLC",
    imageKey: "WaystarAward",
  },
];
