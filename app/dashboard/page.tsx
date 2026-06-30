"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Flame, BookOpen, CheckCircle2, TrendingUp } from "lucide-react";
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
    <div className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${color}10, ${color}05)`,
        border: `1.5px solid ${color}25`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)`
      }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}15, transparent)`,
        }} />

      <div className="relative flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${color}30, ${color}15)`,
            border: `1.5px solid ${color}40`,
            boxShadow: `0 4px 16px ${color}20`
          }}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">{label}</p>
          <p className="text-4xl font-black text-white mt-2">{value}</p>
          {sub && <p className="text-xs text-white/60 mt-1 truncate">{sub}</p>}
        </div>
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
    <nav className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between"
      style={{
        background: "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
      }}>
      {/* Left - Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <img src="/logo.png" alt="MedCore" className="h-9 sm:h-10 w-auto" />
        <div className="flex flex-col gap-0">
          <span className="text-white font-black text-base sm:text-lg">MedCore</span>
          <span className="text-cyan-400 text-xs font-semibold">Master Medicine</span>
        </div>
      </Link>

      {/* Right - User & Logout */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-xs font-semibold text-white">{name}</span>
            <span className="text-xs text-white/60">Learner</span>
          </div>
        </div>
        <button onClick={onLogout}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#FCA5A5"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
          }}>
          Sign Out
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
        <div className="flex items-center justify-between flex-wrap gap-6 mb-8">
          <div>
            <h1 className="text-5xl font-black text-white mb-3">
              Welcome back, <span style={{ backgroundImage: "linear-gradient(135deg, #3B82F6, #8B5CF6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>{user.name.split(" ")[0]}</span>
            </h1>
            <p className="text-white/80 text-base flex items-center gap-2">
              {completedCount === 0 ? (
                <><span>🎯</span> Start your first block to unlock insights</>
              ) : (
                <><TrendingUp className="w-5 h-5 text-emerald-400" /> On track! {completedCount}/{totalBlocks} blocks completed</>
              )}
            </p>
          </div>

          <div className="group relative rounded-2xl p-6 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,146,60,0.08))",
              border: "1.5px solid rgba(251,146,60,0.25)"
            }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, rgba(251,146,60,0.1), transparent)" }} />

            <div className="relative">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-400" />
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wide font-semibold">Progress</p>
                  <p className="text-2xl font-black text-white mt-1">
                    <span className="text-orange-400">{completedCount}</span>/{totalBlocks}
                  </p>
                </div>
              </div>
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
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800/50">
              <div className="w-2 h-10 rounded-full" style={{ background: "linear-gradient(180deg, #3B82F6, #8B5CF6)" }} />
              <div>
                <h2 className="text-3xl font-black text-white">Performance Analytics</h2>
                <p className="text-sm text-white/60 mt-1">Track your learning journey</p>
              </div>
              <span className="ml-auto text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4 pb-6 border-b border-slate-800/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                <h2 className="text-3xl font-black text-white">Learning Blocks</h2>
              </div>
              <p className="text-sm text-white/60">Master each subject systematically</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-white">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-white/80">Completed</span>
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(100,116,139,0.1)", border: "1px solid rgba(100,116,139,0.2)" }}>
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-white/80">Not Started</span>
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block, i) => {
              const session = latestByBlock[block.id];
              const done = !!session;
              const score = done ? Math.round(session.score) : null;
              const mcqCount = (block as any).mcqs?.length || (block as any).total_mcqs || 0;

              return (
                <div
                  key={block.id}
                  className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl card-lift"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    animation: "fade-in 0.6s ease forwards",
                    opacity: 0,
                    background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,27,75,0.5))",
                    border: "1px solid rgba(99,102,241,0.15)",
                    boxShadow: "0 12px 48px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.08)"
                  }}
                >
                  {/* hover glow */}
                  <div className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, transparent)`,
                      zIndex: -1
                    }} />

                  {/* gradient header */}
                  <div className={`bg-gradient-to-br ${block.color} p-7 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-300"
                      style={{
                        backgroundImage: "radial-gradient(circle at 100% -10%, rgba(255,255,255,0.5), transparent 70%)",
                      }} />

                    <div className="relative">
                      {/* Top row - Icon and Difficulty */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                          style={{
                            background: "rgba(255,255,255,0.18)",
                            backdropFilter: "blur(12px)",
                            border: "1.5px solid rgba(255,255,255,0.35)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
                          }}>
                          {block.icon}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs px-3 py-1.5 rounded-lg font-bold text-white"
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255,255,255,0.3)"
                            }}>
                            {block.difficulty}
                          </span>
                          {done && score !== null && (
                            <div className="text-center">
                              <div className="text-lg font-black text-white">{score}%</div>
                              <div className="text-xs text-white/70">Score</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Title and Specialty */}
                      <h3 className="text-white font-black text-xl leading-tight mb-1">{block.title}</h3>
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{block.specialty}</p>

                      {/* MCQ Badge */}
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.25)"
                        }}>
                        <span className="text-sm font-bold text-white">{mcqCount}</span>
                        <span className="text-xs text-white/70">Questions</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <p className="text-sm text-white/75 leading-relaxed">{block.description}</p>

                    {/* Status Badge */}
                    {done && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg w-fit"
                        style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-semibold">Completed</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-3">
                      <Link
                        href={`/block/${block.id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 group/btn"
                        style={done
                          ? {
                            background: "linear-gradient(135deg, rgba(100,116,139,0.15), rgba(71,85,105,0.1))",
                            color: "#CBD5E1",
                            border: "1.5px solid rgba(100,116,139,0.3)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                          }
                          : {
                            background: "linear-gradient(135deg, #00CED1 0%, #00B5CC 100%)",
                            color: "#fff",
                            boxShadow: "0 8px 24px rgba(0,206,209,0.35), 0 4px 12px rgba(0,0,0,0.15)"
                          }
                        }
                      >
                        {done ? "Retake Block" : "Start Block"}
                        {!done && <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                      </Link>

                      {done && (
                        <Link
                          href={`/block/${block.id}/review`}
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 group/btn"
                          style={{
                            background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(37,99,235,0.1))",
                            color: "#93C5FD",
                            border: "1.5px solid rgba(59,130,246,0.35)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                          }}
                        >
                          Review Results
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
