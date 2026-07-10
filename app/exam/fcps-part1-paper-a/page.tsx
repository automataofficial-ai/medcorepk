"use client";

import { useRouter } from "next/navigation";
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

const PAPER_ID = "fcps-part1-paper-a";

export default function FCPSPart1PaperAPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* ── Header Section ── */}
        <div className="mb-12 md:mb-16">
          <div className="text-center md:text-left mb-4">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">Select Your Subject</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight">
              FCPS Part 1 - Paper A
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl">
              Choose a medical subject to begin your focused study session. Each subject contains carefully curated MCQs aligned with the CPSP syllabus.
            </p>
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
              onClick={() => router.push(`/subject/${subject.id}/${PAPER_ID}`)}
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
                <p className="text-white/70 text-sm leading-relaxed mb-6 flex-grow">
                  {subject.description}
                </p>

                {/* ── Action Button ── */}
                <button
                  onClick={() => router.push(`/block/${subject.id}`)}
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
