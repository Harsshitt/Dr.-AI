/* Frontend/src/components/Navbar.jsx
   Self-contained navbar with inline CSS (no Tailwind required). 
*/
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        .drai-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 60; background: rgba(255,255,255,0.97); backdrop-filter: blur(6px); border-bottom: 1px solid rgba(0,0,0,0.06); }
        .drai-wrap { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .drai-row { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }

        .drai-left { display:flex; align-items:center; gap:12px; }
        .drai-logo { font-weight:700; font-size:20px; color:#dc2626; text-decoration:none; }

        .drai-center { display:flex; align-items:center; justify-content:center; flex:1; }
        .drai-right { display:flex; align-items:center; gap:12px; }

        .drai-links { display:flex; gap:18px; list-style:none; margin:0; padding:0; }
        .drai-links a { color:#374151; text-decoration:none; font-weight:500; padding:8px 10px; border-radius:8px; transition: background .12s, color .12s; }
        .drai-links a:hover { background: rgba(0,0,0,0.04); color:#b91c1c; }

        .drai-cta { background:#dc2626; color:white; padding:8px 14px; border-radius:8px; text-decoration:none; font-weight:600; }
        .drai-cta:hover { background:#b91c1c; }

        .drai-hambtn { display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:8px; border:1px solid rgba(0,0,0,0.06); background:white; }

        .drai-mobilemenu { display:none; flex-direction:column; gap:8px; padding:12px 20px; border-top:1px solid rgba(0,0,0,0.06); background:rgba(255,255,255,0.98); }
        .drai-mobilemenu a { padding:8px 6px; display:block; color:#374151; text-decoration:none; border-radius:6px; }
        .drai-mobilemenu a:hover { background: rgba(0,0,0,0.03); color:#b91c1c; }

        @media (max-width: 767px) {
          .drai-center { display:none; }
          .drai-right { display:none; }
          .drai-mobile-toggle { display:block; }
        }
        @media (min-width: 768px) {
          .drai-mobile-toggle { display:none; }
          .drai-mobilemenu { display:none !important; }
        }
      `}</style>

      <header className="drai-nav">
        <div className="drai-wrap">
          <div className="drai-row">

            {/* LEFT — LOGO + TEXT */}
            <div className="drai-left">
              <img
                src="/dr.ai-logo.svg"
                alt="Dr.AI logo"
                style={{ height: "90px", width: "90px", objectFit: "contain" }} 
              />

              <Link to="/" className="drai-logo" onClick={() => setOpen(false)}>
                
              </Link>
            </div>

            {/* CENTER LINKS */}
            <div className="drai-center">
              <ul className="drai-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Chat</Link></li>
                <li><Link to="/symptoms">Symptoms</Link></li>
                <li><Link to="/meds">Medicines</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </div>

            {/* RIGHT — CTA */}
            <div className="drai-right">
              <Link to="/chat" className="drai-cta">Start Chat</Link>

              <button
                className="drai-mobile-toggle drai-hambtn"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
              >
                {open ? (
                  <svg width="22" height="22" stroke="currentColor" fill="none">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="22" height="22" stroke="currentColor" fill="none">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
              <Link to="/chat" onClick={() => setOpen(false)} className="drai-cta">Start Chat</Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}