import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, X, Star, Send, Loader2 } from "lucide-react";

export default function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1); // 1: Input, 2: Success
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        ratingUI: 0,
        ratingChatbot: 0,
        ratingOverall: 0,
        comment: ""
    });

    const endpoints = [
        "http://localhost:5001/api/feedback"
    ];

    const handleRate = (category, value) => {
        setFormData(prev => ({ ...prev, [category]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.ratingUI === 0 || formData.ratingChatbot === 0 || formData.ratingOverall === 0) {
            alert("Please provide a rating for all categories.");
            return;
        }

        setIsSubmitting(true);
        let success = false;

        // Try sending to backend
        for (const ep of endpoints) {
            try {
                const token = localStorage.getItem("dr_ai_token");
                const headers = { "Content-Type": "application/json" };
                if (token) headers["Authorization"] = `Bearer ${token}`;

                const res = await fetch(ep, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    success = true;
                    break;
                }
            } catch (err) {
                console.error("Feedback submission failed:", err);
            }
        }

        setIsSubmitting(false);

        if (success) {
            setStep(2);
            setTimeout(() => {
                setIsOpen(false);
                setStep(1);
                setFormData({ ratingUI: 0, ratingChatbot: 0, ratingOverall: 0, comment: "" });
            }, 3000);
        } else {
            alert("Failed to submit feedback. Please try again.");
        }
    };

    const StarRating = ({ label, value, onChange }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`p-1 transition-transform hover:scale-110 ${value >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    >
                        <Star className={`w-6 h-6 ${value >= star ? "fill-current" : ""}`} />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
                title="Leave Feedback"
            >
                <MessageSquarePlus className="w-6 h-6" />
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                        />

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative pointer-events-auto border border-gray-100"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {step === 1 ? (
                                <form onSubmit={handleSubmit}>
                                    <h2 className="text-xl font-bold text-gray-800 mb-1">We value your feedback</h2>
                                    <p className="text-sm text-gray-500 mb-6">Help us improve your Dr.AI experience.</p>

                                    <StarRating
                                        label="Website UI & Design"
                                        value={formData.ratingUI}
                                        onChange={(v) => handleRate("ratingUI", v)}
                                    />

                                    <StarRating
                                        label="Chatbot Responses"
                                        value={formData.ratingChatbot}
                                        onChange={(v) => handleRate("ratingChatbot", v)}
                                    />

                                    <StarRating
                                        label="Overall Experience"
                                        value={formData.ratingOverall}
                                        onChange={(v) => handleRate("ratingOverall", v)}
                                    />

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments (Optional)</label>
                                        <textarea
                                            value={formData.comment}
                                            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                            placeholder="Tell us what you liked or how we can improve..."
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-sm"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                                        <Send className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                                    <p className="text-gray-500">Your feedback has been submitted successfully.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
