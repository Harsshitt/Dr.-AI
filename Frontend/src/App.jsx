import React from "react";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-indigo-600">Dr.AI</span>
        </h1>

        <p className="text-lg text-gray-600 mb-10">
          Your intelligent health assistant — safe, simple, and always available.
        </p>

        {/* Quick Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a href="#chat" className="p-6 bg-white shadow rounded-lg border hover:shadow-lg">
            <h2 className="text-xl font-semibold text-indigo-600">Start Chat</h2>
            <p className="text-sm text-gray-600 mt-2">Talk to the AI assistant</p>
          </a>

          <a href="#symptoms" className="p-6 bg-white shadow rounded-lg border hover:shadow-lg">
            <h2 className="text-xl font-semibold text-indigo-600">Symptoms</h2>
            <p className="text-sm text-gray-600 mt-2">Check common health symptoms</p>
          </a>

          <a href="#meds" className="p-6 bg-white shadow rounded-lg border hover:shadow-lg">
            <h2 className="text-xl font-semibold text-indigo-600">Medicines</h2>
            <p className="text-sm text-gray-600 mt-2">Learn about medications</p>
          </a>
        </div>

      </main>
    </div>
  );
}