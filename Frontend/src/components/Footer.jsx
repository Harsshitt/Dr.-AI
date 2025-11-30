import React from "react";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-red-500 text-white z-[9999] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2">

                <div className="text-sm font-medium">
                    © {new Date().getFullYear()} Dr.AI Health Assistant
                </div>

                <div className="text-xs text-red-100 hidden md:block">
                    For educational and medical advice.
                </div>

                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-red-200 transition-colors">
                        <i className="fa-brands fa-twitter text-xl"></i>
                    </a>
                    <a href="https://github.com/Harsshitt" target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition-colors">
                        <i className="fa-brands fa-github text-xl"></i>
                    </a>
                    <a href="mailto:harshit956584@gmail.com" className="hover:text-red-200 transition-colors">
                        <i className="fa-solid fa-envelope text-xl"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
}
