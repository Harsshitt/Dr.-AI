// Frontend/src/pages/Chat.jsx
import React, { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();

      if (data.ok) {
        setMessages((prev) => [...prev, data.reply]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: " + data.error },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Server error. Try again later." },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Chat with Dr.AI</h1>

      <div className="max-w-3xl mx-auto bg-white p-4 rounded-2xl shadow">
        <div className="h-[500px] overflow-y-auto border p-3 rounded mb-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`my-2 p-3 rounded-xl ${
                msg.role === "user"
                  ? "bg-red-500 text-white ml-auto max-w-[80%]"
                  : "bg-gray-200 text-gray-900 mr-auto max-w-[80%]"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="bg-gray-300 p-2 rounded-xl inline-block">
              Dr.AI is typing...
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 border px-3 py-2 rounded-xl"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}