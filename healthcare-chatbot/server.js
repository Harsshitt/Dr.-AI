require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { getContextDocs } = require("./src/rag");
const { callGemini } = require("./src/gemini_client");
const { validateJSON } = require("./src/validator");
const logger = require("./src/logger");

const app = express();
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const contextDocs = await getContextDocs(userMessage);
    const sysPrompt = require("fs").readFileSync("./prompt/system_prompt.txt", "utf8");

    const modelResponse = await callGemini(sysPrompt, userMessage, contextDocs);

    const valid = validateJSON(modelResponse);
    if (!valid.valid) return res.status(500).json({ error: valid.errors });

    logger.info({ userMessage, modelResponse });

    return res.json(modelResponse);
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

app.listen(process.env.PORT, () => console.log("Running..."));
