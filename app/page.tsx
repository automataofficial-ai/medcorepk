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
      <div className="text-sm text-white mt-1">{label}</div>
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
      <p className="text-sm text-white leading-relaxed">{desc}</p>
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


      {/* ──────────────────── HERO ──────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-32 overflow-hidden">

        {/* Professional 3D Background Video */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
            style={{
              opacity: 0.45,
              filter: "brightness(0.65) saturate(1.2) contrast(1.05)",
              zIndex: -1
            }}
          >
            {/* Add your 3D video file here - supported formats: MP4, WebM, Ogg */}
            {/* Example: <source src="/videos/hero-3d.mp4" type="video/mp4" /> */}
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
            <source src="/videos/hero-bg.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>

          {/* Fallback animated background if video doesn't load */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 25%, #1F2937 50%, #0F172A 75%, #0F172A 100%)",
              backgroundSize: "400% 400%",
              animation: "gradient-shift 8s ease infinite",
              zIndex: -1
            }}
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050B18]/30 via-[#050B18]/40 to-[#050B18]/85" style={{ zIndex: -1 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/70 via-transparent to-transparent" style={{ zIndex: -1 }} />

          {/* Subtle glow overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 30% 50%, rgba(59,130,246,0.08), transparent 50%)",
              zIndex: -1
            }}
          />
        </div>

        <style>{`
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white font-medium mb-8 border relative z-20"
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
          className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 max-w-4xl relative z-20"
          style={{ animation: "fade-in 0.7s ease 0.2s forwards", opacity: 0 }}
        >
          Ace Your&nbsp;
          <span className="gradient-text">FCPS</span>
          <br />
          With Confidence.
        </h1>

        {/* Sub-headline */}
        <p
          className="text-lg md:text-xl text-white max-w-2xl leading-relaxed mb-10 relative z-20"
          style={{ animation: "fade-in 0.7s ease 0.35s forwards", opacity: 0 }}
        >
          Clinically crafted case-based MCQs, deep analytics, and spaced repetition — aligned to the CPSP syllabus.
          Study smarter. Score higher.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 items-center relative z-20"
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
            className="px-8 py-4 rounded-2xl text-base font-semibold text-white border border-slate-700 hover:border-blue-500/50 hover:text-white transition-all duration-200"
          >
            See How It Works
          </a>
        </div>

        {/* Trust badges */}
        <div
          className="flex flex-wrap justify-center gap-6 mt-12 text-xs text-slate-500 relative z-20"
          style={{ animation: "fade-in 0.7s ease 0.65s forwards", opacity: 0 }}
        >
          {["✓ CPSP Syllabus Aligned", "✓ 30 Case-Based MCQs", "✓ Instant Explanations", "✓ Performance Analytics"].map((t) => (
            <span key={t} className="flex items-center gap-1 text-white">{t}</span>
          ))}
        </div>
      </section>

      {/* ──────────────────── STATS ──────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto glass rounded-3xl p-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          <StatCounter target={30} label="Case-Based MCQs" />
          <StatCounter target={6} label="Clinical Specialties" />
          <StatCounter target={100} suffix="%" label="CPSP Aligned" />
          <StatCounter target={4} label="Options Per MCQ" />
        </div>
      </section>

      {/* ──────────────────── FEATURES ───────────────────────────── */}
      <section id="features" className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-18">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Platform Features</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Everything you need to pass&nbsp;
              <span className="gradient-text">FCPS</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-18">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">The Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">How MedCore Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
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
                <p className="text-sm text-white leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── STUDENT REVIEWS ───────────────────── */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-18">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Student Success Stories</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              What Our Students Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Fatima Khan",
                specialty: "Cardiology",
                rating: 5,
                review: "MedCore's case-based approach helped me understand concepts, not just memorize. Scored 92% on my first attempt!",
                avatar: "👩‍⚕️"
              },
              {
                name: "Dr. Ahmed Hassan",
                specialty: "Pediatrics",
                rating: 5,
                review: "The analytics dashboard showed exactly where I was weak. Focused my study on those areas and it paid off.",
                avatar: "👨‍⚕️"
              },
              {
                name: "Dr. Aisha Malik",
                specialty: "Surgery",
                rating: 5,
                review: "Best investment for FCPS prep. The medical images with explanations are game-changing. Highly recommend!",
                avatar: "👩‍⚕️"
              },
              {
                name: "Dr. Hasan Ali",
                specialty: "Medicine",
                rating: 5,
                review: "Structured learning with instant feedback. Completed 300+ MCQs and felt confident going into the exam.",
                avatar: "👨‍⚕️"
              },
              {
                name: "Dr. Sara Usman",
                specialty: "Obstetrics",
                rating: 5,
                review: "The block-based system kept me motivated. Daily streaks and leaderboard made studying fun and competitive!",
                avatar: "👩‍⚕️"
              },
              {
                name: "Dr. Karim Sheikh",
                specialty: "Neurology",
                rating: 5,
                review: "Worth every penny. The deep explanations and CPSP alignment are unmatched. Pass guarantee material!",
                avatar: "👨‍⚕️"
              }
            ].map((item) => (
              <div key={item.name} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-white text-sm leading-relaxed mb-4">{item.review}</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{item.avatar}</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.name}</p>
                    <p className="text-white text-xs">{item.specialty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── UNIVERSITY LOGOS CAROUSEL ───────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Trusted By</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Medical Schools Across The Globe
            </h2>
          </div>

          <div className="glass rounded-3xl p-10 overflow-hidden">
            <style>{`
              @keyframes scroll-left {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .carousel-container {
                display: flex;
                gap: 50px;
                animation: scroll-left 60s linear infinite;
              }
              .carousel-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 14px;
                min-width: fit-content;
                padding: 0 12px;
              }
            `}</style>
            <div className="relative flex overflow-hidden">
              <div className="carousel-container">
                {[
                  { name: "Aga Khan University", abbr: "AKU", color: "from-blue-600 to-blue-500" },
                  { name: "Combined Military Hospital", abbr: "CMH", color: "from-green-600 to-green-500" },
                  { name: "Fatima Memorial Medical College", abbr: "FUMC", color: "from-red-600 to-red-500" },
                  { name: "Karachi Medical College", abbr: "KMC", color: "from-purple-600 to-purple-500" },
                  { name: "Liaquat University", abbr: "LUMHS", color: "from-indigo-600 to-indigo-500" },
                  { name: "University of Health Sciences", abbr: "UHS", color: "from-cyan-600 to-cyan-500" },
                  { name: "Dow University", abbr: "DUHS", color: "from-orange-600 to-orange-500" },
                  { name: "Liaquat College of Medicine", abbr: "LCM", color: "from-pink-600 to-pink-500" }
                ].map((uni, idx) => (
                  <div key={idx} className="carousel-item">
                    <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${uni.color} flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300`}>
                      <span className="text-white font-black text-base text-center px-2 leading-tight">{uni.abbr}</span>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-sm leading-tight max-w-[140px]">{uni.abbr}</p>
                      <p className="text-white text-xs max-w-[140px] line-clamp-2">{uni.name}</p>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  { name: "Aga Khan University", abbr: "AKU", color: "from-blue-600 to-blue-500" },
                  { name: "Combined Military Hospital", abbr: "CMH", color: "from-green-600 to-green-500" },
                  { name: "Fatima Memorial Medical College", abbr: "FUMC", color: "from-red-600 to-red-500" },
                  { name: "Karachi Medical College", abbr: "KMC", color: "from-purple-600 to-purple-500" },
                  { name: "Liaquat University", abbr: "LUMHS", color: "from-indigo-600 to-indigo-500" },
                  { name: "University of Health Sciences", abbr: "UHS", color: "from-cyan-600 to-cyan-500" },
                  { name: "Dow University", abbr: "DUHS", color: "from-orange-600 to-orange-500" },
                  { name: "Liaquat College of Medicine", abbr: "LCM", color: "from-pink-600 to-pink-500" }
                ].map((uni, idx) => (
                  <div key={`dup-${idx}`} className="carousel-item">
                    <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${uni.color} flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300`}>
                      <span className="text-white font-black text-base text-center px-2 leading-tight">{uni.abbr}</span>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-sm leading-tight max-w-[140px]">{uni.abbr}</p>
                      <p className="text-white text-xs max-w-[140px] line-clamp-2">{uni.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── CTA BANNER ─────────────────────────── */}
      <section className="relative z-10 py-28 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to start your FCPS journey?
          </h2>
          <p className="text-white mb-8 text-base">
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
      <footer className="relative z-10 border-t border-slate-800/60 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="MedCore" className="h-6 w-6" />
            <span>MedCore © 2026</span>
          </div>
          <p>Built for FCPS candidates across Pakistan</p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
