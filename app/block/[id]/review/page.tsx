"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { BlockSession } from "@/lib/types";
import MedicalImage from "@/components/MedicalImage";

interface Block {
  id: string;
  title: string;
  specialty: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  total_mcqs: number;
  mcqs?: any[];
}

function ScoreCircle({ pct }: { pct: number }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? "#10B981" : pct >= 60 ? "#F59E0B" : "#EF4444";
  const label = pct >= 80 ? "Excellent!" : pct >= 60 ? "Good Work" : "Keep Practicing";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1a2844" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)" }} />
        <text x="70" y="64" textAnchor="middle" fill={color} fontSize="28" fontWeight="800" fontFamily="Inter,sans-serif">{pct}%</text>
        <text x="70" y="86" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="Inter,sans-serif">Score</text>
      </svg>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

export default function BlockReviewPage() {
  const router = useRouter();
  const params = useParams();
  const blockId = params.id as string;
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<BlockSession | null>(null);
  const [expandedMcq, setExpandedMcq] = useState<number | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("medcore_user")) { router.push("/login"); return; }
    const stored = localStorage.getItem(`medcore_session_${blockId}`);
    if (stored) setSession(JSON.parse(stored));
  }, [blockId, router]);

  useEffect(() => {
    async function fetchBlock() {
      try {
        const res = await fetch("/api/blocks");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        const blocks = data.blocks || [];
        const foundBlock = blocks.find((b: Block) => b.id === blockId);

        if (!foundBlock) {
          setBlock(null);
          return;
        }

        const transformedMCQs = (foundBlock.mcqs || []).map((dbMcq: any) => {
          return {
            id: dbMcq.id,
            caseStudy: dbMcq.case_study || "",
            image: dbMcq.image_url ? {
              type: dbMcq.image_url,
              caption: "Medical Image",
            } : null,
            options: [
              { label: "A", text: dbMcq.option_a || "" },
              { label: "B", text: dbMcq.option_b || "" },
              { label: "C", text: dbMcq.option_c || "" },
              { label: "D", text: dbMcq.option_d || "" },
            ],
            correctIndex: ["a", "b", "c", "d"].indexOf((dbMcq.correct_answer || "a").toLowerCase()),
            explanation: dbMcq.explanation ? {
              correct: dbMcq.explanation,
              incorrect: ["", "", ""],
            } : null,
          };
        });

        setBlock({
          ...foundBlock,
          mcqs: transformedMCQs,
        });
      } catch (err) {
        console.error("Error fetching block:", err);
        setBlock(null);
      } finally {
        setLoading(false);
      }
    }

    if (blockId) {
      fetchBlock();
    }
  }, [blockId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center glass rounded-2xl p-10">
          <p className="text-2xl mb-4">⏳</p>
          <p className="text-white font-semibold mb-2">Loading review...</p>
        </div>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-2xl mb-4">❌</p>
          <p className="text-white mb-4">Block not found.</p>
          <Link href="/dashboard" className="text-blue-400 text-sm hover:underline">← Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-2xl mb-3">⚠️</p>
          <p className="text-white font-semibold mb-2">No session found for this block</p>
          <p className="text-white text-sm mb-6">You need to complete the block first to see the review.</p>
          <Link href={`/block/${blockId}`}
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}>
            Start Block →
          </Link>
        </div>
      </div>
    );
  }

  const score = Math.round(session.score);
  const timeMins = Math.floor(session.timeTakenSeconds / 60);
  const timeSecs = session.timeTakenSeconds % 60;
  const avgTime = Math.round(session.timeTakenSeconds / block.mcqs.length);

  return (
    <div className="min-h-screen page-enter" style={{ background: "#050B18" }}>

      {/* ── top bar ── */}
      <div className="sticky top-0 z-40 border-b border-slate-800/50"
        style={{ background: "rgba(5,11,24,0.95)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          <Link href="/dashboard" className="flex items-center gap-3 text-white hover:text-white transition-colors">
            <img src="/logo.png" alt="MedCore" className="h-10 w-auto" />
            <span className="text-white font-bold text-sm hidden sm:inline">MedCore</span>
          </Link>
          <span className="text-white font-semibold text-sm">{block.title} — Review</span>
          <Link href={`/block/${blockId}`}
            className="text-xs px-3 py-1.5 rounded-lg text-blue-400 border border-blue-500/30 hover:border-blue-400 transition-colors">
            Retake
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* ── score summary card ── */}
        <div className={`bg-gradient-to-r ${block.color} rounded-3xl p-8 relative overflow-hidden`}>
          <div className="absolute inset-0"
            style={{ backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.15), transparent 60%)" }} />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">

            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                <span className="text-3xl">{block.icon}</span>
                <span className="text-white/70 text-sm">{block.specialty}</span>
              </div>
              <h1 className="text-2xl font-black text-white mb-4">{block.title}</h1>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Correct", value: `${session.correctCount}/${block.mcqs.length}`, color: "#A7F3D0" },
                  { label: "Incorrect", value: `${block.mcqs.length - session.correctCount}/${block.mcqs.length}`, color: "#FCA5A5" },
                  { label: "Time Taken", value: `${timeMins}m ${timeSecs}s`, color: "#BAE6FD" },
                  { label: "Avg/Question", value: `${avgTime}s`, color: "#DDD6FE" },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl"
                    style={{ background: "rgba(0,0,0,0.2)" }}>
                    <p className="text-xs text-white/60 mb-0.5">{s.label}</p>
                    <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <ScoreCircle pct={score} />
          </div>
        </div>

        {/* ── MCQ answer strip (mini overview) ── */}
        <div className="glass rounded-2xl p-5">
          <p className="text-xs text-white uppercase tracking-wide mb-4">Question Overview</p>
          <div className="flex flex-wrap gap-3">
            {session.answers.map((ans, i) => (
              <button
                key={i}
                onClick={() => setExpandedMcq(expandedMcq === i ? null : i)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: ans.isCorrect ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1.5px solid ${ans.isCorrect ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                  color: ans.isCorrect ? "#6EE7B7" : "#FCA5A5",
                }}
              >
                {ans.isCorrect ? "✓" : "✗"} Q{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* ── detailed answer cards ── */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">Detailed Answer Review</h2>

          {block.mcqs.map((mcq, i) => {
            const ans = session.answers[i];
            if (!ans) return null;
            const isExpanded = expandedMcq === i || expandedMcq === null;

            return (
              <div key={mcq.id} className="glass rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${ans.isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>

                {/* ── question header ── */}
                <button
                  onClick={() => setExpandedMcq(expandedMcq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{
                        background: ans.isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                        color: ans.isCorrect ? "#6EE7B7" : "#FCA5A5",
                      }}>
                      {i + 1}
                    </span>
                    <span className="text-white text-sm font-medium truncate pr-4">
                      {mcq.caseStudy.slice(0, 80)}…
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        background: ans.isCorrect ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                        color: ans.isCorrect ? "#6EE7B7" : "#FCA5A5",
                        border: `1px solid ${ans.isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                      }}>
                      {ans.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                    <svg
                      className="w-4 h-4 text-white transition-transform"
                      style={{ transform: expandedMcq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* ── expanded content ── */}
                {(expandedMcq === i || expandedMcq === null) && (
                  <div className="border-t border-slate-800/60 p-5 space-y-5">

                    {/* case study */}
                    <div>
                      <p className="text-xs text-white uppercase tracking-wide mb-2">Clinical Scenario</p>
                      <p className="text-white text-sm leading-relaxed">{mcq.caseStudy}</p>
                    </div>

                    {/* image */}
                    {mcq.image && (
                      <div className="max-w-sm">
                        <MedicalImage image={mcq.image} />
                      </div>
                    )}

                    {/* all options — color coded */}
                    <div>
                      <p className="text-xs text-white uppercase tracking-wide mb-3">All Options</p>
                      <div className="space-y-2">
                        {mcq.options.map((opt, oi) => {
                          const isCorrectOpt = oi === mcq.correctIndex;
                          const isSelectedOpt = oi === ans.selectedIndex;
                          const isWrongSelected = isSelectedOpt && !isCorrectOpt;

                          let borderCol = "rgba(255,255,255,0.06)";
                          let bgCol = "rgba(255,255,255,0.02)";
                          let textCol = "#64748B";
                          let labelBg = "rgba(255,255,255,0.06)";
                          let labelColor = "#475569";
                          let icon = null as string | null;

                          if (isCorrectOpt) {
                            borderCol = "#10B981";
                            bgCol = "rgba(16,185,129,0.08)";
                            textCol = "#A7F3D0";
                            labelBg = "rgba(16,185,129,0.2)";
                            labelColor = "#6EE7B7";
                            icon = "✓";
                          } else if (isWrongSelected) {
                            borderCol = "#EF4444";
                            bgCol = "rgba(239,68,68,0.08)";
                            textCol = "#FCA5A5";
                            labelBg = "rgba(239,68,68,0.2)";
                            labelColor = "#FCA5A5";
                            icon = "✗";
                          }

                          return (
                            <div key={oi} className="flex items-start gap-3 p-3.5 rounded-xl"
                              style={{ border: `1.5px solid ${borderCol}`, background: bgCol }}>
                              <span className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                                style={{ background: labelBg, color: labelColor }}>
                                {opt.label}
                              </span>
                              <span className="text-sm flex-1" style={{ color: textCol }}>{opt.text}</span>
                              {icon && (
                                <span className="flex-shrink-0 text-base font-bold"
                                  style={{ color: isCorrectOpt ? "#10B981" : "#EF4444" }}>
                                  {icon}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* explanations */}
                    <div className="space-y-4">
                      {/* correct explanation */}
                      <div className="rounded-xl p-4"
                        style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                        <p className="text-emerald-300 font-semibold text-xs mb-2 flex items-center gap-1.5">
                          ✅ Why {mcq.options[mcq.correctIndex].label} is correct
                        </p>
                        <p className="text-white text-sm leading-relaxed">{mcq.explanation.correct}</p>
                      </div>

                      {/* wrong explanations */}
                      <div className="rounded-xl p-4 space-y-4"
                        style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
                        <p className="text-red-300 font-semibold text-xs flex items-center gap-1.5">
                          ❌ Why the other options are wrong
                        </p>
                        {mcq.options.map((opt, oi) => {
                          if (oi === mcq.correctIndex) return null;
                          const explIdx = oi < mcq.correctIndex ? oi : oi - 1;
                          return (
                            <div key={oi} className="border-t border-red-900/30 pt-3 first:border-0 first:pt-0">
                              <p className="text-red-300/80 text-xs font-semibold mb-1">
                                Option {opt.label}: {opt.text}
                              </p>
                              <p className="text-white text-sm leading-relaxed">
                                {mcq.explanation.incorrect[explIdx] ?? "This option is not the best choice for this clinical scenario."}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── CTA ── */}
        <div className="flex flex-col sm:flex-row gap-4 pb-8">
          <Link href="/dashboard"
            className="flex-1 py-3.5 rounded-2xl text-center font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}>
            ← Back to Dashboard
          </Link>
          <Link href={`/block/${blockId}`}
            className="flex-1 py-3.5 rounded-2xl text-center font-semibold transition-all hover:scale-[1.02]"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8" }}>
            Retake This Block
          </Link>
        </div>
      </div>
    </div>
  );
}
