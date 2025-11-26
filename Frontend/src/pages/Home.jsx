// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
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



  // Floating particles configuration
  const floatingIcons = [
    { Icon: Heart, color: "text-rose-400", delay: 0 },
    { Icon: Pill, color: "text-violet-400", delay: 2 },
    { Icon: Plus, color: "text-red-400", delay: 4 },
    { Icon: FlaskConical, color: "text-emerald-400", delay: 1 },
    { Icon: Sparkles, color: "text-amber-400", delay: 3 },
    { Icon: Shield, color: "text-rose-400", delay: 5 },
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
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating Medical Icons */}
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className={`absolute ${item.color}`}
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1000),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 1000),
                opacity: 0,
              }}
              animate={{
                x: [
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1000),
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1000),
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1000),
                ],
                y: [
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 1000),
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 1000),
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 1000),
                ],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 360],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 20 + index * 2,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              <item.Icon className="w-8 h-8" />
            </motion.div>
          ))}

          {/* Animated Grid Pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(239, 68, 68, 0.3) 25%, rgba(239, 68, 68, 0.3) 26%, transparent 27%, transparent 74%, rgba(239, 68, 68, 0.3) 75%, rgba(239, 68, 68, 0.3) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(239, 68, 68, 0.3) 25%, rgba(239, 68, 68, 0.3) 26%, transparent 27%, transparent 74%, rgba(239, 68, 68, 0.3) 75%, rgba(239, 68, 68, 0.3) 76%, transparent 77%, transparent)
              `,
              backgroundSize: "50px 50px",
            }}
            animate={{
              backgroundPosition: ["0px 0px", "50px 50px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-sm">Your AI Health Care Assistant</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl mb-6"
            >
              Meet{" "}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Dr.AI
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Understand your symptoms, medications, and lab reports in plain language.
              Get clear guidance on when to seek care.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/chat">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Start Chat</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-gray-700 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-red-600 hover:text-red-600 transition-all"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center gap-2 text-sm text-gray-500 justify-center lg:justify-start"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </motion.div>
              <span>Educational only — not a medical diagnosis</span>
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Doctor Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Central Doctor Icon */}
            <motion.div
              className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Main Circle */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-500 rounded-full shadow-2xl flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Stethoscope className="w-40 h-40 text-white" strokeWidth={1.5} />
                </motion.div>
              </motion.div>

              {/* Orbiting Icons */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  animate={{
                    rotate: -360,
                    y: [0, -10, 0],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                  whileHover={{ scale: 1.2 }}
                  className="bg-white p-4 rounded-2xl shadow-xl cursor-pointer"
                >
                  <Heart className="w-8 h-8 text-rose-500" />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  animate={{
                    rotate: -360,
                    x: [0, 10, 0],
                  }}
                  transition={{
                    rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                    x: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                  whileHover={{ scale: 1.2 }}
                  className="bg-white p-4 rounded-2xl shadow-xl cursor-pointer"
                >
                  <Pill className="w-8 h-8 text-violet-500" />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  animate={{
                    rotate: -360,
                    y: [0, 10, 0],
                  }}
                  transition={{
                    rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  }}
                  whileHover={{ scale: 1.2 }}
                  className="bg-white p-4 rounded-2xl shadow-xl cursor-pointer"
                >
                  <FlaskConical className="w-8 h-8 text-emerald-500" />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  animate={{
                    rotate: -360,
                    x: [0, -10, 0],
                  }}
                  transition={{
                    rotate: { duration: 22, repeat: Infinity, ease: "linear" },
                    x: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                  }}
                  whileHover={{ scale: 1.2 }}
                  className="bg-white p-4 rounded-2xl shadow-xl cursor-pointer"
                >
                  <Shield className="w-8 h-8 text-red-500" />
                </motion.div>
              </motion.div>

              {/* Pulse Rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-300"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-rose-300"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1,
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-purple-300"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 2,
                }}
              />

              {/* Sparkle Effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  animate={{
                    x: [0, Math.cos((i * Math.PI) / 4) * 150],
                    y: [0, Math.sin((i * Math.PI) / 4) * 150],
                    opacity: [1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/50 backdrop-blur-sm relative overflow-hidden">
        {/* Animated Background Lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
              style={{ top: `${20 * i}%`, width: "100%" }}
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center"
              >
                <motion.div
                  className="bg-gradient-to-br from-red-50 to-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  >
                    <stat.icon className="w-8 h-8 text-red-600" />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="text-3xl text-gray-900 mb-1"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        {/* Animated Shapes */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 border-4 border-red-200 rounded-3xl"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-24 h-24 border-4 border-rose-200"
          animate={{
            rotate: [0, -90, -180, -270, -360],
            borderRadius: ["20%", "50%", "20%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h2 className="text-4xl md:text-5xl mb-4">How Dr.AI Helps You</h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Get evidence-informed guidance that reduces worry and helps you make informed healthcare decisions
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 h-full relative z-10">
                  <motion.div
                    animate={{
                      scale: hoveredCard === index ? 1.1 : 1,
                      rotate: hoveredCard === index ? [0, -5, 5, 0] : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      rotate: { duration: 0.5 },
                    }}
                    className={`bg-gradient-to-br ${feature.color} rounded-2xl p-4 w-fit mb-6 relative`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />

                    {/* Icon Glow Effect */}
                    {hoveredCard === index && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: [0.5, 0], scale: [1, 1.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{
                          background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)`,
                        }}
                      />
                    )}
                  </motion.div>
                  <motion.h3
                    animate={{
                      x: hoveredCard === index ? 5 : 0,
                    }}
                    className="text-2xl mb-3"
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    animate={{
                      x: hoveredCard === index ? 5 : 0,
                    }}
                    transition={{ delay: 0.05 }}
                    className="text-gray-600 leading-relaxed"
                  >
                    {feature.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: hoveredCard === index ? 1 : 0,
                      x: hoveredCard === index ? 0 : -10,
                    }}
                    className="mt-4 flex items-center gap-2 text-red-600"
                  >
                    <span className="text-sm">Learn more</span>
                    <motion.div
                      animate={{ x: hoveredCard === index ? [0, 5, 0] : 0 }}
                      transition={{
                        duration: 1,
                        repeat: hoveredCard === index ? Infinity : 0,
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50 text-gray-900 relative overflow-hidden">


        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-4xl md:text-5xl mb-4"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Simple & Clear Process
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dr.AI asks the right questions to provide personalized, educational guidance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Share Your Concern",
                description:
                  "Tell Dr.AI about your symptoms, medications, or lab results in your own words",
                icon: MessageSquare,
              },
              {
                step: "02",
                title: "Answer Questions",
                description:
                  "Provide details about your age, conditions, and relevant health information",
                icon: Target,
              },
              {
                step: "03",
                title: "Get Clear Guidance",
                description:
                  "Receive educational information and recommendations on next steps",
                icon: Zap,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white shadow-xl rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-red-100 relative"
                >
                  <span className="text-3xl font-bold text-red-600">{item.step}</span>

                  {/* Corner Icons */}
                  <motion.div
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1.5"
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  >
                    <item.icon className="w-4 h-4 text-red-600" />
                  </motion.div>
                </motion.div>
                <motion.h3
                  className="text-2xl mb-3"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                >
                  {item.title}
                </motion.h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>

                {/* Connection Line */}
                {index < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-red-200"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
                  >
                    <motion.div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 md:p-12 border-2 border-rose-200 relative overflow-hidden"
          >
            {/* Animated Alert Icon */}
            <motion.div
              className="absolute top-4 right-4 text-rose-300"
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Shield className="w-16 h-16" />
            </motion.div>

            <div className="flex items-start gap-4 mb-6 relative z-10">
              <motion.div
                className="bg-rose-500 rounded-2xl p-3"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(244, 63, 94, 0.4)",
                    "0 0 0 20px rgba(244, 63, 94, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <motion.h3
                  className="text-3xl mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  Important Safety Information
                </motion.h3>
                <motion.p
                  className="text-gray-700 text-lg leading-relaxed mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Dr.AI is an <span className="font-semibold">educational tool</span>, not a medical professional.
                  For emergencies like severe chest pain, difficulty breathing, or signs of stroke,
                  <span className="font-semibold"> seek emergency care immediately</span>.
                </motion.p>
                <motion.div
                  className="flex items-center gap-2 text-rose-600"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </motion.div>
                  <span>Always consult healthcare providers for medical decisions</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        {/* Animated Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-gradient-to-br from-red-500 to-rose-500 rounded-full p-6 w-fit mx-auto mb-8 relative"
            >
              <Clock className="w-16 h-16" />

              {/* Orbiting Dots */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-white rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  animate={{
                    x: [0, Math.cos((i * Math.PI) / 2) * 50],
                    y: [0, Math.sin((i * Math.PI) / 2) * 50],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl mb-6"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            >
              Ready to Learn About Your Health?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Start getting clear, compassionate guidance on your health concerns today
            </motion.p>
            <Link to="/chat">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-red-600 to-rose-600 text-white px-10 py-5 rounded-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all text-lg flex items-center justify-center gap-3 mx-auto relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Get Started Now</span>
                <motion.div
                  className="relative z-10"
                  animate={{
                    x: [0, 10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section >
    </div >
  );
}
