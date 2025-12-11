
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Download, Eye } from "lucide-react";
import { jsPDF } from "jspdf";

export default function MedicalHistory() {
    const [history, setHistory] = useState({});
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("dr_ai_user") || "{}");
            if (user.email) {
                setUserEmail(user.email);
                const stored = localStorage.getItem(`dr_ai_chat_history_${user.email}`);
                if (stored) {
                    setHistory(JSON.parse(stored));
                }
            }
        } catch (e) { console.error(e); }
    }, []);

    const generatePDF = (date, messages) => {
        try {
            const doc = new jsPDF();

            // Header
            doc.setFillColor(16, 185, 129); // Emerald 500
            doc.rect(0, 0, 210, 20, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.text("Dr.AI Medical History Report", 10, 13);

            // Metadata
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(`Patient Email: ${userEmail}`, 10, 30);
            doc.text(`Date of Session: ${date}`, 10, 35);
            doc.line(10, 38, 200, 38);

            // Content
            let y = 50;
            const pageHeight = doc.internal.pageSize.height;

            if (messages && Array.isArray(messages)) {
                messages.forEach((msg) => {
                    if (msg.id === "1") return; // Skip welcome message

                    const isBot = msg.sender === "bot";
                    const senderName = isBot ? "Dr.AI" : "You";
                    const textContent = msg.text || ""; // Safety check

                    // Sender Title
                    doc.setFontSize(11);
                    doc.setFont("helvetica", "bold");
                    if (isBot) {
                        doc.setTextColor(5, 150, 105); // Emerald
                    } else {
                        doc.setTextColor(75, 85, 99); // Gray
                    }
                    doc.text(senderName + ":", 10, y);
                    y += 5;

                    // Message Body
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(10);

                    // Text wrapping
                    const textLines = doc.splitTextToSize(textContent, 190);
                    doc.text(textLines, 10, y);

                    y += textLines.length * 5 + 5; // Spacing

                    // Page Break Check
                    if (y > pageHeight - 20) {
                        doc.addPage();
                        y = 20;
                    }
                });
            }

            // Direct Download - 100% reliable
            doc.save(`Dr_AI_History_${date}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF report. Check console for details.");
        }
    };

    const dates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
                        <p className="text-gray-500">View and download your past AI consultations.</p>
                    </div>
                </div>

                {dates.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="mx-auto bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No history records found</h3>
                        <p className="text-gray-500">Your chats with Dr.AI will appear here automatically.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {dates.map((date) => (
                            <motion.div
                                key={date}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100/50 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-lg shrink-0">
                                        {new Date(date).getDate()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {history[date].length} messages recorded
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => generatePDF(date, history[date])}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-lg shadow-emerald-200"
                                >
                                    <Eye className="w-4 h-4" />
                                    Open PDF
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
