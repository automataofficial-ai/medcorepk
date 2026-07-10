"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

interface MCQ {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: string;
  block_id: string;
}

interface Block {
  id: string;
  title: string;
}

export default function MCQManagementPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [admin, setAdmin] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [mcqs, setMCQs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    case_study: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "a",
    difficulty: "Medium",
    explanation_a: "",
    explanation_b: "",
    explanation_c: "",
    explanation_d: "",
    notes: "",
    image_url: "",
  });

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }
    setAdmin(JSON.parse(adminToken));
  }, [router]);

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const res = await fetch("/api/blocks");
        const data = await res.json();
        setBlocks(data.blocks || []);
        if (data.blocks?.length > 0) {
          setSelectedBlock(data.blocks[0].id);
        }
      } catch (err) {
        console.error("Error loading blocks:", err);
      }
    };
    if (admin) loadBlocks();
  }, [admin]);

  useEffect(() => {
    const loadMCQs = async () => {
      if (!selectedBlock) return;
      setLoading(true);
      try {
        const res = await fetch("/api/blocks");
        const data = await res.json();
        const block = data.blocks?.find((b: any) => b.id === selectedBlock);
        setMCQs(block?.mcqs || []);
      } catch (err) {
        console.error("Error loading MCQs:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMCQs();
  }, [selectedBlock]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.option_a || !formData.option_b || !formData.option_c || !formData.option_d) {
      showError("Error", "Question and all options required");
      return;
    }

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/questions/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Update failed");
        success("Updated", "MCQ updated!");
      } else {
        const res = await fetch("/api/admin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, block_id: selectedBlock }),
        });
        if (!res.ok) throw new Error("Create failed");
        success("Created", "MCQ created!");
      }

      const res = await fetch("/api/blocks");
      const data = await res.json();
      const block = data.blocks?.find((b: any) => b.id === selectedBlock);
      setMCQs(block?.mcqs || []);

      setShowForm(false);
      setEditingId(null);
      setFormData({
        question: "",
        case_study: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "a",
        difficulty: "Medium",
        explanation_a: "",
        explanation_b: "",
        explanation_c: "",
        explanation_d: "",
        notes: "",
        image_url: "",
      });
    } catch (err: any) {
      showError("Error", err?.message || "Failed to save");
    }
  };

  const handleEdit = (mcq: MCQ) => {
    setFormData({
      question: mcq.question,
      case_study: "",
      option_a: mcq.option_a,
      option_b: mcq.option_b,
      option_c: mcq.option_c,
      option_d: mcq.option_d,
      correct_answer: mcq.correct_answer,
      difficulty: mcq.difficulty,
      explanation_a: "",
      explanation_b: "",
      explanation_c: "",
      explanation_d: "",
      notes: "",
      image_url: "",
    });
    setEditingId(mcq.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this MCQ?")) return;
    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      success("Deleted", "MCQ deleted!");
      setMCQs(mcqs.filter((m) => m.id !== id));
    } catch (err: any) {
      showError("Error", err?.message || "Failed to delete");
    }
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      <div className="px-6 py-6 border-b" style={{ background: "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))", borderColor: "rgba(99,102,241,0.1)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">MCQ Management</h1>
            <p className="text-slate-400 text-sm">Add, edit, and delete questions</p>
          </div>
          <button onClick={() => router.push("/admin")} className="px-4 py-2 rounded-lg font-semibold text-slate-300" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>← Back</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex gap-4 items-center flex-wrap">
          <label className="text-white font-semibold">Select Block:</label>
          <select value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)} className="px-4 py-2 rounded-lg bg-slate-700 text-white">
            {blocks.map((b) => (<option key={b.id} value={b.id}>{b.title}</option>))}
          </select>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ question: "", case_study: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_answer: "a", difficulty: "Medium", explanation_a: "", explanation_b: "", explanation_c: "", explanation_d: "", notes: "", image_url: "" }); }} className="ml-auto px-6 py-2 rounded-lg font-bold text-white" style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}>
            {showForm ? "Cancel" : "+ Add MCQ"}
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-2xl p-8 mb-8" style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? "Edit MCQ" : "Add New MCQ"}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Question Section */}
              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-white font-bold mb-4">📋 Question Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Case Study / Scenario</label>
                    <textarea value={formData.case_study} onChange={(e) => setFormData({ ...formData, case_study: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" rows={3} placeholder="Clinical case or scenario..." />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Question *</label>
                    <textarea value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" rows={2} placeholder="Enter question..." />
                  </div>
                </div>
              </div>

              {/* Options Section */}
              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-white font-bold mb-4">🔤 Answer Options</h3>
                <div className="space-y-3">
                  {["a", "b", "c", "d"].map((letter) => (
                    <div key={letter}>
                      <label className="block text-white text-sm font-semibold mb-2">Option {letter.toUpperCase()} *</label>
                      <input type="text" value={formData[`option_${letter}` as keyof typeof formData] as string} onChange={(e) => setFormData({ ...formData, [`option_${letter}`]: e.target.value } as any)} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" placeholder={`Option ${letter.toUpperCase()}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanations Section */}
              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-white font-bold mb-4">💡 Why Each Option Is Correct/Wrong</h3>
                <div className="space-y-4">
                  {["a", "b", "c", "d"].map((letter) => (
                    <div key={letter}>
                      <label className="block text-white text-sm font-semibold mb-2">Explanation for Option {letter.toUpperCase()}</label>
                      <textarea value={formData[`explanation_${letter}` as keyof typeof formData] as string} onChange={(e) => setFormData({ ...formData, [`explanation_${letter}`]: e.target.value } as any)} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" rows={2} placeholder={`Explain why option ${letter.toUpperCase()} is correct/incorrect...`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Section */}
              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-white font-bold mb-4">⚙️ Question Settings</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Correct Answer *</label>
                    <select value={formData.correct_answer} onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white">
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="c">C</option>
                      <option value="d">D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Difficulty</label>
                    <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white">
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Image URL</label>
                    <input type="text" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" placeholder="e.g., ecg, xray" />
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <h3 className="text-white font-bold mb-4">📝 Additional Notes (FCPS Tips & References)</h3>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" rows={3} placeholder="Add FCPS tips, references, mnemonics, or clinical pearls..." />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl font-bold text-white" style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}>
                {editingId ? "Update MCQ" : "Add MCQ"}
              </button>
            </form>
          </div>
        )}

        <div className="glass rounded-2xl overflow-hidden" style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Questions ({mcqs.length})</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-slate-400">Loading...</div>
          ) : mcqs.length === 0 ? (
            <div className="p-6 text-center text-slate-400">No MCQs yet. Add one!</div>
          ) : (
            <div className="divide-y divide-slate-700">
              {mcqs.map((mcq, idx) => (<div key={mcq.id} className="p-6 hover:bg-slate-900/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-2">{idx + 1}. {mcq.question}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mb-3">
                      <p>A: {mcq.option_a}</p>
                      <p>B: {mcq.option_b}</p>
                      <p>C: {mcq.option_c}</p>
                      <p>D: {mcq.option_d}</p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="px-2 py-1 rounded" style={{ background: "rgba(16,185,129,0.2)", color: "#10B981" }}>Correct: {mcq.correct_answer.toUpperCase()}</span>
                      <span className="px-2 py-1 rounded" style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>{mcq.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(mcq)} className="px-3 py-1 rounded-lg text-sm font-semibold text-blue-400 hover:bg-blue-900/30">Edit</button>
                    <button onClick={() => handleDelete(mcq.id)} className="px-3 py-1 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-900/30">Delete</button>
                  </div>
                </div>
              </div>))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
