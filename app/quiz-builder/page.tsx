"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import { Search, BookOpen, Stethoscope, Award, Zap, BarChart3, ChevronRight, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Block {
  id: string;
  title: string;
  specialty: string;
  icon: string;
  color: string;
}

interface UserStats {
  answered: number;
  correct: number;
  percentage: number;
  dailyAvg: number;
  timePerQuestion: string;
}

interface RecentSession {
  id: string;
  title: string;
  daysAgo: number;
  percentage: number;
  questionsCount: number;
}

const DIFFICULTIES = [
  { value: "easy", label: "Easy", color: "#10B981" },
  { value: "medium", label: "Medium", color: "#F59E0B" },
  { value: "hard", label: "Hard", color: "#EF4444" },
];

const PAPER_A_SUBJECTS: Block[] = [
  { id: "anatomy", title: "Anatomy & Histology", specialty: "Basic Science", icon: "🔬", color: "#3B82F6" },
  { id: "physiology", title: "Physiology", specialty: "Basic Science", icon: "❤️", color: "#EF4444" },
  { id: "biochemistry", title: "Biochemistry", specialty: "Basic Science", icon: "⚗️", color: "#F59E0B" },
  { id: "pathology", title: "Pathology", specialty: "Basic Science", icon: "⚠️", color: "#8B5CF6" },
  { id: "microbiology", title: "Microbiology", specialty: "Basic Science", icon: "🦠", color: "#06B6D4" },
  { id: "pharmacology", title: "Pharmacology", specialty: "Clinical", icon: "💊", color: "#10B981" },
  { id: "community-medicine", title: "Community Medicine", specialty: "Public Health", icon: "🌍", color: "#EC4899" },
];

