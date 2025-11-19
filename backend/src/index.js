// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { findRedFlags, isEmergencyFromFlags } = require("./lib/safety");
const { callChat } = require("./lib/openai");
const systemPrompt = require("./prompts/systemPrompt");

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Emergency template for red flags
function emergencyTemplate(foundFlags) {
  return {
    reply: `I’m not a medical professional, but your symptoms (${foundFlags.join(
      ", "
    )}) may indicate an emergency. Please call local emergency services or go to the nearest emergency department now.`,
    
    json_output: {
      urgency: "emergency_now",
      red_flags: foundFlags,
      patient_profile: null,
      chief_complaint: "",
      next_steps: ["Call emergency services / go to nearest ED now"],
      otc_suggestions: [],
      rx_education: [],
      labs_summary: [],
      care_navigation: {
        setting: "ed",
        rationale: "Red-flag symptoms detected"
      }
    }
  };
}

// Main AI endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const { patient_profile = {}, message = "", history = [] } = req.body;

    // STEP 1: rule-based red flag detection
    const foundFlags = findRedFlags(
      `${message} ${history.map((h) => h.content || "").join(" ")}`
    );

    if (isEmergencyFromFlags(foundFlags)) {
      const tpl = emergencyTemplate(foundFlags);
      return res.json({
        reply: tpl.reply,
        json_output: tpl.json_output
      });
    }

    // STEP 2: build the messages for AI
    const userMessages = [
      {
        role: "user",
        content: `Patient profile: ${JSON.stringify(patient_profile)}`
      },
      {
        role: "user",
        content: `Chief complaint: ${message}`
      },
      ...(Array.isArray(history) ? history : [])
    ];

    // STEP 3: call OpenAI
    const aiResp = await callChat({
      systemPrompt,
      userMessages,
      model: process.env.AI_MODEL || "gpt-4o-mini"
    });

    if (!aiResp.success) {
      return res.status(500).json({
        error: "OpenAI_error",
        message: aiResp.error
      });
    }

    return res.json({
      reply: aiResp.content,
      json_output: null // can parse later if needed
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "server_error",
      message: String(err)
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend server running on port ${PORT}`)
);