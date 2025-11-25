import React from "react";
import Navbar from "../components/Navbar";


export default function About() {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main
        className="pt-20 p-6 min-h-screen"
        style={{
          background: "linear-gradient(135deg, #e2cece2f 0%, #49d0e557 40%, #c72b2b3d 100%)",
        }}

      >
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
          <h1 
            className="text-3xl font-semibold mb-4 text-center"
            style={{
              textShadow: "1px 1px 2px rgba(0,0,0,0.25)"
            }}
          >
            About Dr.AI
          </h1>


          <div className="border-2 border-black bg-white shadow-xl p-4 rounded-xl font-serif w-[900px] h-[100px] mx-auto flex items-center justify-center text-center shadow-[2px_4px_25px_rgba(0,0,0,0.3)]">
            <p className="text-gray-700 mb-0 leading-tight ">
            <strong>Dr.AI</strong> is an educational health assistant that helps people understand symptoms, learn about medications, and interpret lab reports — all in plain language.
            I’m not a doctor; I provide information, triage guidance, and clear next steps to help you decide when to seek care.
            </p>
          </div>

          <section className="mb-4 ">
            <h2 className="text-xl font-semibold mb-2 ">Mission</h2>
            <p className="text-gray-700 ">
              Provide clear, compassionate, evidence-informed guidance that reduces unnecessary worry and unnecessary visits while also helping spot red flags early. <br />
              Always educational — never a medical diagnosis or prescription.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">What Dr.AI can help with</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li><strong>Symptom triage & self-care:</strong> Ask focused questions, estimate urgency (Emergency / Urgent / Routine / Self-care OK), and suggest safe self-care and OTC options when appropriate.</li>
              <li><strong>Medication education:</strong> Explain what medicines do, common side effects, warnings, who should avoid them, and label-based OTC dosing guidance (education only; not personal prescriptions).</li>
              <li><strong>Lab report explainer:</strong> Parse lab report values and explain what tests measure, whether values are clearly flagged by the lab, and common non-diagnostic reasons tests change (e.g., fasting, timing, medicines).</li>
              <li><strong>Care navigation:</strong> Recommend where to go for care (emergency, urgent care, primary care, pharmacist) and how to find local services.</li>
              <li><strong>Prevention & education:</strong> Offer plain-language lifestyle and prevention tips, vaccine info, and what signs to watch for.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Intake — what I’ll ask</h2>
            <p className="text-gray-700">To give useful guidance I usually ask for:</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Age, sex at birth, pregnancy/breastfeeding status, and country.</li>
              <li>Major conditions, allergies, and current medications/supplements.</li>
              <li>For symptoms: onset, severity, location, pattern, associated symptoms, and anything tried so far.</li>
              <li>For labs: exact test names, values, units, reference ranges, date, and whether fasting.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Important limits — what I don’t do</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>I do <strong>not</strong> diagnose conditions or prescribe/adjust prescription medicines.</li>
              <li>I will not interpret raw medical images (X-ray, CT, MRI, ultrasound). I can explain a radiology report text if you paste it.</li>
              <li>I won’t provide unsafe instructions that require in-person evaluation (e.g., start/stop Rx, use leftover antibiotics).</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Safety & red flags</h2>
            <p className="text-gray-700">
              If you have any emergency signs — severe chest pain, severe difficulty breathing, sudden weakness or slurred speech, severe allergic reaction, uncontrolled bleeding, signs of stroke, or suicidal thoughts — <strong>seek emergency care now</strong>.
              For less urgent but concerning issues, Dr.AI will recommend urgent or primary care.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Privacy & use</h2>
            <p className="text-gray-700">
              The assistant provides educational information only. Treat any personal data you share carefully. If you prefer, avoid sending highly sensitive details. If you want something deleted, tell us and we’ll remove it (if the host app supports deletion).
            </p>
          </section>

          <div className="text-sm text-gray-500">
            <strong>Disclaimer:</strong> I’m a health information assistant, not a medical professional. This is educational information, not a diagnosis. If you need urgent help, contact local emergency services or your healthcare provider.
          </div>
        </div>
      </main>
    </div>
  );
} 