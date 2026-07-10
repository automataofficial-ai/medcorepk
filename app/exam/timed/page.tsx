"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { Clock, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  case_study?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: string;
}

interface UserAnswer {
  questionId: string;
  answer: string;
  timeSpent: number;
  isCorrect: boolean;
}

const EXAM_DURATION_MINUTES = 150; // 2h 30m
const TOTAL_QUESTIONS = 200;

export default function TimedExamPage() {
  const router = useRouter();
  const { success, error: showError, warning } = useToast();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_MINUTES * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/blocks");
        const data = await res.json();

        let allQuestions: Question[] = [];
        for (const block of data.blocks || []) {
          allQuestions = allQuestions.concat(block.mcqs || []);
        }

        // Shuffle and select 200 questions
        const shuffled = allQuestions
          .sort(() => Math.random() - 0.5)
          .slice(0, TOTAL_QUESTIONS);

        setQuestions(shuffled);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        showError("Error", "Failed to load exam questions");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [showError]);

  // Countdown timer
  useEffect(() => {
    if (!examStarted || examFinished || timeRemaining <= 0) {
      if (timeRemaining === 0 && examStarted && !examFinished) {
        handleFinishExam();
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining((prev) => {
        if (prev <= 60) {
          warning("Time Warning", "Less than 1 minute remaining!");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining, examStarted, examFinished, warning]);

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleSelectAnswer = (answer: string) => {
    const currentQuestion = questions[currentIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinishExam = async () => {
    setExamFinished(true);

    // Calculate results
    let correct = 0;
    const userAnswers: UserAnswer[] = [];

    for (const question of questions) {
      const userAnswer = selectedAnswers[question.id];
      const isCorrect = userAnswer === question.correct_answer;

      if (isCorrect) correct++;

      userAnswers.push({
        questionId: question.id,
        answer: userAnswer || "Not answered",
        timeSpent: 45, // Approximate
        isCorrect,
      });
    }

    const score = Math.round((correct / questions.length) * 100);
    const timeUsed = EXAM_DURATION_MINUTES * 60 - timeRemaining;

    const examResults = {
      totalQuestions: questions.length,
      correct,
      incorrect: questions.length - correct,
      unanswered: Object.keys(selectedAnswers).length - correct,
      score,
      timeUsed,
      userAnswers,
    };

    setResults(examResults);
    success("Exam Completed!", `Your score: ${score}%`);

    // Save to database
    try {
      const user = JSON.parse(localStorage.getItem("medcore_user") || "{}");

      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({
          id: `exam-timed-${Date.now()}`,
          blockId: "timed-exam",
          totalMcqs: questions.length,
          correctCount: correct,
          score,
          timeTakenSeconds: timeUsed,
          completedAt: new Date().toISOString(),
          answers: userAnswers.map((a) => ({
            mcqIndex: questions.findIndex((q) => q.id === a.questionId),
            selectedIndex: a.answer.charCodeAt(0) - 65,
            isCorrect: a.isCorrect,
            timeTakenSeconds: 45,
          })),
        }),
      });
    } catch (err) {
      console.error("Error saving exam results:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050B18" }}
      >
        <div className="text-center">
          <p className="text-white font-semibold">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "#050B18" }}
      >
        <div className="max-w-2xl w-full glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">⏱️</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Timed Exam Mode
            </h1>
            <p className="text-slate-400">FCPS Part II CBT Simulation</p>
          </div>

          <div className="space-y-6 my-8">
            <div
              className="p-4 rounded-xl flex items-start gap-3"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              }}
            >
              <Clock className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold">Duration</p>
                <p className="text-sm text-slate-300">
                  2 hours 30 minutes (150 minutes)
                </p>
              </div>
            </div>

            <div
              className="p-4 rounded-xl flex items-start gap-3"
              style={{
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              <AlertCircle className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold">Questions</p>
                <p className="text-sm text-slate-300">200 questions total</p>
              </div>
            </div>

            <div
              className="p-4 rounded-xl flex items-start gap-3"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold">Features</p>
                <p className="text-sm text-slate-300">
                  Real-time timer, instant feedback, review all answers
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleStartExam}
              className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                boxShadow: "0 0 20px rgba(0,206,209,0.4)",
              }}
            >
              Start Exam Now
            </button>

            <Link
              href="/dashboard"
              className="w-full py-3 rounded-xl font-semibold text-white transition-all text-center"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (examFinished && results) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-8"
        style={{ background: "#050B18" }}
      >
        <div className="max-w-2xl w-full glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {results.score >= 80 ? "🎉" : results.score >= 60 ? "👍" : "📚"}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Exam Results</h1>
            <p className="text-3xl font-black" style={{ color: "#00CED1" }}>
              {results.score}%
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-xl" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p className="text-2xl font-bold text-emerald-400">{results.correct}</p>
              <p className="text-xs text-slate-400 mt-1">Correct</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-2xl font-bold text-red-400">{results.incorrect}</p>
              <p className="text-xs text-slate-400 mt-1">Incorrect</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: "rgba(100,116,139,0.1)", border: "1px solid rgba(100,116,139,0.2)" }}>
              <p className="text-2xl font-bold text-slate-300">
                {Math.round(
                  (results.timeUsed / (EXAM_DURATION_MINUTES * 60)) * 100
                )}
              </p>
              <p className="text-xs text-slate-400 mt-1">Time Used %</p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href={`/exam/timed/review/${Date.now()}`}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all text-center"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #2563EB)",
              }}
            >
              Review Answers
            </Link>

            <Link
              href="/dashboard"
              className="w-full py-3 rounded-xl font-semibold text-white transition-all text-center"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentQuestion?.id];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#050B18" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))",
          borderColor: "rgba(99,102,241,0.1)",
        }}
      >
        <div>
          <p className="text-slate-400 text-xs uppercase">Question</p>
          <p className="text-white font-bold">
            {currentIndex + 1}/{questions.length}
          </p>
        </div>

        <div
          className={`text-center px-4 py-2 rounded-lg font-bold text-lg ${
            timeRemaining <= 300
              ? "text-red-400"
              : timeRemaining <= 600
              ? "text-amber-400"
              : "text-green-400"
          }`}
        >
          ⏱️ {formatTime(timeRemaining)}
        </div>

        <div>
          <p className="text-slate-400 text-xs uppercase">Answered</p>
          <p className="text-white font-bold">
            {Object.keys(selectedAnswers).length}/{questions.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-1"
        style={{
          background: "linear-gradient(90deg, #00CED1, #00B5CC)",
          width: `${progress}%`,
        }}
      />

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Question */}
        <div className="mb-8">
          <div
            className="glass rounded-2xl p-6 mb-6"
            style={{
              background: "rgba(30,27,75,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {currentQuestion.case_study && (
              <div
                className="mb-4 p-4 rounded-lg text-sm text-slate-300"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                <p className="font-semibold text-amber-400 mb-2">Case Study</p>
                <p>{currentQuestion.case_study}</p>
              </div>
            )}

            <h2 className="text-xl font-bold text-white mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {["a", "b", "c", "d"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  className="w-full p-4 rounded-xl text-left transition-all text-white font-medium"
                  style={{
                    background:
                      selectedAnswer === option
                        ? "linear-gradient(135deg, rgba(0,206,209,0.2), rgba(0,181,204,0.2))"
                        : "rgba(255,255,255,0.05)",
                    border:
                      selectedAnswer === option
                        ? "2px solid rgba(0,206,209,0.5)"
                        : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span className="font-bold mr-3">
                    {option.toUpperCase()}.
                  </span>
                  {currentQuestion[`option_${option}` as keyof Question]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
            }}
          >
            ← Previous
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={currentIndex === questions.length - 1}
            className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-40"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
            }}
          >
            Next →
          </button>

          {currentIndex === questions.length - 1 && (
            <button
              onClick={handleFinishExam}
              className="flex-1 px-6 py-3 rounded-xl font-bold transition-all"
              style={{
                background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                color: "white",
              }}
            >
              Finish Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
