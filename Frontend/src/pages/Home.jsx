import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Heart,
  Pill,
  FlaskConical,
  MapPin,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Users,
  MessageSquare,
  Brain,
  Activity,
  Plus,
  Zap,
  Target
} from "lucide-react";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const floatingIcons = [
    { Icon: Heart, color: "text-rose-400", top: "12%", left: "8%", delay: 0 },
    { Icon: Pill, color: "text-violet-400", top: "20%", left: "75%", delay: 2 },
    { Icon: Plus, color: "text-red-400", top: "48%", left: "60%", delay: 4 },
    { Icon: FlaskConical, color: "text-emerald-400", top: "65%", left: "14%", delay: 1 },
    { Icon: Sparkles, color: "text-amber-400", top: "36%", left: "40%", delay: 3 },
    { Icon: Shield, color: "text-rose-400", top: "72%", left: "82%", delay: 5 },
  ];

  const features = [
    {
      icon: Activity,
      title: "Symptom Analysis",
      description:
        "Get instant triage guidance and understand urgency levels for your symptoms",
      color: "from-rose-500 to-pink-500",
      delay: 0.1,
    },
    {
      icon: Pill,
      title: "Medication Guide",
      description:
        "Learn about medicines, side effects, and safe OTC options in plain language",
      color: "from-violet-500 to-purple-500",
      delay: 0.2,
    },
    {
      icon: FlaskConical,
      title: "Lab Reports",
      description: "Understand your test results and what they mean for your health",
      color: "from-emerald-500 to-green-500",
      delay: 0.3,
    },
    {
      icon: MapPin,
      title: "Care Navigation",
      description:
        "Find the right care at the right time — emergency, urgent, or routine",
      color: "from-amber-500 to-orange-500",
      delay: 0.4,
    },
  ];

  const stats = [
    { icon: Users, value: "24/7", label: "Always Available" },
    { icon: MessageSquare, value: "Plain", label: "Language" },
    { icon: Shield, value: "Safe", label: "Guidance" },
    { icon: Brain, value: "Smart", label: "Education" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-red-200/30 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating medical icons (deterministic positions for stability) */}
          {floatingIcons.map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.color}`}
              style={{ top: item.top, left: item.left }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                y: [0, (i % 2 === 0 ? -18 : 18), 0],
                opacity: [0.2, 0.9, 0.2],
                rotate: [0, 360, 0],
              }}
              transition={{ duration: 12 + i, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
            >
              <item.Icon className="w-8 h-8" />
            </motion.div>
          ))}

          {/* Subtle grid overlay */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(239, 68, 68, 0.12) 25%, rgba(239, 68, 68, 0.12) 26%, transparent 27%),
                linear-gradient(90deg, transparent 24%, rgba(239, 68, 68, 0.12) 25%, rgba(239, 68, 68, 0.12) 26%, transparent 27%)
              `,
              backgroundSize: "80px 80px",
            }}
            animate={{ backgroundPosition: ["0px 0px", "80px 80px"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-sm">Your AI Health Education Assistant</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 font-extrabold">
              Meet{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 inline-block">
                Dr.AI
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl lg:mx-0">
              Understand your symptoms, medications, and lab reports in plain language.
              Get clear guidance on when to seek care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/chat">
                <button className="group bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl flex items-center gap-2 relative overflow-hidden">
                  <span>Start Learning</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>

              <Link to="/about">
                <button className="bg-white text-gray-700 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-red-600 hover:text-red-600">
                  Learn More
                </button>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Educational only — not a medical diagnosis</span>
            </div>
          </motion.div>

          {/* Right Content - Animated Doctor Illustration */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
              <motion.div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-500 rounded-full shadow-2xl flex items-center justify-center" whileHover={{ scale: 1.03 }}>
                <Stethoscope className="w-40 h-40 text-white" strokeWidth={1.5} />
              </motion.div>

              {/* Orbiting widgets */}
              <div className="absolute -top-4 -left-4">
                <div className="bg-white p-3 rounded-2xl shadow-xl">
                  <Heart className="w-6 h-6 text-rose-500" />
                </div>
              </div>
              <div className="absolute right-0 top-16">
                <div className="bg-white p-3 rounded-2xl shadow-xl">
                  <Pill className="w-6 h-6 text-violet-500" />
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <div className="bg-white p-3 rounded-2xl shadow-xl">
                  <FlaskConical className="w-6 h-6 text-emerald-500" />
                </div>
              </div>

              {/* Pulse rings */}
              <motion.div className="absolute inset-0 rounded-full border-4 border-red-300" animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.05, 0.6] }} transition={{ duration: 3, repeat: Infinity }} />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" animate={{ y: [0, 16, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/50 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }} className="text-center">
                <div className="bg-gradient-to-br from-red-50 to-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-3xl text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">How Dr.AI Helps You</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Get evidence-informed guidance that reduces worry and helps you make informed healthcare decisions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: feature.delay }} onHoverStart={() => setHoveredCard(index)} onHoverEnd={() => setHoveredCard(null)} whileHover={{ scale: 1.02 }} className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg transition-all border border-gray-100 h-full">
                  <div className={`bg-gradient-to-br ${feature.color} rounded-2xl p-4 w-fit mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 md:p-12 border-2 border-rose-200 relative overflow-hidden">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-rose-500 rounded-2xl p-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl mb-4">Important Safety Information</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Dr.AI is an <strong>educational tool</strong>, not a medical professional. For emergencies like severe chest pain, difficulty breathing, or signs of stroke, <strong>seek emergency care immediately</strong>.
                </p>
                <div className="flex items-center gap-2 text-rose-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Always consult healthcare providers for medical decisions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-full p-6 w-fit mx-auto mb-8">
            <Clock className="w-16 h-16" />
          </div>
          <h2 className="text-4xl md:text-5xl mb-6">Ready to Learn About Your Health?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Start getting clear, compassionate guidance on your health concerns today</p>
          <Link to="/chat">
            <button className="group bg-gradient-to-r from-red-600 to-rose-600 text-white px-10 py-5 rounded-xl hover:shadow-2xl transition-all">
              Get Started Now
            </button>
          </Link>
        </div>
      </section >
    </div >
  );
}