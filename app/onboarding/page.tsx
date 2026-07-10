"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { getSupabase } from "@/lib/supabase";

const SPECIALTIES = [
  { id: "cardiology", name: "Cardiology", icon: "❤️" },
  { id: "neurology", name: "Neurology", icon: "🧠" },
  { id: "ophthalmology", name: "Ophthalmology", icon: "👁️" },
  { id: "psychiatry", name: "Psychiatry", icon: "💭" },
  { id: "surgery", name: "Surgery", icon: "🔪" },
  { id: "pediatrics", name: "Pediatrics", icon: "👶" },
  { id: "obstetrics", name: "Obstetrics", icon: "🤰" },
  { id: "pathology", name: "Pathology", icon: "🔬" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { success, error: showError, info } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [specialty, setSpecialty] = useState("");
  const [examDate, setExamDate] = useState("");
  const [goals, setGoals] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("medcore_user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleNext = async () => {
    if (step === 1 && !specialty) {
      showError("Select Specialty", "Please choose a specialty to continue");
      return;
    }
    if (step === 2 && !examDate) {
      showError("Set Exam Date", "Please select your exam date");
      return;
    }
    if (step === 3 && !goals) {
      showError("Set Goals", "Please select your study goals");
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("medcore_user") || "{}");

      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          updates: {
            specialty: specialty || null,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        showError("Error", errorData.error || "Failed to save profile");
        setLoading(false);
        return;
      }

      success("Setup Complete! 🎉", "Your profile is ready. Starting your journey...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      showError("Error", "Failed to save profile. Please try again");
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Orbs */}
      <div className="orb w-96 h-96 bg-blue-700 top-[-100px] left-[-100px]" style={{ animationDuration: "12s" }} />
      <div className="orb w-72 h-72 bg-violet-700 bottom-0 right-[-60px]" style={{ animationDuration: "15s", animationDelay: "4s" }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Progress */}
        <div className="w-full max-w-2xl mb-12">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  background: s <= step ? "linear-gradient(135deg, #00CED1, #00B5CC)" : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
          <p className="text-slate-400 text-xs mt-2">Step {step} of 4</p>
        </div>

        {/* Content */}
        <div className="w-full max-w-2xl">
          {/* Step 1: Specialty */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Choose Your Specialty</h1>
                <p className="text-slate-400">Select the medical specialty you're preparing for</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSpecialty(s.id)}
                    className="p-4 rounded-2xl transition-all duration-300 text-center group"
                    style={{
                      background:
                        specialty === s.id
                          ? "linear-gradient(135deg, rgba(0,206,209,0.2), rgba(0,181,204,0.2))"
                          : "rgba(255,255,255,0.05)",
                      border:
                        specialty === s.id
                          ? "2px solid rgba(0,206,209,0.5)"
                          : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <p className="text-sm font-medium text-white">{s.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Exam Date */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">When's Your Exam?</h1>
                <p className="text-slate-400">Set your target FCPS exam date</p>
              </div>

              <div className="glass rounded-2xl p-8" style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl text-white text-center text-lg outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                {examDate && (
                  <p className="text-center text-slate-400 text-sm mt-4">
                    That's {Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days away!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Study Goals */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">What's Your Goal?</h1>
                <p className="text-slate-400">Help us personalize your study plan</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: "pass", label: "Just Pass the Exam", icon: "✓" },
                  { value: "excel", label: "Excel with High Score", icon: "⭐" },
                  { value: "master", label: "Master All Topics", icon: "🏆" },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => setGoals(goal.value)}
                    className="w-full p-4 rounded-xl transition-all duration-300 text-left flex items-center gap-3"
                    style={{
                      background:
                        goals === goal.value
                          ? "linear-gradient(135deg, rgba(0,206,209,0.2), rgba(0,181,204,0.2))"
                          : "rgba(255,255,255,0.05)",
                      border:
                        goals === goal.value
                          ? "2px solid rgba(0,206,209,0.5)"
                          : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <p className="text-white font-medium">{goal.label}</p>
                      <p className="text-xs text-slate-400">
                        {goal.value === "pass" && "Complete the essential topics"}
                        {goal.value === "excel" && "Focus on high-yield topics"}
                        {goal.value === "master" && "Deep dive into all subjects"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Dashboard Tour */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn text-center">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">You're All Set!</h1>
                <p className="text-slate-400">Let's explore your personalized dashboard</p>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex gap-4 p-4 rounded-xl glass" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div className="text-2xl">📊</div>
                  <div>
                    <p className="text-white font-medium">Analytics Dashboard</p>
                    <p className="text-xs text-slate-400">Track your progress with detailed insights</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl glass" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
                  <div className="text-2xl">📝</div>
                  <div>
                    <p className="text-white font-medium">Practice MCQs</p>
                    <p className="text-xs text-slate-400">Solve questions in tutor or exam mode</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl glass" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <div className="text-2xl">🎯</div>
                  <div>
                    <p className="text-white font-medium">Smart Recommendations</p>
                    <p className="text-xs text-slate-400">Get personalized study suggestions</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="w-full max-w-2xl mt-12 flex gap-3">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
            }}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-60 text-white"
            style={{
              background: "linear-gradient(135deg, #00CED1, #00B5CC)",
              boxShadow: "0 0 20px rgba(0,206,209,0.4)",
            }}
          >
            {loading ? "Saving..." : step === 4 ? "Start Learning 🚀" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
