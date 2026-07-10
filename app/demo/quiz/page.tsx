"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import type { MCQAnswer, Block, MCQ } from "@/lib/types";
import { Zap, Crown } from "lucide-react";

interface AnalyticsData {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  averageTimePerQuestion: number;
  questionBreakdown: Array<{
    questionNumber: number;
    correct: boolean;
    timeSpent: number;
  }>;
}

// Demo MCQs - will be replaced with real block data
const DEMO_MCQS: MCQ[] = [
  {
    id: "demo-1",
    caseStudy: "A 45-year-old male presents with severe chest pain radiating to the left arm and shortness of breath.",
    question: "What is the most likely diagnosis?",
    notes: "Consider the classic presentation of acute coronary syndrome.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
    options: [
      {
        label: "A",
        text: "Acute Myocardial Infarction",
        explanation: "This is the correct diagnosis. The classic presentation of chest pain radiating to the left arm with shortness of breath is pathognomonic for acute MI. Immediate ECG and troponin levels are required."
      },
      {
        label: "B",
        text: "Gastroesophageal Reflux Disease",
        explanation: "While GERD can cause chest discomfort, it typically doesn't present with radiation to the arm or severe shortness of breath. The acute presentation here is more consistent with cardiac etiology."
      },
      {
        label: "C",
        text: "Anxiety Disorder",
        explanation: "Anxiety can cause chest tightness, but the radiation pattern and associated dyspnea point to a cardiac cause. Age and risk factors are important to consider."
      },
      {
        label: "D",
        text: "Pulmonary Embolism",
        explanation: "PE presents with dyspnea and chest pain but the radiation to the left arm is more specific for cardiac ischemia. PE typically presents with pleuritic chest pain."
      },
    ],
    correctIndex: 0,
  },
  {
    id: "demo-2",
    caseStudy: "A 28-year-old female with fever (39°C), headache, and neck stiffness for 2 days.",
    question: "What is the most appropriate initial investigation?",
    notes: "Consider the clinical presentation suggestive of meningitis.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5f400f6f5?w=400&h=300&fit=crop",
    options: [
      {
        label: "A",
        text: "Blood culture",
        explanation: "While blood cultures are important, they take 24-48 hours to result. In suspected meningitis, initial diagnosis is made by CSF examination."
      },
      {
        label: "B",
        text: "Lumbar puncture",
        explanation: "This is correct. Lumbar puncture with CSF analysis is the gold standard for diagnosing meningitis. Cell count, culture, glucose, and protein are examined. Antibiotics should be started before LP if there's delay."
      },
      {
        label: "C",
        text: "CT scan of brain",
        explanation: "CT brain is contraindicated before LP in suspected meningitis unless there are signs of raised ICP or focal neurological signs. It delays diagnosis and treatment."
      },
      {
        label: "D",
        text: "Throat swab culture",
        explanation: "Throat swab is not appropriate for meningitis diagnosis. CSF examination is required to confirm the diagnosis."
      },
    ],
    correctIndex: 1,
  },
  {
    id: "demo-3",
    caseStudy: "A 62-year-old hypertensive diabetic patient on metformin presents with polyuria and polydipsia.",
    question: "Which complication is most likely?",
    notes: "Consider the presentation in a diabetic patient.",
    image: "https://images.unsplash.com/photo-1631217314831-c02b2e9de566?w=400&h=300&fit=crop",
    options: [
      {
        label: "A",
        text: "Hypoglycemia",
        explanation: "Hypoglycemia presents with sweating, tremor, and tachycardia, not polyuria. The symptoms here indicate hyperglycemia."
      },
      {
        label: "B",
        text: "Hyperglycemic Hyperosmolar State",
        explanation: "Correct answer. HHS presents with polyuria, polydipsia, altered mental status, and extreme hyperglycemia (often >600 mg/dL). It's more common in elderly diabetics on metformin due to reduced renal clearance."
      },
      {
        label: "C",
        text: "Metabolic Acidosis",
        explanation: "While DKA causes metabolic acidosis, it's more common in type 1 diabetes. HHS is characterized by hyperglycemia without significant ketosis."
      },
      {
        label: "D",
        text: "Respiratory Alkalosis",
        explanation: "Respiratory alkalosis is not associated with diabetes presentations. The patient's symptoms point to a metabolic derangement, not respiratory."
      },
    ],
    correctIndex: 1,
  },
  {
    id: "demo-4",
    caseStudy: "A 35-year-old male with history of heavy alcohol consumption presents with confusion and ataxia.",
    question: "What is the most likely diagnosis?",
    notes: "Consider the classic triad associated with chronic alcohol abuse.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=400&h=300&fit=crop",
    options: [
      {
        label: "A",
        text: "Wernicke's Encephalopathy",
        explanation: "Correct answer. The classic triad is: confusion, ataxia, and ophthalmoplegia (not always present). Caused by thiamine (Vitamin B1) deficiency common in alcoholics. Treat urgently with IV thiamine."
      },
      {
        label: "B",
        text: "Korsakoff Syndrome",
        explanation: "Korsakoff syndrome is a chronic sequela of Wernicke's encephalopathy. It presents with confabulation, anterograde and retrograde amnesia rather than acute confusion and ataxia."
      },
      {
        label: "C",
        text: "Hepatic Encephalopathy",
        explanation: "Hepatic encephalopathy would require evidence of liver disease and elevated ammonia levels. Ataxia is not a typical presentation."
      },
      {
        label: "D",
        text: "Hypomagnesemia",
        explanation: "While hypomagnesemia is common in alcoholics, it causes neuromuscular manifestations more than confusion and ataxia specifically."
      },
    ],
    correctIndex: 0,
  },
  {
    id: "demo-5",
    caseStudy: "A 5-year-old child presents with stridor, barky cough, and hoarseness for 3 days.",
    question: "What is the diagnosis?",
    notes: "Consider the classic presentation in a pediatric patient.",
    image: "https://images.unsplash.com/photo-1631531808773-a5fda1f9a83d?w=400&h=300&fit=crop",
    options: [
      {
        label: "A",
        text: "Epiglottitis",
        explanation: "Epiglottitis presents with acute onset, drooling, dysphagia, and tripod positioning. It's a medical emergency. The gradual 3-day course makes it less likely."
      },
      {
        label: "B",
        text: "Laryngotracheobronchitis (Croup)",
        explanation: "Correct diagnosis. Classic presentation: barky, seal-like cough, inspiratory stridor, and hoarseness. Usually viral (parainfluenza) and self-limiting. Treat with dexamethasone and supportive care."
      },
      {
        label: "C",
        text: "Acute Bronchitis",
        explanation: "Bronchitis doesn't typically cause stridor or inspiratory distress. It's characterized by productive cough without upper airway involvement."
      },
      {
        label: "D",
        text: "Whooping Cough",
        explanation: "Whooping cough presents with paroxysmal cough ending in a 'whoop' and post-tussive vomiting, not primarily with stridor or hoarseness."
      },
    ],
    correctIndex: 1,
  },
  {
    id: "demo-6",
    caseStudy: "A 52-year-old smoker with COPD presents with acute dyspnea and reduced oxygen saturation.",
    question: "What is the initial management?",
    notes: "Consider the acute exacerbation protocol.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
    options: [
      {
        label: "A",
        text: "Immediate intubation",
        explanation: "Intubation is reserved for severe cases with respiratory failure. First attempt medical management with oxygen and bronchodilators."
      },
      {
        label: "B",
        text: "Oxygen therapy and bronchodilators",
        explanation: "Correct answer. Initial management includes oxygen to maintain SpO2 85-90%, short-acting beta-2 agonists (albuterol), and anticholinergics (ipratropium). Add corticosteroids and antibiotics as needed."
      },
      {
        label: "C",
        text: "Antihistamines",
        explanation: "Antihistamines are not indicated in COPD exacerbation and may worsen symptoms by drying secretions."
      },
      {
        label: "D",
        text: "Beta-blockers",
        explanation: "Beta-blockers are contraindicated in COPD as they can precipitate bronchospasm. Non-selective beta-blockers especially should be avoided."
      },
    ],
    correctIndex: 1,
  },
  {
    id: "demo-7",
    caseStudy: "A 38-year-old female with hypothyroidism on levothyroxine presents with weight gain and lethargy.",
    question: "What is the most appropriate action?",
    notes: "Consider the medication adjustment needed.",
    image: "https://images.unsplash.com/photo-1579154204601-01d82b27292f?w=400&h=300&fit=crop",
    options: [
      {
        label: "A",
        text: "Stop levothyroxine immediately",
        explanation: "Stopping thyroid replacement abruptly can lead to hypothyroid crisis. Never stop without medical supervision or alternatives."
      },
      {
        label: "B",
        text: "Check TSH level and adjust dose",
        explanation: "Correct answer. Symptoms suggest inadequate replacement. Check TSH, T3, and T4 levels. If TSH is elevated, increase levothyroxine dose. Recheck levels in 6 weeks."
      },
      {
        label: "C",
        text: "Increase protein intake",
        explanation: "While nutrition is important, the primary issue is thyroid hormone replacement. Protein intake alone won't address the underlying problem."
      },
      {
        label: "D",
        text: "Start antidepressants",
        explanation: "While depression can coexist with hypothyroidism, the primary treatment is optimizing thyroid replacement. Antidepressants alone won't resolve the hormonal imbalance."
      },
    ],
    correctIndex: 1,
  },
  {
    id: "demo-8",
    caseStudy: "A 7-year-old with persistent cough, night sweats, and weight loss. Chest X-ray shows upper lobe infiltrate.",
    question: "What is the most likely diagnosis?",
    notes: "Consider the radiological findings and clinical presentation.",
    image: "https://images.unsplash.com/photo-1576091160431-112a47d7b7f5?w=400&h=300&fit=crop",
    options: [
      {
        label: "A",
        text: "Pneumonia",
        explanation: "Acute pneumonia doesn't typically cause persistent symptoms and weight loss. It usually presents acutely and doesn't have the classic CXR findings of TB."
      },
      {
        label: "B",
        text: "Tuberculosis",
        explanation: "Correct diagnosis. Classic presentation: chronic cough, night sweats, weight loss, and hemoptysis. Upper lobe infiltrate on CXR is pathognomonic for pulmonary TB. Requires TB testing and treatment."
      },
      {
        label: "C",
        text: "Asthma",
        explanation: "Asthma presents acutely with wheezing and shortness of breath, not with chronic constitutional symptoms and infiltrates on CXR."
      },
      {
        label: "D",
        text: "Bronchiectasis",
        explanation: "While bronchiectasis can cause chronic cough, night sweats are less prominent. Upper lobe infiltrate is not typical for bronchiectasis alone."
      },
    ],
    correctIndex: 1,
  },
  {
    id: "demo-9",
    caseStudy: "A 72-year-old male with acute urinary retention and lower abdominal pain.",
    question: "What is the first-line management?",
    notes: "Consider the acute presentation.",
    image: "https://images.unsplash.com/photo-1576091160643-112d4fbbc591?w=400&h=300&fit=crop",
    options: [
      {
        label: "A",
        text: "Immediate surgery",
        explanation: "Surgery is reserved for specific cases (strictures, malignancy). First manage the retention medically."
      },
      {
        label: "B",
        text: "Catheterization",
        explanation: "Correct answer. First-line management for acute retention is catheterization to relieve obstruction. Post-void residual can be checked. Then investigate underlying cause (BPH, prostate cancer, strictures)."
      },
      {
        label: "C",
        text: "Diuretics",
        explanation: "Diuretics are contraindicated as they increase urine production when the bladder cannot empty. This worsens retention."
      },
      {
        label: "D",
        text: "Observation",
        explanation: "Acute retention requires immediate intervention. Observation risks bladder rupture and renal damage from obstructive uropathy."
      },
    ],
    correctIndex: 1,
  },
  {
    id: "demo-10",
    caseStudy: "A 30-year-old pregnant woman (32 weeks) presents with severe headache, visual changes, and BP 160/110.",
    question: "What is the diagnosis and management?",
    notes: "Consider the gestational timeline.",
    image: "https://images.unsplash.com/photo-1559457411-b4b97eec4591?w=400&h=300&fit=crop",
    options: [
      {
        label: "A",
        text: "Gestational diabetes - diet modification",
        explanation: "Gestational diabetes doesn't present with headache, visual changes, or hypertension. Different pathophysiology and management."
      },
      {
        label: "B",
        text: "Preeclampsia - magnesium sulfate and delivery planning",
        explanation: "Correct answer. Classic signs: hypertension, headache, visual disturbances, and hyperreflexia. At 32 weeks, manage with magnesium sulfate for neuroprotection and plan delivery. Can progress to eclampsia (seizures) if untreated."
      },
      {
        label: "C",
        text: "Migraines - analgesics",
        explanation: "While migraines can occur in pregnancy, they don't explain hypertension and proteinuria (presumed). Preeclampsia must be ruled out urgently."
      },
      {
        label: "D",
        text: "Anemia - iron supplementation",
        explanation: "Anemia doesn't present with this clinical picture. While common in pregnancy, it doesn't cause hypertension or visual changes."
      },
    ],
    correctIndex: 1,
  },
];

