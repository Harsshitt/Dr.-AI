// Frontend/src/pages/Symptoms.jsx
import React from "react";

export default function Symptoms() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <main className="pt-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Symptoms Checker — Quick guide</h1>

        <p className="text-gray-700 mb-4">
          This tool helps you understand common symptoms and decide what to do next. I’m an assistant, not a doctor — I provide educational guidance and red-flag checks only.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How it works</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Tell the assistant your age, sex at birth, major medical conditions, allergies, and medications.</li>
            <li>Describe the symptom: when it started, how severe it is, what makes it better/worse, and any related symptoms (fever, breathlessness, chest pain, etc.).</li>
            <li>I will estimate urgency (Emergency / Urgent / Routine / Self-care OK), suggest safe self-care steps, and list “go-now” signs.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Common self-care steps (general)</h2>
          <p className="text-gray-700">For many minor problems you can try:</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Rest, hydration, and simple home measures (ice/heat for musculoskeletal pain as appropriate).</li>
            <li>OTC pain relievers or fever reducers — only follow the product label and check age/weight rules.</li>
            <li>If symptoms are mild and improving in 48–72 hours, monitor and follow up with your primary care provider if not better.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Red flags — seek emergency care now</h2>
          <p className="text-gray-700">If any of these are present, call local emergency services or go to the nearest emergency department:</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Severe chest pain, pressure or squeezing.</li>
            <li>Sudden severe difficulty breathing, choking, or blue lips/skin.</li>
            <li>Signs of stroke: face droop, arm weakness, slurred speech.</li>
            <li>Sudden severe headache, confusion, new weakness/numbness, or sudden vision loss.</li>
            <li>Severe allergic reaction — swelling of face/tongue, difficulty breathing, hives with dizziness.</li>
            <li>Uncontrolled bleeding, severe dehydration, or loss of consciousness.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">When to see a clinician (urgent, within 24–48h)</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>High fever that doesn't respond to antipyretics or lasts &gt;48 hours.</li>
            <li>Worsening shortness of breath or persistent cough.</li>
            <li>Severe pain that is not controlled by OTC medicine.</li>
            <li>Signs of infection that are spreading (increasing redness, swelling, fever).</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">What I’ll ask you</h2>
          <p className="text-gray-700">To give useful guidance I usually ask:</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>How old are you? Sex at birth? Pregnant or breastfeeding?</li>
            <li>Describe the symptom (where, when, severity 1–10, what made it start).</li>
            <li>Any other symptoms (fever, cough, vomiting, chest pain, dizziness)?</li>
            <li>Medical conditions, allergies, and current medicines.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Quick safety note</h2>
          <p className="text-gray-700">
            I am not a clinician and I do not make diagnoses. Use this information to decide how urgently to seek professional care. If you feel severely unwell or unsure — choose emergency care.
          </p>
        </section>
      </main>
    </div>
  );
}