// The ask bar's backend: one function whose only real job is to hold the API
// key server-side. Everything the bot knows is in the system prompt, built from
// the site's own content at cold start.
//
// No database. The old design stored every visitor's transcript in Postgres
// behind an RLS policy that let anyone holding the public anon key read all of
// it, in exchange for data that was never queried. Leads and unanswered
// questions are notified instead: structured logs by default, plus a webhook
// when LEAD_WEBHOOK_URL is set.

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { buildPersona } = require("./persona");

const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");

// Read straight from the environment rather than declared with defineSecret,
// which makes a secret mandatory and blocks deploys until it exists. This one
// is genuinely optional: without it leads still reach Cloud Logging. Set it in
// functions/.env (gitignored) or promote it to a real secret if the URL you
// use is sensitive.
const leadWebhookUrl = () => process.env.LEAD_WEBHOOK_URL || null;

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 1024;

// A visitor cannot spend more than this many model calls on one message. The
// loop only continues while Claude keeps asking for tools, and both tools are
// terminal, so 4 is generous.
const MAX_TURNS = 4;

// Keeps one visitor from walking the whole context window. The prompt is fixed
// at roughly 3.4k tokens; this bounds what they can add to it.
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY = 20;

const TOOLS = [
  {
    name: "record_user_details",
    description:
      "Record that a visitor is interested in getting in touch and has provided an email address. Call this as soon as you have their email.",
    input_schema: {
      type: "object",
      properties: {
        email: { type: "string", description: "The visitor's email address" },
        name: { type: "string", description: "Their name, if they gave one" },
        notes: {
          type: "string",
          description:
            "Anything about the conversation worth recording for context, such as the role or company",
        },
      },
      required: ["email"],
    },
  },
  {
    name: "record_unknown_question",
    description:
      "Record a question that could not be answered from the portfolio content. Call this whenever you do not know something, even if it is trivial or unrelated to work.",
    input_schema: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "The question, as the visitor asked it",
        },
      },
      required: ["question"],
    },
  },
];

// Built once per cold start rather than per request.
let cachedPersona = null;
const persona = () => {
  if (!cachedPersona) cachedPersona = buildPersona();
  return cachedPersona;
};

async function notify(kind, payload, webhookUrl) {
  // Cloud Logging is the durable record; the webhook is the optional nudge.
  logger.info(`chat.${kind}`, payload);

  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, ...payload, at: new Date().toISOString() }),
    });
  } catch (error) {
    // A failed notification must not fail the visitor's message.
    logger.error("chat.notify_failed", { kind, error: String(error) });
  }
}

async function runTool(block, webhookUrl) {
  const { name, input } = block;

  if (name === "record_user_details") {
    await notify(
      "lead",
      {
        email: input.email,
        name: input.name || null,
        notes: input.notes || null,
      },
      webhookUrl
    );
    return "Recorded. Their details will reach Zach.";
  }

  if (name === "record_unknown_question") {
    await notify("unknown_question", { question: input.question }, webhookUrl);
    return "Recorded.";
  }

  return `Unknown tool: ${name}`;
}

async function callClaude(messages, apiKey) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: persona(),
      tools: TOOLS,
      tool_choice: { type: "auto", disable_parallel_tool_use: true },
      messages,
    }),
  });

  if (!response.ok) {
    // Deliberately not including the response body. Anthropic's error payloads
    // can quote the offending request, so logging them would put visitor text
    // into Cloud Logging through the failure path -- the one place the privacy
    // policy promises conversations do not go. Status and type are enough to
    // debug from.
    let type = "unknown";
    try {
      type = (await response.json())?.error?.type ?? "unknown";
    } catch {
      // Non-JSON error body; the status alone will have to do.
    }
    throw new Error(`anthropic ${response.status} (${type})`);
  }

  return response.json();
}

/** Normalises whatever the client sent into a valid messages array. */
function sanitiseHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
}

exports.chat = onRequest(
  {
    region: "us-central1",
    secrets: [ANTHROPIC_API_KEY],
    // v2 functions are Cloud Run services and are not publicly invokable by
    // default; without this the endpoint answers 403 to everyone, including
    // the hosting rewrite. This is a public chat endpoint, so allUsers is
    // correct -- the API key stays server-side either way.
    invoker: "public",
    cors: true,
    maxInstances: 5,
    timeoutSeconds: 60,
  },
  async (req, res) => {
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "POST only" });
      return;
    }

    const message = String(req.body?.message ?? "").trim();
    if (!message) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    const webhookUrl = leadWebhookUrl();

    const messages = [
      ...sanitiseHistory(req.body?.history),
      { role: "user", content: message.slice(0, MAX_MESSAGE_CHARS) },
    ];

    try {
      for (let turn = 0; turn < MAX_TURNS; turn += 1) {
        const reply = await callClaude(messages, ANTHROPIC_API_KEY.value());

        if (reply.stop_reason !== "tool_use") {
          const text = reply.content
            .filter((b) => b.type === "text")
            .map((b) => b.text)
            .join("")
            .trim();

          res.json({ response: text });
          return;
        }

        // Claude asked for a tool. Run it and hand the result back.
        const toolUses = reply.content.filter((b) => b.type === "tool_use");
        const results = [];
        for (const block of toolUses) {
          results.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: await runTool(block, webhookUrl),
          });
        }

        messages.push({ role: "assistant", content: reply.content });
        messages.push({ role: "user", content: results });
      }

      // Ran out of turns without a final answer.
      logger.warn("chat.turn_limit", { turns: MAX_TURNS });
      res.json({
        response:
          "Sorry — I got stuck on that one. Email me at zachmartim101@gmail.com and I'll answer directly.",
      });
    } catch (error) {
      logger.error("chat.failed", { error: String(error) });
      res.status(502).json({
        error:
          "Something went wrong reaching my assistant. Email zachmartim101@gmail.com and you'll get me directly.",
      });
    }
  }
);
