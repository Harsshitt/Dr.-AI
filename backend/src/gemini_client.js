// src/gemini_client.js
// Minimal Gemini HTTP wrapper using Google Generative Language REST API
// Requires: process.env.GOOGLE_API_KEY set to a valid API key
// Model: you can change model name via GEMINI_MODEL env var (e.g. "models/gemini-1.5-flash")

import { GoogleGenerativeAI } from "@google/generative-ai";
// backend package.json has undici, but node 18+ has global fetch. 
// I'll assume global fetch or use what's available.

const API_KEY = process.env.GOOGLE_API_KEY;
// Remove "models/" prefix if present for SDK, though SDK handles it usually.
// SDK expects "gemini-1.5-flash"
const MODEL_NAME = (process.env.GEMINI_MODEL || "gemini-1.5-flash").replace(/^models\//, "");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export async function callGemini(prompt, userMessage = "", contextDocs = null) {
  if (!API_KEY) {
    console.error("GOOGLE_API_KEY not set in environment");
    throw new Error("GOOGLE_API_KEY not set in environment");
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      console.warn("Gemini returned empty text response");
      return "I'm sorry, I couldn't generate a response at this moment.";
    }

    return text;
  } catch (err) {
    console.error("Gemini call failed:", err);
    throw new Error("Gemini call failed: " + (err.message || err));
  }
}