function ProgressDots({
  total,
  current,
  answers,
}: {
  total: number;
  current: number;
  answers: (MCQAnswer | null)[];
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const ans = answers[i];
        const isCurrent = i === current;
        const bg = !ans
          ? isCurrent
            ? "#3B82F6"
            : "rgba(255,255,255,0.08)"
          : ans.isCorrect
          ? "#10B981"
          : "#EF4444";
        return (
          <div
            key={i}
            className="relative"
            title={`Question ${i + 1}`}
          >
            <div
              className="rounded-full transition-all duration-300 flex items-center justify-center text-xs font-bold"
              style={{
                width: isCurrent ? 32 : 24,
                height: isCurrent ? 32 : 24,
                background: bg,
                color: "#fff",
                boxShadow: isCurrent ? "0 0 10px rgba(59,130,246,0.5)" : "none",
                transform: isCurrent ? "scale(1.15)" : "scale(1)",
              }}
            >
              {i + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return elapsed;
}

interface PremiumModalProps {
  score: number;
  onContinue: () => void;
}

interface AnalyticsData {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  averageTimePerQuestion: number;
  questionBreakdown: Array<{
    questionNumber: number;
    correct: boolean;
    timeSpent: number;
  }>;
}

function DemoAnalyticsDashboard({ analytics }: { analytics: AnalyticsData }) {
  const correctPercentage = Math.round((analytics.correctAnswers / analytics.totalQuestions) * 100);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { text: "Outstanding", color: "#10B981", bgColor: "rgba(16,185,129,0.1)", emoji: "🌟" };
    if (percentage >= 75) return { text: "Excellent", color: "#3B82F6", bgColor: "rgba(59,130,246,0.1)", emoji: "⭐" };
    if (percentage >= 60) return { text: "Good", color: "#F59E0B", bgColor: "rgba(245,158,11,0.1)", emoji: "👍" };
    return { text: "Needs Improvement", color: "#EF4444", bgColor: "rgba(239,68,68,0.1)", emoji: "💪" };
  };

  const performance = getPerformanceLevel(correctPercentage);

  return (
    <div className="min-h-screen w-full overflow-hidden" style={{ background: "#050B18" }}>
      {/* ── Background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 top-[-80px] left-[-80px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute w-80 h-80 bg-violet-700 rounded-full blur-3xl opacity-20 top-40 right-[-60px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
      </div>

      {/* ── Top Navigation ── */}
      <div className="sticky top-0 z-40 border-b border-slate-800/30"
        style={{
          background: "linear-gradient(135deg, rgba(5,11,24,0.98), rgba(15,23,42,0.95))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{
                background: "linear-gradient(135deg, #A855F7, #7C3AED)",
                boxShadow: "0 8px 24px rgba(168,85,247,0.3)",
              }}>
              📊
            </div>
            <div>
              <p className="text-white font-bold text-sm">Quiz Analytics</p>
              <p className="text-white/50 text-xs">Demo Performance Report</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">

      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Score Display */}
          <div
            className="lg:col-span-1 rounded-3xl p-8 border overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, ${performance.bgColor}, rgba(15,23,42,0.4))`,
              borderColor: performance.color,
              borderWidth: "2px",
              boxShadow: `0 20px 60px ${performance.color}30`,
            }}
          >
            <div className="relative z-10">
              <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-3">Your Performance</p>
              <p className="text-6xl font-black text-transparent bg-clip-text mb-2"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${performance.color}, #00CED1)`,
                }}>
                {analytics.score.toFixed(0)}%
              </p>
              <p className="text-lg font-bold mb-4" style={{ color: performance.color }}>
                {performance.emoji} {performance.text}
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                You answered <span className="text-white font-bold">{analytics.correctAnswers} out of {analytics.totalQuestions}</span> questions correctly.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Total Time */}
              <div className="rounded-2xl p-6 border border-slate-700/50"
                style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(15,23,42,0.4))" }}>
                <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-3">Total Time</p>
                <p className="text-4xl font-black text-blue-400 mb-2">{formatTime(analytics.totalTime)}</p>
                <p className="text-white/60 text-sm">Time spent on quiz</p>
              </div>

              {/* Avg Per Question */}
              <div className="rounded-2xl p-6 border border-slate-700/50"
                style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(15,23,42,0.4))" }}>
                <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-3">Avg per Question</p>
                <p className="text-4xl font-black text-violet-400 mb-2">{analytics.averageTimePerQuestion.toFixed(0)}s</p>
                <p className="text-white/60 text-sm">Average time spent</p>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="rounded-2xl p-6 border border-slate-700/50"
              style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(15,23,42,0.4))" }}>
              <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-4">Overall Progress</p>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-semibold">Accuracy</span>
                    <span className="text-emerald-400 font-bold">{correctPercentage}%</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div
                      className="h-3 rounded-full transition-all duration-1000"
                      style={{
                        width: `${correctPercentage}%`,
                        background: "linear-gradient(90deg, #10B981 0%, #00CED1 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {/* Overall Score */}
        <div className="rounded-xl p-5 border border-slate-700/50"
          style={{ background: "rgba(15,23,42,0.4)" }}>
          <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-2">Overall Score</p>
          <p className="text-4xl font-black text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
            }}>
            {analytics.score.toFixed(0)}%
          </p>
          <p className="text-white/50 text-xs mt-2" style={{ color: performance.color }}>
            {performance.text}
          </p>
        </div>

        {/* Correct Answers */}
        <div className="rounded-xl p-5 border border-slate-700/50"
          style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}>
          <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-2">Correct Answers</p>
          <p className="text-4xl font-black text-emerald-400">
            {analytics.correctAnswers}/{analytics.totalQuestions}
          </p>
          <p className="text-emerald-400/60 text-xs mt-2">Questions answered correctly</p>
        </div>

        {/* Total Time */}
        <div className="rounded-xl p-5 border border-slate-700/50"
          style={{ background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.2)" }}>
          <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-2">Total Time</p>
          <p className="text-4xl font-black text-blue-400">{formatTime(analytics.totalTime)}</p>
          <p className="text-blue-400/60 text-xs mt-2">Time spent on quiz</p>
        </div>

        {/* Avg Time per Q */}
        <div className="rounded-xl p-5 border border-slate-700/50"
          style={{ background: "rgba(168,85,247,0.05)", borderColor: "rgba(168,85,247,0.2)" }}>
          <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-2">Avg per Question</p>
          <p className="text-4xl font-black text-violet-400">{analytics.averageTimePerQuestion.toFixed(0)}s</p>
          <p className="text-violet-400/60 text-xs mt-2">Average time spent</p>
        </div>
      </div>

      {/* Question Breakdown Section */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-white mb-2">Question-by-Question Analysis</h3>
          <p className="text-white/60 text-sm">Detailed breakdown of each question and your response</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.questionBreakdown.map((q) => (
            <div
              key={q.questionNumber}
              className="rounded-2xl p-6 border border-slate-700/50 transition-all hover:border-slate-600/80"
              style={{
                background: q.correct ? "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(15,23,42,0.4))" : "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(15,23,42,0.4))",
                borderColor: q.correct ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{
                      background: q.correct ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                      color: q.correct ? "#10B981" : "#EF4444",
                      border: `2px solid ${q.correct ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                    }}
                  >
                    {q.correct ? "✓" : "✗"}
                  </div>
                  <div>
                    <p className="text-white font-bold">Question {q.questionNumber}</p>
                    <p className="text-white/60 text-xs">MCQ Assessment</p>
                  </div>
                </div>
                <span
                  className="px-4 py-2 rounded-full text-xs font-bold"
                  style={{
                    background: q.correct ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                    color: q.correct ? "#10B981" : "#EF4444",
                    border: `1px solid ${q.correct ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                  }}
                >
                  {q.correct ? "Correct" : "Incorrect"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className="text-white/70 text-sm font-semibold">Time Spent</span>
                <span className="text-white font-bold" style={{ color: q.correct ? "#10B981" : "#EF4444" }}>
                  ⏱️ {q.timeSpent.toFixed(0)}s
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-white mb-2">Personalized Insights</h3>
          <p className="text-white/60 text-sm">Key takeaways from your performance</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-8 border border-amber-700/50"
            style={{ background: "linear-gradient(135deg, rgba(180,83,9,0.15), rgba(180,83,9,0.05))" }}>
            <div className="flex items-start gap-4">
              <span className="text-4xl">💡</span>
              <div>
                <p className="text-amber-300 font-black text-lg mb-2">Learning Insight</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  {correctPercentage >= 75
                    ? "Excellent performance! You have a strong understanding of these medical concepts. Keep practicing to maintain your skills and prepare for your exams."
                    : "Good effort! Review the explanations for incorrect answers to strengthen your knowledge in these areas. Consistent practice will improve your score."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-8 border border-cyan-700/50"
            style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))" }}>
            <div className="flex items-start gap-4">
              <span className="text-4xl">⚡</span>
              <div>
                <p className="text-cyan-300 font-black text-lg mb-2">Speed Analysis</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  {analytics.averageTimePerQuestion < 60
                    ? "You're working quickly! For clinical scenarios, ensure you're reading questions carefully to avoid careless mistakes."
                    : "You're taking time to think through each question, which is excellent for complex clinical scenarios. Balance speed with accuracy."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="mb-12 rounded-3xl p-8 border-2"
        style={{
          background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.05))",
          borderColor: "rgba(168,85,247,0.3)",
        }}>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-2">Ready to Continue?</p>
            <h3 className="text-3xl font-black text-white mb-4">Unlock Premium Features</h3>
            <p className="text-white/80 text-base leading-relaxed mb-6">
              Get access to all 3,620 MCQs, detailed analytics, personalized study recommendations, and more to master your medical exams.
            </p>
            <ul className="space-y-3 text-white/70 text-sm mb-8">
              <li className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                Complete question bank with all medical subjects
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                Advanced performance analytics and insights
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                Spaced repetition algorithm for optimal retention
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.href = "/signup"}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-lg"
              style={{
                background: "linear-gradient(135deg, #A855F7, #7C3AED)",
                boxShadow: "0 12px 32px rgba(168,85,247,0.4)",
              }}
            >
              <Zap size={20} />
              Upgrade to Premium
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "2px solid rgba(255,255,255,0.1)",
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function PremiumModal({ score, onContinue }: PremiumModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="rounded-3xl p-8 max-w-md w-full mx-4 border"
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,27,75,0.6))",
          borderColor: "rgba(168,85,247,0.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.1))",
              border: "2px solid rgba(168,85,247,0.4)",
            }}
          >
            <Crown size={40} className="text-violet-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-white text-center mb-3">
          🎉 Demo Complete!
        </h2>

        {/* Score Display */}
        <div className="mb-6 text-center">
          <p className="text-white/70 text-sm mb-2">Your Demo Score</p>
          <p className="text-5xl font-black text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)",
            }}>
            {score.toFixed(0)}%
          </p>
        </div>

        {/* Message */}
        <p className="text-white/80 text-center text-sm leading-relaxed mb-6">
          Excellent work on your demo quiz! You've completed 10 sample MCQs with instant feedback.
        </p>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {[
            "📚 Access all 3,620 MCQs across 7 subjects",
            "📊 Track detailed performance analytics",
            "🎯 Personalized study recommendations",
            "⚡ Spaced repetition for optimal learning",
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: "rgba(16,185,129,0.2)",
                    border: "1px solid rgba(16,185,129,0.4)",
                  }}
                >
                  <span className="text-green-400">✓</span>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-snug">{feature}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #A855F7, #7C3AED)",
              boxShadow: "0 8px 24px rgba(168,85,247,0.3)",
            }}
          >
            <Zap size={18} />
            Upgrade to Premium
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Back to Home
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-white/50 text-xs text-center mt-6 leading-relaxed">
          Start your premium membership today and unlock unlimited practice with detailed analytics and explanations.
        </p>
      </div>
    </div>
  );
}

