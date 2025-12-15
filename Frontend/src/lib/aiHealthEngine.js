// src/lib/aiHealthEngine.js
import { GoogleGenerativeAI } from "@google/generative-ai";

//------------------------------------------------------------
// MAIN FUNCTION — DYNAMIC AI RESPONSE (API ONLY)
//------------------------------------------------------------

export async function generateHealthResponse(
    userInput,
    conversationHistory,
    patientProfile
) {
    try {
        //--------------------------------------------------------
        // 1. INIT GEMINI CLIENT
        //--------------------------------------------------------
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Missing VITE_GEMINI_API_KEY");
            return {
                text: "Configuration Error: Missing API Key. Please add VITE_GEMINI_API_KEY to your Frontend .env file.",
                structuredData: {},
            };
        }
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", // stable and fast
        });

        //--------------------------------------------------------
        // 2. FORMAT HISTORY + PROFILE
        //--------------------------------------------------------
        const historyText = conversationHistory
            .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
            .join("\n");

        const profileText = JSON.stringify(patientProfile, null, 2);

        //--------------------------------------------------------
        // 3. PROMPT FOR GEMINI
        //--------------------------------------------------------
        const prompt = `
You are **Dr.AI**, a friendly medical assistant.
Your job is to give:
- short, clear, dynamic medical explanations
- ask follow-up questions when needed
- NEVER diagnose, NEVER prescribe medicines
- DO NOT repeat the same answer again and again
- respond naturally based on the user's exact input

Always respond in a caring, simple, doctor-like tone.
**CRITICAL:** Respond ONLY in **Professional English**. Do not use any other language.

**SCOPE RESTRICTION:**
You are strictly a medical assistant.
- **DO NOT** answer questions about sports, politics, movies, coding, or general knowledge.
- If the user asks about non-health topics, return this text: "I specialize only in human health and medicine. Please ask me a health-related question."

---------------------------------------
PATIENT PROFILE:
${profileText}

CHAT HISTORY:
${historyText}

CURRENT USER QUESTION:
"${userInput}"

---------------------------------------
RESPOND IN THIS JSON FORMAT ONLY:

{
  "text": "human readable answer here",
  "structuredData": {
    "urgency": "self_care | routine | urgent | emergency",
    "next_steps": ["step 1", "step 2"]
  }
}
`;

        //--------------------------------------------------------
        // 4. CALL GEMINI
        //--------------------------------------------------------
        const result = await model.generateContent(prompt);
        const output = result.response.text();

        //--------------------------------------------------------
        // 5. TRY TO PARSE JSON
        //--------------------------------------------------------
        try {
            return JSON.parse(output);
        } catch (err) {
            // If AI gives non-JSON answer, return plain text
            return {
                text: output,
                structuredData: {},
            };
        }
    } catch (error) {
        console.error("AI Engine ERROR ----------------");
        console.error(error);

        let errorMsg = "Sorry, I’m having trouble connecting to the AI brain right now.";

        if (error.message?.includes("API key not valid") || error.toString().includes("400")) {
            errorMsg = "⚠️ **API Key Error:** The provided Google Gemini API Key is invalid. Please update your `.env` file with a valid key.";
        } else if (error.message?.includes("Failed to fetch")) {
            errorMsg = "⚠️ **Network Error:** Cannot connect to Google AI. Please check your internet connection.";
        }

        return {
            text: errorMsg,
            structuredData: {},
        };
    }
}
