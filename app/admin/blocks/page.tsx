"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Block {
  id: string;
  title: string;
  specialty: string;
  description: string;
  icon: string;
  difficulty: string;
  total_mcqs: number;
}

export default function AdminBlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    specialty: "",
    description: "",
    icon: "📚",
    color: "from-blue-600 to-blue-800",
    difficulty: "Medium",
  });

  useEffect(() => {
    fetchBlocks();
  }, []);

  async function fetchBlocks() {
    try {
      const res = await fetch("/api/blocks");
      const data = await res.json();
      setBlocks(data.blocks || []);
    } catch (err) {
      console.error("Error fetching blocks:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBlock(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mcqs: [], // Can add MCQs separately
        }),
      });

      if (res.ok) {
        setFormData({
          title: "",
          specialty: "",
          description: "",
          icon: "📚",
          color: "from-blue-600 to-blue-800",
          difficulty: "Medium",
        });
        setShowForm(false);
        fetchBlocks();
      }
    } catch (err) {
      console.error("Error adding block:", err);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-800/50"
        style={{ background: "rgba(5,11,24,0.95)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Blocks</h1>
            <p className="text-sm text-slate-400">Add and manage MCQ blocks</p>
          </div>
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Add Block Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-8 px-6 py-3 rounded-lg font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #00CED1, #00B5CC)",
            boxShadow: "0 4px 15px rgba(0,206,209,0.4)",
          }}
        >
          {showForm ? "Cancel" : "+ Add New Block"}
        </button>

        {/* Add Block Form */}
        {showForm && (
          <div className="glass rounded-2xl p-8 mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Create New Block</h2>
            <form onSubmit={handleAddBlock} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Block Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="px-4 py-3 rounded-lg text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />

                <input
                  type="text"
                  placeholder="Specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  required
                  className="px-4 py-3 rounded-lg text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />

                <input
                  type="text"
                  placeholder="Icon (emoji)"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="px-4 py-3 rounded-lg text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />

                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="px-4 py-3 rounded-lg text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                rows={3}
              />

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}
              >
                Create Block
              </button>
            </form>
          </div>
        )}

        {/* Blocks List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">
            {loading ? "Loading blocks..." : `${blocks.length} Blocks`}
          </h2>

          {blocks.map((block) => (
            <div
              key={block.id}
              className="glass rounded-2xl p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{block.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{block.title}</h3>
                  <p className="text-sm text-slate-400">
                    {block.specialty} • {block.difficulty} • {block.total_mcqs} MCQs
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-400"
                  style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)" }}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-red-400"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
