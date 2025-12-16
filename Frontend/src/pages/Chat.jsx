// src/pages/Chat.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Plus,
  Image as ImageIcon,
  FileText,
  Camera,
  X,
  ThumbsUp,
  ThumbsDown,
  MessageSquarePlus,
  Check
} from "lucide-react";
import { generateHealthResponse } from "../lib/aiHealthEngine";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text:
        "Hello! I'm Dr.AI, your health assistant. I can help you understand symptoms, learn about medications, and interpret lab reports. I'm an educational assistant and cannot diagnose or prescribe. If this is an emergency, call 911. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      structuredData: null,
      feedback: null, // { type: 'like' | 'dislike', comment: string }
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Attachment State
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachment, setAttachment] = useState(null); // { type: 'image' | 'pdf', file: File, preview: string }
  const [showCamera, setShowCamera] = useState(false);

  // Feedback Comment State
  const [activeCommentId, setActiveCommentId] = useState(null); // ID of message currently being commented on
  const [commentText, setCommentText] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const quickActions = [
    { icon: Thermometer, label: "Symptom Check", text: "I have symptoms I'd like to check" },
    { icon: Pill, label: "Medicine Info", text: "Tell me about a medication" },
    { icon: FlaskConical, label: "Lab Results", text: "Help me understand my lab results" },
    { icon: Heart, label: "Prevention Tips", text: "What are some prevention tips?" },
  ];

  // Load user for history saving
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("dr_ai_user") || "{}");
      if (user.email) setUserEmail(user.email);
    } catch (e) { console.error(e); }
  }, []);

  // Save/Load History
  useEffect(() => {
    if (!userEmail) return;

    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
    const storageKey = `dr_ai_chat_history_${userEmail}`;
    if (messages.length > 1) {
      try {
        const history = JSON.parse(localStorage.getItem(storageKey) || "{}");
        history[today] = messages;
        localStorage.setItem(storageKey, JSON.stringify(history));
      } catch (e) { console.error("Failed to save chat", e); }
    }
  }, [messages, userEmail]);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ---------------------------
  // Feedback Logic
  // ---------------------------
  const handleFeedback = (msgId, type) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;

      // Toggle logic
      const currentType = m.feedback?.type;

      // If clicking same type, remove it (toggle off)
      if (currentType === type) {
        return { ...m, feedback: { ...m.feedback, type: null } };
      }

      return { ...m, feedback: { ...m.feedback, type } };
    }));
  };

  const startComment = (msgId) => {
    const msg = messages.find(m => m.id === msgId);
    setCommentText(msg?.feedback?.comment || "");
    setActiveCommentId(msgId);
  };

  const submitComment = (msgId) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      return { ...m, feedback: { ...m.feedback, comment: commentText } };
    }));
    setActiveCommentId(null);
    setCommentText("");
  };

  const cancelComment = () => {
    setActiveCommentId(null);
    setCommentText("");
  };


  // ---------------------------
  // Camera Logic
  // ---------------------------
  const startCamera = async () => {
    try {
      setShowAttachMenu(false);
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Could not access camera. Please allow permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
      const preview = URL.createObjectURL(blob);
      setAttachment({ type: 'image', file, preview });
      stopCamera();
    }, "image/jpeg");
  };

  // ---------------------------
  // File Handling
  // ---------------------------
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'image') {
      const preview = URL.createObjectURL(file);
      setAttachment({ type: 'image', file, preview });
    } else if (type === 'pdf') {
      setAttachment({ type: 'pdf', file, preview: null, name: file.name });
    }
    setShowAttachMenu(false);
    e.target.value = null; // reset
  };

  const removeAttachment = () => {
    if (attachment?.preview) URL.revokeObjectURL(attachment.preview);
    setAttachment(null);
  };


  // ---------------------------
  // Backend Integration
  // ---------------------------
  const endpoints = [
    "http://localhost:5001/api/chat"
  ];

  const sendToBackend = async (payload) => {
    console.log("sendToBackend payload:", payload);
    let lastErr;
    const token = localStorage.getItem("dr_ai_token");

    for (const ep of endpoints) {
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(ep, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        const raw = await res.text();
        let json;
        try { json = JSON.parse(raw); } catch (e) { json = raw; }

        if (!res.ok) throw new Error(`Endpoint ${ep} returned ${res.status}`);
        return json;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !attachment) return;

    // Build User Message
    const userMsg = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      attachment: attachment ? { ...attachment, file: null } : null // Don't allow non-serializable file object in state history if possible, or handle it carefully. LocalStorage will kill it anyway. 
    };
    // Note: Storing 'preview' blob URL in history is temporary (revoked on refresh). Real app would upload to S3. We'll stick to ephemeral state for now.

    setMessages((p) => [...p, userMsg]);
    const currentInput = inputValue;
    const currentAttachment = attachment;

    setInputValue("");
    setAttachment(null);
    setIsTyping(true);

    try {
      // Convert attachment to base64 if needed (Optional for this step, but good for future)
      // For now, we mainly send the text. 
      const payload = {
        message: currentInput + (currentAttachment ? ` [Attached: ${currentAttachment.type}]` : ""),
        // isPro is now determined server-side

        messages: [
          ...messages.map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
          { role: "user", content: currentInput },
        ],
      };

      const result = await sendToBackend(payload);

      let text = null;
      let structuredData = null;

      if (result && result.reply) {
        text = typeof result.reply === 'string' ? result.reply : JSON.stringify(result.reply);
      } else if (result && result.text) {
        text = result.text;
      } else {
        throw new Error("Invalid response from backend");
      }

      const assistant = {
        id: (Date.now() + 1).toString(),
        text: text,
        sender: "bot",
        timestamp: new Date(),
        structuredData: structuredData,
        feedback: null // Initialize feedback
      };
      setMessages((p) => [...p, assistant]);

    } catch (err) {
      console.error("Backend failed, switching to Local Engine:", err);
      // Fallback
      const profile = { age: null, country: "usa" };
      const localResponse = await generateHealthResponse(currentInput, messages, profile);
      setMessages((p) => [
        ...p,
        {
          id: (Date.now() + 3).toString(),
          text: localResponse.text,
          sender: "bot",
          timestamp: new Date(),
          structuredData: localResponse.structuredData,
          feedback: null
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (text) => {
    setInputValue(text);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="h-[calc(100vh-150px)] bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col relative">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-[78px] pb-4 flex flex-col">

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
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg p-2">
                    <a.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">{a.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pb-56">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.02 }} className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                {m.sender === "bot" && (
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full p-2 h-10 w-10 flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-white" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.sender === "user" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-white border border-gray-200 shadow-sm"}`}>

                  {/* Display Attached Image in History */}
                  {m.attachment && m.attachment.type === 'image' && m.attachment.preview && (
                    <img src={m.attachment.preview} alt="Attached" className="w-48 h-auto rounded-lg mb-2 border border-white/20" />
                  )}
                  {m.attachment && m.attachment.type === 'pdf' && (
                    <div className="bg-white/20 p-2 rounded-lg mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <span className="text-xs truncate max-w-[150px]">{m.attachment.name || "Document.pdf"}</span>
                    </div>
                  )}

                  <div className="text-sm leading-relaxed">
                    {m.sender === "user" ? (
                      m.text
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({ node, ...props }) => <ul className="list-disc ml-4 my-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal ml-4 my-2" {...props} />,
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold my-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold my-2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold my-1" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold text-emerald-800" {...props} />,
                          a: ({ node, ...props }) => <a className="text-emerald-600 underline hover:text-emerald-700" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    )}
                  </div>
                  {m.structuredData?.urgency && <div className="text-xs mt-2 inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Urgency: {m.structuredData.urgency}</div>}

                  {/* FEEDBACK UI (Only for Bot) */}
                  {m.sender === 'bot' && (
                    <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleFeedback(m.id, 'like')}
                          className={`p-1 rounded-full hover:bg-emerald-50 transition-colors ${m.feedback?.type === 'like' ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, 'dislike')}
                          className={`p-1 rounded-full hover:bg-red-50 transition-colors ${m.feedback?.type === 'dislike' ? 'text-red-600 bg-red-50' : 'text-gray-400'}`}
                          title="Not Helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => startComment(m.id)}
                          className={`p-1 rounded-full hover:bg-blue-50 transition-colors ${m.feedback?.comment || activeCommentId === m.id ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
                          title="Leave Feedback"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* INLINE COMMENT BOX */}
                      <AnimatePresence>
                        {activeCommentId === m.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <textarea
                              autoFocus
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Why was this helpful (or not)?..."
                              className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-emerald-500 outline-none resize-none bg-gray-50"
                              rows="2"
                            />
                            <div className="flex justify-end gap-2 mt-2 mb-1">
                              <button onClick={cancelComment} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">Cancel</button>
                              <button onClick={() => submitComment(m.id)} className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-md hover:bg-emerald-700 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Save
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* SAVED COMMENT DISPLAY */}
                      {!activeCommentId && m.feedback?.comment && (
                        <div className="text-[10px] text-blue-600 bg-blue-50 p-2 rounded-lg italic border border-blue-100">
                          "{m.feedback.comment}"
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-xs mt-2 text-gray-400">
                    {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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

          {/* TYPING INDICATOR */}
          {isTyping && (
            <div className="flex items-end gap-3">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-full h-10 w-10 flex items-center justify-center text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BOX AREA */}
        <div className="fixed bottom-[80px] left-0 right-0 max-w-5xl mx-auto px-4 z-20">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm relative">

            {/* ATTACHMENT PREVIEW */}
            {attachment && (
              <div className="absolute -top-24 left-4 bg-white p-2 rounded-xl shadow-lg border border-gray-200 flex items-start gap-2 animate-in slide-in-from-bottom-2">
                {attachment.type === 'image' ? (
                  <img src={attachment.preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500">
                    <FileText className="w-8 h-8 mb-1" />
                    <span className="text-[10px] truncate max-w-full px-1">{attachment.name}</span>
                  </div>
                )}
                <button onClick={removeAttachment} className="bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ATTACH MENU */}
            {showAttachMenu && (
              <div className="absolute bottom-20 left-4 bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-[180px] z-20 flex flex-col gap-1 animate-in slide-in-from-bottom-2">
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 w-full px-3 py-2 hover:bg-emerald-50 rounded-lg text-sm text-gray-700 transition-colors">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  Gallery / Images
                </button>
                <button onClick={() => pdfInputRef.current?.click()} className="flex items-center gap-3 w-full px-3 py-2 hover:bg-emerald-50 rounded-lg text-sm text-gray-700 transition-colors">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  PDF Document
                </button>
                <button onClick={startCamera} className="flex items-center gap-3 w-full px-3 py-2 hover:bg-emerald-50 rounded-lg text-sm text-gray-700 transition-colors">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  Camera
                </button>
              </div>
            )}

            {/* HIDDEN INPUTS */}
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'image')} />
            <input type="file" ref={pdfInputRef} accept=".pdf" className="hidden" onChange={(e) => handleFileSelect(e, 'pdf')} />

            <div className="flex gap-3 items-end">
              {/* INSERT BUTTON */}
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-3 rounded-xl transition-all ${showAttachMenu ? 'bg-emerald-100 text-emerald-600 rotate-45' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
              >
                <Plus className="w-5 h-5" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask Dr.AI..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
              />
              <button onClick={handleSendMessage} disabled={!inputValue.trim() && !attachment} className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* CAMERA MODAL */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4"
          >
            <div className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl border border-gray-800">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>

              <button onClick={stopCamera} className="absolute top-4 right-4 bg-gray-800/80 text-white p-2 rounded-full hover:bg-gray-700">
                <X className="w-6 h-6" />
              </button>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full border-4 border-white bg-red-600 hover:bg-red-700 shadow-lg transition-transform active:scale-95"
                />
              </div>
            </div>
            <p className="text-white mt-4 text-sm font-medium">Tap button to capture</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}