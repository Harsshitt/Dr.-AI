


import {
    Stethoscope,
    MessageSquare,
    Activity,
    Pill,
    Info,
    Home,
    Menu,
    X,
    AlertTriangle,
    Clock,
    CheckCircle2,
    Shield,
    Droplet,
    Heart,
    User,
    FileText,
    Zap,
    AlertOctagon,
} from "lucide-react";
import React from "react";


export default function SymptomsPage() {


    const howItWorks = [
        { step: 1, text: "Tell the assistant your age, sex at birth, major medical conditions, allergies, and medications.", icon: User },
        { step: 2, text: "Describe the symptom: when it started, how severe it is, what makes it better/worse, and any related symptoms.", icon: FileText },
        { step: 3, text: 'I will estimate urgency (Emergency / Urgent / Routine / Self-care OK), suggest safe self-care steps, and list "go-now" signs.', icon: Zap },
    ];

    const selfCareSteps = [
        { title: "Rest & Hydration", description: "Rest, hydration, and simple home measures (ice/heat for musculoskeletal pain as appropriate).", icon: Droplet },
        { title: "OTC Medications", description: "OTC pain relievers or fever reducers — only follow the product label and check age/weight rules.", icon: Pill },
        { title: "Monitor Progress", description: "If symptoms are mild and improving in 48–72 hours, monitor and follow up with your primary care provider if not better.", icon: Clock },
    ];

    const redFlags = [
        "Severe chest pain, pressure or squeezing",
        "Sudden severe difficulty breathing, choking, or blue lips/skin",
        "Signs of stroke: face droop, arm weakness, slurred speech",
        "Sudden severe headache, confusion, new weakness/numbness, or sudden vision loss",
        "Severe allergic reaction — swelling of face/tongue, difficulty breathing, hives with dizziness",
        "Uncontrolled bleeding, severe dehydration, or loss of consciousness",
    ];

    const urgentSigns = [
        "High fever that doesn't respond to antipyretics or lasts >48 hours",
        "Worsening shortness of breath or persistent cough",
        "Severe pain that is not controlled by OTC medicine",
        "Signs of infection that are spreading (increasing redness, swelling, fever)",
    ];

    const questionsAsked = [
        "How old are you? Sex at birth? Pregnant or breastfeeding?",
        "Describe the symptom (where, when, severity 1–10, what made it start)",
        "Any other symptoms (fever, cough, vomiting, chest pain, dizziness)?",
        "Medical conditions, allergies, and current medicines",
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-6 pb-4">

            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
                        <Activity className="w-5 h-5" />
                        <span className="font-semibold">Symptom Checker Guide</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Understand Your <span className="text-emerald-600">Symptoms</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        This tool helps you understand common symptoms and decide what to do next.
                        I’m an assistant, not a doctor — I provide guidance and red-flag checks only.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-10">

                <div className="md:col-span-8 space-y-12">

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <Zap className="w-6 h-6 text-emerald-500" />
                            How it works
                        </h2>
                        <div className="grid gap-6">
                            {howItWorks.map((item, idx) => (
                                <div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex gap-4 items-start"
                                >
                                    <div className="bg-emerald-50 p-3 rounded-xl shrink-0">
                                        <item.icon className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-1 block">Step 0{item.step}</span>
                                        <p className="text-gray-700 leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <Heart className="w-6 h-6 text-emerald-500" />
                            Common self-care steps
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {selfCareSteps.map((step, idx) => (
                                <div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                                >
                                    <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                        <step.icon className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-600">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-3xl border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-blue-500" />
                            What I’ll ask you
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {questionsAsked.map((q, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-gray-700">{q}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                <div className="md:col-span-4 space-y-8">

                    <div className="max-w-4xl mx-auto mt-20">
                        <div
                            className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 relative overflow-hidden"
                        >
                            <div className="absolute -right-10 -top-10 opacity-10">
                                <AlertOctagon className="w-32 h-32 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2 relative z-10">
                                <AlertTriangle className="w-6 h-6" />
                                Red Flags (Emergency)
                            </h3>
                            <p className="text-orange-800 text-sm mb-4 font-medium relative z-10">
                                If you experience any of these, seek immediate medical attention:
                            </p>
                            <ul className="grid md:grid-cols-2 gap-3 relative z-10">
                                {redFlags.map((flag, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-orange-900 text-sm">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                                        {flag}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6">
                        <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
                            <Clock className="w-6 h-6" />
                            Urgent (24-48h)
                        </h3>
                        <ul className="space-y-3">
                            {urgentSigns.map((sign, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-orange-900 text-sm">
                                    <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                                    {sign}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                        <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Safety Note
                        </h3>
                        <p className="text-sm text-gray-600">
                            I am not a clinician and I do not make diagnoses. Use this information to decide how urgently to seek professional care. If you feel severely unwell or unsure — choose emergency care.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
