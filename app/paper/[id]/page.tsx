"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Microscope, Heart, Beaker, AlertCircle, Biohazard, Pill, Globe } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  topics: number;
  mcqs: number;
}

const SUBJECTS: Subject[] = [
  {
    id: "anatomy",
    name: "Anatomy & Histology",
    icon: <Microscope size={32} />,
    description: "Study human body structures and microscopic tissue organization. Master anatomical landmarks and histological identification.",
    color: "#3B82F6",
    topics: 45,
    mcqs: 520,
  },
  {
    id: "physiology",
    name: "Physiology",
    icon: <Heart size={32} />,
    description: "Understand how body systems function. From cellular mechanisms to organ system integration and homeostasis.",
    color: "#EF4444",
    topics: 38,
    mcqs: 480,
  },
  {
    id: "biochemistry",
    name: "Biochemistry",
    icon: <Beaker size={32} />,
    description: "Master molecular processes and metabolic pathways. Essential for understanding drug mechanisms and disease processes.",
    color: "#F59E0B",
    topics: 42,
    mcqs: 510,
  },
  {
    id: "pathology",
    name: "Pathology",
    icon: <AlertCircle size={32} />,
    description: "Learn disease mechanisms, cellular injury, and tissue responses. Foundation for clinical diagnosis and management.",
    color: "#8B5CF6",
    topics: 50,
    mcqs: 580,
  },
  {
    id: "microbiology",
    name: "Microbiology",
    icon: <Biohazard size={32} />,
    description: "Study infectious agents including bacteria, viruses, fungi, and parasites. Clinical microbiology and infection control.",
    color: "#06B6D4",
    topics: 40,
    mcqs: 490,
  },
  {
    id: "pharmacology",
    name: "Pharmacology",
    icon: <Pill size={32} />,
    description: "Comprehensive drug knowledge including mechanisms, uses, side effects, and interactions. Critical for clinical practice.",
    color: "#10B981",
    topics: 55,
    mcqs: 620,
  },
  {
    id: "community-medicine",
    name: "Community Medicine",
    icon: <Globe size={32} />,
    description: "Public health, epidemiology, and preventive medicine. Understand population health and disease prevention strategies.",
    color: "#EC4899",
    topics: 35,
    mcqs: 420,
  },
];

