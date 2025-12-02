// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please fill all fields.");
            return;
        }

        // Basic email pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Enter a valid email.");
            return;
        }

        // Backend API call
        try {
            const response = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            // Save token and user info
            localStorage.setItem("dr_ai_token", data.token);
            localStorage.setItem("dr_ai_user", JSON.stringify(data.user));

            navigate("/chat");
        } catch (err) {
            console.error(err);
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-2 text-center">Welcome back — Login</h2>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Login to continue to <span className="font-medium">Dr.AI</span>
                </p>

                {error && (
                    <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md mb-4 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            placeholder="your password"
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-red-600 font-medium hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
