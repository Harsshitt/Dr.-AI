import "dotenv/config";
import { sendEmail } from "./utils/mailer.js";

async function test() {
    console.log("SENDING TEST EMAIL...");
    const result = await sendEmail("harshit95654@gmail.com", "Dr. AI Test", "If you see this, email is working.");
    console.log("Result:", result);
}

test();
