"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      // Simple admin login check
      // In production, verify against admin database
      const ADMIN_EMAIL = "admin@medcore.com";
      const ADMIN_PASSWORD = "Admin123456";

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem(
          "admin_token",
          JSON.stringify({
            email,
            role: "admin",
            loginTime: Date.now(),
          })
        );

        success("Login Successful", "Welcome to Admin Panel!");
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        showError("Invalid Credentials", "Email or password incorrect");
      }
    } catch (err: any) {
      showError("Error", err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#050B18" }}
    >
      <div className="orb w-96 h-96 bg-blue-700 top-[-100px] left-[-100px]" style={{ animationDuration: "12s", position: "absolute" }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Login
          </h1>
          <p className="text-slate-400">MedCore Admin Panel</p>
        </div>

        <div
          className="glass rounded-3xl p-8"
          style={{
            background: "rgba(30,27,75,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@medcore.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
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
              className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                boxShadow: "0 0 20px rgba(0,206,209,0.4)",
              }}
            >
              {loading ? "Logging in..." : "Login to Admin Panel"}
            </button>
          </form>

          <div
            className="mt-6 p-4 rounded-lg text-sm"
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <p className="text-blue-300 font-semibold mb-2">📝 Test Credentials</p>
            <p className="text-slate-400 text-xs">
              Email: <span className="font-mono">admin@medcore.com</span>
            </p>
            <p className="text-slate-400 text-xs">
              Password: <span className="font-mono">Admin123456</span>
            </p>
          </div>
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
