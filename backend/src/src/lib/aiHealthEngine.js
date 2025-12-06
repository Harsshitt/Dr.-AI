// Backend/lib/aiHealthEngine.js
// Exports: generateHealthResponse(userInput, conversationHistory, patientProfile)
// Integrates with Gemini 2.5 Flash via the Gemini API (generateContent).
//
// Requirements:
// - NODE env var GEMINI_API_KEY must be set (Google AI Studio API key).
// - Optional: FOLLOWUP_URL in env to receive assistant responses for logging/triage.
// - npm install node-fetch@2

const fetch = require('node-fetch');

function _generateHealthResponseSync(userInput, conversationHistory, patientProfile) {
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

/**
 * Call Gemini generateContent REST endpoint (gemini-2.5-flash).
 * Returns {ok, text, raw} where text is primary assistant text (string).
 */
async function callGeminiGenerate(userInput, conversationHistory = [], patientProfile = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'dummykey') {
    return { ok: false, error: 'missing_api_key' };
  }

  // Build a concise system instruction tailored for healthcare assistant + JSON mode instruction
  const systemInstruction = [
    {
      parts: [{ text:
        `You are a concise healthcare support assistant for Project X. Provide informational guidance only — NOT diagnosis. Use Hindi in English alphabet when replying (short, empathetic). \
Use only provided context and be explicit to escalate on emergencies. Return a short JSON object with keys: text (user-facing reply), structuredData (object with urgency/chief_complaint), and escalate (boolean). If unsure, say 'I don't know — escalate'.`
      }]
    }
  ];

  // Build contents: include systemInstruction as system_instruction and user content as last content
  // The API expects contents array of Content objects; for simple text we use parts with text strings.
  const contents = [
    // conversation history as user/system alternation (kept short)
    ...(
      (conversationHistory && conversationHistory.length) ?
      conversationHistory.slice(-6).map(turn => ({ parts: [{ text: `${turn.role || 'user'}: ${turn.text || turn}` }] })) :
      []
    ),
    { parts: [{ text: `User: ${userInput || ''}` }] },
    { parts: [{ text: `PatientProfile: ${JSON.stringify(patientProfile || {})}` }] }
  ];

  const body = {
    // model string used in official docs
    model: "gemini-2.5-flash",
    // contents field; for REST the generateContent endpoint expects `contents` in request JSON
    contents: contents,
    // include system instruction separately (supported by API)
    system_instruction: { parts: [{ text: systemInstruction.map(s => s.parts.map(p => p.text).join(' ')).join(' ') }] },
    // generation config: keep short and request 1 candidate
    generationConfig: {
      maxOutputTokens: 400, // reasonable limit
      temperature: 0.2,
      topP: 0.95,
      candidateCount: 1
    }
  };

  // Endpoint: using v1beta endpoint as documented
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

  // Timeout controller
  const controller = new fetch.AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // x-goog-api-key header is optional if using ?key=; safe to include
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const statusText = `${resp.status} ${resp.statusText}`;
    const textBody = await resp.text();
    let parsed = null;
    try { parsed = JSON.parse(textBody); } catch (e) { parsed = null; }

    if (!resp.ok) {
      return { ok: false, error: 'api_error', status: resp.status, statusText, raw: parsed || textBody };
    }

    // Response typically contains `candidates` array with text or content pieces.
    // We'll attempt to extract a plain text candidate or fallback to concatenating candidate content parts.
    const candidates = parsed && (parsed.candidates || parsed.outputs || parsed.output?.candidates) ? (parsed.candidates || parsed.outputs || parsed.output?.candidates) : null;

    if (candidates && candidates.length) {
      const first = candidates[0];
      // Many responses have `content` / `text` / `parts` structure
      if (first.text) {
        return { ok: true, text: String(first.text), raw: parsed };
      }
      if (first.content && Array.isArray(first.content)) {
        // join text parts if present
        const joined = first.content.map(c => c.text || JSON.stringify(c)).join('\n');
        return { ok: true, text: joined, raw: parsed };
      }
      // try `outputText` or similar
      if (parsed.outputText) {
        return { ok: true, text: String(parsed.outputText), raw: parsed };
      }
    }

    // Fallback: try top-level text fields or stringify raw
    if (parsed && parsed.text) return { ok: true, text: String(parsed.text), raw: parsed };
    // as last resort return raw string
    return { ok: true, text: textBody, raw: parsed || textBody };

  } catch (err) {
    clearTimeout(timeout);
    const reason = err && err.name === 'AbortError' ? 'timeout' : (err && err.message) || String(err);
    return { ok: false, error: 'network_error', reason };
  }
}

