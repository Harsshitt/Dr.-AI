// backend/index.js — FINAL WORKING VERSION (Gemini only)

import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.GOOGLE_API_KEY?.trim();
const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

if (!API_KEY) {
  console.error("❌ ERROR: GOOGLE_API_KEY missing in .env");
  process.exit(1);
}

// INIT GEMINI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL });

app.get("/", (req, res) => {
  res.send("Dr.AI backend is running");
});

// CHAT ENDPOINT
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    const result = await model.generateContent(userMessage);
    const text = result.response.text();

    res.json({
      ok: true,
      reply: text
    });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.json({
      ok: false,
      error: err.message || "AI error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});