import React, { useState } from "react";
import { sendToAI } from "../utils/api";

export default function ChatWindow({ profile }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMsg = { sender: "You", text: message };
    setChat([...chat, userMsg]);
    setLoading(true);

    const payload = {
      patient_profile: profile,
      message,
      history: [],
    };

    try {
      const res = await sendToAI(payload);
      const aiMsg = { sender: "Dr.AI", text: res.reply };
      setChat((prev) => [...prev, aiMsg]);
    } catch (err) {
      setChat((prev) => [...prev, { sender: "System", text: "Error sending message" }]);
    }

    setLoading(false);
    setMessage("");
  }

  return (
    <div style={{ padding: 20, border: "1px solid #ddd", flex: 1 }}>
      <h2>Chat with Dr.AI</h2>

      <div
        style={{
          border: "1px solid #eee",
          height: 300,
          overflowY: "auto",
          padding: 10,
          marginBottom: 12,
        }}
      >
        {chat.map((m, i) => (
          <div key={i}>
            <b>{m.sender}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "70%", padding: 8 }}
        placeholder="Type your symptoms..."
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{ marginLeft: 10, padding: "8px 16px" }}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}