// Helper: call followup API (non-blocking but awaited with short timeout)
async function callFollowupApi(payload) {
  const url = process.env.FOLLOWUP_URL;
  if (!url) return { ok: false, reason: 'no_followup_url' };

  const controller = new fetch.AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const text = await r.text();
    let parsed = null;
    try { parsed = JSON.parse(text); } catch (e) { parsed = null; }
    return { ok: r.ok, status: r.status, body: parsed || text };
  } catch (e) {
    clearTimeout(timeout);
    return { ok: false, reason: e && e.name === 'AbortError' ? 'timeout' : (e && e.message) || String(e) };
  }
}

/**
 * Main exported function.
 * - tries Gemini first
 * - parses Gemini output (if returns JSON, tries to read text/structuredData)
 * - falls back to local sync generator on failure
 * - posts followup webhook with response summary
 */
async function generateHealthResponse(userInput, conversationHistory, patientProfile) {
  // 1) attempt Gemini
  const geminiResult = await callGeminiGenerate(userInput, conversationHistory, patientProfile);

  let resp;
  if (geminiResult.ok && geminiResult.text) {
    // Try to parse JSON in Gemini text (if model returned JSON)
    let parsed = null;
    try {
      // sometimes model returns JSON wrapped inside backticks or markdown — try to extract JSON substring
      const raw = geminiResult.text.trim();
      const firstBrace = raw.indexOf('{');
      const lastBrace = raw.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const maybeJson = raw.slice(firstBrace, lastBrace + 1);
        parsed = JSON.parse(maybeJson);
      } else {
        parsed = null;
      }
    } catch (e) {
      parsed = null;
    }

    if (parsed && parsed.text) {
      resp = {
        text: String(parsed.text),
        structuredData: parsed.structuredData || {},
        _source: 'gemini_json'
      };
    } else {
      // fallback: use plain text as answer; small sanitization
      resp = {
        text: geminiResult.text.toString().slice(0, 1000),
        structuredData: { source: 'gemini_free_text' },
        _source: 'gemini_text',
      };
    }
  } else {
    // Gemini failed — use local fallback
    const local = _generateHealthResponseSync(userInput, conversationHistory || [], patientProfile || {});
    resp = { ...local, _source: 'local_fallback', geminiError: geminiResult };
  }

  // 2) build followup payload (sanitize minimal PHI - do NOT include full patientProfile here unless explicitly allowed)
  const safePatientProfile = patientProfile ? { age: patientProfile.age || null, sex: patientProfile.sex || null } : {};
  const followupPayload = {
    event: 'assistant_response',
    timestamp: new Date().toISOString(),
    userInput: (userInput || '').slice(0, 1000),
    assistantText: (resp.text || '').slice(0, 2000),
    structuredData: resp.structuredData || {},
    source: resp._source || 'unknown',
    patientSummary: safePatientProfile
  };

  try {
    const followupRes = await callFollowupApi(followupPayload);
    resp._followup = { attempted: !!process.env.FOLLOWUP_URL, result: followupRes.ok ? 'success' : 'failed', detail: followupRes };
  } catch (e) {
    resp._followup = { attempted: !!process.env.FOLLOWUP_URL, result: 'error', detail: String(e) };
  }

  return Promise.resolve(resp);
}

module.exports = { generateHealthResponse };
npm install node-fetch@2