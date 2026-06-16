"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid,
} from "recharts";
import { BLOCKS } from "@/lib/blocks";
import type { BlockSession } from "@/lib/types";

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
    <div className="glass rounded-2xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-slate-400 truncate">{sub}</p>}
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
      {label && <p className="text-slate-400 mb-1 text-xs">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="text-white font-semibold">{p.name}: {p.value}%</p>
      ))}
    </div>
  );
}

/* ── Navbar ── */
function Navbar({ name, onLogout }: { name: string; onLogout: () => void }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/60 px-6 py-4 flex items-center justify-between"
      style={{ background: "rgba(5,11,24,0.9)", backdropFilter: "blur(16px)" }}>
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
          style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>M</div>
        <span className="text-white font-bold">Med<span className="text-blue-400">Core</span></span>
      </Link>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
            {name.charAt(0)}
          </div>
          <span>{name}</span>
        </div>
        <button onClick={onLogout}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-600">
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sessions, setSessions] = useState<BlockSession[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── auth guard ── */
  useEffect(() => {
    const stored = localStorage.getItem("medcore_user");
    if (!stored) { router.push("/login"); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  /* ── fetch sessions ── */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch {/* noop */}
      setLoading(false);
    }
    load();
  }, []);

  function logout() {
    localStorage.removeItem("medcore_user");
    router.push("/login");
  }

  /* ── derived stats ── */
  const totalBlocks = BLOCKS.length;
  const completedBlockIds = [...new Set(sessions.map((s) => s.blockId))];
  const completedCount = completedBlockIds.length;
  const totalMcqs = sessions.reduce((a, s) => a + s.totalMcqs, 0);
  const totalCorrect = sessions.reduce((a, s) => a + s.correctCount, 0);
  const totalIncorrect = totalMcqs - totalCorrect;
  const overallAcc = totalMcqs ? Math.round((totalCorrect / totalMcqs) * 100) : 0;
  const highestSession = sessions.reduce<BlockSession | null>((best, s) =>
    best === null || s.score > best.score ? s : best, null);

  /* ── latest session per block ── */
  const latestByBlock: Record<string, BlockSession> = {};
  for (const s of sessions) {
    if (!latestByBlock[s.blockId] || s.completedAt > latestByBlock[s.blockId].completedAt)
      latestByBlock[s.blockId] = s;
  }

  /* ── chart data ── */
  const barData = BLOCKS.map((b) => ({
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

  const subjectData = BLOCKS.map((b, i) => ({
    name: b.specialty.split(" ")[0],
    Accuracy: latestByBlock[b.id] ? Math.round(latestByBlock[b.id].score) : 0,
    fill: COLORS[i % COLORS.length],
  }));

  if (!user) return null;

  return (
    <div className="min-h-screen page-enter" style={{ background: "#050B18" }}>
      <Navbar name={user.name} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* ── welcome banner ── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}</span> 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {completedCount === 0
                ? "Start your first block to begin tracking progress."
                : `You have completed ${completedCount}/${totalBlocks} blocks — keep going!`}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 glass px-4 py-2.5 rounded-xl">
            <span className="text-orange-400 text-base">🔥</span>
            {completedCount > 0 ? (
              <span><strong className="text-white">{completedCount}</strong> block{completedCount !== 1 ? "s" : ""} completed</span>
            ) : (
              <span>No blocks completed yet</span>
            )}
          </div>
        </div>

        {/* ── stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="📚" label="Blocks Completed" value={completedCount} sub={`of ${totalBlocks} available`} color="#3B82F6" />
          <StatCard icon="❓" label="MCQs Attempted" value={totalMcqs} sub="across all blocks" color="#8B5CF6" />
          <StatCard icon="✅" label="Correct Answers" value={totalCorrect} sub={`${overallAcc}% accuracy`} color="#10B981" />
          <StatCard icon="🏆" label="Best Block Score" value={highestSession ? `${Math.round(highestSession.score)}%` : "—"} sub={highestSession?.blockTitle ?? "No attempts yet"} color="#F59E0B" />
        </div>

        {/* ── analytics section ── */}
        {sessions.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">Performance Analytics</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">Live</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

              {/* overall accuracy ring + stats */}
              <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Overall Accuracy</p>
                <ScoreRing pct={overallAcc} />
                <div className="w-full grid grid-cols-2 gap-3 mt-2">
                  <div className="text-center p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <p className="text-2xl font-bold text-emerald-400">{totalCorrect}</p>
                    <p className="text-xs text-slate-400">Correct</p>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <p className="text-2xl font-bold text-red-400">{totalIncorrect}</p>
                    <p className="text-xs text-slate-400">Incorrect</p>
                  </div>
                </div>
              </div>

              {/* pie chart */}
              <div className="glass rounded-2xl p-6">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-4">Answer Distribution</p>
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
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-4">Score Trend</p>
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
                  <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
                    Complete 2+ blocks to see trend
                  </div>
                )}
              </div>
            </div>

            {/* bar chart: score by specialty */}
            <div className="glass rounded-2xl p-6">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-4">Score by Specialty</p>
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
                          <p className="text-slate-400 text-xs mb-1">{d?.full}</p>
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
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-5">Subject Accuracy Breakdown</p>
              <div className="space-y-4">
                {subjectData.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-slate-300">{BLOCKS.find((b) => b.specialty.startsWith(s.name))?.title ?? s.name}</span>
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
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-4">Session History</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {["Block", "Score", "Correct", "Incorrect", "Date"].map((h) => (
                        <th key={h} className="text-left py-2 pr-4 text-xs text-slate-500 uppercase tracking-wide font-medium">{h}</th>
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
                          <td className="py-3 pr-4 text-slate-400">{new Date(s.completedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "2-digit" })}</td>
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
              <p className="text-slate-400 text-sm mb-6">Complete your first block to unlock performance analytics, charts, and insights.</p>
            </div>
          )
        )}

        {/* ── blocks grid ── */}
        <div>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-lg font-bold text-white">Available Blocks</h2>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />Not Started
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOCKS.map((block, i) => {
              const session = latestByBlock[block.id];
              const done = !!session;
              const score = done ? Math.round(session.score) : null;

              return (
                <div
                  key={block.id}
                  className="glass rounded-2xl overflow-hidden card-lift"
                  style={{ animationDelay: `${i * 0.05}s`, animation: "fade-in 0.5s ease forwards", opacity: 0 }}
                >
                  {/* gradient header */}
                  <div className={`bg-gradient-to-r ${block.color} p-5 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3), transparent 60%)",
                      }} />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <span className="text-3xl">{block.icon}</span>
                        <h3 className="text-white font-bold text-base mt-2 leading-tight">{block.title}</h3>
                        <p className="text-white/70 text-xs mt-0.5">{block.specialty}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white/90"
                          style={{ background: "rgba(255,255,255,0.15)" }}>
                          {block.difficulty}
                        </span>
                        {done && score !== null && <ScoreRing pct={score} />}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed">{block.description}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>📝 {block.mcqs.length} MCQs</span>
                      <span style={{ color: DIFF_COLOR[block.difficulty] }}>● {block.difficulty}</span>
                      {done && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          ✓ Done
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/block/${block.id}`}
                      className="block w-full py-2.5 rounded-xl text-center text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                      style={done
                        ? { background: "rgba(255,255,255,0.06)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }
                        : { background: "linear-gradient(135deg, #2563EB, #7C3AED)", color: "#fff", boxShadow: "0 4px 15px rgba(99,102,241,0.3)" }}
                    >
                      {done ? "Retake Block" : "Start Block →"}
                    </Link>

                    {done && (
                      <Link
                        href={`/block/${block.id}/review`}
                        className="block w-full py-2.5 rounded-xl text-center text-sm font-medium text-blue-400 transition-all duration-200 hover:text-blue-300"
                        style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
                      >
                        Review Answers
                      </Link>
                    )}
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
