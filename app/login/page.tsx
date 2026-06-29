"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmail, getCurrentUser, getUserProfile } from "@/lib/supabase";

const DEMO_EMAIL = "doctor@medcore.pk";
const DEMO_PASSWORD = "medcore2026";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await signInWithEmail(email, password);

      if (signInError) {
        setError(signInError.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      if (data.user) {
        // Fetch full profile from database
        const { data: profile } = await getUserProfile(data.user.id);

        localStorage.setItem(
          "medcore_user",
          JSON.stringify({
            id: data.user.id,
            name: profile?.full_name || data.user.email,
            email: data.user.email,
            specialty: profile?.specialty || null,
            loggedInAt: Date.now(),
          })
        );

        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#050B18" }}>

      {/* orbs */}
      <div className="orb w-96 h-96 bg-blue-700 top-[-100px] left-[-100px]" style={{ animationDuration: "12s" }} />
      <div className="orb w-72 h-72 bg-violet-700 bottom-0 right-[-60px]" style={{ animationDuration: "15s", animationDelay: "4s" }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8" style={{ animation: "fade-in 0.5s ease forwards" }}>
          <Link href="/" className="inline-flex justify-center mb-6 hover:opacity-80 transition-opacity duration-300">
            <img src="/icon.svg" alt="MedCore Icon" className="h-16 w-16" />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-white text-sm">Sign in to continue your FCPS preparation</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8" style={{ animation: "fade-in 0.6s ease 0.1s forwards", opacity: 0 }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="doctor@medcore.pk"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  // @ts-expect-error --tw-ring-color
                  "--tw-ring-color": "#3B82F6",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#3B82F6"; e.target.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.25)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={(e) => { e.target.style.borderColor = "#3B82F6"; e.target.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.25)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm text-red-300"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)", boxShadow: "0 0 20px rgba(0,206,209,0.4)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In →"}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center glass rounded-2xl p-5" style={{ animation: "fade-in 0.7s ease 0.25s forwards", opacity: 0 }}>
          <p className="text-slate-300 text-sm mb-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Sign Up
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="border-t border-slate-700/50 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
              <span className="text-slate-300 font-medium">Demo Account</span>
            </div>
            <div className="space-y-2 text-white">
              <div className="flex justify-between">
                <span className="text-xs">Email:</span>
                <button
                  onClick={() => setEmail(DEMO_EMAIL)}
                  className="text-blue-400 font-mono hover:text-blue-300 transition-colors text-xs"
                >
                  {DEMO_EMAIL}
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Password:</span>
                <button
                  onClick={() => setPassword(DEMO_PASSWORD)}
                  className="text-blue-400 font-mono hover:text-blue-300 transition-colors text-xs"
                >
                  {DEMO_PASSWORD}
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Click the values above to auto-fill.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
