// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/auth/login", {
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

            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Server error. Please try again later.");
        }
    };

    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25; // Sensitivity
        const y = (e.clientY - top - height / 2) / 25;
        setTilt({ x, y });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <div className="w-full flex items-start justify-center bg-gradient-to-br from-gray-50 to-white p-4 pt-10">
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

        @keyframes counter-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        .doctor-float {
          animation: floatDoctor 3s ease-in-out infinite;
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

        .plus-stable {
          animation: counter-orbit 8s linear infinite;
        }
      `}</style>

            <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16 lg:gap-32 px-4 md:px-8 lg:px-12">

                {/* ✅ LEFT SIDE: DOCTOR IMAGE (4D TILT EFFECT) */}
                <div className="flex-1 flex justify-center items-center relative perspective-1000 w-full">
                    <div
                        className="relative doctor-float"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <img
                            src="/login_doctor.png?v=4"
                            alt="Doctor & AI"
                            className="w-48 md:w-72 lg:w-96 object-contain relative z-10 transition-transform duration-100 ease-out"
                            style={{
                                transform: `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.05, 1.05, 1.05)`,
                            }}
                        />


                    </div>
                </div>

                {/* ✅ RIGHT SIDE: LOGIN FORM */}
                <div className="flex-1 w-full max-w-md bg-transparent p-6 rounded-[2rem] border border-gray-200/50">
                    <h2 className="text-3xl font-bold text-center mb-6 text-emerald-700">Welcome Back — Login</h2>
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
                                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="you@example.com"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm text-gray-700">Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="your password"
                            />
                        </label>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-emerald-600 font-semibold hover:text-emerald-700">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}