// Frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Home from "./pages/Home";

/* ------------------------
   Chat & About pages
   ------------------------ */
function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <main className="pt-20 p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Chat with Dr.AI</h1>
        <p className="text-gray-600 mb-4">Start a conversation to check symptoms, learn about medicines, or get lab-report help.</p>
      </main>
    </div>
  );
}

/* Placeholder pages for symptoms & meds so Navbar remains visible */
function SymptomsPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <main className="pt-20 p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Symptoms Checker</h1>
        <p className="text-gray-700">Enter symptoms to get triage guidance and self-care suggestions (educational only).</p>
      </main>
    </div>
  );
}

function MedsPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <main className="pt-20 p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Medicines</h1>
        <p className="text-gray-700">Learn about common medications: what they do, common side effects, and safety warnings.</p>
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
      {/* Navbar shown once for whole app */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/meds" element={<MedsPage />} />
        {/* fallback route (optional) */}
        <Route path="*" element={<Home />} />
      </Routes>

      {/* fixed footer */}
      <Footer />
    </BrowserRouter>
  );
}