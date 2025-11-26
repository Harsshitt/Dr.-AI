// Frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import About from "./pages/About";
import SymptomsPage from "./pages/SymptomsPage";
import Medicines from "./pages/Medicines";
import Home from "./pages/Home"; // Restored Home import

/* ------------------------
   Chat Page
   ------------------------ */
function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <main className="pt-20 p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Chat with Dr.AI</h1>
        <p className="text-gray-600 mb-4">
          Start a conversation to check symptoms, learn about medicines, or get lab-report help.
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
      {/* Navbar global */}
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

      {/* Global footer */}
      <Footer />
    </BrowserRouter>
  );
}
