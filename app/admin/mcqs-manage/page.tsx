"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

interface Block {
  id: string;
  title: string;
  specialty: string;
}

interface MCQ {
  id: string;
  case_study: string;
  question: string;
  image_url: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
}

const IMAGE_TYPES = [
  "chest-xray",
  "ecg",
  "brain-ct",
  "hand-xray",
  "knee-xray",
  "abdominal-xray",
  "thyroid-scan",
  "histology",
  "fundoscopy",
  "urine-dipstick",
  "mri-knee",
  "peripheral-smear",
];

export default function MCQsManagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blockId = searchParams.get("blockId");

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [userId, setUserId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    case_study: "",
    question: "",
    image_url: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "a",
    explanation: "",
  });

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  useEffect(() => {
    if (blockId && blocks.length > 0) {
      const block = blocks.find((b) => b.id === blockId);
      if (block) {
        setSelectedBlock(block);
        fetchMCQs(blockId);
      }
    }
  }, [blockId, blocks]);

  async function checkAdminAndLoad() {
    try {
      const user = localStorage.getItem("medcore_user");
      if (!user) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(user);
      setUserId(userData.id);

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userData.id)
        .single();

      if (error || data?.role !== "admin") {
        router.push("/admin/dashboard");
        return;
      }

      setIsAdmin(true);
      fetchBlocks();
    } catch (err) {
      console.error("Auth error:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBlocks() {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("blocks")
        .select("id, title, specialty")
        .order("created_at", { ascending: false });

      if (!error) {
        setBlocks(data || []);
      }
    } catch (err) {
      console.error("Error fetching blocks:", err);
    }
  }

  async function fetchMCQs(bId: string) {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("mcqs")
        .select("*")
        .eq("block_id", bId)
        .order("created_at", { ascending: true });

      if (!error) {
        setMcqs(data || []);
      }
    } catch (err) {
      console.error("Error fetching MCQs:", err);
    }
  }

  async function handleSaveMCQ(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedBlock) {
      alert("Please select a block first");
      return;
    }

    try {
      const action = editingId ? "update-mcq" : "create-mcq";

      const res = await fetch("/api/admin/mcqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify({
          userId,
          action,
          mcq: {
            id: editingId,
            block_id: selectedBlock.id,
            ...formData,
          },
        }),
      });

      const result = await res.json();

      if (res.ok) {
        resetForm();
        fetchMCQs(selectedBlock.id);
        alert(editingId ? "MCQ updated!" : "MCQ created!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Error saving MCQ:", err);
      alert("Failed to save MCQ");
    }
  }

  async function handleDeleteMCQ(mcqId: string) {
    if (!confirm("Delete this MCQ?")) return;

    if (!selectedBlock) return;

    try {
      const res = await fetch("/api/admin/mcqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify({
          userId,
          action: "delete-mcq",
          mcq: { id: mcqId },
        }),
      });

      if (res.ok) {
        fetchMCQs(selectedBlock.id);
        alert("MCQ deleted!");
      } else {
        alert("Failed to delete MCQ");
      }
    } catch (err) {
      console.error("Error deleting MCQ:", err);
    }
  }

  function resetForm() {
    setFormData({
      case_study: "",
      question: "",
      image_url: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "a",
      explanation: "",
    });
    setEditingId(null);
    setShowAddForm(false);
  }

  function editMCQ(mcq: MCQ) {
    setFormData({
      case_study: mcq.case_study,
      question: mcq.question,
      image_url: mcq.image_url || "",
      option_a: mcq.option_a,
      option_b: mcq.option_b,
      option_c: mcq.option_c,
      option_d: mcq.option_d,
      correct_answer: mcq.correct_answer.toLowerCase(),
      explanation: mcq.explanation || "",
    });
    setEditingId(mcq.id);
    setShowAddForm(true);
  }

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-800/50"
        style={{ background: "rgba(5,11,24,0.95)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage MCQs</h1>
            <p className="text-sm text-slate-400">Add, edit, and delete questions</p>
          </div>
          <Link href="/admin/blocks-manage" className="text-blue-400 hover:text-blue-300">
            ← Back to Blocks
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Block Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-2">Select Block</label>
          <select
            value={selectedBlock?.id || ""}
            onChange={(e) => {
              const block = blocks.find((b) => b.id === e.target.value);
              setSelectedBlock(block || null);
              if (block) fetchMCQs(block.id);
              resetForm();
            }}
            className="w-full px-4 py-3 rounded-lg text-white"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <option value="">Choose a block...</option>
            {blocks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.specialty})
              </option>
            ))}
          </select>
        </div>

        {selectedBlock && (
          <>
            {/* Add MCQ Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="mb-8 px-6 py-3 rounded-lg font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                boxShadow: "0 4px 15px rgba(0,206,209,0.4)",
              }}
            >
              {showAddForm ? "Cancel" : "+ Add New MCQ"}
            </button>

            {/* MCQ Form */}
            {showAddForm && (
              <div className="glass rounded-2xl p-8 mb-12">
                <h2 className="text-xl font-bold text-white mb-6">
                  {editingId ? "Edit MCQ" : "Create New MCQ"}
                </h2>
                <form onSubmit={handleSaveMCQ} className="space-y-4">
                  {/* Case Study */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Case Study</label>
                    <textarea
                      value={formData.case_study}
                      onChange={(e) => setFormData({ ...formData, case_study: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg text-white"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      rows={3}
                      placeholder="Patient scenario and clinical presentation..."
                    />
                  </div>

                  {/* Question */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Question</label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg text-white"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      placeholder="What is the diagnosis?"
                    />
                  </div>

                  {/* Image */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Image Type</label>
                      <select
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg text-white"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        <option value="">No image</option>
                        {IMAGE_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["a", "b", "c", "d"].map((opt) => (
                      <div key={opt}>
                        <label className="block text-sm text-slate-300 mb-2">Option {opt.toUpperCase()}</label>
                        <input
                          type="text"
                          value={formData[`option_${opt}` as keyof typeof formData]}
                          onChange={(e) =>
                            setFormData({ ...formData, [`option_${opt}`]: e.target.value })
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg text-white"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                          placeholder={`Option ${opt.toUpperCase()}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Answer */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Correct Answer</label>
                    <select
                      value={formData.correct_answer}
                      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-white"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <option value="a">Option A</option>
                      <option value="b">Option B</option>
                      <option value="c">Option C</option>
                      <option value="d">Option D</option>
                    </select>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Explanation</label>
                    <textarea
                      value={formData.explanation}
                      onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-white"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      rows={3}
                      placeholder="Why this answer is correct and why others are wrong..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-lg font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}
                    >
                      {editingId ? "Update MCQ" : "Create MCQ"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-3 rounded-lg font-semibold text-white"
                      style={{ background: "rgba(255,255,255,0.1)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* MCQs List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-6">{mcqs.length} MCQs</h2>

              {mcqs.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <p className="text-slate-400">No MCQs in this block yet. Click "+ Add New MCQ" to create one.</p>
                </div>
              ) : (
                mcqs.map((mcq, idx) => (
                  <div key={mcq.id} className="glass rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">Question {idx + 1}</h3>
                        <p className="text-sm text-slate-300 mt-2">{mcq.question}</p>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{mcq.case_study}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => editMCQ(mcq)}
                          className="px-3 py-2 rounded text-sm font-semibold text-blue-400"
                          style={{ background: "rgba(59,130,246,0.1)" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMCQ(mcq.id)}
                          className="px-3 py-2 rounded text-sm font-semibold text-red-400"
                          style={{ background: "rgba(239,68,68,0.1)" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-slate-400">A) {mcq.option_a}</div>
                      <div className="text-slate-400">B) {mcq.option_b}</div>
                      <div className="text-slate-400">C) {mcq.option_c}</div>
                      <div className="text-slate-400">D) {mcq.option_d}</div>
                    </div>
                    <div className="mt-3 p-2 rounded" style={{ background: "rgba(16,185,129,0.1)" }}>
                      <p className="text-xs text-emerald-400">
                        ✓ Correct: <strong>{mcq.correct_answer.toUpperCase()}</strong>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
