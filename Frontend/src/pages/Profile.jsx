
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";


import { User, Mail, Calendar, Activity, Shield, Camera } from "lucide-react";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const userData = localStorage.getItem("dr_ai_user");
        const settingsData = localStorage.getItem("dr_ai_settings_user");

        let initialUser = {};
        // Load settings first (preferences)
        if (settingsData) initialUser = { ...initialUser, ...JSON.parse(settingsData) };
        // Load auth user second (source of truth for identity)
        if (userData) initialUser = { ...initialUser, ...JSON.parse(userData) };

        setUser(initialUser);
        setFormData(initialUser);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                const updatedUser = { ...user, profileImage: base64String };
                const updatedFormData = { ...formData, profileImage: base64String };

                setUser(updatedUser);
                setFormData(updatedFormData);

                // Save immediately to storage
                localStorage.setItem("dr_ai_user", JSON.stringify(updatedUser));
                localStorage.setItem("dr_ai_settings_user", JSON.stringify(updatedUser)); // Sync
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setUser(formData);
        localStorage.setItem("dr_ai_user", JSON.stringify(formData));
        // Also update settings to keep sync
        localStorage.setItem("dr_ai_settings_user", JSON.stringify(formData));
        setIsEditing(false);
    };

    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "Not provided";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-emerald-100/50"
                >
                    {/* Header Background */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 pt-10 relative">
                        <div className="flex items-end gap-6">
                            <div className="relative group">
                                <div className="w-28 h-28 bg-white p-1 rounded-2xl shadow-lg rotate-3 transform transition-transform hover:rotate-0 overflow-hidden">
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl flex items-center justify-center text-4xl font-bold text-emerald-700">
                                            {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                    )}
                                </div>

                                {/* Camera Upload Button */}
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute bottom-[-10px] right-[-10px] bg-white text-emerald-600 p-2 rounded-full shadow-lg cursor-pointer hover:bg-emerald-50 transition-colors border border-emerald-100"
                                    title="Upload Profile Picture"
                                >
                                    <Camera className="w-5 h-5" />
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>

                            <div className="mb-4">
                                <h1 className="text-3xl font-bold text-white shadow-black/10 drop-shadow-md">
                                    {user.name}
                                </h1>
                                <p className="text-white font-bold flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-white" />
                                    Patient Account
                                </p>
                            </div>
                        </div>

                        {/* Edit Toggle */}
                        <div className="absolute top-6 right-6">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-2 rounded-xl font-semibold border border-white/30 transition-all shadow-lg"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setFormData(user); // Reset
                                            setIsEditing(false);
                                        }}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl font-semibold border border-white/30 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="bg-white text-emerald-700 px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>



                    <div className="px-8 pb-12 mt-6">
                        {isEditing ? (
                            // --- EDIT MODE ---
                            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in zoom-in duration-300">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Identity</h3>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                                        <input
                                            name="name"
                                            value={formData.name || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Email <span className="text-red-400">*</span></label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                            <input
                                                name="email"
                                                value={formData.email || ""}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
                                        <input
                                            name="phone"
                                            value={formData.phone || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Personal Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Age (Auto)</label>
                                            <div className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 font-medium cursor-not-allowed">
                                                {calculateAge(formData.dob)} years
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
                                            <select
                                                name="sex"
                                                value={formData.sex || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            >
                                                <option value="">Select...</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Marital Status</label>
                                            <select
                                                name="maritalStatus"
                                                value={formData.maritalStatus || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            >
                                                <option value="">Select...</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Divorced">Divorced</option>
                                                <option value="Widowed">Widowed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Location</label>
                                        <input
                                            name="location"
                                            value={formData.location || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // --- VIEW MODE ---
                            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* Info Cards */}
                                <div className="space-y-6">
                                    {/* Contact Card */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Email Address</p>
                                                    <p className="text-gray-900 font-semibold">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                                                    <p className="text-gray-900 font-semibold">{user.phone || "Not provided"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">Location</p>
                                                    <p className="text-gray-900 font-semibold">{user.location || "Not provided"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Personal Details Card */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Personal Details</h3>
                                        <div className="grid grid-cols-2 gap-y-6">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-1">Date of Birth</p>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-orange-500" />
                                                    <span className="font-semibold text-gray-900">{formatDate(user.dob)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-1">Age</p>
                                                <span className="font-semibold text-gray-900 text-lg">{calculateAge(user.dob)}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-1">Gender</p>
                                                <span className="font-semibold text-gray-900 capitalize">{user.sex || "Not set"}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-1">Marital Status</p>
                                                <span className="font-semibold text-gray-900">{user.maritalStatus || "Not set"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats / Badges Placeholder */}
                                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-emerald-100 text-sm font-medium mb-1">Member Status</p>
                                                <h3 className="text-2xl font-bold">Active Patient</h3>
                                            </div>
                                            <Shield className="w-8 h-8 text-emerald-200 opacity-50" />
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-white/20 flex gap-6">
                                            <div>
                                                <p className="text-2xl font-bold">12</p>
                                                <p className="text-xs text-emerald-100">Visits</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">100%</p>
                                                <p className="text-xs text-emerald-100">Profile</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div >
        </div >
    );
}
