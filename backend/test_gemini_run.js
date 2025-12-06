import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    try {
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`SUCCESS: ${modelName} worked! Response:`, response.text());
        return true;
    } catch (error) {
        console.error(`FAILED: ${modelName} -`, error.message);
        return false;
    }
}

testModel("gemini-2.0-flash");
