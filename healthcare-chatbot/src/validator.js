const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  required: ["intent", "answer", "confidence", "escalate", "error"],
  properties: {
    intent: { type: "string" },
    answer: { type: "string" },
    confidence: { type: "number" },
    escalate: { type: "boolean" },
    error: { type: "boolean" }
  }
};

const validate = ajv.compile(schema);

function validateJSON(obj) {
  return { valid: validate(obj), errors: validate.errors };
}

module.exports = { validateJSON };
