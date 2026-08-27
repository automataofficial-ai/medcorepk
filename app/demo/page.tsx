"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Lock } from "lucide-react";

interface MCQ {
  id: string;
  question: string;
  case_study: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation_a: string;
  explanation_b: string;
  explanation_c: string;
  explanation_d: string;
  references?: string;
  is_fcps_pearl?: boolean;
  fcps_pearl_content?: string;
  difficulty_level?: string;
}

export default function DemoPage() {
  const router = useRouter();
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});
  const [timer, setTimer] = useState(0);
  const [finished, setFinished] = useState(false);

  const difficultyColors: Record<string, string> = {
    easy: "#10B981",
    medium: "#F59E0B",
    hard: "#EF4444",
  };

  useEffect(() => {
    const fetchDemoMCQs = async () => {
      try {
        const res = await fetch("/api/mcqs?limit=10");
        const data = await res.json();
        setMcqs(data.mcqs?.slice(0, 10) || []);
      } catch (err) {
        console.error("Error loading demo MCQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDemoMCQs();
  }, []);

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

  if (finished) {
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const percentage = mcqs.length > 0 ? Math.round((correctCount / mcqs.length) * 100) : 0;

    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="max-w-2xl w-full mx-4">
          <div className="text-center mb-12">
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
              </div>
            </div>

            <h2 className="text-4xl font-black text-white mb-4">Demo Complete!</h2>
            <p className="text-white/70 text-lg mb-12">
              You answered <span className="text-cyan-400 font-bold">{correctCount} out of {mcqs.length}</span> correctly.
            </p>
          </div>

          <div className="rounded-3xl p-8 md:p-10 border-2" style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.1), rgba(30,27,75,0.4))", borderColor: "rgba(234,179,8,0.5)" }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)" }}>
                <Lock size={24} className="text-yellow-900" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Unlock Full Access</h3>
                <p className="text-white/70">You''ve experienced the tutor mode! Get access to 30,000+ MCQs with detailed explanations, analytics, FCPS Pearls, and more.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-cyan-400">✓</span> Unlimited MCQs
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-cyan-400">✓</span> Full Explanations
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-cyan-400">✓</span> Analytics Dashboard
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-cyan-400">✓</span> FCPS Pearls
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/signup")}
                className="flex-1 px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
                  color: "#000",
                }}
              >
                Sign Up Now
              </button>
              <button
                onClick={() => router.push("/login")}
                className="flex-1 px-8 py-4 rounded-2xl font-bold text-white text-lg border-2 border-white/30 hover:border-white/50 transition-all"
              >
                Already Have Account?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentMcq = mcqs[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / mcqs.length) * 100);
  const diffColor = difficultyColors[currentMcq.difficulty_level?.toLowerCase() || "medium"];

  const options = [
    { key: "a", label: "A", text: currentMcq.option_a },
    { key: "b", label: "B", text: currentMcq.option_b },
    { key: "c", label: "C", text: currentMcq.option_c },
    { key: "d", label: "D", text: currentMcq.option_d },
  ];

  const handleCheckAnswer = () => {
    if (!selected) return;
    const isCorrect = selected === currentMcq.correct_answer.toLowerCase();
    setAnswers({ ...answers, [currentIdx]: { selected, correct: isCorrect } });
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx < mcqs.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#050B18" }}>
      {/* LEFT SIDEBAR - desktop only; mobile gets the compact strip in the top bar */}
      <div className="hidden lg:flex w-80 flex-shrink-0 border-r border-slate-800/50 px-6 py-6 flex-col min-h-0" style={{ background: "rgba(15,23,42,0.4)" }}>
        <div className="mb-5 flex flex-col items-center flex-shrink-0">
          <div className="relative w-24 h-24 mb-3">
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

        <button className="px-6 py-2 rounded-lg font-bold text-white text-sm mb-5 flex-shrink-0" style={{ background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)" }}>
          Demo Mode
        </button>

        {/* Question grid scrolls inside the sidebar rather than growing the page */}
        <div className="flex-1 min-h-0 overflow-y-auto -mr-2 pr-2 mb-4">
          <p className="text-white/60 text-xs font-semibold mb-3 uppercase">Questions</p>
          <div className="flex flex-wrap gap-2.5">
            {mcqs.map((_, idx) => {
              const isAnswered = idx in answers;
              const isCurrent = idx === currentIdx;
              const isCorrect = answers[idx]?.correct;

              return (
                <button
                  key={idx}
                  disabled={!isCurrent && !isAnswered}
                  onClick={() => {
                    if (isCurrent || isAnswered) {
                      setCurrentIdx(idx);
                      setSelected(null);
                      setSubmitted(false);
                    }
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all disabled:cursor-not-allowed flex-shrink-0"
                  style={{
                    background: isCurrent ? "#3B82F6" : isAnswered ? (isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)") : "rgba(99,102,241,0.2)",
                    color: isCurrent || isAnswered ? "#fff" : "rgba(255,255,255,0.5)",
                    border: isCurrent ? "2px solid #3B82F6" : "1px solid rgba(99,102,241,0.3)",
                    opacity: !isCurrent && !isAnswered && idx !== 0 ? 0.4 : 1,
                  }}
                >
                  {isAnswered && !isCurrent ? (isCorrect ? "✓" : "✗") : idx + 1}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* MAIN COLUMN */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top Bar */}
        <div className="border-b border-slate-800/50 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 flex-shrink-0" style={{ background: "rgba(15,23,42,0.3)" }}>
          <span className="text-white font-semibold text-sm whitespace-nowrap">Demo Mode</span>
          <div className="flex items-center gap-4">
            <span className="lg:hidden text-white/60 text-xs font-semibold whitespace-nowrap">
              {answeredCount}/{mcqs.length} · {progress}%
            </span>
            <div className="flex items-center gap-2 text-cyan-400 text-sm">
              <Clock size={16} />
              <span className="font-mono">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</span>
            </div>
          </div>
        </div>

        {/* Mobile question strip - scrolls horizontally in place of the sidebar */}
        <div className="lg:hidden border-b border-slate-800/50 px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ background: "rgba(15,23,42,0.2)" }}>
          {mcqs.map((_, idx) => {
            const isAnswered = idx in answers;
            const isCurrent = idx === currentIdx;
            const isCorrect = answers[idx]?.correct;
            return (
              <button
                key={idx}
                disabled={!isCurrent && !isAnswered}
                onClick={() => {
                  if (isCurrent || isAnswered) {
                    setCurrentIdx(idx);
                    setSelected(null);
                    setSubmitted(false);
                  }
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 disabled:cursor-not-allowed"
                style={{
                  background: isCurrent ? "#3B82F6" : isAnswered ? (isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)") : "rgba(99,102,241,0.2)",
                  color: isCurrent || isAnswered ? "#fff" : "rgba(255,255,255,0.5)",
                  opacity: !isCurrent && !isAnswered ? 0.4 : 1,
                }}
              >
                {isAnswered && !isCurrent ? (isCorrect ? "✓" : "✗") : idx + 1}
              </button>
            );
          })}
        </div>

        {/* Content - only these panes scroll, never the page itself */}
        <div
          className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden px-4 sm:px-6 lg:px-8 py-4 lg:py-5 flex flex-col lg:flex-row gap-5 lg:gap-6"
          style={{ animation: "fadeIn 0.3s ease" }}
        >
        <div className="flex-1 lg:max-w-3xl min-w-0 lg:overflow-y-auto lg:-mr-3 lg:pr-3">
          <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4">Question {currentIdx + 1}</p>
          <h2 className="text-xl font-semibold text-white mb-2">{currentMcq.question}</h2>
          <p className="text-white/60 text-sm mb-8">Choose the single best answer.</p>

          {currentMcq.case_study && (
            <div className="rounded-xl p-5 mb-8" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.03))", border: "1px solid rgba(6,182,212,0.25)" }}>
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
                    background: isSelected ? "rgba(6,182,212,0.15)" : "transparent",
                    borderColor: isSelected ? "#06B6D4" : "rgba(99,102,241,0.3)",
                    cursor: submitted ? "not-allowed" : "pointer",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5"
                      style={{
                        borderColor: isSelected ? "#06B6D4" : "rgba(99,102,241,0.3)",
                        background: isSelected ? "rgba(6,182,212,0.2)" : "transparent",
                      }}
                    />
                    <div>
                      <p className="text-white font-semibold">{opt.label}. {opt.text}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanations */}
          {submitted && (
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

        {/* RIGHT SIDEBAR - Tutor Mode Info */}
        {submitted && (
          <div className="w-full lg:w-72 flex-shrink-0 space-y-4 lg:overflow-y-auto pb-4">
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

        {/* Bottom Bar - in flow, so it can never cover the question */}
        <div className="border-t border-slate-800/50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex-shrink-0" style={{ background: "rgba(15,23,42,0.3)" }}>
          <div className="flex items-center justify-center gap-4">
            {!submitted ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selected}
                className="w-full sm:w-auto px-6 sm:px-12 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-white text-sm sm:text-lg transition-all disabled:opacity-50"
                style={{
                  background: selected ? "linear-gradient(135deg, #06B6D4, #0891B2)" : "rgba(6,182,212,0.2)",
                }}
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-6 sm:px-12 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-white text-sm sm:text-lg"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
              >
                {currentIdx === mcqs.length - 1 ? "Finish Demo" : "Next Question"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
