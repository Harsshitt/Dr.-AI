// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

import About from "./pages/About";
import SymptomsPage from "./pages/SymptomsPage";
import Medicines from "./pages/Medicines";
import Home from "./pages/Home";

import ChatPage from "./pages/Chat";     // Chat Page
import Login from "./pages/Login";       // NEW Login page
import Signup from "./pages/Signup";     // NEW Signup page

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* Main pages */}
        <Route path="/" element={<Home />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Chat page */}
        <Route path="/chat" element={<ChatPage />} />

        {/* Other pages */}
        <Route path="/about" element={<About />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/meds" element={<Medicines />} />

        {/* fallback */}
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
