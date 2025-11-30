// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

import About from "./pages/About";
import SymptomsPage from "./pages/SymptomsPage";
import Medicines from "./pages/Medicines";
import Home from "./pages/Home";
import Chat from "./pages/Chat"; // <-- import the full Chat page (Chat.jsx)

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />            {/* <-- uses Chat.jsx */}
        <Route path="/about" element={<About />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/meds" element={<Medicines />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
