import { Check, ShieldCheck, Zap, FileText, Calendar, Activity, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";

export default function Upgrade() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("dr_ai_token");
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            // 1. Create Payment Link
            const response = await fetch(`${API_BASE_URL}/api/payment/create-payment-link`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    origin: window.location.origin,
                    // You can optionally pass user details here if you have them stored in context
                    // name: user.name, 
                    // email: user.email 
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Could not initiate payment");
            }

            const data = await response.json();

            // 2. Redirect to Razorpay Hosted Page
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No payment URL returned");
            }

        } catch (error) {
            console.error("Payment Error:", error);
            alert(`Payment Initialization Failed: ${error.message}`);
            setLoading(false);
        }
    };
    const features = [
        {
            icon: <FileText className="w-6 h-6 text-emerald-600" />,
            title: "Downloadable Visit Summary",
            desc: "Get a professional PDF summary of your symptoms and AI analysis to share with your doctor."
        },
        {
            icon: <Activity className="w-6 h-6 text-blue-600" />,
            title: "Symptom Timeline Builder",
            desc: "Visualize your health journey with an generated interactive timeline of events."
        },
        {
            icon: <Calendar className="w-6 h-6 text-purple-600" />,
            title: "Medication Calendar",
            desc: "Smart schedule creation for your prescriptions and supplements tailored to your routine."
        },
        {
            icon: <Zap className="w-6 h-6 text-amber-500" />,
            title: "Unlimited Deep Dives",
            desc: "Get extensive, detailed explanations for complex lab reports and condition research."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
            title: "Clinician-Reviewed Pathways",
            desc: "Access verified standard-of-care pathways for common chronic conditions."
        },
        {
            icon: <Check className="w-6 h-6 text-rose-500" />,
            title: "Priority Access",
            desc: "Skip lines for integrated telehealth, pharmacy delivery, and lab booking services."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-12 pb-20">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4">
                        <Zap className="w-4 h-4 fill-current" />
                        Dr. AI Pro
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Unlock the full power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Dr. AI</span>
                    </h1>
                    <p className="text-lg text-slate-600">
                        Advanced tools to manage your health journey. Safety guidance is always free.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">

                    {/* Free Card */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-slate-200"></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Basic</h3>
                        <div className="text-4xl font-bold text-slate-900 mb-6">Free<span className="text-lg text-slate-500 font-normal"> / forever</span></div>
                        <p className="text-slate-600 mb-8 text-sm">Essential AI health guidance for everyone.</p>

                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "24/7 AI Health Chat",
                                "Metric Triage & Assessment",
                                "Drug Interaction Checker",
                                "3 Lab Explanations / month",
                                "Mental Health Resources",
                                "Emergency Safety Alerts"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                                    <Check className="w-5 h-5 text-slate-400 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link to="/chat" className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-colors text-center">
                            Current Plan
                        </Link>
                    </div>

                    {/* Pro Card */}
                    <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-xl flex flex-col relative overflow-hidden relative">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Recommended
                        </div>
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-400"></div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                            Pro <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">New</span>
                        </h3>
                        <div className="text-4xl font-bold text-slate-900 mb-2">$9<span className="text-lg text-slate-500 font-normal"> / month</span></div>
                        <p className="text-xs text-emerald-600 font-medium mb-6 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Accepts Cards, UPI, Wallets
                        </p>
                        <p className="text-slate-600 mb-8 text-sm">Actionable tools for proactive health management.</p>

                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Everything in Basic",
                                "Downloadable PDF Summaries",
                                "Symptom Timeline Builder",
                                "Medication Calendar",
                                "Clinician-Reviewed Pathways",
                                "Priority Support Access"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-800 font-medium text-sm">
                                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Activating Pro..." : "Upgrade to Pro"}
                        </button>
                    </div>
                </div>

                {/* Feature Grid Details */}
                <div className="mt-24">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Premium Tools Included</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Safety Note */}
                <div className="mt-20 max-w-2xl mx-auto text-center bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h4 className="flex items-center justify-center gap-2 text-blue-900 font-bold mb-2">
                        <ShieldCheck className="w-5 h-5" />
                        Safety First Promise
                    </h4>
                    <p className="text-blue-800 text-sm">
                        Dr. AI will <strong>never</strong> charge for emergency advice, triage assessments, or mental health crisis support. Safety features are always free and accessible to everyone.
                    </p>
                </div>

            </div>
        </div>
    );
}
