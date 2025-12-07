// backend/lib/aiHealthEngine.js
// Exports: generateHealthResponse(userInput, conversationHistory, patientProfile)
// Integrates with Gemini via REST API (native fetch)

// NOTE: Node 18+ has native fetch.

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
 * Call Gemini generateContent REST endpoint
 */
async function callGeminiGenerate(userInput, conversationHistory = [], patientProfile = {}) {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'dummykey') {
    return { ok: false, error: 'missing_api_key' };
  }

  const systemInstruction = [
    {
      parts: [{
        text:
          `You are a concise healthcare support assistant. Provide informational guidance only — NOT diagnosis. Use Professional English when replying (formal, concise, empathetic). \
Use only provided context and be explicit to escalate on emergencies. Return a short JSON object with keys: text (user-facing reply), structuredData (object with urgency/chief_complaint).`
      }]
    }
  ];

  const contents = [
    // History
    ...(conversationHistory || []).slice(-6).map(turn => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.text || String(turn) }]
    })),
    // Current input
    {
      role: "user",
      parts: [{ text: `User Query: ${userInput || ''}\n\nPatient Profile: ${JSON.stringify(patientProfile || {})}` }]
    }
  ];

  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const body = {
    model: modelName,
    contents: contents,
    system_instruction: { parts: [{ text: systemInstruction.map(s => s.parts.map(p => p.text).join(' ')).join(' ') }] },
    generationConfig: {
      maxOutputTokens: 400,
      temperature: 0.2,
      topP: 0.95,
      candidateCount: 1
    }
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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

    const candidates = parsed?.candidates;

    if (candidates && candidates.length) {
      const first = candidates[0];
      if (first.content && first.content.parts) {
        const text = first.content.parts.map(p => p.text).join('');
        return { ok: true, text: text, raw: parsed };
      }
    }

    return { ok: true, text: textBody, raw: parsed || textBody };

  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, error: 'network_error', reason: err.message };
  }
}

// Helper: call followup API 
async function callFollowupApi(payload) {
  const url = process.env.FOLLOWUP_URL;
  if (!url) return { ok: false, reason: 'no_followup_url' };

  const controller = new AbortController();
  setTimeout(() => controller.abort(), 3000);

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    return { ok: r.ok, status: r.status };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

/**
 * Main exported function.
 */
export async function generateHealthResponse(userInput, conversationHistory, patientProfile) {
  const geminiResult = await callGeminiGenerate(userInput, conversationHistory, patientProfile);

  let resp;
  if (geminiResult.ok && geminiResult.text) {
    // Try to parse JSON in Gemini text
    let parsed = null;
    try {
      const raw = geminiResult.text.trim();
      const firstBrace = raw.indexOf('{');
      const lastBrace = raw.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        parsed = JSON.parse(raw.slice(firstBrace, lastBrace + 1));
      }
    } catch (e) { parsed = null; }

    if (parsed && parsed.text) {
      resp = {
        text: String(parsed.text),
        structuredData: parsed.structuredData || {},
        _source: 'gemini_json'
      };
    } else {
      resp = {
        text: geminiResult.text.slice(0, 1000),
        structuredData: { source: 'gemini_free_text' },
        _source: 'gemini_text',
      };
    }
  } else {
    // Gemini failed — use local fallback
    const local = _generateHealthResponseSync(userInput, conversationHistory || [], patientProfile || {});
    resp = { ...local, _source: 'local_fallback', geminiError: geminiResult };
  }

  // Followup logging
  const followupPayload = {
    event: 'assistant_response',
    timestamp: new Date().toISOString(),
    userInput: (userInput || '').slice(0, 1000),
    assistantText: (resp.text || '').slice(0, 2000),
    structuredData: resp.structuredData || {},
    source: resp._source || 'unknown'
  };

  callFollowupApi(followupPayload).catch(() => { });

  return resp;
}