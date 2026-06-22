"use client";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "#050B18" }}>
      {/* Static orbs */}
      <div className="orb w-96 h-96 bg-blue-600 top-[-80px] left-[-80px]" style={{ animationDuration: "12s" }} />
      <div className="orb w-80 h-80 bg-violet-700 top-40 right-[-60px]" style={{ animationDuration: "16s", animationDelay: "3s" }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-blue-300 font-medium mb-8 border"
            style={{
              background: "rgba(59,130,246,0.08)",
              borderColor: "rgba(59,130,246,0.3)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            About MedCore
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6"
          >
            Transforming FCPS Preparation
          </h1>

          {/* Description */}
          <p
            className="text-lg md:text-xl text-slate-400 leading-relaxed mb-12"
          >
            MedCore is Pakistan&apos;s premier platform for FCPS (Fellow of the College of Physicians and Surgeons) exam preparation. We combine clinically-crafted case-based learning with advanced analytics to help medical professionals ace their exams.
          </p>

          {/* Mission Section */}
          <div
            className="glass rounded-2xl p-8 mb-12 text-left"
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              To provide accessible, evidence-based FCPS preparation that empowers medical graduates to achieve excellence. We believe every candidate deserves world-class resources aligned with the CPSP curriculum.
            </p>

            <h3 className="text-lg font-semibold text-white mb-3 mt-8">What Sets Us Apart</h3>
            <ul className="text-slate-300 space-y-3 text-left">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span><strong>Clinically Accurate:</strong> Every case is reviewed by FCPS-qualified physicians</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span><strong>CPSP Aligned:</strong> Meticulously mapped to the official CPSP syllabus</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span><strong>Visual Learning:</strong> Real medical images (ECGs, X-rays, CT scans)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span><strong>Deep Analytics:</strong> Track progress by specialty, topic, and difficulty</span>
              </li>
            </ul>
          </div>

          {/* Team Section */}
          <div
            className="glass rounded-2xl p-8 text-left"
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Our Team</h2>
            <p className="text-slate-300 leading-relaxed">
              MedCore is built by a team of FCPS examination specialists, medical educators, and software engineers. We&apos;ve personally walked the FCPS journey and understand the challenges candidates face.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="MedCore" className="h-6 w-6" />
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
