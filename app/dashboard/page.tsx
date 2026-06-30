"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid,
} from "recharts";
import { getSupabase } from "@/lib/supabase";
import type { BlockSession } from "@/lib/types";

interface Block {
  id: string;
  title: string;
  specialty: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  total_mcqs: number;
}

interface UserStats {
  total_questions_answered: number;
  total_correct: number;
  total_incorrect: number;
  current_streak: number;
  accuracy_percentage: number;
}

/* ── palette ── */
const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];
const DIFF_COLOR = { Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444" } as const;

/* ── helpers ── */
function clsx(...cls: (string | boolean | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

function ScoreRing({ pct }: { pct: number }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 75 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1a2844" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{ transition: "stroke-dasharray 1s ease" }} />
      <text x="50" y="54" textAnchor="middle" fill={color} fontSize="16" fontWeight="700"
        fontFamily="Inter, sans-serif">
        {pct}%
      </text>
    </svg>
  );
}

/* ── stat card ── */
function StatCard({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 hover:scale-105 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}08)`,
        border: `1.5px solid ${color}30`,
        boxShadow: `0 8px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0px rgba(255,255,255,0.08)`
      }}>
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{
          background: `${color}20`,
          border: `1.5px solid ${color}40`,
          boxShadow: `0 4px 12px ${color}20`
        }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white uppercase tracking-widest font-semibold">{label}</p>
        <p className="text-3xl font-black text-white mt-1">{value}</p>
        {sub && <p className="text-xs text-white mt-1 truncate">{sub}</p>}
      </div>
    </div>
  );
}

/* ── custom tooltip for charts ── */
function ChartTip({ active, payload, label }: {
  active?: boolean; payload?: { value: number; name: string }[]; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-sm">
      {label && <p className="text-white mb-1 text-xs">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="text-white font-semibold">{p.name}: {p.value}%</p>
      ))}
    </div>
  );
}

/* ── Navbar ── */
function Navbar({ name, onLogout }: { name: string; onLogout: () => void }) {
  return (
    <nav className="sticky top-0 z-50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center justify-between"
      style={{
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.6))",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
      }}>
      {/* Left side - Logo/Title */}
      <Link href="/" className="flex items-start gap-2 sm:gap-3 hover:opacity-80 transition-opacity duration-300">
        <img src="/logo.png" alt="MedCore Logo" className="h-10 sm:h-12 w-auto flex-shrink-0" />

        {/* Title and tagline - vertically stacked */}
        <div className="flex flex-col gap-0.5 justify-start">
          <div className="text-white font-black text-base sm:text-xl leading-tight max-w-fit">MedCore</div>
          <div className="text-cyan-400 text-xs font-semibold leading-none">crystal clear concepts</div>
        </div>
      </Link>

      {/* Right side - User info and Logout */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl"
          style={{ background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}>
            {name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{name}</span>
            <span className="text-xs text-white">Candidate</span>
          </div>
        </div>
        <button onClick={onLogout}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 border"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            borderColor: "rgba(239, 68, 68, 0.3)",
            color: "#FECACA"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
          }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; id: string } | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [sessions, setSessions] = useState<BlockSession[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── auth guard ── */
  useEffect(() => {
    const stored = localStorage.getItem("medcore_user");
    if (!stored) { router.push("/login"); return; }
    const userData = JSON.parse(stored);
    setUser(userData);
  }, [router]);

  /* ── fetch all data ── */
  const fetchAllData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const supabase = getSupabase();

      // Fetch blocks from database
      const blocksRes = await fetch("/api/blocks");
      const blocksData = await blocksRes.json();
      setBlocks(blocksData.blocks || []);

      // Fetch user sessions
      const sessionsRes = await fetch("/api/sessions");
      const sessionsData = await sessionsRes.json();
      setSessions(sessionsData.sessions || []);

      // Fetch user stats from database
      try {
        const { data: userProgressData } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (userProgressData) {
          setUserStats({
            total_questions_answered: userProgressData.total_questions || 0,
            total_correct: userProgressData.correct_answers || 0,
            total_incorrect: (userProgressData.total_questions || 0) - (userProgressData.correct_answers || 0),
            current_streak: userProgressData.current_streak || 0,
            accuracy_percentage: userProgressData.total_questions ? Math.round((userProgressData.correct_answers / userProgressData.total_questions) * 100) : 0,
          });
        } else {
          // Default stats if no progress found
          setUserStats({
            total_questions_answered: 0,
            total_correct: 0,
            total_incorrect: 0,
            current_streak: 0,
            accuracy_percentage: 0,
          });
        }
      } catch (err) {
        console.log("No user progress yet");
        // Default stats on error
        setUserStats({
          total_questions_answered: 0,
          total_correct: 0,
          total_incorrect: 0,
          current_streak: 0,
          accuracy_percentage: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  }, [user?.id]);

  /* ── initial data load ── */
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  /* ── refresh data every 5 seconds for live updates ── */
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  function logout() {
    localStorage.removeItem("medcore_user");
    router.push("/login");
  }

  /* ── derived stats from database ── */
  const totalBlocks = blocks.length;
  const completedBlockIds = [...new Set(sessions.map((s) => s.blockId))];
  const completedCount = completedBlockIds.length;
  const totalMcqs = userStats?.total_questions_answered || 0;
  const totalCorrect = userStats?.total_correct || 0;
  const totalIncorrect = userStats?.total_incorrect || 0;
  const overallAcc = userStats?.accuracy_percentage || 0;
  const currentStreak = userStats?.current_streak || 0;
  const highestSession = sessions.reduce<BlockSession | null>((best, s) =>
    best === null || s.score > best.score ? s : best, null);

  /* ── latest session per block ── */
  const latestByBlock: Record<string, BlockSession> = {};
  for (const s of sessions) {
    if (!latestByBlock[s.blockId] || s.completedAt > latestByBlock[s.blockId].completedAt)
      latestByBlock[s.blockId] = s;
  }

  /* ── chart data ── */
  const barData = blocks.map((b) => ({
    name: b.specialty.split(" ")[0],
    Score: latestByBlock[b.id] ? Math.round(latestByBlock[b.id].score) : 0,
    full: b.title,
  }));

  const pieData = totalMcqs
    ? [
        { name: "Correct", value: totalCorrect },
        { name: "Incorrect", value: totalIncorrect },
      ]
    : [{ name: "No data", value: 1 }];

  const areaData = sessions
    .slice()
    .sort((a, b) => a.completedAt.localeCompare(b.completedAt))
    .map((s, i) => ({
      idx: `#${i + 1}`,
      Score: Math.round(s.score),
      block: s.blockTitle,
    }));

  const subjectData = blocks.map((b, i) => ({
    name: b.specialty.split(" ")[0],
    Accuracy: latestByBlock[b.id] ? Math.round(latestByBlock[b.id].score) : 0,
    fill: COLORS[i % COLORS.length],
  }));

  if (!user) return null;

  return (
    <div className="min-h-screen page-enter" style={{ background: "#050B18" }}>
      <Navbar name={user.name} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">

        {/* ── welcome banner ── */}
        <div className="flex items-center justify-between flex-wrap gap-6 mb-2">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Welcome back, <span style={{ backgroundImage: "linear-gradient(135deg, #60A5FA, #A78BFA)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>{user.name.split(" ")[0]}</span>
            </h1>
            <p className="text-white text-base">
              {completedCount === 0
                ? "🎯 Start your first block to begin tracking progress"
                : `📊 You have completed ${completedCount}/${totalBlocks} blocks — keep going!`}
            </p>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 146, 60, 0.08))",
              border: "1px solid rgba(251, 146, 60, 0.3)"
            }}>
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-xs text-white uppercase tracking-wide">Blocks Completed</p>
              {completedCount > 0 ? (
                <p className="text-xl font-bold text-white"><strong>{completedCount}</strong>/{totalBlocks}</p>
              ) : (
                <p className="text-lg font-semibold text-slate-300">Get Started</p>
              )}
            </div>
          </div>
        </div>

        {/* ── stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="📚" label="Blocks Completed" value={completedCount} sub={`of ${totalBlocks} available`} color="#3B82F6" />
          <StatCard icon="❓" label="MCQs Attempted" value={totalMcqs} sub="across all blocks" color="#8B5CF6" />
          <StatCard icon="✅" label="Correct Answers" value={totalCorrect} sub={`${overallAcc}% accuracy`} color="#10B981" />
          <StatCard icon="🔥" label="Current Streak" value={currentStreak} sub="consecutive days" color="#EF4444" />
        </div>

        {/* ── analytics section ── */}
        {sessions.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-800/50">
              <div className="w-2 h-8 rounded-full" style={{ background: "linear-gradient(180deg, #3B82F6, #8B5CF6)" }} />
              <div>
                <h2 className="text-2xl font-black text-white">Performance Analytics</h2>
                <p className="text-xs text-white mt-1">Track your progress and improvement</p>
              </div>
              <span className="ml-auto text-xs px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

              {/* overall accuracy ring + stats */}
              <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
                <p className="text-xs text-white uppercase tracking-wide">Overall Accuracy</p>
                <ScoreRing pct={overallAcc} />
                <div className="w-full grid grid-cols-2 gap-3 mt-2">
                  <div className="text-center p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <p className="text-2xl font-bold text-emerald-400">{totalCorrect}</p>
                    <p className="text-xs text-white">Correct</p>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <p className="text-2xl font-bold text-red-400">{totalIncorrect}</p>
                    <p className="text-xs text-white">Incorrect</p>
                  </div>
                </div>
              </div>

              {/* pie chart */}
              <div className="glass rounded-2xl p-6">
                <p className="text-xs text-white uppercase tracking-wide mb-4">Answer Distribution</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      paddingAngle={pieData.length > 1 ? 4 : 0} dataKey="value">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={
                          pieData[i].name === "Correct" ? "#10B981" :
                          pieData[i].name === "Incorrect" ? "#EF4444" : "#374151"
                        } />
                      ))}
                    </Pie>
                    <Legend formatter={(v) => <span className="text-slate-300 text-xs">{v}</span>} />
                    <Tooltip content={<ChartTip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* score trend */}
              <div className="glass rounded-2xl p-6">
                <p className="text-xs text-white uppercase tracking-wide mb-4">Score Trend</p>
                {areaData.length >= 2 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a2844" />
                      <XAxis dataKey="idx" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} width={28} />
                      <Tooltip content={<ChartTip />} />
                      <Area type="monotone" dataKey="Score" stroke="#3B82F6" strokeWidth={2}
                        fill="url(#scoreGrad)" dot={{ fill: "#3B82F6", r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-white text-sm">
                    Complete 2+ blocks to see trend
                  </div>
                )}
              </div>
            </div>

            {/* bar chart: score by specialty */}
            <div className="glass rounded-2xl p-6">
              <p className="text-xs text-white uppercase tracking-wide mb-4">Score by Specialty</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2844" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} width={28}
                    tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = barData.find((b) => b.name === payload[0]?.payload?.name);
                      return (
                        <div className="glass rounded-xl px-3 py-2 text-sm">
                          <p className="text-white text-xs mb-1">{d?.full}</p>
                          <p className="text-white font-semibold">Score: {payload[0].value}%</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="Score" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* subject accuracy progress bars */}
            <div className="glass rounded-2xl p-6">
              <p className="text-xs text-white uppercase tracking-wide mb-5">Subject Accuracy Breakdown</p>
              <div className="space-y-4">
                {subjectData.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-slate-300">{blocks.find((b) => b.specialty.startsWith(s.name))?.title ?? s.name}</span>
                      <span className="font-semibold" style={{ color: s.fill }}>{s.Accuracy}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "#1a2844" }}>
                      <div className="h-2 rounded-full progress-fill"
                        style={{ width: `${s.Accuracy}%`, background: `linear-gradient(90deg, ${s.fill}99, ${s.fill})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* session history */}
            <div className="glass rounded-2xl p-6">
              <p className="text-xs text-white uppercase tracking-wide mb-4">Session History</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {["Block", "Score", "Correct", "Incorrect", "Date"].map((h) => (
                        <th key={h} className="text-left py-2 pr-4 text-xs text-white uppercase tracking-wide font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sessions
                      .slice()
                      .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
                      .map((s) => (
                        <tr key={s.id} className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 pr-4 text-slate-200 font-medium">{s.blockTitle}</td>
                          <td className="py-3 pr-4">
                            <span className="font-bold" style={{
                              color: s.score >= 80 ? "#10B981" : s.score >= 60 ? "#F59E0B" : "#EF4444"
                            }}>{Math.round(s.score)}%</span>
                          </td>
                          <td className="py-3 pr-4 text-emerald-400">{s.correctCount}</td>
                          <td className="py-3 pr-4 text-red-400">{s.totalMcqs - s.correctCount}</td>
                          <td className="py-3 pr-4 text-white">{new Date(s.completedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "2-digit" })}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* empty analytics state */
          !loading && (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">No Analytics Yet</h3>
              <p className="text-white text-sm mb-6">Complete your first block to unlock performance analytics, charts, and insights.</p>
            </div>
          )
        )}

        {/* ── blocks grid ── */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4 pb-4 border-b border-slate-800/50">
            <div>
              <h2 className="text-2xl font-black text-white">Available Blocks</h2>
              <p className="text-xs text-white mt-1">Practice all subjects and track your progress</p>
            </div>
            <div className="flex items-center gap-5 text-xs text-white">
              <span className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(16, 185, 129, 0.08)" }}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Completed</span>
              </span>
              <span className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(100, 116, 139, 0.08)" }}>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <span className="text-white">Not Started</span>
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocks.map((block, i) => {
              const session = latestByBlock[block.id];
              const done = !!session;
              const score = done ? Math.round(session.score) : null;

              return (
                <div
                  key={block.id}
                  className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl card-lift"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    animation: "fade-in 0.5s ease forwards",
                    opacity: 0,
                    background: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,27,75,0.4))",
                    border: "1px solid rgba(99,102,241,0.15)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0px rgba(255,255,255,0.08)"
                  }}
                >
                  {/* animated background gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${block.color.includes('from-red') ? 'rgba(239,68,68,0.05)' : block.color.includes('from-sky') ? 'rgba(59,130,246,0.05)' : block.color.includes('from-purple') ? 'rgba(139,92,246,0.05)' : 'rgba(245,158,11,0.05)'}, transparent)`
                    }} />

                  {/* gradient header */}
                  <div className={`bg-gradient-to-br ${block.color} p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.4), transparent 70%)",
                      }} />

                    <div className="relative flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                          style={{
                            background: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.3)"
                          }}>
                          {block.icon}
                        </div>
                        <h3 className="text-white font-black text-lg leading-tight">{block.title}</h3>
                        <p className="text-white/60 text-xs mt-1.5 font-medium uppercase tracking-wide">{block.specialty}</p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span className="text-xs px-3 py-1.5 rounded-lg font-bold text-white/95"
                          style={{
                            background: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.25)"
                          }}>
                          {block.difficulty}
                        </span>
                        {done && score !== null && <ScoreRing pct={score} />}
                      </div>
                    </div>

                    {/* MCQ count badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mt-2"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.2)"
                      }}>
                      <span className="text-sm font-bold text-white">{(block as any).mcqs?.length || (block as any).total_mcqs || 0}</span>
                      <span className="text-xs text-white/70">MCQs</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <p className="text-sm text-white/80 leading-relaxed h-10 overflow-hidden">{block.description}</p>

                    <div className="flex items-center gap-3">
                      {done && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
                          <span className="text-emerald-400 text-sm font-semibold">✓</span>
                          <span className="text-emerald-400 text-xs font-medium">Completed</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2.5 pt-2">
                      <Link
                        href={`/block/${block.id}`}
                        className="block w-full py-3 rounded-xl text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95"
                        style={done
                          ? {
                            background: "linear-gradient(135deg, rgba(148,163,184,0.1), rgba(100,116,139,0.08))",
                            color: "#CBD5E1",
                            border: "1.5px solid rgba(148,163,184,0.25)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                          }
                          : {
                            background: "linear-gradient(135deg, #00CED1 0%, #00B5CC 100%)",
                            color: "#fff",
                            boxShadow: "0 8px 24px rgba(0,206,209,0.3), 0 2px 8px rgba(0,0,0,0.1)"
                          }
                        }
                      >
                        {done ? "Retake Block" : "Start Block →"}
                      </Link>

                      {done && (
                        <Link
                          href={`/block/${block.id}/review`}
                          className="block w-full py-2.5 rounded-xl text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95"
                          style={{
                            background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.1))",
                            color: "#93C5FD",
                            border: "1.5px solid rgba(59,130,246,0.3)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                          }}
                        >
                          📊 Review Results
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
