// src/lib/openai.js
// Wrapper for calling OpenAI using the official npm package

const OpenAI = require("openai");

// Create OpenAI client using your API key from .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});

/**
 * callChat()
 * Sends system + user messages to the OpenAI model
 * and returns the model response text.
 */
async function callChat({ systemPrompt, userMessages = [], model = "gpt-4o-mini" }) {
  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...userMessages.map(msg => ({
        role: msg.role || "user",
        content: msg.content
      }))
    ];

    // Chat Completion API call
    const response = await client.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: 800
    });

    // Extract message content
    const firstMessage = response.choices[0].message;
    const content = firstMessage?.content || "";

    return {
      success: true,
      content
    };

  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      success: false,
      error: error.message || "Unknown OpenAI error"
    };
  }
}

module.exports = { callChat };