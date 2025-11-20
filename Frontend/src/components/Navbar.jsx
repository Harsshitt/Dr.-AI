// Frontend/src/components/Navbar.jsx
import React, { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-indigo-600">
              Dr.AI
            </a>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-indigo-600">Home</a>
            <a href="/chat" className="text-gray-700 hover:text-indigo-600">Chat</a>
            <a href="/about" className="text-gray-700 hover:text-indigo-600">About</a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div className="md:hidden bg-white shadow-sm border-t">
          <div className="px-4 py-3 space-y-2">
            <a href="/" className="block text-gray-700 hover:text-indigo-600">Home</a>
            <a href="/chat" className="block text-gray-700 hover:text-indigo-600">Chat</a>
            <a href="/about" className="block text-gray-700 hover:text-indigo-600">About</a>
          </div>
        </div>
      )}
    </header>
  );
}