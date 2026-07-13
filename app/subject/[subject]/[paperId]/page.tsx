"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SubSubject {
  id: string;
  name: string;
  description: string;
  order_index: number;
}

interface Block {
  id: string;
  title: string;
  specialty: string;
}

export default function SubSubjectsPage() {
  const router = useRouter();
  const params = useParams();
  const [subSubjects, setSubSubjects] = useState<SubSubject[]>([]);
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);

  const subjectId = params.subject as string;
  const paperId = params.paperId as string;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/blocks");
        const data = await res.json();
        const blocks = data.blocks || [];

        // Find block by ID or title
        let foundBlock = blocks.find((b: Block) => b.id === subjectId);
        if (!foundBlock) {
          const searchName = subjectId.toLowerCase().replace("-", " ");
          foundBlock = blocks.find((b: Block) =>
            b.title.toLowerCase().includes(searchName)
          );
        }

        if (foundBlock) {
          setBlock(foundBlock);

          // Fetch sub-subjects for this block
          const subRes = await fetch(`/api/blocks/${foundBlock.id}/sub-subjects`);
          const subData = await subRes.json();
          setSubSubjects(subData.sub_subjects || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (!block) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center">
          <p className="text-white text-xl">Block not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* ── Top Navigation ── */}
      <div className="sticky top-0 z-40 border-b border-slate-800/30"
        style={{
          background: "linear-gradient(135deg, rgba(5,11,24,0.98), rgba(15,23,42,0.95))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-center">
          <Link href="/" className="group transition-all duration-300">
            <img src="/logo.png" alt="MedCore" className="h-10 w-auto group-hover:opacity-80" />
          </Link>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* ── Header Section ── */}
        <div className="mb-12 md:mb-16">
          <div className="text-center md:text-left mb-4">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">Select Sub-Topic</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight">
              {block.title}
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl">
              Choose a sub-topic to begin your focused study session. Each sub-topic contains carefully curated MCQs.
            </p>
          </div>
        </div>

        {/* ── Sub-Subjects Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {subSubjects.length > 0 ? (
            subSubjects.map((subSubject, idx) => (
              <Link
                key={subSubject.id}
                href={`/subject/${subjectId}/${paperId}/${subSubject.id}`}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                style={{
                  animation: `fade-in 0.6s ease ${idx * 0.08}s forwards`,
                  opacity: 0,
                }}
              >
                {/* ── Card Background ── */}
                <div
                  className="absolute inset-0 transition-all duration-300 group-hover:opacity-20 opacity-15"
                  style={{ background: "#06B6D4" }}
                />

                {/* ── Glassmorphism Card ── */}
                <div
                  className="relative p-7 md:p-8 h-full border backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl rounded-2xl flex flex-col"
                  style={{
                    background: "linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,27,75,0.3))",
                    borderColor: "rgba(6,182,212,0.4)",
                    borderWidth: "1.5px",
                    boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.08), 0 0 30px rgba(6,182,212,0.1)`,
                  }}
                >
                  {/* ── Sub-Subject Icon ── */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0 text-3xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(6,182,212,0.1))",
                      border: "2px solid rgba(6,182,212,0.4)",
                      boxShadow: `0 8px 24px rgba(6,182,212,0.15)`,
                    }}
                  >
                    📚
                  </div>

                  {/* ── Sub-Subject Title ── */}
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 leading-tight">
                    {subSubject.name}
                  </h3>

                  {/* ── Description ── */}
                  {subSubject.description && (
                    <p className="text-white/70 text-sm leading-relaxed mb-6 flex-grow">
                      {subSubject.description}
                    </p>
                  )}

                  {/* ── Action Button ── */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white font-semibold text-sm">Start Quiz</span>
                    <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-white/70 text-lg">No sub-topics available yet.</p>
            </div>
          )}
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
