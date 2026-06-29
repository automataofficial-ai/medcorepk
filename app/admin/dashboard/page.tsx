"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

interface AdminStats {
  totalBlocks: number;
  totalMCQs: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalBlocks: 0,
    totalMCQs: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    try {
      const user = localStorage.getItem("medcore_user");
      if (!user) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(user);
      const supabase = getSupabase();

      // Check user role
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userData.id)
        .single();

      if (error || data?.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setIsAdmin(true);
      fetchStats();
    } catch (err) {
      console.error("Auth check error:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const supabase = getSupabase();

      const [blocksRes, mcqsRes, usersRes] = await Promise.all([
        supabase.from("blocks").select("id", { count: "exact" }),
        supabase.from("mcqs").select("id", { count: "exact" }),
        supabase.from("users").select("id", { count: "exact" }),
      ]);

      setStats({
        totalBlocks: blocksRes.count || 0,
        totalMCQs: mcqsRes.count || 0,
        totalUsers: usersRes.count || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-800/50"
        style={{ background: "rgba(5,11,24,0.95)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Manage blocks, MCQs, and users</p>
          </div>
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Total Blocks</p>
            <p className="text-4xl font-bold text-white">{stats.totalBlocks}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Total MCQs</p>
            <p className="text-4xl font-bold text-white">{stats.totalMCQs}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Total Users</p>
            <p className="text-4xl font-bold text-white">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blocks Management */}
            <Link href="/admin/blocks-manage">
              <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform cursor-pointer">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-bold text-white mb-2">Manage Blocks</h3>
                <p className="text-sm text-slate-400 mb-4">Create, edit, and delete MCQ blocks</p>
                <div className="text-blue-400 text-sm font-semibold">View →</div>
              </div>
            </Link>

            {/* MCQs Management */}
            <Link href="/admin/mcqs-manage">
              <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform cursor-pointer">
                <div className="text-4xl mb-4">❓</div>
                <h3 className="text-lg font-bold text-white mb-2">Manage MCQs</h3>
                <p className="text-sm text-slate-400 mb-4">Add, edit, and remove questions from blocks</p>
                <div className="text-blue-400 text-sm font-semibold">View →</div>
              </div>
            </Link>

            {/* Users Management */}
            <div className="glass rounded-2xl p-8 opacity-50 cursor-not-allowed">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-bold text-white mb-2">Manage Users</h3>
              <p className="text-sm text-slate-400 mb-4">View users and manage roles (coming soon)</p>
              <div className="text-slate-500 text-sm font-semibold">Coming Soon</div>
            </div>

            {/* Analytics */}
            <div className="glass rounded-2xl p-8 opacity-50 cursor-not-allowed">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-white mb-2">Analytics</h3>
              <p className="text-sm text-slate-400 mb-4">View detailed statistics and insights (coming soon)</p>
              <div className="text-slate-500 text-sm font-semibold">Coming Soon</div>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="glass rounded-2xl p-6 text-sm text-slate-400">
          <p>ℹ️ You are logged in as an administrator. This panel is restricted to admin users only.</p>
        </div>
      </div>
    </div>
  );
}
