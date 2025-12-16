// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, Pill, FileText, Map, ShieldCheck, Clock } from "lucide-react";

function About() {
  return (
    <div style={styles.page}>
      <style>{`
/* -------------------- INTAKE SECTION -------------------- */
.intake-section {
    max-width: 1100px;
    margin: 80px auto;
    padding: 32px;
    border-radius: 26px;
    background: linear-gradient(180deg, #ecfdf5, #d1fae5);
    border: 1px solid #a7f3d0;
}

.intake-title {
    font-size: 32px;
    font-weight: 700;
    color: #0c1a2c;
    text-align: center;
    margin-bottom: 12px;
}

.intake-sub {
    text-align: center;
    font-size: 16px;
    color: #44546a;
    margin-bottom: 30px;
}

.intake-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
}

.intake-card {
    background: white;
    padding: 18px 20px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14.5px;
    color: #37475a;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.04);
}

.intake-icon {
    min-width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #059669;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 14px;
}


/* -------------------- LIMITS SECTION -------------------- */
.limits-section {
    max-width: 1100px;
    margin: 80px auto;
    padding: 32px;
    background: #f0fdfa;
    border: 1px solid #ccfbf1;
    border-radius: 26px;
}

.limits-title {
    font-size: 32px;
    font-weight: 700;
    color: #081226;
    text-align: center;
    margin-bottom: 22px;
}

.limits-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.limit-item {
    background: white;
    padding: 18px 20px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    gap: 16px;
    color: #37475a;
    font-size: 15px;
    box-shadow: 0 10px 26px rgba(255, 120, 80, 0.08);
}

.limit-icon {
    min-width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #10b981;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 14px;
}

/* -------------------- FEATURES GRID -------------------- */

.af-section {
  max-width: 1100px;
  margin: 80px auto;
  padding: 28px 20px;
}

.af-title {
  text-align: center;
  font-size: 34px;
  font-weight: 700;
  color: #081226;
  margin-bottom: 22px;
}

.af-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.af-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 10px 30px rgba(12, 20, 35, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.03);
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: transform .14s ease, box-shadow .14s ease;
}

.af-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(16, 185, 129, 0.08);
}

.af-icon {
  min-width: 56px;
  height: 56px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 22px rgba(3, 102, 214, 0.06);
}

.af-body {
  flex: 1;
}

.af-heading {
  font-size: 18px;
  font-weight: 600;
  color: #081226;
  margin: 0 0 8px 0;
}

.af-text {
  margin: 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

/* SAFETY SECTION */

.safety-wrap {
    max-width: 1100px;
    margin: 80px auto;
    padding: 20px;
}

.safety-inner {
    background: linear-gradient(90deg, #059669 0%, #10b981 60%, #34d399 100%);
    border-radius: 18px;
    padding: 28px;
    box-shadow: 0 18px 40px rgba(16, 185, 129, 0.18);
}

.safety-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 18px;
}

.safety-icon {
    width: 56px;
    height: 56px;
    min-width: 56px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 -6px 20px rgba(0, 0, 0, 0.06);
}

.safety-title {
    margin: 0;
    color: #fff;
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
}

.safety-card {
    margin-top: 6px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 22px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 20px rgba(11, 14, 25, 0.06);
}

.safety-lead {
    color: rgba(255, 255, 255, 0.95);
    margin: 0 0 16px 0;
    font-weight: 600;
}

.safety-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 18px;
    margin-bottom: 14px;
}

.safety-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255, 255, 255, 0.94);
    font-size: 15px;
}

.safety-bullet {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.12);
    display: grid;
    place-items: center;
    color: #fff;
}

.safety-note {
    color: rgba(255, 255, 255, 0.88);
    margin: 8px 0 0 0;
    font-size: 14px;
}

/* RESPONSIVE */
@media (max-width: 880px) {
    .safety-grid {
        grid-template-columns: 1fr;
    }
}
      `}</style>

      {/* HERO SECTION */}
      <div style={styles.heroWrap}>
        <div style={styles.heroInner}>

          <div style={styles.iconCol}>
            <div style={styles.iconCircle}>
              <motion.img
                src="/dr.ai-logo.svg"
                alt="Dr.AI Logo"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                  display: "block",
                  filter: "invert(20%) sepia(100%) saturate(6000%) hue-rotate(100deg)",
                }}
              />
            </div>
          </div>

          <div style={styles.heroTextCol}>
            <h1 style={styles.heroTitle}>About Dr.AI</h1>

            <p style={styles.heroSubtitle}>
              Your health assistant that helps you understand symptoms, medications,
              and lab reports — all in plain language.
            </p>

            <div style={styles.badgeWrap}>
              <span style={styles.badgeInner}>Informational purpose and medical diagnosis</span>
            </div>
          </div>

        </div>
      </div>

      {/* MISSION SECTION */}
      <div style={styles.missionArea}>
        <div style={styles.missionCard}>
          <div style={styles.missionLeftIcon}>
            <div style={styles.missionIconBox}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 3c-2.8 0-5 2.2-5 5v3" stroke="#fff" strokeWidth="1.4" fill="none" />
                <path d="M12 14v6" stroke="#fff" strokeWidth="1.4" fill="none" />
                <path d="M8 21h8" stroke="#fff" strokeWidth="1.4" fill="none" />
              </svg>
            </div>
          </div>

          <div style={styles.missionContent}>
            <h3 style={styles.missionTitle}>Mission</h3>
            <p style={styles.missionText}>
              Provide clear, compassionate, evidence-informed guidance that reduces unnecessary worry
              while helping spot red flags early.
            </p>
            <p style={styles.missionNote}>Informational purpose and medical diagnosis.</p>
          </div>
        </div>
      </div>

      {/* INTAKE SECTION */}
      <IntakeSection />

      {/* LIMITS SECTION */}
      <LimitsSection />

      {/* SAFETY */}
      <SafetySection />

      {/* FEATURES */}
      <FeaturesGrid />

      {/* PRIVACY */}
      <PrivacyUse />

      {/* DISCLAIMER */}
      <Disclaimer />

    </div>
  );
}

