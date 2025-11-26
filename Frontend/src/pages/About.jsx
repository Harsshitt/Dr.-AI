// src/pages/About.jsx
import React from "react";
import "./AboutFeatures.css";
import "./AboutExtra.css"; // intake + limits CSS
import "./AboutSafety.css"; // (kept in case other styles used)
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div style={styles.page}>
      <Navbar />

      {/* 1. ABOUT (HERO) */}
      <div style={styles.heroWrap}>
        <div style={styles.heroInner}>
          <div style={styles.iconCol}>
            <div style={styles.iconCircle}>
              <img
                src="/dr.ai-logo.svg"
                alt="Dr.AI Logo"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                  display: "block",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
          </div>

          <div style={styles.heroTextCol}>
            <h1 style={styles.heroTitle}>About Dr.AI</h1>

            <p style={styles.heroSubtitle}>
              Your educational health assistant that helps you understand
              symptoms, medications, and lab reports — all in plain language.
            </p>

            <div style={styles.badgeWrap}>
              <span style={styles.badgeInner}>
                Educational assistant — not a medical professional
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MISSION */}
      <div style={styles.missionArea}>
        <div style={styles.missionCard}>
          <div style={styles.missionLeftIcon}>
            <div style={styles.missionIconBox}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M12 3c-2.8 0-5 2.2-5 5v3"
                  stroke="#fff"
                  strokeWidth="1.4"
                  fill="none"
                />
                <path
                  d="M12 14v6"
                  stroke="#fff"
                  strokeWidth="1.4"
                  fill="none"
                />
                <path
                  d="M8 21h8"
                  stroke="#fff"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          <div style={styles.missionContent}>
            <h3 style={styles.missionTitle}>Mission</h3>
            <p style={styles.missionText}>
              Provide clear, compassionate, evidence-informed guidance that
              reduces unnecessary worry and unnecessary visits while also
              helping spot red flags early.
            </p>
            <p style={styles.missionNote}>
              Always educational — never a medical diagnosis or prescription.
            </p>
          </div>
        </div>
      </div>

      {/* 3. INTAKE */}
      <section className="intake-section">
        <h2 className="intake-title">Intake — What I'll Ask</h2>

        <p className="intake-sub">To give useful guidance I usually ask for:</p>

        <div className="intake-grid">
          <div className="intake-card">
            <div className="intake-icon"><span>✓</span></div>
            Age, sex at birth, pregnancy/breastfeeding status, and country
          </div>

          <div className="intake-card">
            <div className="intake-icon"><span>✓</span></div>
            Major conditions, allergies, and current medications/supplements
          </div>

          <div className="intake-card">
            <div className="intake-icon"><span>✓</span></div>
            For symptoms: onset, severity, location, pattern, associated symptoms, and anything tried so far
          </div>

          <div className="intake-card">
            <div className="intake-icon"><span>✓</span></div>
            For labs: exact test names, values, units, reference ranges, date, and whether fasting
          </div>
        </div>
      </section>

      {/* 4. IMPORTANT LIMITS */}
      <section className="limits-section">
        <h2 className="limits-title">Important Limits — What I Don’t Do</h2>

        <div className="limits-list">
          <div className="limit-item">
            <div className="limit-icon"><span>✕</span></div>
            I do not diagnose conditions or prescribe/adjust prescription medicines.
          </div>

          <div className="limit-item">
            <div className="limit-icon"><span>✕</span></div>
            I will not interpret raw medical images (X-ray, CT, MRI, ultrasound).
            I can explain a radiology report text if you paste it.
          </div>

          <div className="limit-item">
            <div className="limit-icon"><span>✕</span></div>
            I won't provide unsafe instructions that require in-person evaluation.
          </div>
        </div>
      </section>

      {/* 5. WHAT Dr.AI CAN HELP WITH (FEATURES GRID) */}
      <FeaturesGrid />

      {/* 6. PRIVACY & USE */}
      <PrivacyUse />

      {/* 7. DISCLAIMER */}
      <Disclaimer />
    </div>
  );
}