export default function DemoQuizPage() {
  const router = useRouter();
  const { info, success, error, warning } = useToast();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<(MCQAnswer | null)[]>([]);
  const [mcqTimer, setMcqTimer] = useState(0);
  const [timings, setTimings] = useState<number[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizMCQs, setQuizMCQs] = useState<MCQ[]>([]);
  const sessionTimer = useTimer();

  // Fetch real block data from API
  useEffect(() => {
    async function fetchDemoBlock() {
      try {
        const res = await fetch("/api/blocks");
        const data = await res.json();
        const blocks = data.blocks || [];

        if (blocks.length === 0) {
          error("No blocks available", "Could not load demo blocks");
          return;
        }

        // Select first block as demo block
        const demoBlock = blocks[0];

        // Transform database MCQs to expected format
        const transformedMCQs = (demoBlock.mcqs || [])
          .slice(0, 10)
          .map((dbMcq: any) => {
            let correctIndex = 0;
            if (typeof dbMcq.correct_answer === "string") {
              correctIndex = ["a", "b", "c", "d"].indexOf(dbMcq.correct_answer.toLowerCase());
              if (correctIndex === -1) correctIndex = 0;
            } else if (typeof dbMcq.correct_answer === "number") {
              correctIndex = dbMcq.correct_answer;
            }

            const allExplanations = [
              dbMcq.explanation_a || "",
              dbMcq.explanation_b || "",
              dbMcq.explanation_c || "",
              dbMcq.explanation_d || "",
            ];

            return {
              id: dbMcq.id || `mcq-${Math.random()}`,
              caseStudy: dbMcq.case_study || dbMcq.caseStudy || "",
              question: dbMcq.question || "",
              notes: dbMcq.notes || "",
              image: dbMcq.image_url ? {
                type: dbMcq.image_url,
                caption: "Medical Image",
              } : null,
              options: [
                { label: "A", text: dbMcq.option_a || "" },
                { label: "B", text: dbMcq.option_b || "" },
                { label: "C", text: dbMcq.option_c || "" },
                { label: "D", text: dbMcq.option_d || "" },
              ],
              correctIndex,
              explanation: {
                correct: dbMcq.explanation_summary || allExplanations[correctIndex] || "See individual option explanations",
                incorrect: allExplanations,
              },
            };
          });

        setBlock(demoBlock);
        setQuizMCQs(transformedMCQs);
        setLoading(false);

        console.log(`Loaded demo block: ${demoBlock.title} with ${transformedMCQs.length} questions`);
      } catch (err) {
        console.error("Error fetching demo block:", err);
        error("Loading Error", "Could not load demo block. Using fallback demo MCQs.");
        setQuizMCQs(DEMO_MCQS);
        setBlock({
          id: "demo-fallback",
          title: "Demo Quiz",
          specialty: "Medical",
          description: "Fallback demo questions",
          difficulty: "Medium",
          color: "from-violet-600 to-blue-600",
          icon: "🎁",
          mcqs: DEMO_MCQS,
        });
        setLoading(false);
      }
    }

    fetchDemoBlock();
  }, []);

  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
    setMcqTimer(0);
  }, [currentIdx]);

  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => setMcqTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [submitted, currentIdx]);

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = useCallback(() => {
    if (selected === null || submitted) return;
    const mcq = DEMO_MCQS[currentIdx];
    const isCorrect = selected === mcq.correctIndex;
    const answer: MCQAnswer = {
      mcqIndex: currentIdx,
      selectedIndex: selected,
      isCorrect,
      timeTakenSeconds: mcqTimer,
    };
    const updated = [...answers];
    updated[currentIdx] = answer;
    setAnswers(updated);

    const updatedTimings = [...timings];
    updatedTimings[currentIdx] = mcqTimer;
    setTimings(updatedTimings);

    setSubmitted(true);

    if (isCorrect) {
      success("Correct! 🎉", "Great job!");
    } else {
      warning("Incorrect", "Review the explanation to learn more");
    }
  }, [selected, submitted, currentIdx, mcqTimer, answers, timings, success, warning]);

  const handleNext = useCallback(() => {
    const isLast = currentIdx === quizMCQs.length - 1;

    if (isLast) {
      const finalAnswers = answers.filter(Boolean) as MCQAnswer[];
      const correct = finalAnswers.filter((a) => a.isCorrect).length;
      const score = (correct / quizMCQs.length) * 100;
      setFinalScore(score);

      // Calculate analytics
      const totalTime = finalAnswers.reduce((sum, a) => sum + a.timeTakenSeconds, 0);
      const averageTime = totalTime / finalAnswers.length;

      const questionBreakdown = finalAnswers.map((a) => ({
        questionNumber: a.mcqIndex + 1,
        correct: a.isCorrect,
        timeSpent: a.timeTakenSeconds,
      }));

      const analyticsData: AnalyticsData = {
        score,
        totalQuestions: quizMCQs.length,
        correctAnswers: correct,
        totalTime,
        averageTimePerQuestion: averageTime,
        questionBreakdown,
      };

      setAnalytics(analyticsData);
      setShowAnalytics(true);
    } else {
      setCurrentIdx((i) => i + 1);
      info(`Question ${currentIdx + 2} of ${quizMCQs.length}`, "Keep it up!");
    }
  }, [currentIdx, answers, info]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-white font-semibold">Loading demo quiz...</p>
        </div>
      </div>
    );
  }

  if (showAnalytics && analytics) {
    return <DemoAnalyticsDashboard analytics={analytics} />;
  }

  if (!block || quizMCQs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-white font-semibold">Could not load demo quiz</p>
          <Link href="/" className="text-blue-400 text-sm hover:underline mt-4 inline-block">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const mcq = quizMCQs[currentIdx];
  const isLast = currentIdx === quizMCQs.length - 1;
  const progress = ((currentIdx + (submitted ? 1 : 0)) / quizMCQs.length) * 100;

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "#050B18" }}>
      {/* ── Background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 top-[-80px] left-[-80px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute w-80 h-80 bg-violet-700 rounded-full blur-3xl opacity-20 top-40 right-[-60px] animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
      </div>

      {/* ── Top Navigation Bar ── */}
      <div
        className="sticky top-0 z-40 border-b border-slate-800/30"
        style={{
          background: "linear-gradient(135deg, rgba(5,11,24,0.98), rgba(15,23,42,0.95))",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-all duration-300 text-white/70 hover:text-white"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>

          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs text-white/70 mb-2">
              <span className="font-medium">
                Question {currentIdx + 1} of {quizMCQs.length}
              </span>
              <span className="text-white/60">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(30,27,75,0.5)" }}>
              <div
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)",
                }}
              />
            </div>
          </div>

          <div
            className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-700/50"
            style={{ background: "rgba(15,23,42,0.6)" }}
          >
            <span className="text-white/80 text-lg">⏱️</span>
            <span className="text-white font-mono font-bold text-sm">{formatTime(sessionTimer)}</span>
          </div>
        </div>
      </div>

      {/* ── Main Content - Full Width ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Block Header */}
        <div className="flex items-center justify-between flex-wrap gap-6 pb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
              {block.icon}
            </div>
            <div>
              <p className="text-white font-black text-base">{block.title}</p>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">
                {quizMCQs.length} Questions • Demo Mode
              </p>
            </div>
          </div>
          <div className="hidden sm:block">
            <ProgressDots total={quizMCQs.length} current={currentIdx} answers={answers} />
          </div>
        </div>

        {/* Case Study & Image */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main case study */}
          <div
            className="lg:col-span-2 glass rounded-2xl p-7 border border-slate-700/50"
            style={{
              background: "linear-gradient(135deg, rgba(30,27,75,0.4), rgba(15,23,42,0.4))",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs px-3 py-1.5 rounded-full font-semibold text-blue-300"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  border: "1px solid rgba(59,130,246,0.3)",
                }}
              >
                📋 Clinical Scenario
              </span>
              <span
                className="text-xs px-3 py-1.5 rounded-full font-medium text-white/70"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Q{currentIdx + 1}/{quizMCQs.length}
              </span>
            </div>
            <p className="text-white/90 leading-relaxed text-base mb-4">{mcq.caseStudy}</p>
            {mcq.question && (
              <div className="border-t border-slate-700/50 pt-4 mt-4">
                <p className="text-xs text-white/60 font-semibold uppercase tracking-wide mb-2">
                  Question
                </p>
                <p className="text-white text-sm leading-relaxed">{mcq.question}</p>
              </div>
            )}
          </div>

          {/* Medical Image */}
          {mcq.image && (
            <div className="glass rounded-2xl p-6 border border-slate-700/50 h-fit"
              style={{
                background: "linear-gradient(135deg, rgba(30,27,75,0.4), rgba(15,23,42,0.4))",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-cyan-400">🏥</span>
                <span className="text-xs px-2 py-1 rounded-full font-semibold text-cyan-300"
                  style={{ background: "rgba(6,182,212,0.2)", border: "1px solid rgba(6,182,212,0.3)" }}>
                  {mcq.image.caption || "Medical Image"}
                </span>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900 p-4">
                <p className="text-white/70 text-sm text-center">
                  📊 {mcq.image.type}
                </p>
                {mcq.image.finding && (
                  <p className="text-white/60 text-xs mt-2 text-center italic">
                    {mcq.image.finding}
                  </p>
                )}
              </div>
              <p className="text-white/60 text-xs mt-3 leading-relaxed">
                {mcq.image.caption || "Reference image related to the clinical case presented above."}
              </p>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          <p className="text-xs text-white uppercase tracking-wide font-medium">
            Select the best answer
          </p>
          {mcq.options.map((opt, i) => {
            const isCorrect = i === mcq.correctIndex;
            const isSelected = selected === i;
            const showResult = submitted;

            let borderColor = "rgba(255,255,255,0.08)";
            let bg = "rgba(255,255,255,0.02)";
            let textColor = "#CBD5E1";
            let labelBg = "rgba(255,255,255,0.08)";

            if (showResult) {
              if (isCorrect) {
                borderColor = "#10B981";
                bg = "rgba(16,185,129,0.08)";
                textColor = "#A7F3D0";
                labelBg = "rgba(16,185,129,0.25)";
              } else if (isSelected && !isCorrect) {
                borderColor = "#EF4444";
                bg = "rgba(239,68,68,0.08)";
                textColor = "#FCA5A5";
                labelBg = "rgba(239,68,68,0.25)";
              }
            } else if (isSelected) {
              borderColor = "#3B82F6";
              bg = "rgba(59,130,246,0.10)";
              textColor = "#BAE6FD";
              labelBg = "rgba(59,130,246,0.3)";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={submitted}
                className="w-full rounded-xl p-4 flex items-start gap-3 text-left transition-all"
                style={{
                  border: `1.5px solid ${borderColor}`,
                  background: bg,
                }}
              >
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: labelBg, flexShrink: 0 }}
                >
                  {opt.label}
                </span>
                <span className="text-sm leading-relaxed" style={{ color: textColor }}>
                  {opt.text}
                </span>
                {showResult && isCorrect && (
                  <span className="ml-auto text-emerald-400 text-lg flex-shrink-0">✓</span>
                )}
                {showResult && isSelected && !isCorrect && (
                  <span className="ml-auto text-red-400 text-lg flex-shrink-0">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-6 pt-4 pb-2">
          <div className="text-sm text-white/70 font-medium h-6 flex items-center">
            {!submitted
              ? selected !== null
                ? "🎯 Ready to submit"
                : "👆 Select an answer"
              : submitted && selected === mcq.correctIndex
              ? "✅ Correct! Well done"
              : "❌ Incorrect, try next"}
          </div>
          <div className="flex gap-3">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="px-8 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                style={{
                  background:
                    selected !== null
                      ? "linear-gradient(135deg, #00CED1 0%, #00B5CC 100%)"
                      : "rgba(30,27,75,0.8)",
                  boxShadow:
                    selected !== null
                      ? "0 8px 24px rgba(0,206,209,0.3)"
                      : "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                  boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
                }}
              >
                {isLast ? "🎉 Finish Demo" : "Next Question →"}
              </button>
            )}
          </div>
        </div>

        {/* Explanation Panel */}
        {submitted && (
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "rgba(99,102,241,0.05)",
              border: "1.5px solid rgba(99,102,241,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-blue-400 text-xl">💡</span>
              <span className="text-blue-300 font-bold text-sm">Understanding Each Option</span>
            </div>

            {mcq.options.map((opt, i) => {
              const isCorrect = i === mcq.correctIndex;
              const isSelected = selected === i;
              const explanation = isCorrect
                ? mcq.explanation.correct
                : (mcq.explanation.incorrect?.[i < mcq.correctIndex ? i : i - 1] || "Review this option carefully.");

              return (
                <div
                  key={i}
                  className="rounded-lg p-4 transition-all"
                  style={{
                    background: isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.04)",
                    border: `1px solid ${isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)"}`
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold"
                        style={{
                          background: isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.1)",
                          color: isCorrect ? "#6EE7B7" : "#FCA5A5"
                        }}
                      >
                        {isCorrect ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold mb-1.5 ${isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                        Option {opt.label}: {isCorrect ? "(CORRECT ANSWER)" : "(Incorrect)"}
                      </p>
                      <p className="text-white/90 text-sm leading-relaxed mb-2 font-medium">
                        {opt.text}
                      </p>
                      <div
                        className="border-t pt-2 mt-2"
                        style={{ borderColor: isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.15)" }}
                      >
                        <p className={`text-xs font-semibold mb-1.5 ${isCorrect ? "text-emerald-400" : "text-orange-400"}`}>
                          {isCorrect ? "✓ Why this is correct:" : "✗ Why this is wrong:"}
                        </p>
                        <p className="text-white/80 text-sm leading-relaxed">
                          {explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              className="rounded-lg p-4 mt-6"
              style={{
                background: "rgba(168,85,247,0.08)",
                border: "1px solid rgba(168,85,247,0.3)"
              }}
            >
              <p className="text-purple-300 text-sm leading-relaxed">
                <span className="font-bold">💎 Premium Feature:</span> In the premium version, you'll get even more detailed explanations, clinical pearls, case discussions, and references for further reading on every MCQ!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
