// src/App.jsx
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import FeedbackWidget from "./components/FeedbackWidget";

import Home from "./pages/Home";
import About from "./pages/About";
import SymptomsPage from "./pages/SymptomsPage";
import Medicines from "./pages/Medicines";
import ChatPage from "./pages/Chat"; // ensure this file exists (or use your Chat.jsx)
import Profile from "./pages/Profile";
import MedicalHistory from "./pages/MedicalHistory";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import Upgrade from "./pages/Upgrade";
import MockCheckout from "./pages/MockCheckout";
import PaymentSuccess from "./pages/PaymentSuccess";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/symptoms" element={<SymptomsPage />} />
          <Route path="/meds" element={<Medicines />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<MedicalHistory />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/payment/mock-checkout" element={<MockCheckout />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
      <FeedbackWidget />
    </BrowserRouter>
  );
}