"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateForm(): boolean {
    if (!fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      if (result.user) {
        // Store user in localStorage for immediate access
        const userData: any = {
          id: result.user.id,
          name: fullName,
          email,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("medcore_user", JSON.stringify(userData));

        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#050B18" }}
    >
      {/* orbs */}
      <div
        className="orb w-96 h-96 bg-blue-700 top-[-100px] left-[-100px]"
        style={{ animationDuration: "12s" }}
      />
      <div
        className="orb w-72 h-72 bg-violet-700 bottom-0 right-[-60px]"
        style={{ animationDuration: "15s", animationDelay: "4s" }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8" style={{ animation: "fade-in 0.5s ease forwards" }}>
          <Link href="/" className="inline-flex justify-center mb-6 hover:opacity-80 transition-opacity duration-300">
            <img src="/icon.svg" alt="MedCore Icon" className="h-16 w-16" />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-white text-sm">Join MedCore and start your FCPS preparation</p>
        </div>

        {/* Card */}
        <div
          className="glass rounded-3xl p-8"
          style={{ animation: "fade-in 0.6s ease 0.1s forwards", opacity: 0 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Dr. Ahmed Khan"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  // @ts-expect-error --tw-ring-color
                  "--tw-ring-color": "#3B82F6",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B82F6";
                  e.target.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
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
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B82F6";
                  e.target.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  // @ts-expect-error --tw-ring-color
                  "--tw-ring-color": "#3B82F6",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B82F6";
                  e.target.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>


            {/* Error Message */}
            {error && (
              <div
                className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm text-red-300"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                boxShadow: "0 0 20px rgba(0,206,209,0.4)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Sign Up →"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-300 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
