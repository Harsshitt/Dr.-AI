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

    if (!userMessage.trim()) {
      return res.status(400).json({
        ok: false,
        error: "empty_message",
        message: "Message is required",
      });
    }

    const aiResp = await generateHealthResponse(
      userMessage,
      [],        // you can pass conversation history later
      {}         // patient profile object later
    );

    return res.json({
      ok: true,
      reply: aiResp.text,
      structuredData: aiResp.structuredData || {},
      source: aiResp.source || aiResp._source || "unknown",
      error: aiResp.geminiError || null,
    });
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