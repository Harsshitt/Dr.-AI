// Frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Symptoms from "./pages/Symptoms";
import Meds from "./pages/Meds";
import Chat from "./pages/Chat"; // if exists

// If Chat.jsx does not exist
function ChatPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Chat with Dr.AI</h1>
      <p className="text-gray-600">
        Start a conversation to check symptoms, learn about medicines, or get lab-report help.
      </p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/chat"
          element={typeof Chat !== "undefined" ? <Chat /> : <ChatPageFallback />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/symptoms" element={<Symptoms />} />
        <Route path="/meds" element={<Meds />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}