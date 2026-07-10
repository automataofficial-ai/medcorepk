"use client";

import Link from "next/link";

export default function FCPSPart1PaperBPage() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "#050B18" }}>
      {/* ── Static orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 top-[-80px] left-[-80px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute w-80 h-80 bg-violet-700 rounded-full blur-3xl opacity-20 top-40 right-[-60px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
        <div className="absolute w-72 h-72 bg-cyan-600 rounded-full blur-3xl opacity-20 bottom-20 left-1/3 animate-pulse" style={{ animationDuration: "9s", animationDelay: "4s" }} />
      </div>

      {/* ── Top Navigation ── */}
      <div className="sticky top-0 z-40 border-b border-slate-800/30"
        style={{
          background: "linear-gradient(135deg, rgba(5,11,24,0.98), rgba(15,23,42,0.95))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="group transition-all duration-300">
              <img src="/logo.png" alt="MedCore" className="h-10 w-auto group-hover:opacity-80" />
            </Link>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block p-4 rounded-2xl mb-6"
              style={{
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))",
                border: "2px solid rgba(168, 85, 247, 0.3)"
              }}>
              <span className="text-6xl">🚀</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
            Coming Soon
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto">
            FCPS Part 1 - Paper B is under development and will be available very soon. Stay tuned for comprehensive mock exam content!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #0891b2 0%, #006b7f 100%)",
                boxShadow: "0 12px 32px rgba(8, 145, 178, 0.4)"
              }}
            >
              Back to Home
            </Link>
            <Link
              href="/exam/fcps-part1-paper-a"
              className="px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1))",
                border: "2px solid rgba(59, 130, 246, 0.5)"
              }}
            >
              Try Paper A
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .glass {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}
