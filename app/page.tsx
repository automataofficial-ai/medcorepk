"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Image, Lightbulb, BarChart3, Flame, Target, ClipboardList, Stethoscope, ChevronLeft, ChevronRight, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

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

/* ── Testimonial Carousel ────────────────────────────────────────── */
function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const testimonials = [
    {
      name: "Dr. Fatima Khan",
      title: "Senior Vice Dean (Education), UNSW Medicine & Health",
      review: "MedCore combines high-quality material and robust peer review with a uniquely clinical focus. Students value the confidence they can place in learning relevant information for their future practice. I recommend this excellent resource.",
      avatar: "👩‍⚕️"
    },
    {
      name: "Dr. Ahmed Hassan",
      title: "Clinical Educator, Aga Khan University",
      review: "The analytics dashboard showed exactly where I was weak. Focused my study on those areas and it paid off immensely. Students appreciate the structured learning with instant feedback and comprehensive coverage.",
      avatar: "👨‍⚕️"
    },
    {
      name: "Dr. Aisha Malik",
      title: "Program Director, Surgical Training",
      review: "MedCore combines high-quality material and robust peer review with a uniquely clinical focus. The medical images with explanations are game-changing. I recommend this excellent resource to all my trainees.",
      avatar: "👩‍⚕️"
    }
  ];

  return (
    <div className="relative w-full">
      {/* Testimonial Card - Full Width Container */}
      <div className="relative py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-20">

        {/* Quotation Mark - Top Right */}
        <div className="absolute top-4 right-4 sm:right-8 text-7xl sm:text-9xl md:text-[140px] text-cyan-400 opacity-20 leading-none pointer-events-none">
          "
        </div>

        {/* Main Content - Flex Layout */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 sm:gap-10 md:gap-12 items-start">

          {/* Avatar - Left */}
          <div className="flex-shrink-0 pt-2 mx-auto md:mx-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-cyan-500 flex items-center justify-center text-5xl sm:text-6xl md:text-7xl border-4 border-cyan-400">
              {testimonials[current].avatar}
            </div>
          </div>

          {/* Text Content - Right */}
          <div className="flex-1 relative z-10 pt-2">
            {/* Main Review Text */}
            <p className="text-white text-sm sm:text-base md:text-lg lg:text-2xl leading-relaxed mb-6 sm:mb-10 font-semibold">
              {testimonials[current].review}
            </p>

            {/* Name and Title with Accent Line */}
            <div className="flex items-start gap-5">
              <div className="w-20 h-1.5 bg-cyan-400 rounded-full flex-shrink-0 mt-1.5"></div>
              <div>
                <p className="text-white font-black text-2xl mb-1">{testimonials[current].name}</p>
                <p className="text-cyan-300 text-base font-semibold leading-relaxed">{testimonials[current].title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom Right */}
        <div className="flex justify-end gap-4 mt-14 pr-0 md:pr-12">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="w-16 h-16 rounded-full bg-cyan-600 text-white hover:bg-cyan-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
            className="w-16 h-16 rounded-full bg-cyan-600 text-white hover:bg-cyan-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

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
      <section className="relative z-10 pt-20 pb-24 overflow-hidden">

        {/* Professional Background with Slider */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-slate-950">
          {/* Image Slider - Dark & Full */}
          <div className="absolute inset-0">
            <img
              src="/slide1.jpg"
              alt="Hero slide 1"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                animation: "carousel 15s infinite",
                filter: "brightness(0.35) contrast(1.1)",
                backgroundColor: "#0f172a"
              }}
            />
            <img
              src="/slide2.jpg"
              alt="Hero slide 2"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                animation: "carousel 15s infinite 5s",
                filter: "brightness(0.35) contrast(1.1)",
                backgroundColor: "#0f172a"
              }}
            />
            <img
              src="/slide3.jpg"
              alt="Hero slide 3"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                animation: "carousel 15s infinite 10s",
                filter: "brightness(0.35) contrast(1.1)",
                backgroundColor: "#0f172a"
              }}
            />
          </div>

          {/* Video backup */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
            style={{
              opacity: 0.45,
              filter: "brightness(0.65) saturate(1.2) contrast(1.05)",
              zIndex: 0
            }}
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
            <source src="/videos/hero-bg.webm" type="video/webm" />
          </video>

          {/* Fallback gradient */}
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#050B18]/40 via-[#050B18]/50 to-[#050B18]/85" style={{ zIndex: -1 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/70 via-transparent to-transparent" style={{ zIndex: -1 }} />

          {/* Subtle glow */}
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
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          @keyframes carousel {
            0% { opacity: 0; }
            2% { opacity: 1; }
            31% { opacity: 1; }
            33% { opacity: 0; }
            100% { opacity: 0; }
          }
          .float-animation {
            animation: float 5s ease-in-out infinite;
          }
        `}</style>

        {/* Hero Container - Full Width */}
        <div className="px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-center min-h-[100vh] lg:min-h-auto py-12 md:py-0">

            {/* LEFT COLUMN - TEXT CONTENT */}
            <div className="relative z-20">

              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white font-medium mb-8 border"
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

              {/* Main Headline */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 sm:mb-8"
                style={{ animation: "fade-in 0.7s ease 0.2s forwards", opacity: 0 }}
              >
                Ace Your&nbsp;
                <span className="gradient-text">FCPS</span>
                <br />
                With Confidence.
              </h1>

              {/* Subheading */}
              <p
                className="text-base sm:text-lg lg:text-xl text-white/75 leading-relaxed mb-8 sm:mb-12 max-w-lg font-light"
                style={{ animation: "fade-in 0.7s ease 0.35s forwards", opacity: 0 }}
              >
                Clinically crafted case-based MCQs, deep analytics, and spaced repetition — aligned to the CPSP syllabus. Study smarter. Score higher.
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 mb-12"
                style={{ animation: "fade-in 0.7s ease 0.5s forwards", opacity: 0 }}
              >
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-lg text-base font-semibold text-white transition-all duration-200 hover:scale-105 text-center"
                  style={{
                    background: "linear-gradient(135deg, #0891b2 0%, #006b7f 100%)",
                    boxShadow: "0 4px 15px rgba(8, 145, 178, 0.4)",
                  }}
                >
                  Try for Free
                </Link>
                <a
                  href="#features"
                  className="px-8 py-4 rounded-lg text-base font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200 text-center"
                >
                  Learn More
                </a>
              </div>

              {/* Trust Indicators */}
              <div
                className="flex flex-wrap gap-8 text-sm text-white/60"
                style={{ animation: "fade-in 0.7s ease 0.65s forwards", opacity: 0 }}
              >
                {["✓ CPSP Aligned", "✓ 30+ MCQs", "✓ Real Analytics"].map((t) => (
                  <span key={t} className="flex items-center gap-2">{t}</span>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN - COMPACT PHONE MOCKUP WITH OVERLAID IMAGE */}
            <div className="relative flex items-center justify-center h-80 sm:h-96 md:h-[400px] lg:h-96 order-last lg:order-none mt-12 md:mt-0">
              <div
                className="float-animation absolute"
                style={{ animation: "fade-in 0.8s ease 0.4s forwards, float 5s ease-in-out infinite", opacity: 0 }}
              >
                {/* Phone Frame - Larger */}
                <div className="relative" style={{ width: "360px" }}>
                  {/* Outer Phone Bezel */}
                  <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-[45px] shadow-2xl border-8 border-gray-800 overflow-hidden">

                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50" />

                    {/* Status Bar */}
                    <div className="bg-gray-950 px-5 py-1.5 pt-4 flex justify-between items-center text-white text-xs font-medium">
                      <span>1:17</span>
                      <div className="flex gap-1 text-xs">
                        <span>📶</span>
                        <span>🔋</span>
                      </div>
                    </div>

                    {/* Phone Content */}
                    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950">

                      {/* Header */}
                      <div className="px-5 py-3 border-b border-slate-700/50 flex items-center gap-2">
                        <span className="text-white text-base">←</span>
                        <span className="text-white font-bold text-sm">Mock Exam</span>
                      </div>

                      {/* Main Content Area */}
                      <div className="px-4 py-5 space-y-4">

                        {/* Circular Score Progress */}
                        <div className="flex justify-start items-start gap-4">
                          <div className="relative w-40 h-40 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                              {/* Background circle */}
                              <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                              {/* Progress circle - Cyan and Orange */}
                              <circle
                                cx="80"
                                cy="80"
                                r="68"
                                fill="none"
                                stroke="#06b6d4"
                                strokeWidth="12"
                                strokeDasharray="301.59"
                                strokeDashoffset="87.46"
                                strokeLinecap="round"
                              />
                              <circle
                                cx="80"
                                cy="80"
                                r="68"
                                fill="none"
                                stroke="#f97316"
                                strokeWidth="12"
                                strokeDasharray="150.80"
                                strokeDashoffset="0"
                                strokeLinecap="round"
                                style={{ transform: "rotate(288deg)", transformOrigin: "80px 80px" }}
                              />
                            </svg>
                            {/* Center percentage */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-3xl font-black text-white">71%</div>
                              </div>
                            </div>
                          </div>

                          {/* Right stats column */}
                          <div className="space-y-2 text-right flex-1">
                            <div>
                              <div className="text-green-400 font-bold text-lg">106</div>
                              <div className="text-slate-400 text-xs font-semibold">CORRECT</div>
                            </div>
                            <div>
                              <div className="text-red-400 font-bold text-lg">44</div>
                              <div className="text-slate-400 text-xs font-semibold">INC.</div>
                            </div>
                            <div>
                              <div className="text-slate-300 font-bold text-lg">0</div>
                              <div className="text-slate-400 text-xs font-semibold">NOT</div>
                            </div>
                          </div>
                        </div>

                        {/* Specialty Performance Bars */}
                        <div className="space-y-1.5 text-xs bg-slate-800/30 rounded-lg p-3">
                          <div className="text-white font-semibold text-xs mb-2">Performance by Specialty</div>
                          {[
                            { name: "Cardiology", color: "#ef4444", percent: 75 },
                            { name: "Dermatology", color: "#eab308", percent: 68 },
                            { name: "Endocrinology", color: "#a855f7", percent: 82 },
                            { name: "Gastroenterology", color: "#f97316", percent: 60 },
                            { name: "Geriatrics", color: "#8b5cf6", percent: 71 },
                            { name: "Ophthalmology", color: "#06b6d4", percent: 79 }
                          ].map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5 w-24 flex-shrink-0">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-slate-400 text-xs truncate">{item.name}</span>
                              </div>
                              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    backgroundColor: item.color,
                                    width: `${item.percent}%`,
                                    opacity: 0.8
                                  }}
                                />
                              </div>
                              <span className="text-slate-300 text-xs font-semibold w-6 text-right">{item.percent}%</span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Learning Stats */}
                        <div className="grid grid-cols-4 gap-2 py-2 border-t border-slate-700/50 text-center text-xs">
                          <div>
                            <div className="text-slate-400 text-xs">32%</div>
                            <div className="text-white font-semibold text-xs mt-0.5">Progress</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-xs">42s</div>
                            <div className="text-white font-semibold text-xs mt-0.5">Avg Time</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-xs">52%</div>
                            <div className="text-white font-semibold text-xs mt-0.5">Average</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-xs">72%</div>
                            <div className="text-white font-semibold text-xs mt-0.5">Your Score</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shadow effect under phone */}
                  <div
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-52 h-4 bg-black/30 blur-2xl rounded-full"
                    style={{ zIndex: -1 }}
                  />
                </div>

                {/* Overlaid X-ray Image */}
                <div className="absolute -top-16 -right-20 w-64 h-64 rounded-lg overflow-hidden shadow-2xl border-4 border-slate-800 bg-gray-800">
                  {/* Real X-ray simulation */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden">
                    <div className="text-7xl opacity-60">🫁</div>
                    {/* X-ray overlay effect */}
                    <div className="absolute inset-0 bg-gradient-radial opacity-30" style={{ background: "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />
                  </div>

                  {/* Image Label */}
                  <div className="absolute bottom-2 left-0 right-0 px-3 py-1 text-center bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-slate-300 font-semibold text-xs mb-1">Australia SA</div>
                    <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-md px-2 py-1 inline-block">
                      <div className="text-cyan-400 font-black text-xs">97th PERCENTILE</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── TRUSTED BY ───────────────────────── */}
      <section className="relative z-10 py-24 px-6 md:px-16 lg:px-24">
        <div>
          {/* Heading */}
          <div className="text-center mb-16 cursor-pointer">
            <h2
              className="text-4xl md:text-5xl font-black text-white mb-4"
              style={{ animation: "fade-in 0.7s ease forwards", opacity: 0 }}
            >
              MedCore Is Trusted by 1,000+
            </h2>
            <p
              className="text-lg text-white/70"
              style={{ animation: "fade-in 0.7s ease 0.2s forwards", opacity: 0 }}
            >
              Medical Students, Doctors, and IMGs across Pakistan and beyond
            </p>
          </div>

          {/* University Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
            {[
              { name: "King Edward Medical University", logo: "kemu.png" },
              { name: "Khyber Medical College", logo: "kmc.png" },
              { name: "University of Aberdeen", logo: "aderdeen (1).png" },
              { name: "Bangor University", logo: "bangor.png" },
            ].map((uni) => (
              <div
                key={uni.name}
                className="cursor-pointer hover:cursor-pointer"
                style={{ animation: "fade-in 0.7s ease forwards", opacity: 0 }}
              >
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-lg flex items-center justify-center"
                  style={{
                    background: "transparent",
                  }}
                >
                  <img
                    src={`/${uni.logo}`}
                    alt={uni.name}
                    className="h-20 w-20 md:h-24 md:w-24 object-contain opacity-90 cursor-pointer"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </div>
                <p className="text-center text-white text-xs md:text-sm font-semibold mt-3 cursor-pointer">
                  {uni.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FEATURES ───────────────────────────── */}
      <section id="features" className="relative z-10 pt-12 pb-28 px-6 md:px-16 lg:px-24 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(15, 23, 42, 0.5) 50%, rgba(168, 85, 247, 0.06) 100%)" }}>
        <div className="absolute inset-0 -z-10 opacity-20" style={{ background: "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15), transparent 60%)" }} />
        <div>

          <div className="text-center mb-12">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Platform Features</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Everything you need to pass&nbsp;
              <span className="gradient-text">FCPS</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { Icon: ClipboardList, title: "Clinical Case Studies", desc: "Every MCQ begins with a realistic patient presentation. Train your brain to think like a clinician.", delay: "0s" },
              { Icon: Stethoscope, title: "Medical Image References", desc: "ECGs, X-rays, CT scans, and histology slides paired with each question.", delay: "0.1s" },
              { Icon: Lightbulb, title: "Deep Explanations", desc: "Every option explained — why correct is correct and why each wrong answer is wrong.", delay: "0.2s" },
              { Icon: BarChart3, title: "Analytics Dashboard", desc: "Track accuracy by subject, specialty, and difficulty. Identify your weak areas instantly.", delay: "0.3s" },
              { Icon: Flame, title: "Study Streaks", desc: "Daily goals, completion badges, and a leaderboard to keep you consistently motivated.", delay: "0.4s" },
              { Icon: Target, title: "Block-Based Learning", desc: "5 high-yield MCQs per block. Finish a block, get your score, review all answers.", delay: "0.5s" },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-3xl p-8 card-lift hover:shadow-2xl transition-all duration-300"
                style={{
                  animationDelay: f.delay,
                  animation: "fade-in 0.7s ease forwards",
                  opacity: 0,
                  background: "#00CED1",
                  boxShadow: "0 10px 30px rgba(0, 206, 209, 0.4)"
                }}
              >
                <f.Icon className="w-14 h-14 mb-5 text-black" strokeWidth={1.5} />
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-black mb-3 sm:mb-4" style={{ textShadow: "0 2px 4px rgba(255,255,255,0.1)" }}>{f.title}</h3>
                <p className="text-sm sm:text-base md:text-lg text-black/95 leading-relaxed font-semibold">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── HOW IT WORKS ───────────────────────── */}
      <section className="relative z-10 pt-12 pb-28 px-6 md:px-16 lg:px-24 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.5) 50%, rgba(34, 197, 94, 0.06) 100%)" }}>
        <div className="absolute inset-0 -z-10 opacity-20" style={{ background: "radial-gradient(circle at 80% 30%, rgba(6, 182, 212, 0.15), transparent 60%), radial-gradient(circle at 10% 70%, rgba(34, 197, 94, 0.15), transparent 60%)" }} />
        <div>
          <div className="text-center mb-12">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">The Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">How MedCore Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                num: "01",
                title: "Choose a Block",
                desc: "Select from 6 clinical specialties — each block has 5 carefully crafted MCQs."
              },
              {
                num: "02",
                title: "Read & Answer",
                desc: "Study the clinical case, examine the reference image, and pick your best answer."
              },
              {
                num: "03",
                title: "Review & Learn",
                desc: "See all answers explained. Wrong options in red. Correct in green. Full explanations."
              },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300"
                style={{
                  background: "#00CED1",
                  boxShadow: "0 10px 30px rgba(0, 206, 209, 0.4)"
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl font-black text-white"
                  style={{ background: "rgba(0, 0, 0, 0.2)" }}
                >
                  {step.num}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-black mb-3 sm:mb-4" style={{ textShadow: "0 2px 4px rgba(255,255,255,0.1)" }}>{step.title}</h3>
                <p className="text-sm sm:text-base md:text-lg text-black/95 leading-relaxed font-semibold">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── STUDENT REVIEWS ───────────────────── */}
      <section className="relative z-10 pt-12 pb-28 px-6 md:px-16 lg:px-24 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(15, 23, 42, 0.5) 50%, rgba(236, 72, 153, 0.06) 100%)" }}>
        <div className="absolute inset-0 -z-10 opacity-20" style={{ background: "radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.15), transparent 60%), radial-gradient(circle at 70% 20%, rgba(236, 72, 153, 0.15), transparent 60%)" }} />
        <div>
          <div className="text-center mb-12">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Student Success Stories</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              What Our Students Say
            </h2>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* ──────────────────── EDUCATORS SECTION ──────────────────── */}
      <section className="relative z-10 pt-12 pb-28 px-6 md:px-16 lg:px-24 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(15, 23, 42, 0.5) 50%, rgba(6, 182, 212, 0.06) 100%)" }}>
        <div className="absolute inset-0 -z-10 opacity-20" style={{ background: "radial-gradient(circle at 80% 50%, rgba(37, 99, 235, 0.15), transparent 60%), radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.15), transparent 60%)" }} />

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="relative z-10">
              <p className="text-cyan-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 sm:mb-4">MedCore for Educators</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
                Empower Your Students with MedCore
              </h2>
              <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
                Educators can request institutional access for MedCore, use our comprehensive MCQ library in classes and clinical teaching, and partner with us for curriculum support, customized collections, and exclusive presentations to enhance your students' FCPS preparation.
              </p>
              <a
                href="#contact"
                className="inline-block px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-cyan-600 text-white font-bold text-base sm:text-lg hover:bg-cyan-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Request Educator Access
              </a>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/educators.jpg"
                  alt="Medical educators using MedCore"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── SOCIAL RESPONSIBILITY ──────────────── */}
      <section className="relative z-10 pt-12 pb-28 px-6 md:px-16 lg:px-24 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.5) 50%, rgba(59, 130, 246, 0.06) 100%)" }}>
        <div className="absolute inset-0 -z-10 opacity-20" style={{ background: "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15), transparent 60%), radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15), transparent 60%)" }} />

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center justify-between">

            {/* Logo Section */}
            <div className="flex-shrink-0 text-center md:text-left">
              <img src="/logo.png" alt="MedCore Logo" className="h-32 md:h-40 w-auto mx-auto md:mx-0 mb-6" />
              <h3 className="text-2xl md:text-3xl font-black text-white">MedCore</h3>
              <p className="text-cyan-400 font-semibold mt-2">crystal clear concepts</p>
            </div>

            {/* Text Section */}
            <div className="flex-1">
              <p className="text-white text-xl md:text-2xl leading-relaxed font-semibold">
                MedCore is committed to supporting medical education and healthcare excellence. We partner with leading medical institutions and provide scholarship access to underprivileged medical students. Together, we're building a brighter future for medical professionals across Pakistan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── FOOTER ─────────────────────────────── */}
      <footer className="relative z-10 border-t border-slate-700/40 pt-20 pb-12 px-6 md:px-16 lg:px-24" style={{ background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 27, 75, 0.4) 100%)" }}>
        <div className="max-w-7xl mx-auto">

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="MedCore Logo" className="h-12 w-auto" />
                <div>
                  <h3 className="text-white font-black text-lg">MedCore</h3>
                  <p className="text-cyan-400 text-xs font-semibold">crystal clear concepts</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pakistan's premier FCPS exam preparation platform with 30,000+ MCQs.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-6">Product</h4>
              <ul className="space-y-4">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Syllabus", href: "/syllabus" },
                  { label: "Dashboard", href: "/dashboard" }
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-6">Company</h4>
              <ul className="space-y-4">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Blog", href: "#blog" },
                  { label: "Careers", href: "#careers" },
                  { label: "Contact", href: "#contact" }
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-6">Resources</h4>
              <ul className="space-y-4">
                {[
                  { label: "Documentation", href: "#docs" },
                  { label: "Study Guides", href: "#guides" },
                  { label: "FAQ", href: "#faq" },
                  { label: "Support", href: "#support" }
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-6">Legal</h4>
              <ul className="space-y-4">
                {[
                  { label: "Privacy Policy", href: "#privacy" },
                  { label: "Terms of Service", href: "#terms" },
                  { label: "Cookie Policy", href: "#cookies" },
                  { label: "Sitemap", href: "#sitemap" }
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700/40 pt-12 pb-8">

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              {/* Copyright */}
              <div className="text-slate-500 text-sm">
                <p>© 2026 MedCore. All rights reserved. Built with ❤️ for medical professionals.</p>
              </div>

              {/* Social Links */}
              <div className="flex gap-6">
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors" title="Twitter">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors" title="LinkedIn">
                  <Linkedin size={24} />
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors" title="Facebook">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors" title="Instagram">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
