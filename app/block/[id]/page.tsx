"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getBlockById } from "@/lib/blocks";
import type { MCQAnswer, BlockSession } from "@/lib/types";
import MedicalImage from "@/components/MedicalImage";

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
  const blockId = params.id as string;
  const block = getBlockById(blockId);

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
  }, [selected, submitted, block, currentIdx, mcqTimer, answers]);

  const handleNext = useCallback(async () => {
    if (!block) return;
    const isLast = currentIdx === block.mcqs.length - 1;

    if (isLast) {
      const finalAnswers = answers.filter(Boolean) as MCQAnswer[];
      const correct = finalAnswers.filter((a) => a.isCorrect).length;
      const score = (correct / block.mcqs.length) * 100;

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

      /* save to CSV via API */
      try {
        await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(session),
        });
      } catch {/* noop */}

      /* also cache in localStorage for review page */
      localStorage.setItem(`medcore_session_${block.id}`, JSON.stringify(session));
      router.push(`/block/${block.id}/review`);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }, [block, currentIdx, answers, sessionTimer, router]);

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

  const mcq = block.mcqs[currentIdx];
  const isLast = currentIdx === block.mcqs.length - 1;
  const progress = ((currentIdx + (submitted ? 1 : 0)) / block.mcqs.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>

      {/* ── top bar ── */}
      <div className="sticky top-0 z-40 border-b border-slate-800/50"
        style={{ background: "rgba(5,11,24,0.95)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between text-xs text-white mb-1">
              <span>Question {currentIdx + 1} of {block.mcqs.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "#1a2844" }}>
              <div className="h-1.5 rounded-full progress-fill"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3B82F6, #8B5CF6)" }} />
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="text-white">⏱</span>
              <span className="text-white font-mono">{formatTime(sessionTimer)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 page-enter">

        {/* ── block header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${block.color} flex items-center justify-center text-xl`}>
              {block.icon}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{block.title}</p>
              <p className="text-white text-xs">{block.specialty}</p>
            </div>
          </div>
          <ProgressDots total={block.mcqs.length} current={currentIdx} answers={answers} />
        </div>

        {/* ── case study card ── */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium text-blue-300"
              style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}>
              Clinical Scenario
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium text-white"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              Q{currentIdx + 1}
            </span>
          </div>
          <p className="text-white leading-relaxed text-sm md:text-base">
            {mcq.caseStudy}
          </p>
        </div>

        {/* ── medical image ── */}
        <div className="max-w-lg mx-auto lg:mx-0">
          <MedicalImage image={mcq.image} />
        </div>

        {/* ── options ── */}
        <div className="space-y-3">
          <p className="text-xs text-white uppercase tracking-wide font-medium">Select the best answer</p>
          {mcq.options.map((opt, i) => {
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
          })}
        </div>

        {/* ── action buttons ── */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="text-xs text-white">
            {!submitted
              ? selected !== null
                ? "Click 'Submit Answer' to confirm"
                : "Select an answer above"
              : submitted && selected === mcq.correctIndex
              ? "✅ Correct!"
              : "❌ Incorrect"}
          </div>
          <div className="flex gap-3">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                style={{ background: selected !== null ? "linear-gradient(135deg, #2563EB, #7C3AED)" : "#1a2844" }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #059669, #0891B2)" }}
              >
                {isLast ? "Finish Block →" : "Next Question →"}
              </button>
            )}
          </div>
        </div>

        {/* ── explanation panel ── */}
        {submitted && (
          <div className="space-y-4 page-enter">
            {/* correct answer explanation */}
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-emerald-400 text-lg">✅</span>
                <span className="text-emerald-300 font-semibold text-sm">Correct Answer: {mcq.options[mcq.correctIndex].label}</span>
              </div>
              <p className="text-white text-sm leading-relaxed">{mcq.explanation.correct}</p>
            </div>

            {/* wrong option explanations */}
            <div className="rounded-2xl p-5 space-y-4"
              style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-lg">❌</span>
                <span className="text-red-300 font-semibold text-sm">Why the other options are incorrect</span>
              </div>
              {mcq.options.map((opt, i) => {
                if (i === mcq.correctIndex) return null;
                const explIdx = i < mcq.correctIndex ? i : i - 1;
                return (
                  <div key={i} className="border-t border-red-900/30 pt-3">
                    <p className="text-red-300 text-xs font-semibold mb-1.5">
                      Option {opt.label}: {opt.text}
                    </p>
                    <p className="text-white text-sm leading-relaxed">
                      {mcq.explanation.incorrect[explIdx] ?? "This option is not the best answer for this clinical scenario."}
                    </p>
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
