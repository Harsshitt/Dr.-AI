// Backend/lib/aiHealthEngine.js
// This file should export generateHealthResponse(userInput, conversationHistory, patientProfile)
// If you have the full engine in TypeScript, transpile it to JS and place it here, or copy/paste.

function _generateHealthResponseSync(userInput, conversationHistory, patientProfile) {
  // Minimal fallback behavior — you can replace with your full engine's logic.
  // If you already copied the long aiHealthEngine code, put that implementation here and return same structure.
  const lower = (userInput || "").toLowerCase();

  if (/(chest pain|can't breathe|severe bleeding|suicidal|stroke)/i.test(lower)) {
    return {
      text: "This sounds like an emergency. Call your local emergency number now.",
      structuredData: { urgency: "emergency_now", red_flags: ["possible emergency"] },
    };
  }

  if (lower.includes("fever")) {
    return {
      text: "Fever info: stay hydrated, rest, consider acetaminophen or ibuprofen per label; seek care for high fever or red flags.",
      structuredData: { urgency: "self_care_ok", chief_complaint: "fever" },
    };
  }

  // Generic fallback
  return {
    text: "Tell me more about your symptoms (onset, severity, other symptoms).",
    structuredData: { urgency: "pending_information" },
  };
}

async function generateHealthResponse(userInput, conversationHistory, patientProfile) {
  // If you have a more detailed synchronous implementation, call it here.
  const resp = _generateHealthResponseSync(userInput, conversationHistory || [], patientProfile || {});
  // Ensure shape matches HealthResponse { text, structuredData }
  return Promise.resolve(resp);
}

// export as CommonJS
module.exports = { generateHealthResponse };