// Frontend/src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        .drai-nav { position: fixed; top:0; left:0; right:0; z-index:60; background:rgba(255,255,255,0.97); backdrop-filter:blur(6px); border-bottom:1px solid rgba(0,0,0,0.06); }
        .drai-wrap { max-width:1200px; margin:0 auto; padding:0 20px; }
        .drai-row { height:64px; display:flex; align-items:center; justify-content:space-between; }

        .drai-left { display:flex; align-items:center; gap:12px; }
        .drai-logo-text { font-weight:700; font-size:22px; color:#dc2626; }

        .drai-center { flex:1; display:flex; align-items:center; justify-content:center; }
        .drai-links { display:flex; gap:20px; list-style:none; }
        .drai-links a { text-decoration:none; font-weight:500; color:#374151; padding:8px 10px; border-radius:6px; }
        .drai-links a:hover { background:rgba(0,0,0,0.05); color:#b91c1c; }

        .drai-right { display:flex; align-items:center; gap:12px; }
        .drai-cta { background:#dc2626; color:white; padding:8px 16px; border-radius:8px; font-weight:600; text-decoration:none; }
        .drai-cta:hover { background:#b91c1c; }

        .drai-mobile-toggle { display:none; }
        .drai-hambtn { width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:white; border:1px solid rgba(0,0,0,0.1); border-radius:8px; }

        .drai-mobilemenu { display:none; flex-direction:column; padding:12px 20px; gap:10px; background:white; border-top:1px solid rgba(0,0,0,0.1); }

        @media (max-width: 768px) {
          .drai-center { display:none; }
          .drai-right { display:none; }
          .drai-mobile-toggle { display:block; }
          .drai-mobilemenu { display:flex; }
        }
      `}</style>

      <header className="drai-nav">
        <div className="drai-wrap">
          <div className="drai-row">

            {/* LEFT — logo + text */}
            <div className="drai-left">
              <img 
                src="/logo.png" 
                alt="Dr.AI Logo" 
                style={{ height: "34px", width: "34px", objectFit: "contain" }}
              />
              <Link to="/" className="drai-logo-text">Dr.AI</Link>
            </div>

            {/* CENTER — desktop links */}
            <div className="drai-center">
              <ul className="drai-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Chat</Link></li>
                <li><Link to="/symptoms">Symptoms</Link></li>
                <li><Link to="/meds">Medicines</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </div>

            {/* RIGHT — CTA + mobile button */}
            <div className="drai-right">
              <Link to="/chat" className="drai-cta">Start Chat</Link>

              <button 
                className="drai-mobile-toggle drai-hambtn"
                onClick={() => setOpen(!open)}
              >
                {open ? (
                  <svg width="22" height="22" stroke="currentColor" fill="none">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" stroke="currentColor" fill="none">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {open && (
            <div className="drai-mobilemenu">
              <Link to="/" onClick={() => setOpen(false)}>Home</Link>
              <Link to="/chat" onClick={() => setOpen(false)}>Chat</Link>
              <Link to="/symptoms" onClick={() => setOpen(false)}>Symptoms</Link>
              <Link to="/meds" onClick={() => setOpen(false)}>Medicines</Link>
              <Link to="/about" onClick={() => setOpen(false)}>About</Link>
              <Link to="/chat" className="drai-cta" onClick={() => setOpen(false)}>Start Chat</Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}