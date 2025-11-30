// src/pages/Chat.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// AI Engine Import
import { generateHealthResponse } from "../lib/aiHealthEngine";

import {
  Pill,
  Send,
  Sparkles,
  Heart,
  FlaskConical,
  User,
  Loader2,
  Thermometer,
  Bot as BotIcon,
} from "lucide-react";

export default function ChatPage() {

  // MAIN CHAT MESSAGES
  const [messages, setMessages] = useState([
    {
      id: "1",
      text:
        "Hello! I'm Dr.AI, your health education assistant. I can help you understand symptoms, learn about medications, and interpret lab reports. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      structuredData: null,
    },
  ]);

  // PATIENT PROFILE (Needed by AI Engine)
  const [patientProfile] = useState({
    age: null,
    sex_at_birth: null,
    pregnancy: null,
    country: null,
    allergies: [],
    conditions: [],
    meds: [],
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickActions = [
    { icon: Thermometer, label: "Symptom Check", text: "I have symptoms I'd like to check" },
    { icon: Pill, label: "Medicine Info", text: "Tell me about a medication" },
    { icon: FlaskConical, label: "Lab Results", text: "Help me understand my lab results" },
    { icon: Heart, label: "Prevention Tips", text: "What are some prevention tips?" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  // fallback if AI engine fails
  const localFallback = (msg) => {
    const t = msg.toLowerCase();
    if (t.includes("fever")) return "Normal fever range is 97–99°F. High fever + red flags = seek care.";
    if (t.includes("ibuprofen")) return "Ibuprofen reduces pain/fever. Avoid kidney issues & ulcers.";
    if (t.includes("lab")) return "Paste your lab values (CBC, BMP, lipid panel). I can explain.";
    return "Please tell me your symptom, medicine name, or lab result.";
  };

  // MAIN MESSAGE HANDLER
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      structuredData: null,
    };

    setMessages((p) => [...p, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const result = await generateHealthResponse(inputValue, messages, patientProfile);

      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: result?.text || localFallback(inputValue),
        sender: "bot",
        timestamp: new Date(),
        structuredData: result?.structuredData || null,
      };

      setMessages((p) => [...p, botMsg]);
    } catch (err) {
      console.error("AI error:", err);

      const botMsg = {
        id: (Date.now() + 2).toString(),
        text: localFallback(inputValue),
        sender: "bot",
        timestamp: new Date(),
        structuredData: null,
      };

      setMessages((p) => [...p, botMsg]);
    }

    setIsTyping(false);
  };

  const handleQuickAction = (text) => {
    setInputValue(text);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex flex-col">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-28 pb-32 flex flex-col">

        {messages.length <= 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <h3 className="text-center text-lg text-gray-700 mb-4">Quick Start Options</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((a, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(a.text)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col items-center gap-2"
                >
                  <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-lg p-2">
                    <a.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">{a.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`flex gap-3 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "bot" && (
                  <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="text-sm leading-relaxed">{m.text}</div>

                  {/* Structured Data Badges */}
                  {m.structuredData?.urgency && (
                    <div className="text-xs mt-2 inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Urgency: {m.structuredData.urgency}
                    </div>
                  )}

                  <div className="text-xs mt-2 text-gray-400">
                    {m.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {m.sender === "user" && (
                  <div className="bg-gray-700 rounded-full p-2 h-10 w-10 flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex items-end gap-3">
              <div className="bg-gradient-to-br from-red-600 to-rose-600 p-2 rounded-full h-10 w-10 flex items-center justify-center text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>

              <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about symptoms, medications, or lab tests..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-3 rounded-xl disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            <Sparkles className="inline-block w-3 h-3 mr-1" />
            Educational information only — Not medical advice
          </p>
        </div>
      </main>
    </div>
  );
}
