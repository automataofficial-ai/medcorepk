"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminSignOut } from "@/lib/admin-client";
import { useAdminGuard } from "@/lib/use-admin-guard";

export default function AdminDashboard() {
  const router = useRouter();
  const { admin, checking: loading } = useAdminGuard();

  const handleLogout = async () => {
    await adminSignOut();
    router.replace("/admin/login");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050B18" }}
      >
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div
        className="px-6 py-6 border-b"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))",
          borderColor: "rgba(99,102,241,0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm">
              Logged in as: <span className="font-semibold">{admin.email}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-semibold text-red-400 transition-all"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* MCQ Management */}
          <Link
            href="/admin/questions"
            className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,27,75,0.5))",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <div className="text-4xl mb-4">❓</div>
            <h3 className="text-xl font-bold text-white mb-2">MCQ Management</h3>
            <p className="text-sm text-white/70">
              Add, edit, and delete MCQ questions
            </p>
            <p className="text-xs text-cyan-400 mt-4">→ Manage Questions</p>
          </Link>

          {/* Import MCQs */}
          <Link
            href="/admin/import"
            className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,27,75,0.5))",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <div className="text-4xl mb-4">📥</div>
            <h3 className="text-xl font-bold text-white mb-2">Import MCQs</h3>
            <p className="text-sm text-white/70">
              Bulk import MCQs from CSV file
            </p>
            <p className="text-xs text-amber-400 mt-4">→ Upload CSV</p>
          </Link>

          {/* View Analytics */}
          <Link
            href="/admin/analytics"
            className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,27,75,0.5))",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
            <p className="text-sm text-white/70">
              View student performance and statistics
            </p>
            <p className="text-xs text-emerald-400 mt-4">→ View Analytics</p>
          </Link>

          {/* Block Management */}
          <Link
            href="/admin/blocks"
            className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,27,75,0.5))",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">Blocks</h3>
            <p className="text-sm text-white/70">
              Manage learning blocks and subjects
            </p>
            <p className="text-xs text-purple-400 mt-4">→ Manage Blocks</p>
          </Link>

          {/* Users */}
          <Link
            href="/admin/users"
            className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,27,75,0.5))",
              border: "1px solid rgba(236,72,153,0.2)",
            }}
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">Users</h3>
            <p className="text-sm text-white/70">
              Manage student accounts and roles
            </p>
            <p className="text-xs text-pink-400 mt-4">→ View Users</p>
          </Link>

          {/* Settings */}
          <Link
            href="/admin/settings"
            className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,27,75,0.5))",
              border: "1px solid rgba(100,116,139,0.2)",
            }}
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold text-white mb-2">Settings</h3>
            <p className="text-sm text-white/70">
              Configure application settings
            </p>
            <p className="text-xs text-slate-400 mt-4">→ Settings</p>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard"
            className="px-6 py-4 rounded-xl font-semibold text-white text-center transition-all"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            ← Back to Dashboard
          </Link>

          <Link
            href="/admin/questions"
            className="px-6 py-4 rounded-xl font-bold text-white text-center transition-all"
            style={{
              background: "linear-gradient(135deg, #00CED1, #00B5CC)",
            }}
          >
            → Manage MCQs
          </Link>
        </div>
      </div>
    </div>
  );
}