export default function QuizBuilderPage() {
  const router = useRouter();
  const { success, error: showError, info } = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [mode, setMode] = useState<"tutor" | "timed">("tutor");
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "year" | "overall">("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [userStats, setUserStats] = useState<UserStats>({
    answered: 0,
    correct: 0,
    percentage: 0,
    dailyAvg: 0,
    timePerQuestion: "0:00",
  });
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);

  const weeklyData = [
    { day: "M", value: 0 },
    { day: "T", value: 0 },
    { day: "W", value: 0 },
    { day: "T", value: 0 },
    { day: "F", value: 0 },
    { day: "S", value: 0 },
    { day: "S", value: 0 },
  ];

  useEffect(() => {
    fetchBlocks();
    fetchUserStats();
    fetchRecentSessions();
  }, []);

  const fetchBlocks = async () => {
    try {
      setBlocks(PAPER_A_SUBJECTS);
    } catch (err) {
      showError("Error", "Failed to load blocks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("medcore_user") || "{}");
      if (!user.id) return;
      // TODO: Fetch real stats from your API
      // For now using placeholder
      setUserStats({
        answered: 24,
        correct: 18,
        percentage: 75,
        dailyAvg: 6,
        timePerQuestion: "0:45",
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("medcore_user") || "{}");
      if (!user.id) return;
      // TODO: Fetch real sessions from your API
      // For now using placeholder
      setRecentSessions([
        {
          id: "1",
          title: "Cardio Block Review",
          daysAgo: 2,
          percentage: 80,
          questionsCount: 15,
        },
        {
          id: "2",
          title: "Anatomy Fundamentals",
          daysAgo: 5,
          percentage: 70,
          questionsCount: 20,
        },
        {
          id: "3",
          title: "Biochemistry MCQs",
          daysAgo: 8,
          percentage: 85,
          questionsCount: 10,
        },
      ]);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulty((prev) =>
      prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty]
    );
  };

  const handleCreateQuiz = async () => {
    if (!selectedBlock) {
      showError("Select Block", "Please choose a block/subject");
      return;
    }
    if (selectedDifficulty.length === 0) {
      showError("Select Difficulty", "Please choose at least one difficulty level");
      return;
    }
    if (numQuestions < 1 || numQuestions > 100) {
      showError("Invalid Questions", "Please enter between 1 and 100 questions");
      return;
    }

    setCreatingQuiz(true);
    info("Creating Quiz", "Preparing your custom quiz...");

    try {
      const user = JSON.parse(localStorage.getItem("medcore_user") || "{}");

      // Create session for custom quiz
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          id: `custom-${Date.now()}`,
          blockId: selectedBlock,
          blockTitle: blocks.find((b) => b.id === selectedBlock)?.title || "Custom Quiz",
          answers: [],
          score: 0,
          correctCount: 0,
          totalMcqs: numQuestions,
          completedAt: new Date().toISOString(),
          timeTakenSeconds: 0,
          isCustom: true,
          difficulty: selectedDifficulty,
        }),
      });

      if (sessionRes.ok) {
        success("Quiz Ready! 🎉", "Starting your custom quiz...");
        setTimeout(() => {
          router.push(`/block/${selectedBlock}?mode=${mode}&difficulty=${selectedDifficulty.join(",")}&count=${numQuestions}`);
        }, 1000);
      }
    } catch (err) {
      showError("Error", "Failed to create quiz");
    } finally {
      setCreatingQuiz(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: "#050B18" }}>
      {/* ── Sidebar ── stacks above the content below lg */}
      <div className="w-full lg:w-80 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800/50 p-4 sm:p-6 lg:overflow-y-auto lg:max-h-screen">
        {/* Course Card */}
        <div className="rounded-2xl p-6 mb-8 overflow-hidden relative" style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
          border: "1.5px solid rgba(16,185,129,0.3)",
        }}>
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{
              background: "linear-gradient(135deg, #10B981, #059669)",
            }}>
              🎁 Free
            </span>
          </div>

          <h3 className="text-2xl font-black text-white mb-3 mt-4">Question Bank</h3>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            Master medical subjects with curated MCQs, difficulty levels, and detailed explanations.
          </p>

          <Link href="#" className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">
            More Info →
          </Link>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {[
            { icon: <BookOpen size={20} />, label: "Question Bank", active: true },
            { icon: <Stethoscope size={20} />, label: "OSCE Practice", active: false },
            { icon: <Award size={20} />, label: "Case Studies", active: false },
            { icon: <Zap size={20} />, label: "Mock Exams", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                item.active ? "text-white" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
              style={{
                background: item.active ? "rgba(59, 130, 246, 0.2)" : "transparent",
                border: item.active ? "1.5px solid rgba(59, 130, 246, 0.4)" : "none",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:overflow-y-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-black text-white">Question Bank</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            ← Back
          </Link>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex gap-3 mb-8">
          {["week", "year", "overall"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTimeframe(tab as any)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedTimeframe === tab ? "text-white" : "text-white/60 hover:text-white"
              }`}
              style={{
                background: selectedTimeframe === tab ? "rgba(59, 130, 246, 0.3)" : "transparent",
                border: selectedTimeframe === tab ? "1px solid rgba(59, 130, 246, 0.5)" : "none",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Chart and Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Chart */}
          <div className="col-span-2 rounded-2xl p-6 border border-slate-800/50" style={{
            background: "linear-gradient(135deg, rgba(15,23,42,0.5), rgba(30,27,75,0.3))",
          }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ background: "#1a2844", border: "1px solid rgba(59, 130, 246, 0.3)" }} />
                <Line type="monotone" dataKey="value" stroke="#FF6B35" strokeWidth={3} dot={{ fill: "#FF6B35", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Study Plan Card */}
          <div className="rounded-2xl p-6 border border-slate-800/50 flex flex-col items-center justify-center text-center" style={{
            background: "linear-gradient(135deg, rgba(15,23,42,0.5), rgba(30,27,75,0.3))",
          }}>
            <BarChart3 size={48} className="text-cyan-400 mb-4" />
            <p className="text-white/70 text-sm mb-4">Stay on track with daily goals.</p>
            <button className="px-6 py-2 rounded-xl font-semibold text-white text-sm" style={{
              background: "linear-gradient(135deg, #0891b2 0%, #006b7f 100%)",
            }}>
              Set Up Study Plan
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="rounded-xl p-4 border border-slate-800/50" style={{
            background: "rgba(15,23,42,0.4)",
          }}>
            <p className="text-3xl font-black text-white">{userStats.answered}</p>
            <p className="text-xs text-white/60 uppercase tracking-wide mt-1">Answered</p>
          </div>
          <div className="rounded-xl p-4 border border-slate-800/50" style={{
            background: "rgba(15,23,42,0.4)",
          }}>
            <p className="text-3xl font-black text-white">{userStats.percentage}%</p>
            <p className="text-xs text-white/60 uppercase tracking-wide mt-1">Correct</p>
          </div>
          <div className="rounded-xl p-4 border border-slate-800/50" style={{
            background: "rgba(15,23,42,0.4)",
          }}>
            <p className="text-3xl font-black text-white">{userStats.dailyAvg}</p>
            <p className="text-xs text-white/60 uppercase tracking-wide mt-1">Daily Avg</p>
          </div>
          <div className="rounded-xl p-4 border border-slate-800/50" style={{
            background: "rgba(15,23,42,0.4)",
          }}>
            <p className="text-3xl font-black text-white">{userStats.timePerQuestion}</p>
            <p className="text-xs text-white/60 uppercase tracking-wide mt-1">Per Question</p>
          </div>
        </div>

        {/* New Session & Recent Sessions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* New Session */}
          <div className="col-span-2 rounded-2xl p-6 border border-slate-800/50" style={{
            background: "linear-gradient(135deg, rgba(15,23,42,0.5), rgba(30,27,75,0.3))",
          }}>
            <h3 className="text-xl font-black text-white mb-6">New Session</h3>

            {/* Blocks Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">Select Subject/Block</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {loading ? (
                  <p className="text-slate-400 text-sm">Loading blocks...</p>
                ) : (
                  blocks.map((block) => (
                    <button
                      key={block.id}
                      onClick={() => setSelectedBlock(block.id)}
                      className="w-full text-left p-3 rounded-lg transition-all flex items-center gap-3"
                      style={{
                        background:
                          selectedBlock === block.id
                            ? "rgba(0,206,209,0.2)"
                            : "rgba(255,255,255,0.05)",
                        border:
                          selectedBlock === block.id
                            ? "1px solid rgba(0,206,209,0.5)"
                            : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <span className="text-lg">{block.icon}</span>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{block.title}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">Difficulty Levels</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => toggleDifficulty(diff.value)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: selectedDifficulty.includes(diff.value)
                        ? `${diff.color}30`
                        : "rgba(255,255,255,0.05)",
                      border: selectedDifficulty.includes(diff.value)
                        ? `1px solid ${diff.color}`
                        : "1px solid rgba(255,255,255,0.1)",
                      color: selectedDifficulty.includes(diff.value) ? diff.color : "white",
                    }}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Questions: {numQuestions}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">Mode</label>
              <div className="flex gap-3">
                {[
                  { value: "tutor", label: "Tutor" },
                  { value: "timed", label: "Exam" },
                ].map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMode(m.value as "tutor" | "timed")}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
                    style={{
                      background: mode === m.value ? "rgba(0,206,209,0.2)" : "rgba(255,255,255,0.05)",
                      border: mode === m.value ? "1px solid rgba(0,206,209,0.5)" : "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleCreateQuiz}
              disabled={creatingQuiz || !selectedBlock || selectedDifficulty.length === 0}
              className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #FF6B35, #FF5722)",
                boxShadow: "0 8px 24px rgba(255, 107, 53, 0.3)",
              }}
            >
              {creatingQuiz ? "Creating..." : "Start Session 🚀"}
            </button>
          </div>

          {/* Recent Sessions */}
          <div className="rounded-2xl p-6 border border-slate-800/50" style={{
            background: "linear-gradient(135deg, rgba(15,23,42,0.5), rgba(30,27,75,0.3))",
          }}>
            <h3 className="text-xl font-black text-white mb-4">Recent Sessions</h3>

            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="p-3 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                  }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white text-sm font-semibold">{session.title}</p>
                      <p className="text-xs text-white/50">{session.daysAgo} days ago</p>
                    </div>
                    <ChevronRight size={18} className="text-white/40" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/60">{session.percentage}% on {session.questionsCount} questions</p>
                    <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          background: session.percentage >= 75 ? "#10B981" : session.percentage >= 50 ? "#F59E0B" : "#EF4444",
                          width: `${session.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