/* ---------------- FEATURES GRID ---------------- */
const FeaturesGrid = () => {
  const features = [
    {
      title: "Symptom Triage & Self-Care",
      text: "Ask focused questions, estimate urgency and suggest safe self-care options.",
      color: "#ff5a9e",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path d="M12 12c2 0 3-1 3-3s-1-3-3-3-3 1-3 3 1 3 3 3z" stroke="#fff" strokeWidth="1.2" />
          <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="1.2" />
        </svg>
      ),
    },
    {
      title: "Medication Education",
      text: "Understand medicine uses, side effects, warnings, and OTC guidance.",
      color: "#9b6bff",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path d="M6 12h12" stroke="#fff" strokeWidth="1.4" />
          <path d="M12 6v12" stroke="#fff" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      title: "Lab Report Explainer",
      text: "Explain what each test means and why values change.",
      color: "#11c26d",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path d="M12 2v20" stroke="#fff" strokeWidth="1.2" />
          <path d="M6 8h12" stroke="#fff" strokeWidth="1.2" />
        </svg>
      ),
    },
    {
      title: "Care Navigation",
      text: "Find where to go: emergency, urgent care, primary care, or pharmacy.",
      color: "#ff9a2b",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path d="M12 2l4 7-4 13-4-13 4-7z" stroke="#fff" strokeWidth="1.1" />
        </svg>
      ),
    },
    {
      title: "Prevention & Education",
      text: "Lifestyle guidance, vaccine info, and early warning signs.",
      color: "#2fb3ff",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path d="M12 3v18" stroke="#fff" strokeWidth="1.2" />
          <path d="M3 8h18" stroke="#fff" strokeWidth="1.2" />
        </svg>
      ),
    },
    {
      title: "24/7 Availability",
      text: "Health information anytime — helping you decide when to seek care.",
      color: "#9b9bff",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.2" />
        </svg>
      ),
    },
  ];

  return (
    <section className="af-section">
      <h2 className="af-title">What Dr.AI Can Help With</h2>

      <div className="af-grid">
        {features.map((item, i) => (
          <article key={i} className="af-card">
            <div className="af-icon" style={{ background: item.color }}>
              {item.icon}
            </div>
            <div className="af-body">
              <h3 className="af-heading">{item.title}</h3>
              <p className="af-text">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

/* ---------------- PRIVACY & USE ---------------- */
const PrivacyUse = () => {
  return (
    <section style={privacyStyles.container}>
      <div style={privacyStyles.card}>
        <div style={privacyStyles.iconWrap}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="10" width="18" height="11" rx="2" stroke="#0b1b2b" strokeWidth="1.2" />
            <path
              d="M7 10V8a5 5 0 0110 0v2"
              stroke="#0b1b2b"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div style={privacyStyles.content}>
          <h3 style={privacyStyles.title}>Privacy & Use</h3>

          <p style={privacyStyles.paragraph}>
            The assistant provides educational information only. Treat any personal data you share carefully.
          </p>

          <p style={privacyStyles.paragraph}>
            If you prefer, avoid sending highly sensitive details. If you want something deleted, tell us and we'll remove it (if the host app supports deletion).
          </p>
        </div>
      </div>
    </section>
  );
};

/* ---------------- DISCLAIMER (separate) ---------------- */
const Disclaimer = () => {
  return (
    <section style={privacyStyles.disclaimerBoxOuter}>
      <div style={privacyStyles.disclaimerBox}>
        <strong>Disclaimer:</strong>{" "}
        <span style={privacyStyles.disclaimerText}>
          I'm a health information assistant, not a medical professional. This is educational information, not a diagnosis.
          If you need urgent help, contact local emergency services or your healthcare provider.
        </span>
      </div>
    </section>
  );
};

/* ---------------- INLINE STYLES ---------------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "'Inter', system-ui",
    color: "#0b1b2b",
  },

  heroWrap: {
    width: "100%",
    background: "linear-gradient(90deg,#0a8df2 0%, #0074e0 100%)",
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
  iconCircle: {
    width: 224,
    height: 224,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 10px 35px rgba(9,30,66,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backdropFilter: "blur(6px)",
  },

  heroTextCol: { flex: 1 },
  heroTitle: { margin: 0, fontSize: 48, fontWeight: 700, color: "#fff" },
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
    marginTop: 28,
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
    background: "linear-gradient(180deg,#16aaff,#0077ee)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  missionContent: { flex: 1 },
  missionTitle: { margin: 0, fontSize: 24, fontWeight: 700, color: "#081226" },
  missionText: { marginTop: 10, color: "#374151" },
  missionNote: { marginTop: 12, color: "#0b78e6", fontWeight: 500 },
};

/* ---------- PRIVACY STYLES ---------- */
const privacyStyles = {
  container: {
    maxWidth: 1100,
    margin: "28px auto",
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
