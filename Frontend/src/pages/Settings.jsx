import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";
import {
    User, Lock, Shield, Trash2, Smartphone, Bell,
    LogOut, Check, X, AlertTriangle, Eye, EyeOff, Save, Key, QrCode
} from "lucide-react";
import { authenticator } from 'otplib';
import { QRCodeSVG } from 'qrcode.react';

export default function Settings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("account");
    const [isLoading, setIsLoading] = useState(false);

    // User State Mock
    const [user, setUser] = useState({
        name: "Harshit Pandey",
        email: "harshit@example.com",
        phone: "+91 98765 43210",
        twoFactor: false,
        notifications: {
            email: true,
            push: true,
            promos: false
        }
    });

    // Handle Phone Update
    const [phone, setPhone] = useState(user.phone);
    const [isEditingPhone, setIsEditingPhone] = useState(false);

    // Password State
    const [passwordData, setPasswordData] = useState({
        current: "",
        new: "",
        confirm: ""
    });


    // Modals
    const [deleteModal, setDeleteModal] = useState(false);
    const [deactivateModal, setDeactivateModal] = useState(false);

    // 2FA State
    const [twoFAModal, setTwoFAModal] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    // 2FA TOTP State
    const [totpSecret, setTotpSecret] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    // -- Handlers --


    // Save changes to localStorage
    const persistUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("dr_ai_settings_user", JSON.stringify(updatedUser));
        // Also update main auth user if needed, but keeping separate for this demo
    };

    // Load from local storage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem("dr_ai_settings_user");
        if (saved) setUser(JSON.parse(saved));
    }, []);

    const generateOTP = () => {
        // App Method: Generate Secret (Browser Safe)
        try {
            // Simple Base32 generation for demo
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            let secret = '';
            for (let i = 0; i < 32; i++) {
                secret += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setTotpSecret(secret);

            const userEmail = user.email || "user@example.com";
            // Manual keyuri construction to avoid library issues
            const otpauth = `otpauth://totp/Dr.AI:${userEmail}?secret=${secret}&issuer=Dr.AI`;
            setQrCodeUrl(otpauth);
        } catch (error) {
            console.error("Error generating TOTP secret:", error);
            alert("Error initializing Authenticator. Please try again.");
        }
    };

    const toggle2FA = () => {
        if (user.twoFactor) {
            // Turning OFF
            if (window.confirm("Are you sure you want to disable Two-Factor Authentication?")) {
                persistUser({ ...user, twoFactor: false });
            }
        } else {
            // Turning ON -> Show Modal
            setTwoFAModal(true);
            setOtp(["", "", "", "", "", ""]);
            generateOTP();
        }
    };

    // Effect to regenerate when modal opens (if needed, but toggle2FA calls it already)
    // We can keep it simple: toggle2FA handles init.
    // If we want to reset if they close and reopen:
    React.useEffect(() => {
        if (twoFAModal) {
            // Ensure otp is clear
            setOtp(["", "", "", "", "", ""]);
            // Generate if not already (or regenerate)
            // But generateOTP is called in toggle2FA.
            // Let's just rely on toggle2FA for generation to avoid double call.
        }
    }, [twoFAModal]);

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSavePhone = () => {
        setIsLoading(true);
        setTimeout(() => {
            persistUser({ ...user, phone: phone });
            setIsEditingPhone(false);
            setIsLoading(false);
            alert("Phone number updated successfully!");
        }, 1000);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert("New passwords do not match!");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setPasswordData({ current: "", new: "", confirm: "" });
            alert("Password changed successfully!");
        }, 1500);
    };

    const handleDeleteAccount = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setDeleteModal(false);
            alert("Account deleted permanently. Redirecting to home...");
            localStorage.clear();
            navigate("/");
        }, 2000);
    };

    const handleDeactivateAccount = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setDeactivateModal(false);
            alert("Account deactivated. You can reactivate by logging in anytime.");
            localStorage.clear();
            navigate("/login");
        }, 1500);
    };
    const verifyOTP = () => {
        const code = otp.join("");
        if (code.length < 6) return;

        setIsLoading(true);
        setTimeout(() => {
            let isValid = false;

            try {
                isValid = authenticator.check(code, totpSecret);
            } catch (err) {
                console.warn("Library verification failed, falling back to mock:", err);
                // Demo fallback
                if (code === "123456") {
                    isValid = true;
                    alert("Library check failed. Accepted '123456' as mock code.");
                } else {
                    alert("Verification error. Ensure you scanned the QR code correctly. (Try 123456 for demo)");
                    if (code === "123456") isValid = true;
                }
            }

            if (isValid) {
                persistUser({ ...user, twoFactor: true });
                setTwoFAModal(false);
                alert("Two-Factor Authentication Enabled Successfully!");
            } else {
                alert("Invalid Code. Please try again.");
            }
            setIsLoading(false);
        }, 1500);
    };

    // -- Render Components --

    // ... (SidebarItem stays same)
    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === id
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "text-gray-600 hover:bg-gray-100"
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* LEFT SIDEBAR */}
                    {/* ... (Left Sidebar stays same) */}
                    <div className="md:col-span-1 space-y-2">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Settings</h2>
                            <div className="space-y-1">
                                <SidebarItem id="account" icon={User} label="General" />
                                <SidebarItem id="security" icon={Lock} label="Security" />
                                <SidebarItem id="notifications" icon={Bell} label="Notifications" />
                            </div>
                            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-2">Danger Zone</h2>
                            <div className="space-y-1">
                                <SidebarItem id="danger" icon={Shield} label="Privacy & Data" />
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="md:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]"
                        >
                            {/* ... (Account, Security, Danger tabs content same generally, just need to ensure correct context) */}
                            {/* --- ACCOUNT TAB --- */}
                            {activeTab === "account" && (
                                <div className="space-y-8">
                                    <div className="border-b border-gray-100 pb-5">
                                        <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
                                        <p className="text-gray-500">Manage your personal information.</p>
                                    </div>
                                    <div className="grid gap-6 max-w-xl">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                            <input
                                                disabled
                                                value={user.name}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                            <input
                                                disabled
                                                value={user.email}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                            <div className="flex gap-3">
                                                <div className="relative flex-1">
                                                    <Smartphone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={isEditingPhone ? phone : user.phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        disabled={!isEditingPhone}
                                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isEditingPhone
                                                            ? "border-emerald-500 bg-white ring-2 ring-emerald-100"
                                                            : "border-gray-200 bg-gray-50"
                                                            } outline-none transition-all`}
                                                    />
                                                </div>
                                                {isEditingPhone ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleSavePhone}
                                                            className="bg-emerald-600 text-white px-4 rounded-xl font-medium hover:bg-emerald-700 flex items-center"
                                                        >
                                                            {isLoading ? "..." : <Check className="w-5 h-5" />}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setIsEditingPhone(false);
                                                                setPhone(user.phone);
                                                            }}
                                                            className="bg-gray-200 text-gray-600 px-4 rounded-xl font-medium hover:bg-gray-300 flex items-center"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setIsEditingPhone(true)}
                                                        className="border border-gray-200 text-gray-700 px-6 rounded-xl font-medium hover:bg-gray-50"
                                                    >
                                                        Change
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- SECURITY TAB --- */}
                            {activeTab === "security" && (
                                <div className="space-y-8">
                                    <div className="border-b border-gray-100 pb-5">
                                        <h2 className="text-2xl font-bold text-gray-900">Security</h2>
                                        <p className="text-gray-500">Protect your account and data.</p>
                                    </div>

                                    {/* Password Change */}
                                    <div className="max-w-xl space-y-6">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <Key className="w-5 h-5 text-emerald-600" /> Change Password
                                        </h3>
                                        <form onSubmit={handlePasswordChange} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.current}
                                                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                                                    <input
                                                        type="password"
                                                        value={passwordData.new}
                                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                                        placeholder="Min 8 chars"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New</label>
                                                    <input
                                                        type="password"
                                                        value={passwordData.confirm}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                                        placeholder="Repeat password"
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={!passwordData.current || !passwordData.new || isLoading}
                                                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    {isLoading ? "Updating..." : "Update Password"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="border-t border-gray-100 my-8"></div>

                                    {/* 2FA */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">Two-Factor Authentication</h3>
                                            <p className="text-sm text-gray-500 mt-1">Add an extra layer of security. We'll send a code to your phone.</p>
                                        </div>
                                        <button
                                            onClick={toggle2FA}
                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${user.twoFactor ? 'bg-emerald-600' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${user.twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* --- DANGER & NOTIFICATION TABS (same) --- */}
                            {activeTab === "danger" && (
                                <div className="space-y-8">
                                    <div className="border-b border-gray-100 pb-5">
                                        <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                                            <AlertTriangle className="w-7 h-7" /> Danger Zone
                                        </h2>
                                        <p className="text-gray-500">Irreversible and sensitive actions.</p>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Deactivate */}
                                        <div className="flex items-center justify-between p-5 border border-gray-200 rounded-2xl bg-gray-50">
                                            <div>
                                                <h3 className="font-bold text-gray-800 mb-1">Deactivate Account</h3>
                                                <p className="text-sm text-gray-500 max-w-md">
                                                    Hide your profile and data temporarily. You can reactivate strictly by logging in again.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setDeactivateModal(true)}
                                                className="text-gray-600 font-bold px-5 py-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-xl transition-all"
                                            >
                                                Deactivate
                                            </button>
                                        </div>

                                        {/* Delete */}
                                        <div className="flex items-center justify-between p-5 border border-red-100 rounded-2xl bg-red-50/50">
                                            <div>
                                                <h3 className="font-bold text-red-700 mb-1">Delete Account</h3>
                                                <p className="text-sm text-red-600/70 max-w-md">
                                                    Permanently delete your account and all associated data. This action cannot be undone.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setDeleteModal(true)}
                                                className="bg-red-600 text-white font-bold px-5 py-2 rounded-xl hover:bg-red-700 shadow-md shadow-red-200 transition-all"
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === "notifications" && (
                                <div className="text-center py-20">
                                    <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-400">Notifications</h3>
                                    <p className="text-gray-400">You are all caught up!</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* 2FA MODAL (Verify OTP) */}
            <AnimatePresence>
                {twoFAModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Setup Authenticator</h3>
                                <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">
                                    Scan the QR code with your Authenticator App (Google Authy, Microsoft, etc.) to enable 2FA.
                                </p>
                            </div>

                            <div className="flex flex-col items-center mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {qrCodeUrl && (
                                    <div className="bg-white p-2 rounded-xl shadow-sm mb-4">
                                        <QRCodeSVG value={qrCodeUrl} size={160} />
                                    </div>
                                )}
                                <p className="text-xs text-center text-gray-400 max-w-[250px] font-mono select-all">
                                    {/* Optional: Show secret text for manual entry if needed, but QR is main focus */}
                                    Secret (for manual entry) optional
                                </p>
                            </div>

                            <div className="flex justify-center gap-2 mb-8">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        className="w-12 h-14 border border-gray-300 rounded-xl text-center text-xl font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                                        value={data}
                                        onChange={(e) => handleOtpChange(e.target, index)}
                                        onFocus={(e) => e.target.select()}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setTwoFAModal(false)}
                                    className="flex-1 py-3 font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={verifyOTP}
                                    disabled={otp.join("").length < 6 || isLoading}
                                    className="flex-1 py-3 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-200 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? "Verifying..." : "Verify Code"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DELETE MODAL */}
            <AnimatePresence>
                {deleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-7 h-7 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Delete Account?</h3>
                            <p className="text-center text-gray-500 mb-6">
                                Are you sure you want to delete your account? This action is <strong className="text-red-600">permanent</strong> and cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal(false)}
                                    className="flex-1 py-3 font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-200 transition-colors"
                                >
                                    {isLoading ? "Deleting..." : "Yes, Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DEACTIVATE MODAL */}
            <AnimatePresence>
                {deactivateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut className="w-7 h-7 text-yellow-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Deactivate Account?</h3>
                            <p className="text-center text-gray-500 mb-6">
                                Your account will be disabled but safe. You can login anytime to reactivate it.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeactivateModal(false)}
                                    className="flex-1 py-3 font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeactivateAccount}
                                    className="flex-1 py-3 font-semibold text-white bg-gray-800 hover:bg-black rounded-xl shadow-lg transition-colors"
                                >
                                    {isLoading ? "Processing..." : "Deactivate"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
