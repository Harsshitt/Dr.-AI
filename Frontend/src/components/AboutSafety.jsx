import React from "react";
import "../pages/AboutSafety.css"; // Ensure CSS is imported if not globally available, or rely on About.jsx import

const AboutSafety = () => {
    const redFlags = [
        "Chest pain or pressure",
        "Difficulty breathing",
        "Severe bleeding",
        "Sudden severe pain",
        "Confusion or fainting",
        "Slurred speech",
        "Sudden vision changes",
        "High fever with stiff neck",
    ];

    return (
        <section className="safety-wrap">
            <div className="safety-inner">
                <div className="safety-header">
                    <div className="safety-icon">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                    <h2 className="safety-title">Safety First: Red Flags</h2>
                </div>

                <div className="safety-card">
                    <p className="safety-lead">
                        If you experience any of these signs, please seek emergency care immediately:
                    </p>

                    <div className="safety-grid">
                        {redFlags.map((flag, index) => (
                            <div key={index} className="safety-item">
                                <span className="safety-bullet">!</span>
                                {flag}
                            </div>
                        ))}
                    </div>

                    <p className="safety-note">
                        Dr.AI is an educational tool, not a replacement for emergency medical services.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutSafety;
