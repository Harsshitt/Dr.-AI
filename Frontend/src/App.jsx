// Frontend/src/App.jsx
import React, { useState, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import About from "./pages/About";
import SymptomsPage from "./pages/SymptomsPage";
import Medicines from "./pages/Medicines";
import Home from "./pages/Home";

/* ------------------------
   Chat Page component (calls your backend /api/chat)
   ------------------------ */
function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi — I'm Dr.AI. Ask me about symptoms, medicines, or lab reports. I'm educational only.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Try relative first, then fallback to localhost:5001 (useful in dev if no proxy)
  const sendToApi = async (payload) => {
    const endpoints = ["/api/chat", "http://localhost:5001/api/chat"];
    let lastErr = null;
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
        }
        const data = await res.json();
        return data;
      } catch (err) {
        lastErr = err;
        // try next endpoint
      }
    }
    throw lastErr;
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setError(null);

    // Append user message locally
    const userMsg = { role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    inputRef.current?.focus();

    setLoading(true);
    try {
      // send messages array so model can see conversation (you can send only last few messages)
      const payload = {
        messages: [...messages.filter(Boolean), userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      const result = await sendToApi(payload);

      // Expected server response: { ok: true, reply: { role, content } }
      if (result && result.ok && result.reply) {
        const assistant = result.reply;
        setMessages((m) => [...m, assistant]);
      } else if (result && result.ok && result.received) {
        // fallback echo behavior (if backend returns received)
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Server received your message." },
        ]);
      } else {
        // Unexpected format
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "No reply from server." },
        ]);
        setError("Unexpected server response");
        console.warn("Unexpected chat API response:", result);
      }
    } catch (err) {
      console.error("Chat send error:", err);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry — I couldn't reach the chat backend.",
        },
      ]);
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <main className="pt-20 p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Chat with Dr.AI</h1>
        <p className="text-gray-600 mb-6">
          Ask about symptoms, medicines, or a lab report. I provide educational
          guidance and red-flag checks only.
        </p>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* messages */}
          <div style={{ maxHeight: 480 }} className="overflow-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-lg ${
                    m.role === "user" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* error */}
          {error && (
            <div className="px-4 py-2 text-sm text-red-600 border-t border-gray-100">
              {error}
            </div>
          )}

          {/* input */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder="Type your question (e.g. 'I have a sore throat and fever — what should I do?')"
              className="flex-1 resize-none px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <div className="flex flex-col items-end gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-md bg-red-600 text-white disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      role: "assistant",
                      content:
                        "Hi — I'm Dr.AI. Ask me about symptoms, medicines, or lab reports. I'm educational only.",
                    },
                  ]);
                  setError(null);
                }}
                className="text-xs text-gray-500"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Note: This chat is educational only. If this is an emergency, seek immediate care.
        </p>
      </main>
    </div>
  );
}

/* ------------------------
   App wrapper w/ routing
   ------------------------ */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/meds" element={<Medicines />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}