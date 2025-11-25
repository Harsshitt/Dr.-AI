// Frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // <-- ADDED FOOTER IMPORT

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
   Home hero component
   ------------------------ */
function HomeHero() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fffaf3] via-[#fff1e8] to-[#ffe7e0]">
      {/* fixed navbar */}
      <Navbar />

      {/* push content down so fixed navbar doesn't overlap */}
      <div className="pt-20">
        {/* Ambient layers */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
          style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
        />

        {/* floating blobs */}
        <div className="pointer-events-none absolute inset-0 rounded-[40px] shadow-[inset_0_0_120px_40px_rgba(255,190,180,0.35)]" />
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-red-300/30 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-red-200/25 blur-3xl rounded-full" />

        {/* heartbeat svg */}
        <motion.svg
          viewBox="0 0 1200 300"
          className="pointer-events-none absolute left-0 top-10 w-[1600px] opacity-20"
          initial={{ x: -50 }}
          animate={{ x: 30 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        >
          <path
            d="M0 170 L80 170 L100 150 L130 200 L160 120 L200 180 L240 170 L320 170 L360 150 L390 190 L430 140 L480 170 L560 170 L600 130 L640 190 L700 170 L780 170 L840 140 L900 180 L960 160 L1020 170 L1200 170"
            stroke="#ff0000ff"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* centered content */}
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
                className="text-4xl sm:text-5xl font-extrabold text-gray-900"
                whileHover={{ scale: 1.5 }}
              >
                Welcome to <span className="text-red-600">Dr.AI</span>
              </motion.h1>

              <motion.p
                variants={heroSubVariant}
                className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto"
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
   Chat & About pages
   ------------------------ */
function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      <main className="pt-20 p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Chat with Dr.AI</h1>
      </main>
    </div>
  );
}

/* ------------------------
   About page (user-facing content based on your project spec)
   ------------------------ */
import About from "./pages/About";

/* ------------------------
   App wrapper w/ routing
   ------------------------ */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeHero />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* ⭐ FIXED FOOTER ALWAYS ON BOTTOM ⭐ */}
      <Footer />
    </BrowserRouter>
  );
}
