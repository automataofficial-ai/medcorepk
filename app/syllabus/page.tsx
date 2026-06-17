"use client";

import Link from "next/link";
import { Download, Heart, Eye, Stethoscope, Zap, Clock, Music, Shield } from "lucide-react";

const PAPER_I_TOPICS = [
  {
    title: "Anatomy",
    description: "Gross anatomy, embryology, histology, CNS, head & neck, viscera, bronchial tree, endocrine glands",
  },
  {
    title: "Physiology, Pharmacology & Biochemistry",
    description: "Body temperature regulation, kidney function, blood pressure, cardiac cycle, blood groups, coagulation, autonomic nervous system, pharmacokinetics, metabolism",
  },
  {
    title: "Pathology including Microbiology",
    description: "Nutritional diseases, biochemical tests, medical genetics, immunology, bacteria, viruses, parasites",
  },
  {
    title: "Research & Biostatistics",
    description: "Basic concepts, epidemiology",
  },
  {
    title: "Behavioral Science & Medical Ethics",
    description: "General principles",
  },
];

const SPECIALTIES = [
  { name: "Medicine & Allied", icon: "🫀", color: "#3B82F6" },
  { name: "Surgery & Allied", icon: "🔧", color: "#8B5CF6" },
  { name: "Gynecology & Obstetrics", icon: "💝", color: "#EC4899" },
  { name: "Ophthalmology", icon: "👁️", color: "#06B6D4" },
  { name: "Radiology (Diagnostic)", icon: "🌐", color: "#10B981" },
  { name: "Psychiatry", icon: "🧠", color: "#F59E0B" },
  { name: "Pathology", icon: "☕", color: "#6366F1" },
  { name: "Anesthesiology", icon: "🔧", color: "#0EA5E9" },
  { name: "ENT (Otorhinolaryngology)", icon: "🎤", color: "#8B5CF6" },
  { name: "Dentistry", icon: "🛡️", color: "#14B8A6" },
  { name: "Community Medicine", icon: "👥", color: "#F97316" },
];

export default function SyllabusPage() {
  return (
    <main className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="orb w-96 h-96 bg-blue-600 top-0 left-[-80px]" style={{ animationDuration: "12s" }} />
        <div className="orb w-80 h-80 bg-violet-700 top-40 right-[-60px]" style={{ animationDuration: "16s", animationDelay: "3s" }} />
        <div className="orb w-64 h-64 bg-cyan-600 bottom-20 left-1/3" style={{ animationDuration: "10s", animationDelay: "6s" }} />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              FCPS <span className="gradient-text">Syllabus</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
              Complete CPSP syllabus and guidelines for all FCPS specialties. Download comprehensive study materials organized by Paper I and Paper II.
            </p>
          </div>
        </div>
      </section>

      {/* Paper I Section */}
      <section className="relative z-10 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              📋 Paper I — Common for All Specialties
            </h2>
            <p className="text-slate-400 text-lg">
              These subjects are examined in Paper I for all FCPS specialties and form the foundation of your exam preparation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PAPER_I_TOPICS.map((topic, idx) => (
              <div
                key={idx}
                className="group rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  borderColor: "rgba(99, 102, 241, 0.3)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                      boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">{topic.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paper II Section */}
      <section className="relative z-10 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-3xl p-10 md:p-14 border"
            style={{
              background: "rgba(15, 23, 42, 0.7)",
              borderColor: "rgba(99, 102, 241, 0.2)",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 flex items-center gap-3">
              🩻 Paper II — Specialty-Specific
            </h2>

            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Paper II covers advanced topics in your chosen specialty. The subjects typically include:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="text-white font-bold mb-2">Anatomy, Histology & Embryology</h3>
                  <p className="text-slate-400">(specialty-focused)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">🧬</div>
                <div>
                  <h3 className="text-white font-bold mb-2">Physiology & Biochemistry</h3>
                  <p className="text-slate-400">Specialty-relevant pathophysiology</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">🔬</div>
                <div>
                  <h3 className="text-white font-bold mb-2">Pathology, Microbiology & Immunology</h3>
                  <p className="text-slate-400">Disease mechanisms and diagnosis</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">💊</div>
                <div>
                  <h3 className="text-white font-bold mb-2">Pharmacology (Clinical Emphasis)</h3>
                  <p className="text-slate-400">Treatment and management</p>
                </div>
              </div>
            </div>

            {/* Important Note Box */}
            <div
              className="rounded-2xl p-8 border-l-4 mb-10"
              style={{
                background: "rgba(59, 130, 246, 0.08)",
                borderLeftColor: "#2563EB",
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            >
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <Zap size={20} className="text-blue-400" />
                Important
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Paper II content varies significantly by specialty. Download your specialty-specific syllabus below to know exactly what to study and focus your preparation efficiently.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
                }}
              >
                <Download size={20} />
                Download Complete Syllabus
              </button>
              <button
                className="px-8 py-4 rounded-2xl text-base font-bold border transition-all duration-300"
                style={{
                  borderColor: "rgba(99, 102, 241, 0.3)",
                  color: "#93C5FD",
                }}
              >
                View Guidelines
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Selection Section */}
      <section className="relative z-10 py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Select Your <span className="gradient-text">Specialty</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Click on your specialty to download the complete CPSP syllabus and guidelines.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPECIALTIES.map((specialty, idx) => (
              <div
                key={idx}
                className="group cursor-pointer rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:scale-105"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  borderColor: "rgba(99, 102, 241, 0.2)",
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:shadow-lg transition-shadow"
                    style={{
                      background: `${specialty.color}20`,
                      border: `2px solid ${specialty.color}40`,
                    }}
                  >
                    {specialty.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    {specialty.name}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: specialty.color,
                      boxShadow: `0 4px 15px ${specialty.color}40`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <Download size={16} />
                    Syllabus
                  </button>
                  <button
                    className="px-6 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      borderColor: specialty.color,
                      color: specialty.color,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${specialty.color}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Download size={16} />
                    Guideline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-12 md:p-16 text-center border"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15))",
              borderColor: "rgba(99, 102, 241, 0.3)",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Ready to Start Your Preparation?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Download the syllabus for your specialty and align your preparation with CPSP guidelines. Master the exam with MedCore.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:shadow-2xl hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
              }}
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-20" />
    </main>
  );
}
