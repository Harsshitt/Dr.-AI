Dr. AI — Health Information & Triage Assistant

Educational only — not a medical professional

🩺 Overview

Dr. AI is an educational health assistant that provides symptom triage, OTC medication education, and lab report explanations.
It does not give clinical diagnoses or prescriptions — only safe guidance and care navigation.

🚀 Features

Symptom intake with structured triage

Urgency estimation (Emergency / Urgent / Routine / Self-care)

Red-flag detection

OTC medication education (label-based, non-prescriptive)

Lab report explanation (test meaning, high/low flags, follow-up questions)

Care navigation (primary care, urgent care, emergency)

Privacy-first design (no PHI stored by default)

📐 Architecture

Frontend: React / Next.js

Backend: Node.js/Express or Python/Flask

Logic Layer:

Symptom & red-flag rules

Medication education module

Lab parsing & explanation module

Integrations (optional): Pharmacy lookup, telehealth, location-based care finder

📦 Project Structure
dr-ai-triage/
├─ README.md
├─ LICENSE
├─ backend/
│  ├─ src/
│  ├─ routes/
│  └─ tests/
├─ frontend/
│  ├─ app/
│  └─ components/
├─ docs/
│  └─ triage-spec.md
├─ examples/
│  └─ sample_lab_reports/
└─ .github/
   └─ workflows/ci.yml

🛠️ Quick Start
git clone https://github.com/yourusername/dr-ai-triage
cd dr-ai-triage
# Install frontend
cd frontend && npm install && npm run dev
# Install backend
cd ../backend && npm install && npm start

🔒 Privacy & Compliance

No personal health data stored by default

All guidance is educational and not a diagnosis

Always includes a safety disclaimer

Does not interpret raw medical images

Does not provide prescription dosing or medical decisions

🤝 Contributing

Pull requests are welcome.
Please follow the code style, include tests, and keep all triage logic safety-aligned.

📜 License

MIT License (or update as needed)
