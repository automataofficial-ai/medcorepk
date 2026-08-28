"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { verifyAdminSession, adminSignOut } from "@/lib/admin-client";
import { useToast } from "@/context/ToastContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showError("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      // Step 1: authenticate against Supabase Auth. Passwords are checked by
      // Supabase against a hash it holds; this app never sees or stores one.
      const { data, error: signInError } = await getSupabase().auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !data?.user) {
        // One message for every failure mode, so the form cannot be used to
        // discover which email addresses have accounts.
        showError("Sign in failed", "Email or password is incorrect.");
        return;
      }

      // Step 2: ask the server whether this verified identity is an admin. The
      // browser deliberately gets no say in this.
      const admin = await verifyAdminSession();

      if (!admin) {
        // Authenticated, but not an administrator. Do not leave a usable
        // student session sitting on the admin login screen.
        await adminSignOut();
        showError(
          "Access denied",
          "This account does not have administrator access."
        );
        return;
      }

      success("Signed in", `Welcome back, ${admin.fullName || admin.email}`);
      router.push("/admin");
    } catch (err: any) {
      showError("Error", err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "#050B18" }}
    >
      <div
        className="orb w-96 h-96 bg-blue-700 top-[-100px] left-[-100px]"
        style={{ animationDuration: "12s", position: "absolute" }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-slate-400">MedCore Admin Panel</p>
        </div>

        <div
          className="glass rounded-3xl p-6 sm:p-8"
          style={{
            background: "rgba(30,27,75,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                boxShadow: "0 0 20px rgba(0,206,209,0.4)",
              }}
            >
              {loading ? "Signing in..." : "Login to Admin Panel"}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500 text-center leading-relaxed">
            Administrator accounts are managed in Supabase. If you need access,
            ask an existing administrator to grant it.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
          >
            ← Back to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
}
