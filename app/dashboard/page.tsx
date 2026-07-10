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

/* ── Paper A Subjects ── */
const PAPER_A_SUBJECTS: Block[] = [
  { id: "anatomy", title: "Anatomy & Histology", specialty: "Basic Science", description: "Study human body structures", icon: "🔬", color: "#3B82F6", difficulty: "Medium", total_mcqs: 520 },
  { id: "physiology", title: "Physiology", specialty: "Basic Science", description: "Body systems and functions", icon: "❤️", color: "#EF4444", difficulty: "Medium", total_mcqs: 480 },
  { id: "biochemistry", title: "Biochemistry", specialty: "Basic Science", description: "Molecular processes", icon: "⚗️", color: "#F59E0B", difficulty: "Medium", total_mcqs: 510 },
  { id: "pathology", title: "Pathology", specialty: "Basic Science", description: "Disease mechanisms", icon: "⚠️", color: "#8B5CF6", difficulty: "Hard", total_mcqs: 580 },
  { id: "microbiology", title: "Microbiology", specialty: "Basic Science", description: "Infectious agents", icon: "🦠", color: "#06B6D4", difficulty: "Hard", total_mcqs: 490 },
  { id: "pharmacology", title: "Pharmacology", specialty: "Clinical", description: "Drug mechanisms", icon: "💊", color: "#10B981", difficulty: "Hard", total_mcqs: 620 },
  { id: "community-medicine", title: "Community Medicine", specialty: "Public Health", description: "Public health concepts", icon: "🌍", color: "#EC4899", difficulty: "Medium", total_mcqs: 420 },
];

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
    <div className="group relative rounded-xl p-4 overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${color}10, ${color}05)`,
        border: `1.5px solid ${color}25`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)`
      }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}15, transparent)`,
        }} />

      <div className="relative flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${color}30, ${color}15)`,
            border: `1.5px solid ${color}40`,
            boxShadow: `0 4px 16px ${color}20`
          }}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">{label}</p>
          <p className="text-2xl font-black text-white mt-1">{value}</p>
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
    <nav className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between"
      style={{
        background: "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
      }}>
      {/* Left - Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <img src="/logo.png" alt="MedCore" className="h-8 sm:h-9 w-auto" />
        <div className="hidden sm:flex flex-col gap-0">
          <span className="text-white font-black text-sm">MedCore</span>
          <span className="text-cyan-400 text-xs font-semibold">Master Medicine</span>
        </div>
      </Link>

      {/* Right - User & Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden lg:flex flex-col gap-0">
            <span className="text-xs font-semibold text-white">{name.split(" ")[0]}</span>
            <span className="text-xs text-white/60">Learner</span>
          </div>
        </div>
        <button onClick={onLogout}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300"
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

      // Use Paper A Subjects
      setBlocks(PAPER_A_SUBJECTS);

      // Fetch user sessions
      const sessionsRes = await fetch("/api/sessions", {
        headers: {
          "x-user-id": user.id,
        },
      });
      const sessionsData = await sessionsRes.json();
      console.log("Sessions fetched:", sessionsData.sessions?.length || 0);
      console.log("Sessions data sample:", sessionsData.sessions?.[0]);
      setSessions(sessionsData.sessions || []);

      // Fetch user stats from database
      try {
        const { data: userProgressData, error: progressError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .single();

        // Fetch study streak
        const { data: streakData } = await supabase
          .from("study_streaks")
          .select("*")
          .eq("user_id", user.id)
          .single();

        console.log("User progress data:", userProgressData, "Streak data:", streakData);

        if (userProgressData) {
          const totalMcqs = userProgressData.total_mcqs_attempted || 0;
          const totalCorrect = userProgressData.total_correct || 0;
          const accuracy = userProgressData.overall_accuracy || 0;

          setUserStats({
            total_questions_answered: totalMcqs,
            total_correct: totalCorrect,
            total_incorrect: totalMcqs - totalCorrect,
            current_streak: (streakData?.current_streak as number) || 0,
            accuracy_percentage: isNaN(accuracy) ? 0 : Math.round(accuracy),
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
        console.error("Error fetching user stats:", err);
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

  /* ── refresh data every 1.5 seconds for live updates ── */
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 1500);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  /* ── listen for session completion events ── */
  useEffect(() => {
    const handleSessionComplete = () => {
      console.log("Session completed, refreshing dashboard...");
      fetchAllData();
    };

    window.addEventListener("sessionCompleted", handleSessionComplete);
    return () => window.removeEventListener("sessionCompleted", handleSessionComplete);
  }, [fetchAllData]);

  /* ── listen for updates in real-time ── */
  useEffect(() => {
    if (!user?.id) return;

    const supabase = getSupabase();

    // Subscribe to session changes
    const sessionsChannel = supabase
      .channel(`user_sessions_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('✓ Session change detected via real-time, refetching...');
          fetchAllData();
        }
      )
      .subscribe((status) => {
        console.log('Sessions subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✓ Real-time sessions subscribed successfully');
        } else if (status === 'CLOSED') {
          console.warn('Sessions subscription closed');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Sessions subscription error - will fall back to polling');
        }
      });

    // Subscribe to user_progress changes
    const progressChannel = supabase
      .channel(`user_progress_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('✓ User progress updated via real-time, refetching...');
          fetchAllData();
        }
      )
      .subscribe((status) => {
        console.log('Progress subscription status:', status);
      });

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(progressChannel);
    };
  }, [user?.id, fetchAllData]);

  function logout() {
    localStorage.removeItem("medcore_user");
    router.push("/login");
  }

  /* ── derived stats from database ── */
  const totalBlocks = blocks.length;

  // Calculate from sessions (more reliable than user_progress)
  const completedBlockIds = [...new Set(sessions.map((s: any) => s.block_id || s.blockId).filter(Boolean))];
  const completedCount = completedBlockIds.length;

  // Calculate totals from sessions for more accuracy
  const sessionTotals = sessions.reduce((acc: any, s: any) => {
    return {
      totalMcqs: acc.totalMcqs + (s.total_mcqs || 0),
      totalCorrect: acc.totalCorrect + (s.correct_count || 0),
      totalIncorrect: acc.totalIncorrect + (s.incorrect_count || 0),
    };
  }, { totalMcqs: 0, totalCorrect: 0, totalIncorrect: 0 });

  // Use sessions data, fallback to user_progress
  const totalMcqs = sessionTotals.totalMcqs > 0 ? sessionTotals.totalMcqs : (userStats?.total_questions_answered || 0);
  const totalCorrect = sessionTotals.totalCorrect > 0 ? sessionTotals.totalCorrect : (userStats?.total_correct || 0);
  const totalIncorrect = sessionTotals.totalIncorrect > 0 ? sessionTotals.totalIncorrect : (userStats?.total_incorrect || 0);
  const overallAcc = totalMcqs > 0 ? Math.round((totalCorrect / totalMcqs) * 100) : (userStats?.accuracy_percentage || 0);
  const currentStreak = userStats?.current_streak || 0;

  const highestSession = sessions.reduce<any>((best, s: any) => {
    const score = s.score || 0;
    const bestScore = best?.score || best?.score === 0 ? best.score : 0;
    return best === null || score > bestScore ? s : best;
  }, null);

  /* ── latest session per block ── */
  const latestByBlock: Record<string, any> = {};
  for (const s of sessions) {
    const blockId = s.block_id || s.blockId;
    const completedAt = s.completed_at || s.completedAt;

    if (blockId && completedAt) {
      if (!latestByBlock[blockId] ||
          new Date(completedAt).getTime() > new Date(latestByBlock[blockId].completed_at || latestByBlock[blockId].completedAt).getTime()) {
        latestByBlock[blockId] = s;
      }
    }
  }

  /* ── chart data ── */
  const barData = blocks.map((b) => {
    const latest = latestByBlock[b.id];
    return {
      name: b.specialty.split(" ")[0],
      Score: latest ? Math.round(latest.score || 0) : 0,
      full: b.title,
    };
  });

  const pieData = totalMcqs && totalMcqs > 0
    ? [
        { name: "Correct", value: totalCorrect },
        { name: "Incorrect", value: totalIncorrect },
      ]
    : [{ name: "No data", value: 1 }];

  const areaData = sessions
    .slice()
    .filter((s: any) => (s.completed_at || s.completedAt) && typeof s.score === "number")
    .sort((a: any, b: any) => {
      const dateA = new Date(a.completed_at || a.completedAt).getTime();
      const dateB = new Date(b.completed_at || b.completedAt).getTime();
      return dateA - dateB;
    })
    .map((s: any, i: number) => ({
      idx: `#${i + 1}`,
      Score: Math.round(s.score || 0),
      block: s.blockTitle || s.block_id || "Unknown",
    }));

  const subjectData = blocks.map((b, i) => {
    const latest = latestByBlock[b.id];
    return {
      name: b.specialty.split(" ")[0],
      Accuracy: latest && typeof latest.score === "number" ? Math.round(latest.score) : 0,
      fill: COLORS[i % COLORS.length],
    };
  });

  if (!user) return null;

  return (
    <div className="min-h-screen page-enter" style={{ background: "#050B18" }}>
      <Navbar name={user.name} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">

        {/* ── welcome banner ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
              Welcome back, <span style={{ backgroundImage: "linear-gradient(135deg, #3B82F6, #8B5CF6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>{user.name.split(" ")[0]}</span>
            </h1>
            <p className="text-white/80 text-sm flex items-center gap-2">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon="📚" label="Blocks Completed" value={completedCount} sub={`of ${totalBlocks} available`} color="#3B82F6" />
          <StatCard icon="❓" label="MCQs Attempted" value={totalMcqs} sub="across all blocks" color="#8B5CF6" />
          <StatCard icon="✅" label="Correct Answers" value={totalCorrect} sub={`${overallAcc}% accuracy`} color="#10B981" />
          <StatCard icon="🔥" label="Current Streak" value={currentStreak} sub="consecutive days" color="#EF4444" />
        </div>


        {/* ── analytics section ── */}
        {sessions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800/50">
              <div className="w-2 h-8 rounded-full" style={{ background: "linear-gradient(180deg, #3B82F6, #8B5CF6)" }} />
              <div>
                <h2 className="text-2xl font-black text-white">Performance Analytics</h2>
                <p className="text-xs text-white/60 mt-0.5">Track your learning journey</p>
              </div>
              <span className="ml-auto text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">

              {/* overall accuracy ring + stats */}
              <div className="glass rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                <p className="text-xs text-white uppercase tracking-wide">Overall Accuracy</p>
                <ScoreRing pct={overallAcc} />
                <div className="w-full grid grid-cols-2 gap-2 mt-1">
                  <div className="text-center p-2 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <p className="text-lg font-bold text-emerald-400">{totalCorrect}</p>
                    <p className="text-xs text-white">Correct</p>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <p className="text-lg font-bold text-red-400">{totalIncorrect}</p>
                    <p className="text-xs text-white">Incorrect</p>
                  </div>
                </div>
              </div>

              {/* pie chart */}
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-white uppercase tracking-wide mb-2">Answer Distribution</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
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
              <div className="glass rounded-xl p-4">
                <p className="text-xs text-white uppercase tracking-wide mb-2">Score Trend</p>
                {areaData.length >= 2 ? (
                  <ResponsiveContainer width="100%" height={160}>
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
                  <div className="h-32 flex items-center justify-center text-white text-xs">
                    Complete 2+ blocks to see trend
                  </div>
                )}
              </div>
            </div>

            {/* bar chart: score by specialty */}
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-white uppercase tracking-wide mb-2">Score by Specialty</p>
              <ResponsiveContainer width="100%" height={180}>
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
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-white uppercase tracking-wide mb-3">Subject Accuracy Breakdown</p>
              <div className="space-y-3">
                {subjectData.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 truncate">{blocks.find((b) => b.specialty.startsWith(s.name))?.title ?? s.name}</span>
                      <span className="font-semibold ml-2" style={{ color: s.fill }}>{s.Accuracy}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "#1a2844" }}>
                      <div className="h-1.5 rounded-full progress-fill"
                        style={{ width: `${s.Accuracy}%`, background: `linear-gradient(90deg, ${s.fill}99, ${s.fill})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* session history */}
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-white uppercase tracking-wide mb-2">Session History</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {["Block", "Score", "Correct", "Incorrect", "Date"].map((h) => (
                        <th key={h} className="text-left py-1 px-2 text-xs text-white uppercase tracking-wide font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sessions
                      .slice()
                      .filter((s: any) => {
                        const completedAt = s.completed_at || s.completedAt;
                        const score = s.score;
                        return completedAt && typeof score === "number" && !isNaN(score);
                      })
                      .sort((a: any, b: any) => {
                        const dateA = a.completed_at || a.completedAt;
                        const dateB = b.completed_at || b.completedAt;
                        return new Date(dateB).getTime() - new Date(dateA).getTime();
                      })
                      .slice(0, 8)
                      .map((s: any) => {
                        const blockTitle = s.blockTitle || s.block_id || "Unknown Block";
                        const score = typeof s.score === "number" ? s.score : 0;
                        const correctCount = s.correctCount || s.correct_count || 0;
                        const totalMcqs = s.totalMcqs || s.total_mcqs || 0;
                        const completedAt = s.completed_at || s.completedAt;

                        return (
                          <tr key={s.id} className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                            <td className="py-1.5 px-2 text-slate-200 font-medium truncate">{blockTitle}</td>
                            <td className="py-1.5 px-2">
                              <span className="font-bold" style={{
                                color: score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444"
                              }}>{Math.round(score)}%</span>
                            </td>
                            <td className="py-1.5 px-2 text-emerald-400">{correctCount}</td>
                            <td className="py-1.5 px-2 text-red-400">{totalMcqs - correctCount}</td>
                            <td className="py-1.5 px-2 text-white">
                              {completedAt
                                ? new Date(completedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "2-digit" })
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* empty analytics state */
          !loading && (
            <div className="glass rounded-xl p-8 text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-base font-semibold text-white mb-1">No Analytics Yet</h3>
              <p className="text-white text-xs">Complete your first block to unlock performance analytics, charts, and insights.</p>
            </div>
          )
        )}

        {/* ── practice modes ── */}
        <div className="mt-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2 pb-3 border-b border-slate-800/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🎯</span>
                <h2 className="text-2xl font-black text-white">Practice Modes</h2>
              </div>
              <p className="text-xs text-white/60">Master your skills with specialized learning methods</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Timed Exam */}
            <Link
              href="/exam/timed"
              className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,27,75,0.5))",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <div className="p-4 space-y-2">
                <div className="text-3xl">⏱️</div>
                <h3 className="text-base font-bold text-white">Timed Exam</h3>
                <p className="text-xs text-white/70">2h 30m CBT simulation with real exam conditions</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-2 py-0.5 rounded-lg text-xs bg-blue-500/20 text-blue-300">200 Questions</span>
                  <span className="px-2 py-0.5 rounded-lg text-xs bg-cyan-500/20 text-cyan-300">Timer</span>
                </div>
              </div>
            </Link>

            {/* Mock Exam */}
            <Link
              href="/exam/mock"
              className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,27,75,0.5))",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <div className="p-4 space-y-2">
                <div className="text-3xl">📋</div>
                <h3 className="text-base font-bold text-white">Mock Exam</h3>
                <p className="text-xs text-white/70">Full simulation with detailed analytics & breakdown</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-2 py-0.5 rounded-lg text-xs bg-amber-500/20 text-amber-300">Analytics</span>
                  <span className="px-2 py-0.5 rounded-lg text-xs bg-orange-500/20 text-orange-300">Report</span>
                </div>
              </div>
            </Link>

            {/* Spaced Repetition */}
            <Link
              href="/learn/spaced-repetition"
              className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,27,75,0.5))",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <div className="p-4 space-y-2">
                <div className="text-3xl">🧠</div>
                <h3 className="text-base font-bold text-white">Spaced Repetition</h3>
                <p className="text-xs text-white/70">SM-2 algorithm for optimal retention & mastery</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-2 py-0.5 rounded-lg text-xs bg-green-500/20 text-green-300">Smart Learning</span>
                  <span className="px-2 py-0.5 rounded-lg text-xs bg-emerald-500/20 text-emerald-300">Adaptive</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
