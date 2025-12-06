import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import { getContextDocs } from "./src/rag.js";
import { callGemini } from "./src/gemini_client.js";
import { validateJSON } from "./src/validator.js";
import logger from "./src/logger.js";

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dr-ai";

// DB Connection
import mongoose from "mongoose";
import authRoutes from "./routers/auth.js";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("⚠️ MongoDB ignored (Mock Mode) - Connect timed out"));

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Dr.AI backend is running");
});

// CHAT ENDPOINT
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || req.body.userMessage || "";
    if (!userMessage.trim()) {
      return res.json({ reply: "Please enter a valid message." });
    }

    // Load system prompt
    let sysPrompt = "";
    try {
      sysPrompt = fs.readFileSync("./prompt/system_prompt.txt", "utf8");
    } catch (e) {
      console.log("No system prompt file found:", e.message);
    }

    // Fetch RAG context
    const contextDocs = await getContextDocs(userMessage);

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
    // The wrapper returns text or JSON string.
    // Let's ensure we send { reply: ... }

    let replyText = modelResponse;
    if (!replyText) {
      replyText = "I apologize, but I couldn't generate a response. Please try asking again.";
    } else if (typeof modelResponse === 'object') {
      replyText = JSON.stringify(modelResponse);
    }

    res.json({ reply: replyText });

  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ reply: "Server error. Try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});