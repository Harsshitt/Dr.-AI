// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, ShieldCheck, Heart, Activity, Brain, Lock } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pt-20">

      {/* Hero Section */}
      <section className="bg-white py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-6">
              About Dr.AI
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Healthcare for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">AI Age</span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              We combine advanced medical knowledge with empathetic AI to provide instant, reliable health guidance—anytime, anywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            icon={<Heart className="w-6 h-6 text-red-500" />}
            title="Our Mission"
            text="To reduce health anxiety by providing clear, evidence-based explanations for symptoms and lab results."
          />
          <Card
            icon={<Brain className="w-6 h-6 text-indigo-500" />}
            title="Intelligent Analysis"
            text="Powered by advanced LLMs trained on medical literature to understand complex queries."
          />
          <Card
            icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
            title="Safety First"
            text="We prioritize safety. Dr.AI knows its limits and will always direct you to emergency care when needed."
          />
        </div>
      </section>

      {/* How it Works / Transparency */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Transparency & Trust</h2>
            <p className="text-gray-500">How we handle your data and what we can (and can't) do.</p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Private & Secure</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your health data is sensitive. We process your chats to provide answers but do not sell your personal health information.
                  Conversations are categorized by your profile for better continuity.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Not a Doctor</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dr.AI is an informational tool. It generates answers based on medical data patterns but does not "diagnose" in the legal sense.
                  Always consult a human clinician for medical decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <div className="bg-gray-50 py-10 px-6 text-center border-t border-gray-200">
        <p className="text-sm text-gray-400">
          Dr.AI is for informational purposes only and does not constitute medical diagnosis or treatment.
        </p>
      </div>

    </div>
  );
}

function Card({ icon, title, text }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
