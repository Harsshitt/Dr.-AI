// src/pages/Medicines.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  MessageSquare,
  Pill,
  Info,
  Home,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  Zap,
  FileText,
  Shield,
  Calendar,
  Phone,
} from "lucide-react";

export default function Medicines() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 pt-20 pb-10">

      {/* Hero */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-10 right-10 w-48 h-48 bg-red-200/30 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl p-6 mb-6 shadow-xl"
            >
              <Pill className="w-16 h-16 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 font-semibold text-gray-900">Medicines — Educational Guide</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              This section helps you understand medicines — what they do, common side effects, safety warnings, and who should avoid them.
              I’m an assistant, not a clinician — this is educational info only, not personalized medical advice.
            </p>

            <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <a href="/chat" className="group bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all inline-flex items-center gap-3">
                <MessageSquare className="w-5 h-5" />
                <span>Start Chat</span>
                <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Zap className="w-4 h-4" />
                </motion.div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How medicine guidance works */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl mb-4 text-center text-gray-900">
            How medicine guidance works
          </motion.h2>

          <motion.div className="space-y-4 mt-6">
            <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <h3 className="text-lg font-semibold mb-2 text-red-700">What I explain</h3>
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                <li>I explain what a medicine is used for and how it generally works.</li>
                <li>You'll learn common side effects, warnings, and interactions.</li>
                <li>OTC medicines include label-based dosing rules (if user provides age/weight).</li>
                <li>Prescription doses are NOT provided — only general educational info.</li>
                <li>I’ll tell you when to follow up with a clinician or pharmacist.</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* OTC Medicines */}
      <section className="py-12 px-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl mx-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl mb-6 text-center text-gray-900">
            OTC Medicines (Over-the-Counter)
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <h3 className="text-lg font-semibold mb-2 text-red-600">Typical uses</h3>
              <p className="text-gray-700 text-sm">For fever, cold, acidity, minor pain, allergy relief, and similar common problems.</p>
            </motion.div>

            <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <h3 className="text-lg font-semibold mb-2 text-red-600">Label-based dosing</h3>
              <p className="text-gray-700 text-sm">If you provide age/weight I can explain label dosing rules (children vs adults) and maximum daily limits.</p>
            </motion.div>

            <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <h3 className="text-lg font-semibold mb-2 text-red-600">Safety & side effects</h3>
              <p className="text-gray-700 text-sm">Common side effects, who should avoid the medicine, and interactions with other OTCs or prescriptions.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prescription Medicines */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl mb-6 text-center text-gray-900">
            Prescription Medicines
          </motion.h2>

          <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <ul className="list-disc ml-5 text-gray-700 space-y-2">
              <li><strong>General education only:</strong> why the medicine is prescribed and how it works.</li>
              <li><strong>Common dose ranges:</strong> educational ranges (not your personal dose).</li>
              <li><strong>Major side effects & warnings:</strong> including serious/black-box warnings when relevant.</li>
              <li><strong>Interactions:</strong> general guidance about medicines that commonly interact.</li>
            </ul>

            <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-300 text-orange-800">
              <strong>Important:</strong> I do NOT prescribe, adjust doses, or tell you how much to take. Always follow your clinician’s instructions exactly.
            </div>
          </motion.div>
        </div>
      </section>

      {/* When to seek medical help */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl mb-6 text-center text-red-700">
            When to seek medical help
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-4">
            <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 flex gap-3 items-start">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
              <div>
                <h4 className="font-semibold mb-1 text-gray-900">Severe side effects</h4>
                <p className="text-gray-700 text-sm">Rash, swelling, trouble breathing — seek urgent medical care.</p>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 flex gap-3 items-start">
              <Phone className="w-6 h-6 text-red-500 mt-1" />
              <div>
                <h4 className="font-semibold mb-1 text-gray-900">Accidental overdose or mixing</h4>
                <p className="text-gray-700 text-sm">If you suspect overdose or dangerous interactions, call emergency services or your local poison control center.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Disclaimer</h3>
            <p className="text-gray-700 text-sm mb-4">
              I provide <strong>educational guidance only</strong>. For any medicine-related decision, consult a clinician or pharmacist.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
