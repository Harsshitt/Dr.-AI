// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
            setError("Please fill all fields.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Enter a valid email.");
            return;
        }

        // Backend API call
        try {
            const response = await fetch("http://localhost:3001/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Signup failed");
                return;
            }

            setSuccess("Account created! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            console.error(err);
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-2 text-center">Create your account</h2>
                <p className="text-sm text-gray-500 mb-6 text-center">Join Dr.AI for quick health education</p>

                {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md mb-4 text-sm">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-sm text-gray-700">Full name</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Your name"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Choose a password"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Confirm Password</span>
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Repeat password"
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition"
                    >
                        Create account
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-red-600 font-medium hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
