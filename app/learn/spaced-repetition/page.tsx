"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import {
  calculateSM2,
  createNewCard,
  getCardsDueForReview,
  calculateStudyStats,
  QUALITY_RATINGS,
  RepetitionCard,
} from "@/lib/spaced-repetition";

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

export default function SpacedRepetitionPage() {
  const router = useRouter();
  const { success, info, warning } = useToast();

  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [cards, setCards] = useState<RepetitionCard[]>([]);
  const [dueCards, setDueCards] = useState<RepetitionCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [sessionMode, setSessionMode] = useState<"browse" | "study">("browse");

  // Load questions and initialize cards
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/blocks");
        const data = await res.json();

        let questions: Question[] = [];
        for (const block of data.blocks || []) {
          questions = questions.concat(block.mcqs || []);
        }

        setAllQuestions(questions);

        // Initialize spaced repetition cards from localStorage
        const savedCards = localStorage.getItem("sr_cards");
        let newCards: RepetitionCard[] = [];

        if (savedCards) {
          try {
            newCards = JSON.parse(savedCards).map((c: any) => ({
              ...c,
              nextReviewDate: new Date(c.nextReviewDate),
              lastReviewDate: c.lastReviewDate
                ? new Date(c.lastReviewDate)
                : null,
            }));
          } catch {
            newCards = questions.map((q) => createNewCard(q.id));
          }
        } else {
          newCards = questions.map((q) => createNewCard(q.id));
        }

        setCards(newCards);
        updateDueCards(newCards);
        setStats(calculateStudyStats(newCards));
        setLoading(false);
      } catch (err) {
        console.error("Error loading questions:", err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateDueCards = (cardsToCheck: RepetitionCard[]) => {
    const due = getCardsDueForReview(cardsToCheck);
    setDueCards(due);

    if (due.length > 0) {
      info("Cards Due", `You have ${due.length} cards to review!`);
    }
  };

  const handleQualityRating = (quality: number) => {
    const currentCard = dueCards[currentCardIndex];
    if (!currentCard) return;

    const updatedCard = calculateSM2(currentCard, quality);
    const updatedAllCards = cards.map((c) =>
      c.id === updatedCard.id ? updatedCard : c
    );

    setCards(updatedAllCards);
    localStorage.setItem("sr_cards", JSON.stringify(updatedAllCards));

    // Move to next card
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setRevealed(false);
    } else {
      success("Session Complete!", "Great progress today!");
      setSessionMode("browse");
      updateDueCards(updatedAllCards);
      setStats(calculateStudyStats(updatedAllCards));
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050B18" }}
      >
        <p className="text-white">Loading spaced repetition...</p>
      </div>
    );
  }

  if (!stats) return null;

  const currentCard = dueCards[currentCardIndex];
  const currentQuestion = allQuestions.find(
    (q) => q.id === currentCard?.question_id
  );

  if (sessionMode === "browse") {
    return (
      <div
        className="min-h-screen"
        style={{ background: "#050B18" }}
      >
        {/* Header */}
        <div
          className="px-6 py-8 border-b"
          style={{
            background:
              "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))",
            borderColor: "rgba(99,102,241,0.1)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">
              Spaced Repetition
            </h1>
            <p className="text-slate-400">
              Intelligent learning with SM-2 algorithm
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
              <p className="text-xs text-slate-400 mt-1">Total Cards</p>
            </div>
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <p className="text-3xl font-bold text-red-400">{stats.due}</p>
              <p className="text-xs text-slate-400 mt-1">Due Now</p>
            </div>
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <p className="text-3xl font-bold text-emerald-400">
                {stats.reviewed}
              </p>
              <p className="text-xs text-slate-400 mt-1">Reviewed</p>
            </div>
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.2)",
              }}
            >
              <p className="text-3xl font-bold text-purple-400">
                {stats.mastered}
              </p>
              <p className="text-xs text-slate-400 mt-1">Mastered</p>
            </div>
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <p className="text-3xl font-bold text-amber-400">
                {stats.avgEaseFactor}
              </p>
              <p className="text-xs text-slate-400 mt-1">Avg Ease</p>
            </div>
          </div>

          {/* Progress */}
          <div
            className="glass rounded-2xl p-6 mb-8"
            style={{
              background: "rgba(30,27,75,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="text-white font-semibold mb-4">Overall Progress</p>
            <div className="h-4 rounded-full" style={{ background: "rgba(100,116,139,0.2)" }}>
              <div
                className="h-4 rounded-full"
                style={{
                  width: `${stats.duePercentage}%`,
                  background: "linear-gradient(90deg, #00CED1, #00B5CC)",
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {stats.duePercentage}% due for review
            </p>
          </div>

          {/* Action */}
          {stats.due > 0 ? (
            <button
              onClick={() => {
                setSessionMode("study");
                setCurrentCardIndex(0);
                setRevealed(false);
              }}
              className="w-full py-4 rounded-xl font-bold text-white text-lg mb-4"
              style={{
                background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                boxShadow: "0 0 20px rgba(0,206,209,0.4)",
              }}
            >
              Start Review Session ({stats.due} cards)
            </button>
          ) : (
            <div
              className="w-full py-4 rounded-xl text-center text-white font-semibold"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              ✓ All caught up! No cards due for review.
            </div>
          )}

          <Link
            href="/dashboard"
            className="w-full py-3 rounded-xl font-semibold text-white text-center"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!currentCard || !currentQuestion) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050B18" }}
      >
        <div className="text-center">
          <p className="text-white text-xl">No more cards to review!</p>
          <button
            onClick={() => setSessionMode("browse")}
            className="mt-6 px-6 py-3 rounded-xl font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #00CED1, #00B5CC)",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "#050B18" }}
    >
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">
              Card {currentCardIndex + 1} of {dueCards.length}
            </p>
            <p className="text-slate-400 text-sm">
              Ease: {currentCard.easeFactor.toFixed(2)}
            </p>
          </div>
          <div
            className="h-1 rounded-full"
            style={{
              background: "linear-gradient(90deg, #00CED1, #00B5CC)",
              width: `${((currentCardIndex + 1) / dueCards.length) * 100}%`,
            }}
          />
        </div>

        {/* Card */}
        <div
          className="glass rounded-3xl p-8 mb-8"
          style={{
            background: "rgba(30,27,75,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
            minHeight: "400px",
          }}
        >
          {/* Question Side */}
          <div className="mb-8">
            <p className="text-slate-400 uppercase text-xs mb-2">Question</p>
            <h2 className="text-2xl font-bold text-white">
              {currentQuestion.question}
            </h2>

            {currentQuestion.case_study && (
              <div
                className="mt-4 p-4 rounded-lg text-sm"
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                <p className="text-amber-400 font-semibold mb-2">Case Study</p>
                <p className="text-slate-300">{currentQuestion.case_study}</p>
              </div>
            )}

            {/* Options */}
            {!revealed && (
              <div className="space-y-3 mt-6">
                {["a", "b", "c", "d"].map((option) => (
                  <div
                    key={option}
                    className="p-3 rounded-lg text-white"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="font-bold mr-2">
                      {option.toUpperCase()}.
                    </span>
                    {currentQuestion[`option_${option}` as keyof Question]}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reveal Button */}
          {!revealed && (
            <button
              onClick={() => setRevealed(true)}
              className="w-full py-4 rounded-xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                boxShadow: "0 0 20px rgba(0,206,209,0.4)",
              }}
            >
              Reveal Answer
            </button>
          )}

          {/* Answer Reveal */}
          {revealed && (
            <div className="space-y-4">
              <div
                className="p-4 rounded-lg border-2"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  borderColor: "rgba(16,185,129,0.3)",
                }}
              >
                <p className="text-emerald-400 font-semibold text-sm mb-2">
                  Correct Answer
                </p>
                <p className="text-white font-bold text-lg">
                  {currentQuestion[
                    `option_${currentQuestion.correct_answer}` as keyof Question
                  ]}
                </p>
              </div>

              {/* Rating */}
              <div>
                <p className="text-slate-400 text-sm mb-3">
                  How well did you know this?
                </p>
                <div className="space-y-2">
                  {Object.entries(QUALITY_RATINGS).map(([quality, rating]) => (
                    <button
                      key={quality}
                      onClick={() => handleQualityRating(parseInt(quality))}
                      className="w-full p-3 rounded-lg text-left transition-all hover:scale-[1.02] text-white font-medium"
                      style={{
                        background: `rgba(${
                          rating.color === "red"
                            ? "239,68,68"
                            : rating.color === "orange"
                            ? "245,158,11"
                            : rating.color === "yellow"
                            ? "234,179,8"
                            : rating.color === "lime"
                            ? "132,204,22"
                            : "34,197,94"
                        },0.1)`,
                        border: `1px solid rgba(${
                          rating.color === "red"
                            ? "239,68,68"
                            : rating.color === "orange"
                            ? "245,158,11"
                            : rating.color === "yellow"
                            ? "234,179,8"
                            : rating.color === "lime"
                            ? "132,204,22"
                            : "34,197,94"
                        },0.3)`,
                      }}
                    >
                      <p className="font-semibold">{rating.label}</p>
                      <p className="text-xs opacity-75">{rating.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
