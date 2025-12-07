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

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [verificationToken, setVerificationToken] = useState("");

    const handleSendOtp = async () => {
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email first.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5001/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setOtpSent(true);
                setSuccess("OTP sent to " + email);
                setError("");
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setError("Server error sending OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setError("Please enter the OTP.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5001/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (res.ok) {
                setOtpVerified(true);
                setVerificationToken(data.verificationToken); // Store token
                setSuccess("Email verified successfully!");
                setError("");
                setOtpSent(false);
            } else {
                setError(data.message || "Invalid OTP");
            }
        } catch (err) {
            setError("Server error verifying OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!otpVerified || !verificationToken) {
            setError("Please verify your email first.");
            return;
        }

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
                body: JSON.stringify({ name, email, dob, sex, password, verificationToken }), // Send token
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
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
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
                            src="/doctor-ai.png"
                            alt="Doctor & AI"
                            className="w-48 md:w-72 lg:w-96 object-contain relative z-10 transition-transform duration-100 ease-out"
                            style={{
                                transform: `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.05, 1.05, 1.05)`,
                            }}
                        />

                        {/* 🏥 ORBITING RED PLUS SYMBOL */}
                        <div className="orbit-container" style={{ transform: `translateZ(50px)` }}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-6xl font-bold filter drop-shadow-md plus-stable">
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
                            <div className="flex gap-2">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none ${otpVerified ? 'bg-green-50 border-green-500' : ''}`}
                                    placeholder="you@example.com"
                                    disabled={otpVerified}
                                />
                                {!otpVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={loading || otpSent}
                                        className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-200 transition-colors whitespace-nowrap"
                                    >
                                        {otpSent ? "Sent" : "Verify"}
                                    </button>
                                )}
                            </div>
                        </label>

                        {/* OTP INPUT (Visible only when Sent and Not Verified) */}
                        {otpSent && !otpVerified && (
                            <label className="block animate-fade-in">
                                <span className="text-sm text-gray-700">Enter OTP</span>
                                <div className="flex gap-2">
                                    <input
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleVerifyOtp();
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="6-digit code"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </label>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <label className="block">
                                <span className="text-sm text-gray-700">Date of Birth</span>
                                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" required />
                            </label>
                            <label className="block">
                                <span className="text-sm text-gray-700">Gender</span>
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

                        <button disabled={loading || !otpVerified} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-emerald-200 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Processing..." : "Create account"}
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
