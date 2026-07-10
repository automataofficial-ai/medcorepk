"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface MockExamResult {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  score: number;
  subjectScores: Record<string, { correct: number; total: number }>;
  difficultyBreakdown: Record<string, { correct: number; total: number }>;
  timeSpent: number;
}

export default function MockExamPage() {
  const router = useRouter();
  const { success } = useToast();
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<MockExamResult | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const startMockExam = () => {
    setStarted(true);
    // Simulate exam completion
    setTimeout(() => {
      const mockResult: MockExamResult = {
        totalQuestions: 200,
        correct: 156,
        incorrect: 44,
        score: 78,
        subjectScores: {
          Anatomy: { correct: 28, total: 30 },
          Physiology: { correct: 25, total: 28 },
          Pharmacology: { correct: 24, total: 30 },
          Pathology: { correct: 22, total: 28 },
          Biochemistry: { correct: 19, total: 25 },
          Microbiology: { correct: 23, total: 27 },
          Biostatistics: { correct: 8, total: 12 },
          "Behavioral Science": { correct: 7, total: 20 },
        },
        difficultyBreakdown: {
          Easy: { correct: 58, total: 60 },
          Medium: { correct: 72, total: 100 },
          Hard: { correct: 26, total: 40 },
        },
        timeSpent: 8100, // 2h 15m
      };

      setResult(mockResult);
      setCompleted(true);
      success("Mock Exam Complete!", `Your score: ${mockResult.score}%`);
    }, 3000);
  };

  if (!started) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "#050B18" }}
      >
        <div className="max-w-2xl w-full glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📋</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Full Mock Exam
            </h1>
            <p className="text-slate-400">Comprehensive 200-Question Simulation</p>
          </div>

          <div className="space-y-4 my-8">
            <div className="p-4 rounded-xl" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
              <p className="text-white font-semibold">📊 200 Questions</p>
              <p className="text-sm text-slate-400">
                All 8 subjects with balanced difficulty
              </p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
              <p className="text-white font-semibold">📈 Detailed Analytics</p>
              <p className="text-sm text-slate-400">
                Subject-wise and difficulty-wise breakdown
              </p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
              <p className="text-white font-semibold">💾 Save Results</p>
              <p className="text-sm text-slate-400">
                Track progress over time
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startMockExam}
              className="w-full py-4 rounded-xl font-bold text-white text-lg"
              style={{
                background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                boxShadow: "0 0 20px rgba(0,206,209,0.4)",
              }}
            >
              Start Mock Exam
            </button>
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
      </div>
    );
  }

  if (!completed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050B18" }}
      >
        <div className="text-center">
          <div className="mb-6 text-5xl animate-pulse">⏳</div>
          <p className="text-white font-semibold mb-2">Mock Exam Running</p>
          <p className="text-slate-400 text-sm">
            Simulating 200-question exam...
          </p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const subjectData = Object.entries(result.subjectScores).map(
    ([subject, scores]) => ({
      name: subject,
      score: Math.round((scores.correct / scores.total) * 100),
      correct: scores.correct,
    })
  );

  const difficultyData = Object.entries(result.difficultyBreakdown).map(
    ([difficulty, scores]) => ({
      name: difficulty,
      value: scores.correct,
    })
  );

  const pieData = [
    { name: "Correct", value: result.correct, color: "#10B981" },
    { name: "Incorrect", value: result.incorrect, color: "#EF4444" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div
        className="px-6 py-8 border-b"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))",
          borderColor: "rgba(99,102,241,0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Mock Exam Results
          </h1>
          <p
            className="text-5xl font-black mb-4"
            style={{ color: "#00CED1" }}
          >
            {result.score}%
          </p>
          <p className="text-slate-400">
            {result.score >= 80
              ? "Excellent performance! 🎉"
              : result.score >= 60
              ? "Good effort! Keep practicing 👍"
              : "Keep studying! You'll improve 📚"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div
            className="p-6 rounded-2xl text-center"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <p className="text-3xl font-bold text-emerald-400">
              {result.correct}
            </p>
            <p className="text-xs text-slate-400 mt-1">Correct</p>
          </div>
          <div
            className="p-6 rounded-2xl text-center"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <p className="text-3xl font-bold text-red-400">
              {result.incorrect}
            </p>
            <p className="text-xs text-slate-400 mt-1">Incorrect</p>
          </div>
          <div
            className="p-6 rounded-2xl text-center"
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <p className="text-3xl font-bold text-blue-400">
              {Math.round(result.timeSpent / 60)}m
            </p>
            <p className="text-xs text-slate-400 mt-1">Time Spent</p>
          </div>
          <div
            className="p-6 rounded-2xl text-center"
            style={{
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <p className="text-3xl font-bold text-purple-400">
              {result.totalQuestions}
            </p>
            <p className="text-xs text-slate-400 mt-1">Total Questions</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-800">
          {["overview", "subjects", "difficulty"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-3 font-medium text-sm transition-all border-b-2"
              style={{
                color: activeTab === tab ? "#00CED1" : "#94A3B8",
                borderColor: activeTab === tab ? "#00CED1" : "transparent",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div
            className="glass rounded-2xl p-8"
            style={{
              background: "rgba(30,27,75,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 className="text-xl font-bold text-white mb-6">
              Answer Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => (
                    <span className="text-white">{value} questions</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === "subjects" && (
          <div
            className="glass rounded-2xl p-8"
            style={{
              background: "rgba(30,27,75,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 className="text-xl font-bold text-white mb-6">
              Performance by Subject
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    background: "rgba(15,23,42,0.9)",
                    border: "1px solid rgba(99,102,241,0.3)",
                  }}
                />
                <Bar dataKey="score" fill="#00CED1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Difficulty Tab */}
        {activeTab === "difficulty" && (
          <div
            className="glass rounded-2xl p-8"
            style={{
              background: "rgba(30,27,75,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 className="text-xl font-bold text-white mb-6">
              Breakdown by Difficulty
            </h3>
            <div className="space-y-4">
              {difficultyData.map((item) => {
                const percentage = Math.round(
                  (item.value / result.totalQuestions) * 100
                );
                return (
                  <div key={item.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{item.name}</span>
                      <span className="text-slate-400">{item.value}</span>
                    </div>
                    <div
                      className="h-2 rounded-full"
                      style={{ background: "rgba(100,116,139,0.2)" }}
                    >
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          background: "linear-gradient(90deg, #00CED1, #00B5CC)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/exam/mock"
            className="flex-1 py-3 rounded-xl font-semibold text-white text-center"
            style={{
              background: "linear-gradient(135deg, #00CED1, #00B5CC)",
            }}
          >
            Retake Mock Exam
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 py-3 rounded-xl font-semibold text-white text-center"
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
