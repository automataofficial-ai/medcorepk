"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ── Floating particles ──────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 10,
  size: 2 + Math.random() * 4,
  opacity: 0.15 + Math.random() * 0.35,
}));

/* ── ECG waveform path ───────────────────────────────────────────── */
const ECG_PATH =
  "M0,50 L20,50 L25,50 L30,50 L32,42 L34,50 L40,50 L45,5 L50,65 L55,50 L60,50 L65,44 L70,50 L110,50 L115,50 L120,50 L122,42 L124,50 L130,50 L135,5 L140,65 L145,50 L150,50 L155,44 L160,50 L200,50 L205,50 L210,50 L212,42 L214,50 L220,50 L225,5 L230,65 L235,50 L240,50 L245,44 L250,50 L290,50 L295,50 L300,50 L302,42 L304,50 L310,50 L315,5 L320,65 L325,50 L330,50 L335,44 L340,50 L380,50";

/* ── Stat counter ────────────────────────────────────────────────── */
function StatCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const step = target / (duration / 16);
          let cur = 0;
          const timer = setInterval(() => {
            cur += step;
            if (cur >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(cur));
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-extrabold text-white tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-400 mt-1">{label}</div>
    </div>
  );
}

/* ── Feature card ────────────────────────────────────────────────── */
function FeatureCard({
  icon, title, desc, delay,
}: { icon: string; title: string; desc: string; delay: string }) {
  return (
    <div
      className="glass rounded-2xl p-6 card-lift"
      style={{ animationDelay: delay, animation: "fade-in 0.7s ease forwards", opacity: 0 }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "#050B18" }}>

      {/* ── Dynamic glow that follows mouse ── */}
      <div
        className="pointer-events-none fixed inset-0 transition-transform duration-700"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(59,130,246,0.07), transparent 60%)`,
        }}
      />

      {/* ── Static orbs ── */}
      <div className="orb w-96 h-96 bg-blue-600 top-[-80px] left-[-80px]" style={{ animationDuration: "12s" }} />
      <div className="orb w-80 h-80 bg-violet-700 top-40 right-[-60px]" style={{ animationDuration: "16s", animationDelay: "3s" }} />
      <div className="orb w-64 h-64 bg-cyan-600 bottom-20 left-1/3" style={{ animationDuration: "10s", animationDelay: "6s" }} />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="particle bg-blue-400"
          style={{
            left: `${p.x}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* ── ECG scrolling line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 pointer-events-none">
        <svg viewBox="0 0 380 100" preserveAspectRatio="none" className="w-full h-full">
          <path className="ecg-path" d={ECG_PATH} stroke="#22C55E" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ──────────────────────── NAV ──────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg animate-glow"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
          >
            M
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Med<span className="text-blue-400">Core</span>
          </span>
          <span className="hidden sm:inline ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 font-medium">
            BETA
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="btn-glow px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
          >
            Login
          </Link>
        </div>
      </nav>

      {/* ──────────────────── HERO ──────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-blue-300 font-medium mb-8 border"
          style={{
            background: "rgba(59,130,246,0.08)",
            borderColor: "rgba(59,130,246,0.3)",
            animation: "fade-in 0.6s ease 0.1s forwards",
            opacity: 0,
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Pakistan&apos;s #1 FCPS Exam Preparation Platform
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 max-w-4xl"
          style={{ animation: "fade-in 0.7s ease 0.2s forwards", opacity: 0 }}
        >
          Ace Your&nbsp;
          <span className="gradient-text">FCPS</span>
          <br />
          With Confidence.
        </h1>

        {/* Sub-headline */}
        <p
          className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10"
          style={{ animation: "fade-in 0.7s ease 0.35s forwards", opacity: 0 }}
        >
          Clinically crafted case-based MCQs, deep analytics, and spaced repetition — aligned to the CPSP syllabus.
          Study smarter. Score higher.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 items-center"
          style={{ animation: "fade-in 0.7s ease 0.5s forwards", opacity: 0 }}
        >
          <Link
            href="/login"
            className="btn-glow px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              boxShadow: "0 0 30px rgba(99,102,241,0.5)",
            }}
          >
            Start Practicing Free →
          </Link>
          <a
            href="#features"
            className="px-8 py-4 rounded-2xl text-base font-semibold text-slate-300 border border-slate-700 hover:border-blue-500/50 hover:text-white transition-all duration-200"
          >
            See How It Works
          </a>
        </div>

        {/* Trust badges */}
        <div
          className="flex flex-wrap justify-center gap-6 mt-12 text-xs text-slate-500"
          style={{ animation: "fade-in 0.7s ease 0.65s forwards", opacity: 0 }}
        >
          {["✓ CPSP Syllabus Aligned", "✓ 30 Case-Based MCQs", "✓ Instant Explanations", "✓ Performance Analytics"].map((t) => (
            <span key={t} className="flex items-center gap-1 text-slate-400">{t}</span>
          ))}
        </div>
      </section>

      {/* ──────────────────── STATS ──────────────────────────────── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter target={30} label="Case-Based MCQs" />
          <StatCounter target={6} label="Clinical Specialties" />
          <StatCounter target={100} suffix="%" label="CPSP Aligned" />
          <StatCounter target={4} label="Options Per MCQ" />
        </div>
      </section>

      {/* ──────────────────── FEATURES ───────────────────────────── */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Everything you need to pass&nbsp;
              <span className="gradient-text">FCPS</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "📋", title: "Clinical Case Studies", desc: "Every MCQ begins with a realistic patient presentation. Train your brain to think like a clinician.", delay: "0s" },
              { icon: "🩻", title: "Medical Image References", desc: "ECGs, X-rays, CT scans, and histology slides paired with each question.", delay: "0.1s" },
              { icon: "💡", title: "Deep Explanations", desc: "Every option explained — why correct is correct and why each wrong answer is wrong.", delay: "0.2s" },
              { icon: "📊", title: "Analytics Dashboard", desc: "Track accuracy by subject, specialty, and difficulty. Identify your weak areas instantly.", delay: "0.3s" },
              { icon: "🔥", title: "Study Streaks", desc: "Daily goals, completion badges, and a leaderboard to keep you consistently motivated.", delay: "0.4s" },
              { icon: "🎯", title: "Block-Based Learning", desc: "5 high-yield MCQs per block. Finish a block, get your score, review all answers.", delay: "0.5s" },
            ].map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── HOW IT WORKS ───────────────────────── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">The Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">How MedCore Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Choose a Block",
                desc: "Select from 6 clinical specialties — each block has 5 carefully crafted MCQs.",
                color: "#3B82F6",
              },
              {
                num: "02",
                title: "Read & Answer",
                desc: "Study the clinical case, examine the reference image, and pick your best answer.",
                color: "#8B5CF6",
              },
              {
                num: "03",
                title: "Review & Learn",
                desc: "See all answers explained. Wrong options in red. Correct in green. Full explanations.",
                color: "#10B981",
              },
            ].map((step) => (
              <div key={step.num} className="glass rounded-2xl p-6 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-black"
                  style={{ background: `${step.color}20`, color: step.color, border: `1px solid ${step.color}40` }}
                >
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── CTA BANNER ─────────────────────────── */}
      <section className="relative z-10 py-20 px-6">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to start your FCPS journey?
          </h2>
          <p className="text-slate-400 mb-8 text-base">
            Join thousands of Pakistani medical graduates preparing smarter with MedCore.
          </p>
          <Link
            href="/login"
            className="btn-glow inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              boxShadow: "0 0 40px rgba(99,102,241,0.5)",
            }}
          >
            Get Started — It&apos;s Free →
          </Link>
        </div>
      </section>

      {/* ──────────────────── FOOTER ─────────────────────────────── */}
      <footer className="relative z-10 border-t border-slate-800/60 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>M</div>
            <span>MedCore © 2026</span>
          </div>
          <p>Built for FCPS candidates across Pakistan</p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-slate-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
