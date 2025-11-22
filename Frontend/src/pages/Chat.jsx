// src/pages/Chat.jsx
import React from "react";
// optionally import your ChatWindow component here:
// import ChatWindow from "../components/ChatWindow";

export default function Chat(){
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Chat with Dr.AI</h1>
      <p>Chat window goes here (or import your ChatWindow component).</p>
      {/* <ChatWindow /> */}
    </main>
  );
}