/* ------------------ COMPONENTS ------------------ */

const IntakeSection = () => (
  <section className="intake-section">
    <h2 className="intake-title">Intake — What I'll Ask</h2>
    <p className="intake-sub">To give useful guidance I usually ask for:</p>

    <div className="intake-grid">
      {[
        "Age, sex at birth, pregnancy/breastfeeding status, and country",
        "Major conditions, allergies, and current medications/supplements",
        "For symptoms: onset, severity, location, pattern, associated symptoms, and anything tried so far",
        "For labs: test names, values, units, ranges, date, and fasting status",
      ].map((t, i) => (
        <div key={i} className="intake-card">
          <div className="intake-icon"><span>✓</span></div>
          {t}
        </div>
      ))}
    </div>
  </section>
);

const LimitsSection = () => (
  <section className="limits-section">
    <h2 className="limits-title">Important Limits — What I Don’t Do</h2>

    <div className="limits-list">
      {[
        "I do not diagnose conditions or prescribe/adjust prescription medicines.",
        "I will not interpret raw medical images (X-ray, CT, MRI, ultrasound). I can explain radiology reports.",
        "I won't provide unsafe instructions that require in-person evaluation."
      ].map((t, i) => (
        <div key={i} className="limit-item">
          <div className="limit-icon"><span>✕</span></div>
          {t}
        </div>
      ))}
    </div>
  </section>
);

const SafetySection = () => (
  <section className="safety-wrap">
    <div className="safety-inner">

      <div className="safety-header">
        <div className="safety-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="safety-title">When to Seek Immediate Care</h2>
      </div>

      <div className="safety-card">
        <p className="safety-lead">If you experience any of these red flags, call emergency services immediately:</p>

        <div className="safety-grid">
          {[
            "Chest pain or pressure",
            "Difficulty breathing",
            "Severe bleeding",
            "Sudden severe pain",
            "Confusion or fainting",
            "Signs of stroke (face drooping)",
          ].map((t, i) => (
            <div key={i} className="safety-item">
              <span className="safety-bullet">!</span>
              {t}
            </div>
          ))}
        </div>

        <p className="safety-note">* This list is not exhaustive. Trust your instincts.</p>
      </div>

    </div>
  </section>
);

