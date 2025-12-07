
import "dotenv/config";
import { generateHealthResponse } from "./lib/aiHealthEngine.js";

async function verifyLanguage() {
    console.log("Testing AI response language...");

    // A query that bypasses local hardcoded checks (no "fever", no emergency keywords)
    const response = await generateHealthResponse("I have a stomach ache and feel nausea", [], {});

    console.log("\n--- AI Response ---");
    console.log("Full Object:", JSON.stringify(response, null, 2));
    console.log(response.text);
    console.log("-------------------");

    if (response.text.toLowerCase().includes("kya") || response.text.toLowerCase().includes("hai")) {
        console.error("FAIL: Detected Hindi/Hinglish words.");
    } else {
        console.log("SUCCESS: Response appears to be in English.");
    }
}

verifyLanguage();
