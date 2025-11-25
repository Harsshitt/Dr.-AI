import React from "react";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-blue-600 text-white z-[9999] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2">

                {/* Left side: Brand / Copyright */}
                <div className="text-sm font-medium">
                    © {new Date().getFullYear()} Dr.AI Health Assistant
                </div>

                {/* Middle: Disclaimer (short) */}
                <div className="text-xs text-blue-100 hidden md:block">
                    For educational use only. Not medical advice.
                </div>

                {/* Right side: Social / Links */}
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-blue-200 transition-colors">
                        <i className="fa-brands fa-twitter text-xl"></i>
                    </a>
                    <a href="#" className="hover:text-blue-200 transition-colors">
                        <i className="fa-brands fa-github text-xl"></i>
                    </a>
                    <a href="#" className="hover:text-blue-200 transition-colors">
                        <i className="fa-solid fa-envelope text-xl"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
}
