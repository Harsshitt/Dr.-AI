// Frontend/src/pages/Meds.jsx
import React from "react";

export default function Meds() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Medicines — Educational Guide</h1>

        <p className="text-gray-700 mb-4">
          This section helps you understand medicines — what they do, common side effects,
          safety warnings, and who should avoid them.  
          I’m an assistant, not a clinician — this is educational info only, not
          personalized medical advice.
        </p>

        {/* How medicine guidance works */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How medicine guidance works</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>I explain what a medicine is used for and how it generally works.</li>
            <li>You'll learn common side effects, warnings, and interactions.</li>
            <li>OTC medicines include label-based dosing rules.</li>
            <li>Prescription doses are NOT provided — only general educational info.</li>
            <li>I’ll tell you when to follow up with a clinician or pharmacist.</li>
          </ul>
        </section>

        {/* OTC section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">OTC Medicines (Over-the-Counter)</h2>
          <p className="text-gray-700">
            OTC medicines can be used for common issues like fever, cold, acidity, minor pain, etc.  
            Guidance includes:
          </p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Typical uses</li>
            <li>Label-based dosing for age/weight (if provided by user)</li>
            <li>Maximum daily limits</li>
            <li>Common side effects</li>
            <li>Who should avoid the medicine</li>
          </ul>
        </section>

        {/* Prescription section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Prescription Medicines</h2>
          <p className="text-gray-700">
            I provide **general education only**, such as:
          </p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Why the medicine is prescribed</li>
            <li>How it works in the body</li>
            <li>Common dose ranges (not your personal dose!)</li>
            <li>Major side effects & black-box warnings</li>
            <li>Interactions (general guidance)</li>
          </ul>

          <p className="text-gray-700 mt-2">
            ❗ I do NOT prescribe, adjust doses, or tell you how much to take.
            Always follow your clinician’s instructions exactly.
          </p>
        </section>

        {/* Safety warnings */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">When to seek medical help</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Severe side effects (rash, swelling, trouble breathing)</li>
            <li>Allergic reaction symptoms</li>
            <li>Accidental overdose or duplicate medicines</li>
            <li>Mixing medicines that may interact</li>
          </ul>
        </section>

        {/* Quick disclaimer */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Disclaimer</h2>
          <p className="text-gray-700">
            I provide **educational guidance only**.  
            For any medicine-related decision, consult a clinician or pharmacist.
          </p>
        </section>
      </main>
    </div>
  );
}