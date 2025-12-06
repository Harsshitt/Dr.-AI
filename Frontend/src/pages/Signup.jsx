// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    // form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    // UI state
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Password validation: min 8, upper, lower, digit, special
    const validatePassword = (pass) => {
        if (!pass) return "Password is required.";
        if (pass.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
        if (!/[0-9]/.test(pass)) return "Password must contain at least one number.";
        if (!/[@$!%*?&_\-#+=<>]/.test(pass)) return "Password must contain at least one special character (e.g. @, #, $).";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // basic empty checks
        if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
            setError("Please fill all fields.");
            return;
        }

        // email pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Enter a valid email.");
            return;
        }

        // password validation
        const passErr = validatePassword(password);
        if (passErr) {
            setError(passErr);
            return;
        }

        // confirm match
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        // All good -> call backend
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || data.error || "Signup failed");
                return;
            }

            setSuccess("Account created! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            console.error(err);
            setError("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-3xl font-bold text-center mb-6 text-emerald-700">Create Account</h2>
                <p className="text-sm text-gray-500 mb-6 text-center">Join Dr.AI for quick health insights</p>

                {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md mb-4 text-sm">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-sm text-gray-700">Full name</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            placeholder="Your name"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            placeholder="Choose a password"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Password must be 8+ characters and include uppercase, lowercase, number & special character.
                        </p>
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-700">Confirm Password</span>
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            placeholder="Repeat password"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? "Creating..." : "Create account"}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
