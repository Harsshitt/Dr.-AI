// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [sex, setSex] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const validatePassword = (pass) => {
        if (!pass) return "Password is required.";
        if (pass.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
        if (!/[0-9]/.test(pass)) return "Password must contain at least one number.";
        if (!/[@$!%*?&_\-#+=<>]/.test(pass)) return "Password must contain at least one special character.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name || !email || !dob || !sex || !password || !confirm) {
            setError("Please fill all fields.");
            return;
        }

        const passErr = validatePassword(password);
        if (passErr) {
            setError(passErr);
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, dob, sex, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || data.error || "Signup failed");
                return;
            }

            setSuccess("Account created! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setError("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">

            {/* ✅ INLINE CSS ADDED HERE */}
            <style>{`
        @keyframes floatDoctor {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }

        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .doctor-float {
          animation: floatDoctor 3s ease-in-out infinite;
          filter: drop-shadow(0 15px 25px rgba(16,185,129,0.45));
        }

        .orbit-container {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120%;
          height: 120%;
          animation: orbit 8s linear infinite;
          pointer-events: none;
        }
      `}</style>

            <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-10 md:gap-32 px-4 md:px-12">

                {/* ✅ LEFT SIDE: DOCTOR IMAGE */}
                <div className="flex-1 flex justify-center items-center relative">
                    <div className="relative">
                        <img
                            src="/doctor-ai.png"
                            alt="Doctor & AI"
                            className="w-64 md:w-96 doctor-float object-contain relative z-10"
                        />

                        {/* 🏥 ORBITING RED PLUS SYMBOL */}
                        <div className="orbit-container">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-6xl font-bold filter drop-shadow-md">
                                +
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ RIGHT SIDE: SIGNUP FORM */}
                <div className="flex-1 w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-center mb-2 text-emerald-700">
                        Create Account
                    </h2>

                    <p className="text-sm text-gray-500 mb-4 text-center">
                        Join Dr.AI for quick health insights
                    </p>

                    {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md mb-3 text-sm">{error}</div>}
                    {success && <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md mb-3 text-sm">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-3">

                        <label className="block">
                            <span className="text-sm text-gray-700">Full name</span>
                            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Your name" />
                        </label>

                        <label className="block">
                            <span className="text-sm text-gray-700">Email</span>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="you@example.com" />
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <label className="block">
                                <span className="text-sm text-gray-700">Date of Birth</span>
                                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" required />
                            </label>
                            <label className="block">
                                <span className="text-sm text-gray-700">Sex</span>
                                <select value={sex} onChange={(e) => setSex(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm" required>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </label>
                        </div>

                        <label className="block">
                            <span className="text-sm text-gray-700">Password</span>
                            <input type="password" placeholder="Choose a password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </label>

                        <label className="block">
                            <span className="text-sm text-gray-700">Confirm Password</span>
                            <input type="password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </label>

                        <button disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-emerald-200 transition-all mt-2">
                            {loading ? "Creating..." : "Create account"}
                        </button>
                    </form>

                    <p className="text-center mt-4 text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
                            Log In
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}