export default function PaperSubjectsPage() {
  const params = useParams();
  const router = useRouter();
  const paperId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [paperTitle, setPaperTitle] = useState("FCPS Mock Paper");

  useEffect(() => {
    // Simulate loading paper details
    const timer = setTimeout(() => {
      setPaperTitle(`FCPS Mock Paper ${paperId || "1"}`);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [paperId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center glass rounded-2xl p-10">
          <p className="text-2xl mb-4">⏳</p>
          <p className="text-white font-semibold mb-2">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "#050B18" }}>
      {/* ── Static orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 top-[-80px] left-[-80px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute w-80 h-80 bg-violet-700 rounded-full blur-3xl opacity-20 top-40 right-[-60px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
        <div className="absolute w-72 h-72 bg-cyan-600 rounded-full blur-3xl opacity-20 bottom-20 left-1/3 animate-pulse" style={{ animationDuration: "9s", animationDelay: "4s" }} />
      </div>

      {/* ── Top Navigation ── */}
      <div className="sticky top-0 z-40 border-b border-slate-800/30"
        style={{
          background: "linear-gradient(135deg, rgba(5,11,24,0.98), rgba(15,23,42,0.95))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="group transition-all duration-300">
              <img src="/logo.png" alt="MedCore" className="h-10 w-auto group-hover:opacity-80" />
            </Link>
            <div className="hidden sm:block">
              <p className="text-white/60 text-sm">←</p>
              <p className="text-white font-bold text-sm">Back to Dashboard</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* ── Header Section ── */}
        <div className="mb-12 md:mb-16">
          <div className="text-center md:text-left mb-4">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">Select Your Subject</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight">
              {paperTitle}
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl">
              Choose a medical subject to begin your focused study session. Each subject contains carefully curated MCQs aligned with the CPSP syllabus.
            </p>
          </div>

          {/* ── Stats Bar ── */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-8 md:mt-10">
            <div className="glass rounded-xl p-4 text-center border border-slate-700/50"
              style={{
                background: "rgba(15,23,42,0.4)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
              }}>
              <p className="text-2xl font-black text-cyan-400">{SUBJECTS.length}</p>
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide mt-1">Subjects</p>
            </div>
            <div className="glass rounded-xl p-4 text-center border border-slate-700/50"
              style={{
                background: "rgba(15,23,42,0.4)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
              }}>
              <p className="text-2xl font-black text-cyan-400">{SUBJECTS.reduce((sum, s) => sum + s.topics, 0)}</p>
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide mt-1">Topics</p>
            </div>
            <div className="glass rounded-xl p-4 text-center border border-slate-700/50"
              style={{
                background: "rgba(15,23,42,0.4)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
              }}>
              <p className="text-2xl font-black text-cyan-400">{SUBJECTS.reduce((sum, s) => sum + s.mcqs, 0)}</p>
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide mt-1">MCQs</p>
            </div>
          </div>
        </div>

        {/* ── Subjects Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {SUBJECTS.map((subject, idx) => (
            <div
              key={subject.id}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              style={{
                animation: `fade-in 0.6s ease ${idx * 0.08}s forwards`,
                opacity: 0,
              }}
              onClick={() => router.push(`/subject/${subject.id}/${paperId}`)}
            >
              {/* ── Card Background ── */}
              <div
                className="absolute inset-0 transition-all duration-300 group-hover:opacity-20 opacity-15"
                style={{ background: `${subject.color}` }}
              />

              {/* ── Glassmorphism Card ── */}
              <div
                className="relative p-7 md:p-8 h-full border backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl rounded-2xl flex flex-col"
                style={{
                  background: "linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,27,75,0.3))",
                  borderColor: `${subject.color}40`,
                  borderWidth: "1.5px",
                  boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.08), 0 0 30px ${subject.color}10`,
                }}
              >
                {/* ── Subject Icon ── */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${subject.color}25, ${subject.color}10)`,
                    color: subject.color,
                    border: `2px solid ${subject.color}40`,
                    boxShadow: `0 8px 24px ${subject.color}15`,
                  }}
                >
                  {subject.icon}
                </div>

                {/* ── Subject Title ── */}
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 leading-tight">
                  {subject.name}
                </h3>

                {/* ── Description ── */}
                <p className="text-white/70 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {subject.description}
                </p>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">📚 Topics:</span>
                    <span className="text-sm font-bold text-cyan-400">{subject.topics}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">❓ MCQs:</span>
                    <span className="text-sm font-bold text-cyan-400">{subject.mcqs}</span>
                  </div>
                </div>

                {/* ── Action Button ── */}
                <button
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)`,
                    boxShadow: `0 8px 24px ${subject.color}30`,
                  }}
                >
                  <span>Start Learning</span>
                  <ChevronRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer Section ── */}
        <div className="mt-16 md:mt-20 pt-12 border-t border-slate-700/30">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h4 className="text-white font-black text-lg mb-3">How to Use</h4>
              <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                <li>✓ Select a subject to view all topics</li>
                <li>✓ Practice MCQs organized by difficulty</li>
                <li>✓ Track your progress with detailed analytics</li>
                <li>✓ Review explanations for each answer</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-lg mb-3">Pro Tips</h4>
              <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                <li>💡 Focus on weak areas first for maximum improvement</li>
                <li>💡 Regular practice improves retention and speed</li>
                <li>💡 Review incorrect answers thoroughly</li>
                <li>💡 Use analytics to track improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .glass {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}
