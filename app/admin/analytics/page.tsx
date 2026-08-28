"use client";

import { useRouter } from "next/navigation";
import { useAdminGuard } from "@/lib/use-admin-guard";

export default function AnalyticsPage() {
  const router = useRouter();
  const { admin } = useAdminGuard();

  if (!admin) return null;

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      <div className="px-6 py-6 border-b" style={{ background: "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))", borderColor: "rgba(99,102,241,0.1)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-slate-400 text-sm">Student performance and statistics</p>
          </div>
          <button onClick={() => router.push("/admin")} className="px-4 py-2 rounded-lg font-semibold text-slate-300" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>← Back</button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <p className="text-slate-400 text-lg">Analytics dashboard coming soon...</p>
      </div>
    </div>
  );
}
