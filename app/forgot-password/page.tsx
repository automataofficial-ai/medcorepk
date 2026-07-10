"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { getSupabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { success, error: showError, info } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError("Error", "Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        showError("Error", error.message || "Failed to send reset email");
      } else {
        success("Reset Email Sent ✓", "Check your email for password reset link");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      showError("Error", err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      showError("Error", "Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      showError("Error", "Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        showError("Error", error.message || "Failed to reset password");
      } else {
        success("Password Reset! ✓", "Your password has been updated. Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      showError("Error", err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#050B18" }}>
      <div className="orb w-96 h-96 bg-blue-700 top-[-100px] left-[-100px]" style={{ animationDuration: "12s" }} />
      <div className="orb w-72 h-72 bg-violet-700 bottom-0 right-[-60px]" style={{ animationDuration: "15s", animationDelay: "4s" }} />

      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8" style={{ animation: "fade-in 0.5s ease forwards" }}>
          <Link href="/" className="inline-flex justify-center mb-6 hover:opacity-80 transition-opacity duration-300">
            <img src="/icon.svg" alt="MedCore Icon" className="h-16 w-16" />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
          <p className="text-white text-sm">Recover access to your MedCore account</p>
        </div>

        <div className="glass rounded-3xl p-8" style={{ animation: "fade-in 0.6s ease 0.1s forwards", opacity: 0 }}>
          <form onSubmit={handleSendReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={(e) => { e.target.style.borderColor = "#3B82F6"; e.target.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.25)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <p className="text-xs text-slate-400">
              We'll send you a link to reset your password
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)", boxShadow: "0 0 20px rgba(0,206,209,0.4)" }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center glass rounded-2xl p-5" style={{ animation: "fade-in 0.7s ease 0.25s forwards", opacity: 0 }}>
          <p className="text-slate-300 text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
