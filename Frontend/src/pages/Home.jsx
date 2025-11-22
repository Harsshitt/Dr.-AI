// src/pages/Home.jsx

import React from "react";
import FullWidthWave from "../components/FullWidthWave";

export default function Home() {
  return (
    <div style={{ position: "relative" }}>
      {/* Zig-zag animated line */}
      <FullWidthWave top="64px" height="120px" />

      {/* Page content */}
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to Dr.AI</h1>
        <p className="text-gray-600">Home page content here.</p>
      </main>
    </div>
  );
}
