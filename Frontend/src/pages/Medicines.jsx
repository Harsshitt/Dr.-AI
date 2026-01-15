// src/pages/Medicines.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Pill, AlertTriangle, CheckCircle2, ShieldAlert, Loader2, ChevronRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { API_BASE_URL } from "../utils/api";

export default function Medicines() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Construct a prompt that enforces Amboss-style structure
      const specificPrompt = `
        [SYSTEM: ACT AS AN EXPERT PHARMACIST using high-quality sources like Amboss/UpToDate]
        Task: Provide a detailed, structured clinical summary for the medicine/drug: "${query}".
        
        Format the response in Markdown with these specific sections:
        1. **Overview**: precise class and mechanism of action.
        2. **Clinical Uses**: Primary indications.
        3. **Dosing (General)**: Standard adult/pediatric ranges (Note: Consult doctor).
        4. **Key Side Effects**: Common and Serious.
        5. **Contraindications & Warnings**: Black box warnings, pregnancy category.
        6. **Brand Names**: Common brands in US/India.

        Keep it concise, professional, and strictly factual.
        `;

      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: specificPrompt })
      });

      const data = await res.json();
      if (data.reply) {
        setResult(data.reply);
      } else {
        setError("Could not fetch medicine data. Please try again.");
      }

    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
          <Pill className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Medicine Guide</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Powered by advanced medical knowledge. Search for any drug to get dosage, side effects, and clinical interactions acting as an Amboss-style reference.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto relative z-10">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a generic or brand name (e.g. Paracetamol, Lisinopril)..."
            className="w-full px-6 py-4 pl-14 rounded-2xl bg-white border border-gray-200 shadow-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg transition-all"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
          </button>
        </form>
      </div>

      {/* Results Area */}
      <div className="max-w-4xl mx-auto mt-12">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex items-center gap-4">
                <ShieldAlert className="w-8 h-8 opacity-80" />
                <div>
                  <h2 className="text-2xl font-bold capitalize">{query}</h2>
                  <p className="text-emerald-100 text-sm">AI-Generated Summary (Verify with Clinician)</p>
                </div>
              </div>

              <div className="p-8 prose prose-emerald max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-600">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>

              <div className="bg-orange-50 p-4 border-t border-orange-100 text-orange-800 text-sm text-center">
                <strong>Disclaimer:</strong> This is for informational purposes only. Do not calculate dosages or change medication based solely on this AI output.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Suggestions */}
        {!result && !loading && (
          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setQuery("Amoxicillin") || document.querySelector('input').focus()}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">Amoxicillin</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Antibiotic used for bacterial infections.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setQuery("Ibuprofen") || document.querySelector('input').focus()}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">Ibuprofen</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">NSAID for pain, fever, and inflammation.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
