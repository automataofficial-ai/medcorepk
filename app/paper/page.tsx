"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen, Clock, Zap } from "lucide-react";

interface Paper {
  id: string;
  title: string;
  description: string;
  color: string;
  duration: string;
  difficulty: string;
  icon: React.ReactNode;
}

const PAPERS: Paper[] = [
  {
    id: "1",
    title: "FCPS Part 1 - Mock Paper",
    description: "Complete mock exam covering all FCPS Part 1 subjects. Contains 7 subjects with 315 topics and 3,710 MCQs.",
    color: "#3B82F6",
    duration: "3 hours",
    difficulty: "Medium",
    icon: <BookOpen size={32} />,
  },
  {
    id: "2",
    title: "FCPS Part 2 - Mock Paper",
    description: "Advanced mock exam for FCPS Part 2. Covers clinical subjects with emphasis on practical scenarios.",
    color: "#8B5CF6",
    duration: "4 hours",
    difficulty: "Hard",
    icon: <Zap size={32} />,
  },
  {
    id: "3",
    title: "FCPS Part 1 - Practice Set A",
    description: "Additional practice set for FCPS Part 1. Focus on challenging topics and weak areas.",
    color: "#10B981",
    duration: "2.5 hours",
    difficulty: "Medium",
    icon: <BookOpen size={32} />,
  },
];

export default function PapersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "#050B18" }}>
      {/* ── Background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 top-[-80px] left-[-80px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute w-80 h-80 bg-violet-700 rounded-full blur-3xl opacity-20 top-40 right-[-60px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
      </div>

      {/* ── Navigation ── */}
      <div className="sticky top-0 z-40 border-b border-slate-800/30"
        style={{
          background: "linear-gradient(135deg, rgba(5,11,24,0.98), rgba(15,23,42,0.95))",
          backdropFilter: "blur(20px)",
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="group transition-all duration-300">
              <img src="/logo.png" alt="MedCore" className="h-10 w-auto group-hover:opacity-80" />
            </Link>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* ── Header ── */}
        <div className="mb-12 md:mb-16">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">FCPS Exam Papers</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Mock Exam Papers
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl">
            Choose from our collection of comprehensive mock papers. Each paper is designed to simulate real exam conditions and help you prepare effectively.
          </p>
        </div>

        {/* ── Papers Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {PAPERS.map((paper, idx) => (
            <div
              key={paper.id}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              style={{
                animation: `fade-in 0.6s ease ${idx * 0.1}s forwards`,
                opacity: 0,
              }}
              onClick={() => router.push(`/paper/${paper.id}`)}
            >
              {/* ── Card Background ── */}
              <div
                className="absolute inset-0 transition-all duration-300 group-hover:opacity-20 opacity-15"
                style={{ background: `${paper.color}` }}
              />

              {/* ── Glassmorphism Card ── */}
              <div
                className="relative p-7 md:p-8 h-full border backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl rounded-2xl flex flex-col"
                style={{
                  background: "linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,27,75,0.3))",
                  borderColor: `${paper.color}40`,
                  borderWidth: "1.5px",
                  boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.08), 0 0 30px ${paper.color}10`,
                }}
              >
                {/* ── Icon ── */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${paper.color}25, ${paper.color}10)`,
                    color: paper.color,
                    border: `2px solid ${paper.color}40`,
                    boxShadow: `0 8px 24px ${paper.color}15`,
                  }}
                >
                  {paper.icon}
                </div>

                {/* ── Title ── */}
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 leading-tight">
                  {paper.title}
                </h3>

                {/* ── Description ── */}
                <p className="text-white/70 text-sm leading-relaxed mb-6 flex-grow">
                  {paper.description}
                </p>

                {/* ── Button ── */}
                <button
                  onClick={() => router.push(`/exam/${paper.id === "1" ? "fcps-part1-paper-a" : "fcps-part1-paper-b"}`)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${paper.color}, ${paper.color}dd)`,
                    boxShadow: `0 8px 24px ${paper.color}30`,
                  }}
                >
                  <span>Start Paper</span>
                  <ChevronRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Animations ── */}
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

        .glass {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}
