import React from "react";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 w-full z-40">
            <div className="liquid-glass border-t border-emerald-100/50 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-4px_24px_rgba(0,0,0,0.03)] backdrop-blur-md">

                <div className="text-sm font-medium text-emerald-900/80">
                    © {new Date().getFullYear()} Dr.AI Health Assistant
                </div>

                <div className="text-xs text-emerald-800/60 hidden md:block px-4 py-1 rounded-full bg-emerald-50/50 border border-emerald-100/50 backdrop-blur-sm">
                    For informational purpose and medical advice.
                </div>

                <div className="flex items-center gap-5">
                    <a
                        href="https://twitter.com/draiapp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700/70 hover:text-emerald-600 hover:scale-110 transition-all"
                        aria-label="Twitter"
                    >
                        {/* Simple icon fallback in case FA is not loaded, but typically it is */}
                        <i className="fa-brands fa-twitter text-xl"></i>
                    </a>
                    <a
                        href="mailto:draihealthofficial@gmail.com"
                        className="text-emerald-700/70 hover:text-emerald-600 hover:scale-110 transition-all"
                        aria-label="Email"
                    >
                        <i className="fa-solid fa-envelope text-xl"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
}
