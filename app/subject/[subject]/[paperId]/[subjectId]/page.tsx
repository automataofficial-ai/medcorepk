"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock } from "lucide-react";

interface MCQ {
  id: string;
  question: string;
  case_study: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e?: string;
  correct_answer: string;
  explanation_a: string;
  explanation_b: string;
  explanation_c: string;
  explanation_d: string;
  explanation_e?: string;
  image_url?: string;
  is_fcps_pearl?: boolean;
  difficulty_level?: string;
  references?: string;
  fcps_pearl_content?: string;
}

interface SubSubject {
  id: string;
  name: string;
  block_id: string;
  block_title: string;
}

function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const subSubjectId = params.subjectId as string;
  const modeParam = searchParams.get("mode") as "tutor" | "timed" | null;

  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [subSubject, setSubSubject] = useState<SubSubject | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});
  const [timer, setTimer] = useState(0);
  const [mode, setMode] = useState<"tutor" | "timed">("tutor");
  const [finished, setFinished] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const difficultyColors: Record<string, string> = {
    easy: "#10B981",
    medium: "#F59E0B",
    hard: "#EF4444",
  };

  useEffect(() => {
    if (modeParam) {
      setMode(modeParam);
    }
  }, [modeParam]);

  useEffect(() => {
    if (!localStorage.getItem("medcore_user")) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/sub-subjects/${subSubjectId}`);
        const data = await res.json();
        setSubSubject(data.sub_subject);
        setMcqs(data.mcqs || []);
        setAnswers({});
      } catch (err) {
        console.error("Error loading quiz:", err);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subSubjectId, router]);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!mcqs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <p className="text-white text-xl">No questions available</p>
      </div>
    );
  }

  // Timed Mode Results Screen
  if (finished && mode === "timed") {
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const percentage = mcqs.length > 0 ? Math.round((correctCount / mcqs.length) * 100) : 0;

    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center max-w-2xl px-4">
          <div className="mb-8">
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="6" />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={percentage >= 60 ? "#10B981" : percentage >= 40 ? "#F59E0B" : "#EF4444"}
                  strokeWidth="6"
                  strokeDasharray={`${(percentage / 100) * 565} 565`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 1s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-6xl font-black text-white">{percentage}%</p>
                <p className="text-white/70 text-sm mt-1">Score</p>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mb-4">Quiz Completed!</h2>
          <p className="text-white/70 text-lg mb-8">
            You answered <span className="text-cyan-400 font-bold">{correctCount} out of {mcqs.length}</span> questions correctly.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentMcq = mcqs[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / mcqs.length) * 100);

  const options = [
    { key: "a", label: "A", text: currentMcq.option_a },
    { key: "b", label: "B", text: currentMcq.option_b },
    { key: "c", label: "C", text: currentMcq.option_c },
    { key: "d", label: "D", text: currentMcq.option_d },
    ...(currentMcq.option_e ? [{ key: "e", label: "E", text: currentMcq.option_e }] : []),
  ];

  const triggerConfetti = () => {
    // Create confetti particles
    const confettiPieces = 30;
    const colors = ["#06B6D4", "#10B981", "#3B82F6", "#F59E0B", "#EC4899"];

    for (let i = 0; i < confettiPieces; i++) {
      const confetti = document.createElement("div");
      const size = Math.random() * 8 + 4;
      const duration = Math.random() * 2 + 2.5;
      const delay = Math.random() * 0.3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rotation = Math.random() * 360;

      confetti.style.position = "fixed";
      confetti.style.pointerEvents = "none";
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";
      confetti.style.backgroundColor = color;
      confetti.style.borderRadius = "50%";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "-10px";
      confetti.style.opacity = "1";
      confetti.style.zIndex = "9999";

      document.body.appendChild(confetti);

      const startX = parseFloat(confetti.style.left);
      const startY = 0;
      const velocityX = (Math.random() - 0.5) * 8;
      const velocityY = Math.random() * 5 + 3;

      let frame = 0;
      const totalFrames = (duration * 60) / 1000;

      const animate = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;

        if (progress > 1) {
          clearInterval(animate);
          confetti.remove();
          return;
        }

        const y = startY + velocityY * frame - (frame * frame * 0.05);
        const x = startX + velocityX * frame;

        confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rotation + frame * 8}deg)`;
        confetti.style.opacity = String(1 - progress);
      }, 16);
    }
  };

  const handleCheckAnswer = () => {
    if (!selected) return;
    const isCorrect = selected === currentMcq.correct_answer.toLowerCase();
    setAnswers({ ...answers, [currentIdx]: { selected, correct: isCorrect } });
    setSubmitted(true);

    if (isCorrect) {
      setShowCongrats(true);
      triggerConfetti();
      setTimeout(() => setShowCongrats(false), 2000);
    }
  };

  const handleNext = () => {
    if (currentIdx < mcqs.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      handleFinish();
    }
  };


  const handleFinish = async () => {
    const user = JSON.parse(localStorage.getItem("medcore_user") || "{}");
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const score = mcqs.length > 0 ? (correctCount / mcqs.length) * 100 : 0;

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          block_id: subSubject?.block_id,
          sub_subject_id: subSubjectId,
          total_mcqs: mcqs.length,
          correct_count: correctCount,
          incorrect_count: mcqs.length - correctCount,
          score,
          time_taken_seconds: timer,
        }),
      });

      if (res.ok) {
        window.dispatchEvent(new Event("sessionCompleted"));
        if (mode === "timed") {
          setFinished(true);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error("Error saving quiz:", err);
    }
  };

  const diffColor = difficultyColors[currentMcq.difficulty_level?.toLowerCase() || "medium"];

  return (
    <div className="flex min-h-screen" style={{ background: "#050B18" }}>
      {/* LEFT SIDEBAR */}
      <div className="w-80 border-r border-slate-800/50 p-8 flex flex-col" style={{ background: "rgba(15,23,42,0.4)" }}>
        <div className="mb-8 flex flex-col items-center">
          <div className="relative w-28 h-28 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#EF4444"
                strokeWidth="8"
                strokeDasharray={(progress / 100) * 2 * Math.PI * 54 + " " + 2 * Math.PI * 54}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-black text-white">{progress}%</p>
            </div>
          </div>
          <p className="text-white/60 text-xs uppercase tracking-wider text-center">
            {answeredCount} of {mcqs.length} Answered
          </p>
        </div>

        <button className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white font-semibold mb-8 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
          📋 Summary
        </button>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-3">
            {mcqs.map((_, idx) => {
              const isAnswered = idx in answers;
              const isCurrent = idx === currentIdx;
              const isCorrect = answers[idx]?.correct;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isCurrent || isAnswered || idx === 0) {
                      setCurrentIdx(idx);
                      setSelected(null);
                      setSubmitted(false);
                    }
                  }}
                  disabled={!isCurrent && !isAnswered && idx !== 0}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all disabled:cursor-not-allowed"
                  style={{
                    background: isCurrent
                      ? "#3B82F6"
                      : isAnswered
                      ? isCorrect
                        ? "rgba(16,185,129,0.3)"
                        : "rgba(239,68,68,0.3)"
                      : "rgba(99,102,241,0.2)",
                    color: isCurrent || isAnswered ? "#fff" : "rgba(255,255,255,0.5)",
                    border: isCurrent ? "2px solid #3B82F6" : "1px solid rgba(99,102,241,0.3)",
                    opacity: (!isCurrent && !isAnswered && idx !== 0) ? 0.4 : 1,
                  }}
                >
                  {isAnswered && !isCurrent ? (isCorrect ? "✓" : "✗") : idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-slate-800/50 px-8 py-4 flex items-center justify-between" style={{ background: "rgba(15,23,42,0.3)" }}>
          <Link href="/" className="text-white/70 hover:text-white transition-colors font-semibold">
            ← Back
          </Link>
          {mode === "timed" && (
            <div className="flex items-center gap-3 text-white">
              <Clock size={18} />
              <span className="font-mono text-sm font-semibold">{formatTime(timer)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 flex gap-8" style={{ animation: "fadeIn 0.3s ease-in" }}>
          <div className="flex-1 max-w-3xl">
            {/* Question Header */}
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4">Question {currentIdx + 1}</p>

            {/* Question Text */}
            <h2 className="text-xl font-semibold text-white mb-2">{currentMcq.question}</h2>
            <p className="text-white/60 text-sm mb-8">Choose the single best answer.</p>

            {/* Case Study */}
            {currentMcq.case_study && (
              <div
                className="rounded-xl p-5 mb-8"
                style={{
                  background: "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.03))",
                  border: "1px solid rgba(6,182,212,0.25)",
                }}
              >
                <p className="text-white/90 text-base leading-relaxed">{currentMcq.case_study}</p>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3 mb-8">
              {options.map((opt) => {
                const isSelected = selected === opt.key;
                const isCorrect = opt.key === currentMcq.correct_answer.toLowerCase();
                const showResult = submitted && (isSelected || isCorrect);

                return (
                  <button
                    key={opt.key}
                    onClick={() => !submitted && setSelected(opt.key)}
                    disabled={submitted}
                    className="w-full text-left p-5 rounded-xl border-2 transition-all"
                    style={{
                      background: showResult
                        ? isCorrect
                          ? "rgba(16,185,129,0.08)"
                          : isSelected
                          ? "rgba(239,68,68,0.08)"
                          : "rgba(30,27,75,0.3)"
                        : isSelected
                        ? "rgba(59,130,246,0.12)"
                        : "rgba(30,27,75,0.3)",
                      borderColor: showResult
                        ? isCorrect
                          ? "rgba(16,185,129,0.4)"
                          : isSelected
                          ? "rgba(239,68,68,0.4)"
                          : "rgba(99,102,241,0.15)"
                        : isSelected
                        ? "rgba(59,130,246,0.5)"
                        : "rgba(99,102,241,0.15)",
                      cursor: submitted ? "not-allowed" : "pointer",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm"
                        style={{
                          borderColor: isSelected ? "#3B82F6" : "rgba(99,102,241,0.4)",
                          background: isSelected ? "#3B82F6" : "transparent",
                          color: isSelected ? "white" : "transparent",
                        }}
                      >
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-base leading-relaxed">{opt.label}. {opt.text}</p>
                        {showResult && (
                          <p className={`text-xs mt-2 font-bold ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                            {isCorrect ? "✓ Correct Answer" : "✗ Your Answer"}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanations for all options */}
            {submitted && mode === "tutor" && (
              <div className="space-y-3 mb-8">
                <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Explanation</p>
                {options.map((opt) => {
                  const isCorrect = opt.key === currentMcq.correct_answer.toLowerCase();
                  const exp = currentMcq[`explanation_${opt.key}` as keyof MCQ];

                  return (
                    <div
                      key={opt.key}
                      className="rounded-xl p-4"
                      style={{
                        background: isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                        border: isCorrect ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs"
                          style={{
                            background: isCorrect ? "#10B981" : "#EF4444",
                            color: "white",
                          }}
                        >
                          {isCorrect ? "✓" : "✗"}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold mb-1 ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                            {opt.label}. {opt.text}
                          </p>
                          {exp && <p className="text-white/70 text-xs leading-relaxed">{exp}</p>}
                          {isCorrect && <p className="text-emerald-400 text-xs font-bold mt-1">✓ Correct Answer</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR - Only show in Tutor Mode */}
          {mode === "tutor" && (
            <div className="w-72 space-y-4 pt-12">
              {/* FCPS Pearl Box */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: currentMcq.is_fcps_pearl
                    ? "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))"
                    : "linear-gradient(135deg, rgba(234,179,8,0.05), rgba(234,179,8,0.02))",
                  border: currentMcq.is_fcps_pearl
                    ? "1px solid rgba(234,179,8,0.4)"
                    : "1px solid rgba(234,179,8,0.2)",
                }}
              >
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">💎 FCPS Pearl</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  {currentMcq.is_fcps_pearl && currentMcq.fcps_pearl_content
                    ? currentMcq.fcps_pearl_content
                    : currentMcq.is_fcps_pearl
                    ? "High-yield concept for FCPS exam"
                    : "Not marked as FCPS Pearl"}
                </p>
              </div>

              {/* References Box */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.03))",
                  border: "1px solid rgba(59,130,246,0.3)",
                }}
              >
                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">📚 References</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  {currentMcq.references || "Katzung, Lippincott, Rang & Dale"}
                </p>
              </div>

              {/* Difficulty Level Box */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.03))",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">⚡ Difficulty</p>
                <div
                  className="inline-flex px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{
                    background: diffColor + "20",
                    border: "1.5px solid " + diffColor + "40",
                    color: diffColor,
                  }}
                >
                  {currentMcq.difficulty_level ? currentMcq.difficulty_level.charAt(0).toUpperCase() + currentMcq.difficulty_level.slice(1) : "Medium"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 px-8 py-6" style={{ background: "rgba(15,23,42,0.3)" }}>
          <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
            {!submitted ? (
              <>
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selected}
                  className="px-12 py-3 rounded-2xl font-bold text-white text-lg transition-all disabled:opacity-50"
                  style={{
                    background: selected ? "linear-gradient(135deg, #06B6D4, #0891B2)" : "rgba(6,182,212,0.2)",
                  }}
                >
                  Check Answer
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="px-12 py-3 rounded-2xl font-bold text-white text-lg"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
              >
                {currentIdx === mcqs.length - 1 ? "Finish Quiz" : "Next Question"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Congratulations Animation */}
      {showCongrats && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div
            className="flex flex-col items-center gap-4 px-8 py-6 rounded-3xl border-2 pointer-events-auto"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))",
              borderColor: "rgba(16,185,129,0.5)",
              boxShadow: "0 20px 60px rgba(16,185,129,0.3), inset 0 1px 1px rgba(255,255,255,0.1)",
              animation: "bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="text-6xl">🎉</div>
            <div className="text-center">
              <h3 className="text-3xl font-black text-white mb-1">Correct!</h3>
              <p className="text-emerald-300 font-semibold">Great job! Keep it up 🚀</p>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-2xl">✨</span>
              <span className="text-2xl">⭐</span>
              <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0) translateY(-100px);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
