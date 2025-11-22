// Frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";

/* ---------------------------
   Framer Motion variant defs
   --------------------------- */
const heroTitleVariant = {
  hidden: { opacity: 0, y: -8, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const heroSubVariant = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.6 } },
};

const floatVariants = {
  floatUp: (i) => ({
    y: [0, -10 - i * 6, 0],
    x: [0, i % 2 === 0 ? -6 : 6, 0],
    transition: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
  }),
};

/* ------------------------
   Home hero component (kept minimal: title + subtitle)
   ------------------------ */
function HomeHero() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fffaf3] via-[#fff1e8] to-[#ffe7e0]">
      {/* fixed navbar */}
      <Navbar />

      {/* push content down so fixed navbar doesn't overlap */}
      <div className="pt-20">
        {/* Ambient layers (absolute) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
          style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-[40px] shadow-[inset_0_0_120px_40px_rgba(255,190,180,0.35)]" />
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-red-300/30 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-red-200/25 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute left-0 top-1/3 w-[260px] h-[420px] bg-red-100/20 blur-2xl rounded-full" />
        <div className="pointer-events-none absolute right-0 top-1/2 w-[260px] h-[420px] bg-orange-100/20 blur-2xl rounded-full" />
        <div className="pointer-events-none absolute top-36 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-white/40 blur-[120px] rounded-full" />

        {/* Decorative heartbeat */}
        <motion.svg
          viewBox="0 0 1200 300"
          className="pointer-events-none absolute left-0 top-8 w-[1400px] opacity-8"
          initial={{ x: -50 }}
          animate={{ x: 30 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        >
          <path
            d="M0 170 L80 170 L100 150 L130 200 L160 120 L200 180 L240 170 L320 170 L360 150 L390 190 L430 140 L480 170 L560 170 L600 130 L640 190 L700 170 L780 170 L840 140 L900 180 L960 160 L1020 170 L1200 170"
            stroke="#ef4444"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* Floating icons (kept for style) */}
        {[
          {
            svg: (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="#ef4444" strokeWidth="1.5" fill="white" />
                <path d="M12 7v10M7 12h10" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
            style: { right: "6%", top: "18%" },
          },
          {
            svg: (
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21s8-4.5 8-10a8 8 0 10-16 0c0 5.5 8 10 8 10z" stroke="#ef4444" strokeWidth="1.25" fill="white" />
                <path d="M10 11h4M12 9v4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
            style: { left: "6%", top: "12%" },
          },
          {
            svg: (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="1.25" fill="white" />
                <path d="M8 12h8M12 8v8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
            style: { right: "12%", top: "36%" },
          },
        ].map((ic, i) => (
          <motion.div key={i} style={ic.style} className="absolute rounded-full p-1" animate={floatVariants.floatUp(i)}>
            {ic.svg}
          </motion.div>
        ))}

        {/* Centered main (only hero title & subtitle) */}
        <main className="min-h-screen flex items-center justify-center md:ml-72 relative z-10 px-6 pt-16">
          <div className="w-full max-w-3xl text-center">
            <motion.header
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="mb-8"
            >
              <motion.h1
                variants={heroTitleVariant}
                className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight"
                style={{ textShadow: "0 8px 30px rgba(239,68,68,0.06)" }}
                whileHover={{ scale: 1.02, textShadow: "0 14px 40px rgba(239,68,68,0.12)" }}
                transition={{ type: "spring", stiffness: 160, damping: 18 }}
              >
                Welcome to <span className="text-red-600">Dr.AI</span>
              </motion.h1>

              <motion.p
                variants={heroSubVariant}
                className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto"
                style={{ textShadow: "0 6px 18px rgba(0,0,0,0.03)" }}
              >
                Your intelligent health assistant — safe, simple, and always available.
              </motion.p>
            </motion.header>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ------------------------
   Chat & About pages (unchanged)
   ------------------------ */
function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      <main className="pt-20 p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Chat with Dr.AI</h1>
        <p className="text-gray-600 mb-4">This is the chat page. Replace the content below with your ChatWindow component.</p>
      </main>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      <main className="pt-20 p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">About Dr.AI</h1>
        <p className="text-gray-600">Information about the project and what it does.</p>
      </main>
    </div>
  );
}

/* ------------------------
   App wrapper w/ routing (single default export)
   ------------------------ */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeHero />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/symptoms"
          element={
            <div className="min-h-screen">
              <Navbar />
              <main className="pt-20 p-6">Symptoms page placeholder</main>
            </div>
          }
        />
        <Route
          path="/meds"
          element={
            <div className="min-h-screen">
              <Navbar />
              <main className="pt-20 p-6">Medicines page placeholder</main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}