// Frontend/src/App.jsx
import React, { useState } from "react";
import IntakeForm from "./components/IntakeForm";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [profile, setProfile] = useState({
    age: "",
    sex_at_birth: "",
    allergies: "",
  });

  return (
    <div style={{ display: "flex", gap: 20, padding: 20, height: "100vh", boxSizing: "border-box" }}>
      <div style={{ width: 300 }}>
        <IntakeForm profile={profile} setProfile={setProfile} />
      </div>

      <div style={{ flex: 1 }}>
        <ChatWindow profile={profile} />
      </div>
    </div>
  );
}