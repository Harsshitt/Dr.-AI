
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const handleSignOut = () => {
    localStorage.removeItem("dr_ai_token");
    localStorage.removeItem("dr_ai_user");
    localStorage.removeItem("dr_ai_auth");
    navigate("/login");
  };

  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem("dr_ai_token");
  const userDataString = localStorage.getItem("dr_ai_user");
  const isPro = localStorage.getItem("dr_ai_pro") === "true"; // Check Pro Status
  let userName = "User";
  let userInitial = "U";
  let userEmail = "";

  try {
    if (userDataString) {
      const user = JSON.parse(userDataString);
      // Try to get initial from name/username, then email
      if (user.name) {
        userName = user.name;
        userInitial = user.name.charAt(0).toUpperCase();
        userEmail = user.email || "";
      } else if (user.username) {
        userName = user.username;
        userInitial = user.username.charAt(0).toUpperCase();
        userEmail = user.email || "";
      } else if (user.email) {
        userName = user.email.split('@')[0];
        userInitial = user.email.charAt(0).toUpperCase();
        userEmail = user.email;
      }
    }
  } catch (e) {
    console.error("Error parsing user data", e);
  }


  // Check if current page is login or signup
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  // Show Profile/Sign Out only if authenticated AND not on auth pages
  const showProfile = isAuthenticated && !isAuthPage;



  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className="liquid-glass border-b border-gray-100 px-6 py-[10.5px] flex items-center justify-between shadow-sm backdrop-blur-md">

          {/* Left: Logo */}
          <div className="flex items-center gap-3 perspective-[500px]">
            <Link to="/" className="block">
  <img
    src="/dr.ai-logo.svg?v=5"
    alt="Dr.AI logo"
    className="h-[54px] w-auto object-contain 
               filter brightness-0 saturate-100 
               invert-[45%] sepia-[94%] saturate-[650%] 
               hue-rotate-[90deg] brightness-[95%] contrast-[90%]"
  />
</Link>



          </div>

          {/* Center: Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-white/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/40 shadow-sm">
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
                      px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                      ${isActive
                    ? "bg-white text-red-600 shadow-sm font-semibold"
                    : "text-gray-600 hover:text-red-500"}
                    `}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (isPro ? (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 text-amber-900 text-xs font-bold shadow-sm cursor-default">
                <span className="text-amber-600">✦</span> PRO
              </div>
            ) : (
              <Link to="/upgrade" className="hidden sm:block px-3 py-1.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 hover:from-emerald-200 hover:to-teal-200 transition-colors border border-emerald-200">
                Try Pro
              </Link>
            ))}
            <Link to="/chat" className="glass-btn px-3 py-1.5 rounded-xl text-sm hidden sm:block">
              Start Chat
            </Link>

            {showProfile && (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center justify-center w-[41px] h-[41px] rounded-full bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all border-2 border-white/50"
                  title={userEmail}
                >
                  {userInitial}
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">

                    {/* User Header */}
                    <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 leading-none mb-1">{userName}</p>
                      <p className="text-xs text-gray-500 font-medium truncate">{userEmail}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                      {[
                        { label: "My Profile", path: "/profile", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
                        { label: "Settings", path: "/settings", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
                        { label: "Medical History", path: "/history", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg> },
                        { label: "Appointments", path: "/appointments", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> }
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 font-medium"
                          onClick={() => setProfileOpen(false)}
                        >
                          <span className="text-gray-400">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <div className="h-px bg-gray-100 my-1 mx-2"></div>

                    {/* Sign Out */}
                    <div className="p-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3 font-medium"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden flex items-center justify-center w-[41px] h-[41px] rounded-xl bg-white/50 border border-white/40 text-gray-700 hover:bg-white hover:text-red-600 transition-colors"
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
            absolute top-full left-0 right-0 border-t border-gray-100 bg-white/80 backdrop-blur-xl transition-all duration-300 ease-out origin-top
            ${open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}
        `}>
          <div className="flex flex-col p-4 gap-2">
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
                    px-4 py-3 rounded-lg text-base font-medium transition-colors
                    ${link.isCta
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "text-gray-700 hover:bg-red-50 hover:text-red-700"}
                  `}
              >
                {link.label}
              </Link>
            ))}

            {showProfile && (
              <button
                onClick={() => { handleSignOut(); setOpen(false); }}
                className="px-4 py-3 rounded-lg text-base font-medium text-left text-red-500 hover:bg-red-50 transition-colors"
              >
                Sign Out ({userEmail})
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}