// Backend/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Use built-in body parser for modern Express
const app = express();
const PORT = process.env.PORT || 3001;

// If you use the official OpenAI package v4+/v6+, this is the client constructor:
const { OpenAI } = require("openai");

// Basic middleware
app.use(cors()); // dev: allows requests from your frontend. You can restrict origins for production.
app.use(express.json({ limit: "1mb" }));

/**
 * Validate API key early so the app fails fast with a clear message.
 * (If key missing we still run the server and return helpful error responses.)
 */
const OPENAI_KEY = (process.env.OPENAI_API_KEY || "").trim();
let openaiClient = null;
if (OPENAI_KEY) {
  try {
    openaiClient = new OpenAI({ apiKey: OPENAI_KEY });
  } catch (err) {
    console.error("Failed to create OpenAI client:", err);
    // leave openaiClient null so route returns an informative error.
  }
} else {
  console.warn("No OPENAI_API_KEY found in environment. Chat endpoint will return an error until you add it.");
}

/* -----------------------------
   Health / info endpoints
   ----------------------------- */
app.get("/", (req, res) => {
  res.send("Dr.AI backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    environment: process.env.NODE_ENV || "development",
    openai_key_present: !!OPENAI_KEY,
    port: PORT,
  });
});

/* -----------------------------
   Chat endpoint (OpenAI)
   ----------------------------- */
app.post("/api/chat", async (req, res) => {
  // helpful guard: make it easy to debug if key missing or not configured
  if (!OPENAI_KEY || !openaiClient) {
    return res.status(500).json({
      ok: false,
      error:
        "OpenAI API key is not configured or client failed to initialize. " +
        "Add a valid OPENAI_API_KEY to your .env and restart the server.",
    });
  }

  try {
    // Normalize incoming messages: either messages[] or single message string
    const clientMessages = Array.isArray(req.body.messages)
      ? req.body.messages
      : [];

    if (!clientMessages.length && req.body.message) {
      // accept { message: "..." } as a convenience
      clientMessages.push({ role: "user", content: String(req.body.message) });
    }

    if (!clientMessages.length) {
      return res.status(400).json({ ok: false, error: "no messages provided" });
    }

    // System prompt seeds behavior. Keep concise but firm.
    const systemPrompt = `
You are "Dr.AI", a health information and triage assistant for the general public.
- Educational assistant only. Not a medical professional.
- Do NOT diagnose or prescribe individualized Rx dosing.
- Provide empathy, plain-language guidance and an urgency level (Emergency, Urgent (24-48h), Routine, Self-care OK).
- Flag red-flags and include "go-now" signs when present.
- If asked to interpret raw medical images, refuse and ask for the radiology report text.
- Always include: "I’m not a medical professional; this is educational and not a diagnosis."
Respond concisely. If missing information, ask clarifying questions.
`.trim();

    const messages = [
      { role: "system", content: systemPrompt },
      ...clientMessages.map((m) => ({ role: m.role || "user", content: String(m.content || "") })),
    ];

    // model selection via .env
    const modelName = process.env.AI_MODEL || "gpt-4o-mini";

    // Call OpenAI: modern API uses openaiClient.chat.completions.create
    const completion = await openaiClient.chat.completions.create({
      model: modelName,
      messages,
      temperature: 0.1,
      max_tokens: 800,
    });

    // Extract assistant message
    const choice = completion?.choices?.[0];
    const assistantMessage = choice?.message ?? { role: "assistant", content: "No response" };

    return res.json({
      ok: true,
      reply: assistantMessage,
      usage: completion?.usage ?? null,
    });
  } catch (err) {
    // Attempt to surface helpful details
    console.error("OpenAI chat error (server):", err);

    // Some OpenAI errors include a structured response in err?.response?.data
    const structured = err?.response?.data || err?.response || null;

    // Common user-facing cases: auth issues or rate limits
    if (structured && structured.error) {
      const msg = structured.error.message || JSON.stringify(structured.error);
      const status = structured.status || 500;
      return res.status(status).json({ ok: false, error: msg });
    }

    // Fallback generic message
    const msg = err?.message || "server error";
    return res.status(500).json({ ok: false, error: msg });
  }
});

/* -----------------------------
   Start server
   ----------------------------- */
app.listen(PORT, () => {
  console.log(`Dr.AI backend listening on http://localhost:${PORT}`);
});