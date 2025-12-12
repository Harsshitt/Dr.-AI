import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jwt from "jsonwebtoken"; // For usage tracking
import { connectDB, getUserModel } from "./utils/db.js";
import authRoutes from "./routers/auth.js";
import paymentRoutes from "./routers/payment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ENV CONFIG
const PORT = process.env.PORT || 5001;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY?.trim();
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

// --- Connect to DB (Mongo or Mock) ---
connectDB();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Dr.AI backend is running");
});

// --- CHAT ENDPOINT ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, isPro } = req.body;
    const authHeader = req.headers.authorization;

    // --- FREEMIUM USAGE LIMIT CHECK ---
    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
          // Check for Report Keywords OR File Attachments
          const lowerMsg = message.toLowerCase();
          const isReportRequest = ["report", "lab", "result", "blood", "test", "scan", "mri", "xray"].some(kw => lowerMsg.includes(kw));
          const isFileAttachment = message.includes("[Attached:");

          if ((isReportRequest || isFileAttachment) && !isPro) {
            const User = getUserModel();
            const user = await User.findById(decoded.id);
            if (user) {
              const now = new Date();
              const lastReset = new Date(user.usage?.lastReset || 0);

              // Reset usage if > 30 days
              if (now - lastReset > 30 * 24 * 60 * 60 * 1000) {
                user.usage = { reportCount: 0, fileCount: 0, lastReset: now };
              }

              // Initialize usage if missing
              if (!user.usage) user.usage = { reportCount: 0, fileCount: 0, lastReset: now };
              if (user.usage.fileCount === undefined) user.usage.fileCount = 0;

              // Check Limits
              // 1. Report Analysis Limit (3/month)
              if (isReportRequest && user.usage.reportCount >= 3) {
                return res.json({
                  reply: "🔒 **Report Limit Reached**\n\nYou have used your 3 free report explanations for this month.\n\n[Upgrade to Pro](/upgrade) for unlimited analysis.",
                  isLimitReached: true
                });
              }

              // 2. File Upload Limit (Max 3 files total/month)
              if (isFileAttachment && user.usage.fileCount >= 3) {
                return res.json({
                  reply: "🔒 **File Limit Reached**\n\nYou can only add a maximum of 3 files on the Basic plan.\n\n[Upgrade to Pro](/upgrade) to analyze unlimited documents.",
                  isLimitReached: true
                });
              }

              // Increment Usage
              if (isReportRequest) user.usage.reportCount++;
              if (isFileAttachment) user.usage.fileCount++;

              await user.save();
              console.log(`[Usage] User ${user.email} - Reports: ${user.usage.reportCount}, Files: ${user.usage.fileCount}`);
            }
          }
        }
      } catch (e) {
        console.warn("[Usage] Token verification failed or user not found:", e.message);
      }
    }
    // ----------------------------------

    if (!message) return res.status(400).json({ error: "Message is required" });

    if (!model) {
      return res.status(503).json({ reply: "Service Unavailable: API configuration missing." });
    }

    // 1. Read System Prompt (Safety Firewall + Dr. AI Persona)
    const promptPath = path.join(__dirname, "prompt", "system_prompt.txt");
    let systemPrompt = "You are Dr. AI, a helpful medical assistant.";
    try {
      if (fs.existsSync(promptPath)) {
        systemPrompt = fs.readFileSync(promptPath, "utf-8");
      } else {
        console.warn("⚠️ system_prompt.txt not found at", promptPath);
      }
    } catch (e) { console.error("Could not read system_prompt.txt", e); }

    // 2. Pro Mode Injection
    if (isPro) {
      systemPrompt += `
      
[SYSTEM NOTICE]: USER IS A PAID 'PRO' SUBSCRIBER.
- ENABLE all premium features (Timeline Generation, Detailed Report Analysis, Medication Calendars).
- DO NOT UPSELL. Perform these tasks immediately if requested.
- FORMAT timelines/calendars as Markdown Tables.
  `;
    }

    // 3. Simple Context (Mock)
    const context = "User Medical History: None provided.";

    const finalPrompt = `
${systemPrompt}

MEDICAL CONTEXT:
${context}

USER QUERY:
"${message}"

IMPORTANT: Respond in valid JSON format as defined in the system prompt.
`;

    // 4. Call Gemini
    console.log("Sending request to Gemini...");
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const modelResponse = response.text();

    console.log("Gemini Response Length:", modelResponse.length);

    // 5. Parse JSON
    let structuredResponse;
    try {
      let jsonStr = modelResponse.replace(/```json/g, "").replace(/```/g, "");
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
      // Fallback: Return text as reply
      structuredResponse = { reply: modelResponse };
    }

    res.json(structuredResponse);

  } catch (err) {
    console.error("❌ /api/chat error:", err);
    return res.status(500).json({
      reply: "I encountered a server error. Please try again later.",
      error: "server_error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log("   GOOGLE_API_KEY set:", !!GOOGLE_API_KEY);
});