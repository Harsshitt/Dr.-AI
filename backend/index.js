// backend/index.js — FINAL CLEAN VERSION
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routers/auth.js";
import { generateHealthResponse } from "./lib/aiHealthEngine.js";

const app = express();
app.use(cors());
app.use(express.json());

// ENV CONFIG
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dr-ai";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY?.trim();
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

// --- MongoDB (optional) ---
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.log("⚠️ MongoDB connection failed (running in mock DB mode):", err.message);
  });

// --- Routes for auth etc. ---
app.use("/api/auth", authRoutes);

// --- Simple health check ---
app.get("/", (req, res) => {
  res.send("Dr.AI backend is running");
});

// --- CHAT ENDPOINT (used by frontend Chat page) ---
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = (req.body.message || "").toString();

    // Build prompt
    const finalPrompt = `
${sysPrompt || "You are Dr.AI, a helpful medical information assistant."}

Use RAG context when useful:
${contextDocs ? JSON.stringify(contextDocs).slice(0, 2000) : "no context"}

User question:
"${userMessage}"
    `;

    // Call Gemini
    const modelResponse = await callGemini(finalPrompt, userMessage, contextDocs);

    // Validate
    const valid = validateJSON(modelResponse); // Optional validation

    // Log
    logger.info({ userMessage, reply: modelResponse });

    // Return
    // The frontend expects { reply: "text" } or just the text? 
    // Chat.jsx expects { reply: "text" } or just text.
    // Attempt to parse JSON response from LLM
    let structuredResponse;
    try {
      // 1. Remove markdown text formatting to get cleaner string
      let jsonStr = modelResponse.replace(/```json/g, "").replace(/```/g, "");

      // 2. Find the first '{' and last '}'
      const firstOpen = jsonStr.indexOf('{');
      const lastClose = jsonStr.lastIndexOf('}');

      if (firstOpen !== -1 && lastClose !== -1) {
        jsonStr = jsonStr.substring(firstOpen, lastClose + 1);
        structuredResponse = JSON.parse(jsonStr);
      } else {
        throw new Error("No JSON object found");
      }
    } catch (e) {
      console.error("JSON Parse Failed:", e.message);

      // 3. Fallback: Try to extract just the "reply" text using regex to avoid showing raw JSON
      // This matches: "reply": "..." (handling escaped quotes is limited but helps)
      const replyMatch = modelResponse.match(/"reply":\s*"([\s\S]*?)"(?=\s*[,}])/);
      const fallbackReply = replyMatch ? replyMatch[1] : modelResponse;

      structuredResponse = { reply: fallbackReply };
    }

    res.json(structuredResponse);
  } catch (err) {
    console.error("❌ /api/chat error:", err);
    return res.status(500).json({
      ok: false,
      error: "server_error",
      message: err.message || "Unexpected server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log("   GOOGLE_API_KEY set:", !!GOOGLE_API_KEY);
  console.log("   GEMINI_MODEL:", GEMINI_MODEL);
});