const FeaturesGrid = () => {
  const features = [
    { title: "Symptom Triage", text: "Estimate urgency + suggest safe self-care.", color: "#ff5a9e", icon: <Stethoscope className="text-white w-7 h-7" /> },
    { title: "Medication Guide", text: "Understand medicines, side effects & warnings.", color: "#9b6bff", icon: <Pill className="text-white w-7 h-7" /> },
    { title: "Lab Report Help", text: "Explain test meanings + abnormal values.", color: "#11c26d", icon: <FileText className="text-white w-7 h-7" /> },
    { title: "Care Navigation", text: "Find the right care: ER, urgent, or clinic.", color: "#ff9a2b", icon: <Map className="text-white w-7 h-7" /> },
    { title: "Prevention Tips", text: "Lifestyle guidance & early warning signs.", color: "#2fb3ff", icon: <ShieldCheck className="text-white w-7 h-7" /> },
    { title: "24/7 Availability", text: "Instant help anytime.", color: "#9b9bff", icon: <Clock className="text-white w-7 h-7" /> },
  ];

  return (
    <section className="af-section">
      <h2 className="af-title">What Dr.AI Can Help With</h2>

      <div className="af-grid">
        {features.map((f, i) => (
          <article key={i} className="af-card">
            <div className="af-icon" style={{ background: f.color }}>
              {f.icon}
            </div>
            <div className="af-body">
              <h3 className="af-heading">{f.title}</h3>
              <p className="af-text">{f.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const PrivacyUse = () => (
  <section style={privacyStyles.container}>
    <div style={privacyStyles.card}>
      <div style={privacyStyles.iconWrap}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="10" width="18" height="11" rx="2" stroke="#0b1b2b" strokeWidth="1.2" />
          <path d="M7 10V8a5 5 0 0110 0v2" stroke="#0b1b2b" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      <div style={privacyStyles.content}>
        <h3 style={privacyStyles.title}>Privacy & Use</h3>
        <p style={privacyStyles.paragraph}>
          The assistant provides informational purpose and medical diagnosis. Treat personal data carefully.
        </p>
        <p style={privacyStyles.paragraph}>
          If you want something deleted, tell us — if supported, we will remove it.
        </p>
      </div>
    </div>
  </section>
);

const Disclaimer = () => (
  <section style={privacyStyles.disclaimerBoxOuter}>
    <div style={privacyStyles.disclaimerBox}>
      <strong>Disclaimer:</strong>{" "}
      <span style={privacyStyles.disclaimerText}>
        Informational purpose and medical diagnosis.
        For emergencies, contact medical services immediately.
      </span>
    </div>
  </section>
);

/* ------------------ MAIN STYLES ------------------ */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "'Inter', system-ui",
    color: "#0b1b2b",
    paddingTop: 0,
    paddingBottom: 0,
  },

  heroWrap: {
    width: "100%",
    background: "linear-gradient(90deg, #059669 0%, #0d9488 100%)",
    paddingTop: 44,
    paddingBottom: 44,
  },

  heroInner: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    gap: 48,
    alignItems: "center",
    padding: "0 20px",
  },

  iconCol: { flex: "0 0 auto" },

  /* 🔥 FINAL GLASS CIRCLE YOU WANTED */
  iconCircle: {
    width: 224,
    height: 224,
    borderRadius: "50%",

    background: "#ffffff",
    border: "4px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  heroTextCol: { flex: 1 },

  heroTitle: {
    margin: 0,
    fontSize: 48,
    fontWeight: 700,
    color: "#fff",
  },

  heroSubtitle: {
    marginTop: 18,
    fontSize: 18,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 1.6,
  },

  badgeWrap: { marginTop: 22 },

  badgeInner: {
    padding: "10px 20px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#fff",
    fontSize: 14,
  },

  missionArea: {
    marginTop: 60,
    padding: "36px 20px",
    background: "#f4f8fb",
  },

  missionCard: {
    maxWidth: 1100,
    margin: "0 auto",
    background: "#fff",
    padding: 28,
    borderRadius: 20,
    display: "flex",
    gap: 18,
    boxShadow: "0 12px 40px rgba(12,20,35,0.08)",
  },

  missionLeftIcon: { flex: "0 0 auto" },

  missionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    background: "linear-gradient(180deg, #10b981, #059669)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  missionContent: { flex: 1 },

  missionTitle: { margin: 0, fontSize: 24, fontWeight: 700, color: "#081226" },

  missionText: { marginTop: 10, color: "#374151" },

  missionNote: {
    marginTop: 12,
    color: "#059669",
    fontWeight: 500,
  },
};

const privacyStyles = {
  container: {
    maxWidth: 1100,
    margin: "80px auto",
    padding: "0 20px",
  },
  card: {
    display: "flex",
    gap: 18,
    alignItems: "flex-start",
    background: "#fff",
    padding: 28,
    borderRadius: 20,
    boxShadow: "0 12px 40px rgba(12,20,35,0.06)",
  },
  iconWrap: {
    flex: "0 0 auto",
    width: 64,
    height: 64,
    borderRadius: 12,
    background: "linear-gradient(180deg,#f0f6ff,#e6f4ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1 },
  title: { margin: 0, fontSize: 22, fontWeight: 700, color: "#081226" },
  paragraph: { marginTop: 10, color: "#374151", lineHeight: 1.6 },

  disclaimerBoxOuter: {
    maxWidth: 1100,
    margin: "12px auto 48px",
    padding: "0 20px",
  },
  disclaimerBox: {
    padding: "18px 20px",
    borderRadius: 12,
    background: "#f3f8fb",
    border: "1px solid rgba(11,27,43,0.04)",
  },
  disclaimerText: { marginLeft: 6, color: "#0b1b2b", fontSize: 14, lineHeight: 1.5 },
};

export default About;
