import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testTopicRestriction() {
    console.log("Testing Topic Restriction...");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `
You are strictly a medical and health assistant.
- DO NOT answer questions about sports, entertainment, technology, coding, general knowledge, or any topic unrelated to human health.
- If a user asks about an off-topic subject, politely reply: "I specialize only in human health and medicine. I cannot assist with other topics."
`;

    const userQuery = "Who won the last FIFA World Cup?";
    const prompt = `${systemPrompt}\n\nUser: ${userQuery}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log(`User Query: "${userQuery}"`);
        console.log(`AI Response: "${response.text()}"`);
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

testTopicRestriction();
