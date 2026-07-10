"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

interface Block {
  id: string;
  title: string;
  specialty: string;
  description: string;
  icon: string;
  difficulty: string;
  total_mcqs: number;
}

export default function BlocksPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [admin, setAdmin] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    specialty: "",
    description: "",
    icon: "📚",
    difficulty: "Medium",
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
      } catch (err) {
        console.error("Error loading blocks:", err);
      } finally {
        setLoading(false);
      }
    };
    if (admin) loadBlocks();
  }, [admin]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.specialty) {
      showError("Error", "Title and specialty required");
      return;
    }

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/blocks/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Update failed");
        success("Updated", "Block updated!");
      } else {
        const res = await fetch("/api/admin/blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Create failed");
        success("Created", "Block created!");
      }

      const res = await fetch("/api/blocks");
      const data = await res.json();
      setBlocks(data.blocks || []);

      setShowForm(false);
      setEditingId(null);
      setFormData({ title: "", specialty: "", description: "", icon: "📚", difficulty: "Medium" });
    } catch (err: any) {
      showError("Error", err?.message || "Failed to save");
    }
  };

  const handleEdit = (block: Block) => {
    setFormData({
      title: block.title,
      specialty: block.specialty,
      description: block.description,
      icon: block.icon,
      difficulty: block.difficulty,
    });
    setEditingId(block.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this block and all its MCQs?")) return;
    try {
      const res = await fetch(`/api/admin/blocks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      success("Deleted", "Block deleted!");
      setBlocks(blocks.filter((b) => b.id !== id));
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
            <h1 className="text-3xl font-bold text-white">Blocks Management</h1>
            <p className="text-slate-400 text-sm">Create and manage learning blocks</p>
          </div>
          <button onClick={() => router.push("/admin")} className="px-4 py-2 rounded-lg font-semibold text-slate-300" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>← Back</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex gap-4">
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: "", specialty: "", description: "", icon: "📚", difficulty: "Medium" }); }} className="px-6 py-2 rounded-lg font-bold text-white" style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}>
            {showForm ? "Cancel" : "+ Add Block"}
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-2xl p-8 mb-8" style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? "Edit Block" : "Add New Block"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" placeholder="e.g., Anatomy Fundamentals" />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Specialty *</label>
                  <input type="text" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" placeholder="e.g., Anatomy" />
                </div>
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" rows={2} placeholder="Block description..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Icon</label>
                  <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white text-center" placeholder="🫀" />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Difficulty</label>
                  <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-bold text-white" style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}>
                {editingId ? "Update Block" : "Add Block"}
              </button>
            </form>
          </div>
        )}

        <div className="glass rounded-2xl overflow-hidden" style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">All Blocks ({blocks.length})</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-slate-400">Loading...</div>
          ) : blocks.length === 0 ? (
            <div className="p-6 text-center text-slate-400">No blocks yet. Create one!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {blocks.map((block) => (<div key={block.id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="text-3xl mb-2">{block.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">{block.title}</h3>
                <p className="text-sm text-slate-400 mb-3">{block.specialty}</p>
                <p className="text-xs text-slate-500 mb-3">{block.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-1 rounded" style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>{block.difficulty}</span>
                  <span className="text-xs px-2 py-1 rounded" style={{ background: "rgba(59,130,246,0.2)", color: "#3B82F6" }}>{block.total_mcqs} MCQs</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(block)} className="flex-1 px-3 py-1 rounded-lg text-sm font-semibold text-blue-400 hover:bg-blue-900/30">Edit</button>
                  <button onClick={() => handleDelete(block.id)} className="flex-1 px-3 py-1 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-900/30">Delete</button>
                </div>
              </div>))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
