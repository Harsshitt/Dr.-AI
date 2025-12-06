async function callGemini(systemPrompt, userMessage, docs) {
  return {
    intent: "symptom_query",
    answer: "Pani piyo, rest karo.",
    citations: [],
    confidence: 0.9,
    escalate: false,
    pii_required: false,
    error: false
  };
}

module.exports = { callGemini };
