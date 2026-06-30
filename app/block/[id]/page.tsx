"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { useToast } from "@/context/ToastContext";
import type { MCQAnswer, BlockSession } from "@/lib/types";
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

function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return elapsed;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ── progress dots ─────────────────────────────────────────────── */
function ProgressDots({
  total, current, answers,
}: { total: number; current: number; answers: (MCQAnswer | null)[] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const ans = answers[i];
        const isCurrent = i === current;
        const bg = !ans
          ? isCurrent ? "#3B82F6" : "rgba(255,255,255,0.08)"
          : ans.isCorrect ? "#10B981" : "#EF4444";
        return (
          <div
            key={i}
            className="relative"
            title={`Question ${i + 1}`}
          >
            <div
              className="rounded-full transition-all duration-300 flex items-center justify-center text-xs font-bold"
              style={{
                width: isCurrent ? 32 : 24,
                height: isCurrent ? 32 : 24,
                background: bg,
                color: "#fff",
                boxShadow: isCurrent ? "0 0 10px rgba(59,130,246,0.5)" : "none",
                transform: isCurrent ? "scale(1.15)" : "scale(1)",
              }}
            >
              {i + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
export default function BlockQuizPage() {
  const router = useRouter();
  const params = useParams();
  const { info, success, error, warning } = useToast();
  const blockId = params.id as string;
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<(MCQAnswer | null)[]>([]);
  const [mcqTimer, setMcqTimer] = useState(0);
  const sessionTimer = useTimer();

  /* auth guard */
  useEffect(() => {
    if (!localStorage.getItem("medcore_user")) router.push("/login");
  }, [router]);

  /* fetch block from database */
  useEffect(() => {
    async function fetchBlock() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        console.log("Fetching block:", blockId);
        const res = await fetch("/api/blocks", { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        const blocks = data.blocks || [];

        const foundBlock = blocks.find((b: Block) => b.id === blockId);

        if (!foundBlock) {
          console.error("Block not found:", blockId);
          error("Block Not Found", "The quiz block you're looking for doesn't exist");
          setBlock(null);
          setTimeout(() => router.push("/dashboard"), 2000);
          return;
        }

        // Ensure MCQs exist
        if (!foundBlock.mcqs || foundBlock.mcqs.length === 0) {
          console.error("No MCQs found in block:", blockId);
          error("No Questions Found", "This block has no questions. Please try another block");
          setBlock(null);
          setTimeout(() => router.push("/dashboard"), 2000);
          return;
        }

        // Transform database MCQs to expected format
        const transformedMCQs = (foundBlock.mcqs || []).map((dbMcq: any) => {
          const correctIndex = ["a", "b", "c", "d"].indexOf((dbMcq.correct_answer || "a").toLowerCase());
          const explanations = ["", "", ""];

          // Map explanations to their incorrect positions (0, 1, 2)
          if (correctIndex !== 0) explanations[0] = dbMcq.explanation_a || "";
          if (correctIndex !== 1) explanations[1] = dbMcq.explanation_b || "";
          if (correctIndex !== 2) explanations[2] = dbMcq.explanation_c || "";
          if (correctIndex !== 3) explanations[3] = dbMcq.explanation_d || "";

          return {
            id: dbMcq.id,
            caseStudy: dbMcq.case_study || "",
            question: dbMcq.question || "",
            notes: dbMcq.notes || "",
            image: dbMcq.image_url ? {
              type: dbMcq.image_url,
              caption: "Medical Image",
            } : null,
            options: [
              { label: "A", text: dbMcq.option_a || "", explanation: dbMcq.explanation_a || "" },
              { label: "B", text: dbMcq.option_b || "", explanation: dbMcq.explanation_b || "" },
              { label: "C", text: dbMcq.option_c || "", explanation: dbMcq.explanation_c || "" },
              { label: "D", text: dbMcq.option_d || "", explanation: dbMcq.explanation_d || "" },
            ],
            correctIndex,
            explanation: dbMcq.explanation ? {
              correct: dbMcq.explanation,
              incorrect: explanations,
            } : null,
          };
        });

        setBlock({
          ...foundBlock,
          mcqs: transformedMCQs,
        });
      } catch (err: any) {
        console.error("Error fetching block:", err);
        if (err.name === "AbortError") {
          error("Loading Timeout", "The block took too long to load. Please check your connection");
        } else {
          error("Failed to Load", "Could not load the quiz block. Please try again");
        }
        setBlock(null);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    }

    if (blockId) {
      fetchBlock();
    }
  }, [blockId]);

  /* reset when moving to new question */
  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
    setMcqTimer(0);
  }, [currentIdx]);

  /* per-question timer */
  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => setMcqTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [submitted, currentIdx]);

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = useCallback(() => {
    if (selected === null || submitted || !block) return;
    const mcq = block.mcqs[currentIdx];
    const isCorrect = selected === mcq.correctIndex;
    const answer: MCQAnswer = {
      mcqIndex: currentIdx,
      selectedIndex: selected,
      isCorrect,
      timeTakenSeconds: mcqTimer,
    };
    const updated = [...answers];
    updated[currentIdx] = answer;
    setAnswers(updated);
    setSubmitted(true);

    // Toast feedback
    if (isCorrect) {
      success("Correct! 🎉", "Great job! That's the right answer");
    } else {
      warning("Incorrect", "Don't worry, you'll learn from the explanation");
    }
  }, [selected, submitted, block, currentIdx, mcqTimer, answers, success, warning]);

  const handleNext = useCallback(async () => {
    if (!block) return;
    const isLast = currentIdx === block.mcqs.length - 1;

    if (isLast) {
      const finalAnswers = answers.filter(Boolean) as MCQAnswer[];
      const correct = finalAnswers.filter((a) => a.isCorrect).length;
      const score = (correct / block.mcqs.length) * 100;

      // Show completion toast with score
      info(`Quiz Complete! 🎉`, `Your Score: ${score.toFixed(1)}%`);

      const session: BlockSession = {
        id: generateId(),
        blockId: block.id,
        blockTitle: block.title,
        answers: finalAnswers,
        score,
        correctCount: correct,
        totalMcqs: block.mcqs.length,
        completedAt: new Date().toISOString(),
        timeTakenSeconds: sessionTimer,
      };

      /* Get user ID from localStorage */
      const user = localStorage.getItem("medcore_user");
      const userId = user ? JSON.parse(user).id : null;

      /* save to database via API */
      try {
        console.log("Saving session:", { userId, blockId: block.id, score, correctCount: correct });
        const saveRes = await fetch("/api/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId || "",
          },
          body: JSON.stringify(session),
        });

        const saveData = await saveRes.json();
        console.log("Session save response:", saveData);

        if (!saveRes.ok) {
          console.error("Session save failed:", saveData);
          error("Save Failed", "Couldn't save your progress to server. Trying again...");
        } else {
          success("Progress Saved ✓", "Your results have been saved to your dashboard");
        }
      } catch (err) {
        console.error("Session save error:", err);
        warning("Save Error", "Your progress was saved locally but not synced to the server");
      }

      /* also cache in localStorage for review page */
      localStorage.setItem(`medcore_session_${block.id}`, JSON.stringify(session));

      // Delay to ensure data is saved
      await new Promise(resolve => setTimeout(resolve, 1500));

      router.push(`/block/${block.id}/review`);
    } else {
      setCurrentIdx((i) => i + 1);
      info(`Question ${currentIdx + 2} of ${block.mcqs.length}`, "Keep it up!");
    }
  }, [block, currentIdx, answers, sessionTimer, router, info, success, error, warning]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center glass rounded-2xl p-10">
          <p className="text-2xl mb-4">⏳</p>
          <p className="text-white font-semibold mb-2">Loading block...</p>
        </div>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center glass rounded-2xl p-10">
          <p className="text-2xl mb-4">❌</p>
          <p className="text-white font-semibold mb-2">Block not found</p>
          <Link href="/dashboard" className="text-blue-400 text-sm hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!block.mcqs || block.mcqs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center glass rounded-2xl p-10">
          <p className="text-2xl mb-4">📝</p>
          <p className="text-white font-semibold mb-2">No MCQs available in this block</p>
          <Link href="/dashboard" className="text-blue-400 text-sm hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const mcq = block.mcqs[currentIdx];

  // Safety check for MCQ
  if (!mcq) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center glass rounded-2xl p-10">
          <p className="text-2xl mb-4">⚠️</p>
          <p className="text-white font-semibold mb-2">Error loading question</p>
          <Link href="/dashboard" className="text-blue-400 text-sm hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }
  const isLast = currentIdx === block.mcqs.length - 1;
  const progress = ((currentIdx + (submitted ? 1 : 0)) / block.mcqs.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>

      {/* ── top bar ── */}
      <div className="sticky top-0 z-40 border-b border-slate-800/30"
        style={{
          background: "linear-gradient(135deg, rgba(5,11,24,0.98), rgba(15,23,42,0.95))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 group transition-all duration-300">
            <img src="/logo.png" alt="MedCore" className="h-9 w-auto group-hover:opacity-80" />
            <span className="text-white font-bold text-sm hidden sm:inline">MedCore</span>
          </Link>

          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs text-white/70 mb-2">
              <span className="font-medium">Question {currentIdx + 1} of {block.mcqs.length}</span>
              <span className="text-white/60">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(30,27,75,0.5)" }}>
              <div className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)" }} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-700/50"
              style={{ background: "rgba(15,23,42,0.6)" }}>
              <span className="text-white/80 text-lg">⏱️</span>
              <span className="text-white font-mono font-bold">{formatTime(sessionTimer)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-7 page-enter">

        {/* ── block header ── */}
        <div className="flex items-center justify-between flex-wrap gap-6 pb-2">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${block.color} flex items-center justify-center text-2xl shadow-lg`}>
              {block.icon}
            </div>
            <div>
              <p className="text-white font-black text-base">{block.title}</p>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">{block.specialty}</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <ProgressDots total={block.mcqs.length} current={currentIdx} answers={answers} />
          </div>
        </div>

        {/* ── case study & scenario card ── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main case study */}
          <div className="lg:col-span-2 glass rounded-2xl p-7 border border-slate-700/50"
            style={{
              background: "linear-gradient(135deg, rgba(30,27,75,0.4), rgba(15,23,42,0.4))",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.08)"
            }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-3 py-1.5 rounded-full font-semibold text-blue-300"
                style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
                📋 Clinical Scenario
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full font-medium text-white/70"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Q{currentIdx + 1}/{block.mcqs.length}
              </span>
            </div>
            <p className="text-white/90 leading-relaxed text-base mb-4">
              {mcq.caseStudy}
            </p>
            {mcq.question && (
              <div className="border-t border-slate-700/50 pt-4 mt-4">
                <p className="text-xs text-white/60 font-semibold uppercase tracking-wide mb-2">Question</p>
                <p className="text-white text-sm leading-relaxed">
                  {mcq.question}
                </p>
              </div>
            )}
          </div>

          {/* Notes sidebar */}
          {mcq.notes && (
            <div className="glass rounded-2xl p-6 border border-amber-700/50 h-fit"
              style={{
                background: "linear-gradient(135deg, rgba(180,83,9,0.1), rgba(120,53,15,0.05))",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.05)"
              }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-400">📝</span>
                <span className="text-xs px-2 py-1 rounded-full font-semibold text-amber-300"
                  style={{ background: "rgba(180,83,9,0.2)", border: "1px solid rgba(180,83,9,0.3)" }}>
                  Notes
                </span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                {mcq.notes}
              </p>
            </div>
          )}
        </div>

        {/* ── medical image ── */}
        {mcq.image && (
          <div className="max-w-lg mx-auto lg:mx-0">
            <MedicalImage image={mcq.image} />
          </div>
        )}

        {/* ── options ── */}
        <div className="space-y-3">
          <p className="text-xs text-white uppercase tracking-wide font-medium">Select the best answer</p>
          {mcq.options && mcq.options.length > 0 ? mcq.options.map((opt, i) => {
            const isCorrect = i === mcq.correctIndex;
            const isSelected = selected === i;
            const showResult = submitted;

            let stateClass = "";
            let borderColor = "rgba(255,255,255,0.08)";
            let bg = "rgba(255,255,255,0.02)";
            let textColor = "#CBD5E1";
            let labelBg = "rgba(255,255,255,0.08)";

            if (showResult) {
              if (isCorrect) {
                stateClass = "correct";
                borderColor = "#10B981";
                bg = "rgba(16,185,129,0.08)";
                textColor = "#A7F3D0";
                labelBg = "rgba(16,185,129,0.25)";
              } else if (isSelected && !isCorrect) {
                stateClass = "incorrect";
                borderColor = "#EF4444";
                bg = "rgba(239,68,68,0.08)";
                textColor = "#FCA5A5";
                labelBg = "rgba(239,68,68,0.25)";
              }
            } else if (isSelected) {
              stateClass = "selected";
              borderColor = "#3B82F6";
              bg = "rgba(59,130,246,0.10)";
              textColor = "#BAE6FD";
              labelBg = "rgba(59,130,246,0.3)";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={submitted}
                className={`option-btn w-full rounded-xl p-4 flex items-start gap-3 text-left ${stateClass}`}
                style={{ border: `1.5px solid ${borderColor}`, background: bg, transition: "all 0.2s ease" }}
              >
                {/* option label */}
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: labelBg, flexShrink: 0 }}
                >
                  {opt.label}
                </span>
                <span className="text-sm leading-relaxed" style={{ color: textColor }}>
                  {opt.text}
                </span>
                {/* result icons */}
                {showResult && isCorrect && (
                  <span className="ml-auto text-emerald-400 text-lg flex-shrink-0">✓</span>
                )}
                {showResult && isSelected && !isCorrect && (
                  <span className="ml-auto text-red-400 text-lg flex-shrink-0">✗</span>
                )}
              </button>
            );
          }) : (
            <p className="text-white text-sm">No options available</p>
          )}
        </div>

        {/* ── action buttons ── */}
        <div className="flex items-center justify-between gap-6 pt-4 pb-2">
          <div className="text-sm text-white/70 font-medium h-6 flex items-center">
            {!submitted
              ? selected !== null
                ? "🎯 Ready to submit"
                : "👆 Select an answer"
              : submitted && selected === mcq.correctIndex
              ? "✅ Correct! Well done"
              : "❌ Incorrect, try next"}
          </div>
          <div className="flex gap-3">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="px-8 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                style={{
                  background: selected !== null ? "linear-gradient(135deg, #00CED1 0%, #00B5CC 100%)" : "rgba(30,27,75,0.8)",
                  boxShadow: selected !== null ? "0 8px 24px rgba(0,206,209,0.3)" : "0 2px 8px rgba(0,0,0,0.2)"
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                  boxShadow: "0 8px 24px rgba(59,130,246,0.3)"
                }}
              >
                {isLast ? "🎉 Finish Block" : "Next Question →"}
              </button>
            )}
          </div>
        </div>

        {/* ── explanation panel ── */}
        {submitted && mcq.explanation && (
          <div className="space-y-4 page-enter">
            {/* all option explanations */}
            <div className="rounded-2xl p-6 space-y-4"
              style={{ background: "rgba(99,102,241,0.05)", border: "1.5px solid rgba(99,102,241,0.2)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue-400 text-xl">💡</span>
                <span className="text-blue-300 font-bold text-sm">Understanding Each Option</span>
              </div>

              {mcq.options.map((opt, i) => {
                const isCorrect = i === mcq.correctIndex;
                const explanation = opt.explanation || mcq.explanation.incorrect?.[i < mcq.correctIndex ? i : i - 1] ||
                  "This option is not the best answer for this clinical scenario.";

                return (
                  <div
                    key={i}
                    className="rounded-lg p-4 transition-all"
                    style={{
                      background: isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.04)",
                      border: `1px solid ${isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)"}`
                    }}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold"
                          style={{
                            background: isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.1)",
                            color: isCorrect ? "#6EE7B7" : "#FCA5A5"
                          }}>
                          {isCorrect ? "✓" : "✗"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold mb-1.5 ${isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                          Option {opt.label}: {isCorrect ? "(CORRECT)" : "(Incorrect)"}
                        </p>
                        <p className="text-white/90 text-sm leading-relaxed mb-2">
                          {opt.text}
                        </p>
                        <div className="border-t"
                          style={{ borderColor: isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.15)" }}>
                          <p className={`text-xs font-semibold mt-2 mb-1 ${isCorrect ? "text-emerald-400" : "text-orange-400"}`}>
                            {isCorrect ? "Why this is correct:" : "Why this is wrong:"}
                          </p>
                          <p className="text-white/80 text-sm leading-relaxed">
                            {explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
