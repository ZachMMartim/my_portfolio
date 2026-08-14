// Portfolio content, kept apart from the components that render it so the
// persona prompt can be generated from the same source. Adding a project here
// reaches both the page and the chatbot.
//
// Images are referenced by key, not by import: this module is read at build
// time by Node, which cannot resolve webpack asset imports. Components map the
// keys back to real assets.

export const EXPERIENCE = [
  {
    org: "Cimento AI",
    role: "SWE Intern",
    dates: "Jan 2026 – present",
    current: true,
    blurb:
      "Executive analytics service over a multi-tenant Aurora Postgres database, its AWS infrastructure in Terraform, and a production MCP server as an OAuth 2.1 resource server.",
  },
  {
    org: "ServiceNow · University of Utah",
    role: "SWE Intern",
    dates: "Dec 2022 – Jan 2026",
    current: false,
    blurb:
      "Workflows, KPIs and modules for university IT on a team of 15+; 150+ bugs resolved; Cisco ISE integration over the ERS REST API.",
  },
];
