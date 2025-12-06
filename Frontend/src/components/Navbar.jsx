
import React, { useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem("dr_ai_token");
    localStorage.removeItem("dr_ai_user");
    localStorage.removeItem("dr_ai_auth");
    navigate("/login");
  };

  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem("dr_ai_token");

  // Check if current page is login or signup
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  // Show Sign Out only if authenticated AND not on auth pages
  const showSignOut = isAuthenticated && !isAuthPage;

  return (
    <>
      <style>{`
        .drai-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 60; background: rgba(255,255,255,0.97); backdrop-filter: blur(6px); border-bottom: 1px solid rgba(0,0,0,0.06); }
        .drai-wrap { max-width: 100%; margin: 0 auto; padding: 0 32px; }
        .drai-row { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }

        .drai-left { display:flex; align-items:center; gap:12px; }
        .drai-logo { font-weight:700; font-size:20px; color:#059669; text-decoration:none; }

        .drai-center { display:flex; align-items:center; justify-content:center; flex:1; }
        .drai-right { display:flex; align-items:center; gap:16px; }

        .drai-links { display:flex; gap:18px; list-style:none; margin:0; padding:0; }
        .drai-links a { 
          color:#374151; 
          text-decoration:none; 
          font-weight:500; 
          padding:8px 12px; 
          border-radius:8px; 
          transition: background .12s, color .12s; 
        }
        .drai-links a:hover { 
          background: rgba(0,0,0,0.05); 
          color:#4b5563; 
        }


        .active-link {
          background: rgba(0,0,0,0.08);
          color: #1f2937 !important;
          font-weight: 600 !important;
        }

        .drai-cta { 
          background:#059669; 
          color:white; 
          padding:8px 14px; 
          border-radius:8px; 
          text-decoration:none; 
          font-weight:600; 
        }
        .drai-cta:hover { background:#047857; }

        .drai-signout {
          background: transparent;
          color: #4b5563;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 500;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }
        .drai-signout:hover {
          background: #f3f4f6;
          color: #059669;
          border-color: #059669;
        }

        .drai-hambtn { 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          width:40px; 
          height:40px; 
          border-radius:8px; 
          border:1px solid rgba(0,0,0,0.06); 
          background:white; 
        }

        .drai-mobilemenu { 
          display:none; 
          flex-direction:column; 
          gap:8px; 
          padding:12px 20px; 
          border-top:1px solid rgba(0,0,0,0.06); 
          background:rgba(255,255,255,0.98); 
        }
        .drai-mobilemenu a, .drai-mobilemenu button { 
          padding:8px 6px; 
          display:block; 
          color:#374151; 
          text-decoration:none; 
          border-radius:6px; 
          text-align: left;
          background: transparent;
          border: none;
          font-size: 16px;
          width: 100%;
        }
        .drai-mobilemenu a:hover, .drai-mobilemenu button:hover { 
          background: rgba(0,0,0,0.03); 
          color:#047857; 
        }

        @media (max-width: 767px) {
          .drai-center { display:none; }
          .drai-cta { display:none; }
          .drai-signout { display:none; }
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

            <div className="drai-left">
              <Link to="/">
                <img
                  src="/dr.ai-logo.svg"
                  alt="Dr.AI logo"
                  style={{
                    height: "90px",
                    width: "90px",
                    objectFit: "contain",
                    filter: "invert(20%) sepia(100%) saturate(6000%) hue-rotate(100deg)"
                  }}
                />
              </Link>
            </div>

            <div className="drai-center">
              <ul className="drai-links">
                <li>
                  <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>Home</NavLink>
                </li>
                <li>
                  <NavLink to="/chat" className={({ isActive }) => (isActive ? "active-link" : "")}>Chat</NavLink>
                </li>
                <li>
                  <NavLink to="/symptoms" className={({ isActive }) => (isActive ? "active-link" : "")}>Symptoms</NavLink>
                </li>
                <li>
                  <NavLink to="/meds" className={({ isActive }) => (isActive ? "active-link" : "")}>Medicines</NavLink>
                </li>
                <li>
                  <NavLink to="/about" className={({ isActive }) => (isActive ? "active-link" : "")}>About</NavLink>
                </li>
              </ul>
            </div>

            <div className="drai-right">
              <Link to="/chat" className="drai-cta">Start Chat</Link>

              {showSignOut && (
                <button onClick={handleSignOut} className="drai-signout">
                  Sign Out
                </button>
              )}

              <button
                className="drai-mobile-toggle drai-hambtn"
                onClick={() => setOpen(!open)}
              >
                {open ? (
                  <svg width="22" height="22" stroke="currentColor" fill="none">
                    <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="22" height="22" stroke="currentColor" fill="none">
                    <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {open && (
            <div className="drai-mobilemenu">
              <Link to="/" onClick={() => setOpen(false)}>Home</Link>
              <Link to="/chat" onClick={() => setOpen(false)}>Chat</Link>
              <Link to="/symptoms" onClick={() => setOpen(false)}>Symptoms</Link>
              <Link to="/meds" onClick={() => setOpen(false)}>Medicines</Link>
              <Link to="/about" onClick={() => setOpen(false)}>About</Link>
              {showSignOut && (
                <button onClick={() => { handleSignOut(); setOpen(false); }}>Sign Out</button>
              )}
              <Link to="/chat" onClick={() => setOpen(false)} className="drai-cta">Start Chat</Link>
            </div>
          )}
        </div>
      </header>

      <div style={{ height: "40px" }}></div>
    </>
  );
}