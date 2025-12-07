
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

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 5; // Higher sensitivity for smaller element
    const y = (e.clientY - top - height / 2) / 5;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
        <div className="liquid-glass rounded-2xl px-6 py-3 flex items-center justify-between">

          {/* Left: Logo */}
          <div className="flex items-center gap-3 perspective-[500px]">
            <Link
              to="/"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="block"
              style={{
                transformStyle: "preserve-3d",
                transform: `perspective(500px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.1, 1.1, 1.1)`,
                transition: "transform 0.1s ease-out"
              }}
            >
              <img
                src="/dr.ai-logo.svg"
                alt="Dr.AI logo"
                className="h-10 w-10 md:h-12 md:w-12 object-contain filter invert-[20%] sepia-[100%] saturate-[6000%] hue-rotate-[100deg]"
              />
            </Link>
            <Link to="/" className="text-xl font-bold text-emerald-700 tracking-tight hidden sm:block">
              Dr.AI
            </Link>
          </div>

          {/* Center: Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-emerald-100/20 backdrop-blur-sm rounded-full px-2 py-1 border border-emerald-100/20 shadow-inner">
            {[
              { path: "/", label: "Home" },
              { path: "/chat", label: "Chat" },
              { path: "/symptoms", label: "Symptoms" },
              { path: "/meds", label: "Medicines" },
              { path: "/about", label: "About" }
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                      ${isActive
                    ? "bg-white text-emerald-700 shadow-sm font-semibold"
                    : "text-emerald-900/70 hover:text-emerald-800 hover:bg-emerald-100/30"}
                    `}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Link to="/chat" className="glass-btn px-4 py-2 rounded-xl text-sm hidden sm:block">
              Start Chat
            </Link>

            {showSignOut && (
              <button
                onClick={handleSignOut}
                className="hidden md:block px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors border border-transparent hover:border-red-100"
              >
                Sign Out
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/50 border border-white/40 text-gray-700 hover:bg-white hover:text-emerald-600 transition-colors"
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

        {/* Mobile Menu */}
        <div className={`
            absolute top-full left-0 right-0 mt-3 p-2 rounded-2xl liquid-glass overflow-hidden origin-top transition-all duration-300 ease-out
            ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}
        `}>
          <div className="flex flex-col gap-1">
            {[
              { path: "/", label: "Home" },
              { path: "/chat", label: "Start Chat", isCta: true },
              { path: "/symptoms", label: "Symptoms" },
              { path: "/meds", label: "Medicines" },
              { path: "/about", label: "About" }
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`
                    px-4 py-3 rounded-xl text-base font-medium transition-colors
                    ${link.isCta
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-gray-700 hover:bg-white/40 hover:text-emerald-700"}
                  `}
              >
                {link.label}
              </Link>
            ))}

            {showSignOut && (
              <button
                onClick={() => { handleSignOut(); setOpen(false); }}
                className="px-4 py-3 rounded-xl text-base font-medium text-left text-red-500 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-28"></div>
    </>
  );
}