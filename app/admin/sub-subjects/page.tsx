"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface Block {
  id: string;
  title: string;
}

interface SubSubject {
  id: string;
  name: string;
  description: string;
  block_id: string;
  order_index: number;
}

export default function SubSubjectsAdminPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [subSubjects, setSubSubjects] = useState<SubSubject[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const blocksRes = await fetch("/api/blocks");
        const blocksData = await blocksRes.json();
        setBlocks(blocksData.blocks || []);

        if (blocksData.blocks?.length > 0) {
          const firstBlockId = blocksData.blocks[0].id;
          setSelectedBlock(firstBlockId);
          await fetchSubSubjects(firstBlockId);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        error("Error", "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [error]);

  async function fetchSubSubjects(blockId: string) {
    try {
      const res = await fetch(`/api/blocks/${blockId}/sub-subjects`);
      const data = await res.json();
      setSubSubjects(data.sub_subjects || []);
    } catch (err) {
      console.error("Error fetching sub-subjects:", err);
    }
  }

  const handleBlockChange = async (blockId: string) => {
    setSelectedBlock(blockId);
    await fetchSubSubjects(blockId);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      error("Validation", "Sub-subject name is required");
      return;
    }

    try {
      if (editingId) {
        // Update
        const res = await fetch(`/api/sub-subjects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to update");
        success("Success", "Sub-subject updated!");
      } else {
        // Create
        const res = await fetch(`/api/blocks/${selectedBlock}/sub-subjects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            order_index: subSubjects.length,
          }),
        });

        if (!res.ok) throw new Error("Failed to create");
        success("Success", "Sub-subject created!");
      }

      await fetchSubSubjects(selectedBlock);
      setFormData({ name: "", description: "" });
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sub-subject?"))
      return;

    try {
      const res = await fetch(`/api/sub-subjects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      success("Success", "Sub-subject deleted!");
      await fetchSubSubjects(selectedBlock);
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const handleEdit = (subSubject: SubSubject) => {
    setFormData({ name: subSubject.name, description: subSubject.description });
    setEditingId(subSubject.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050B18" }}>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white mb-3">Sub-Subjects Management</h1>
          <p className="text-white/70">Add and manage sub-topics within each block</p>
        </div>

        {/* ── Block Selector ── */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-3">Select Block</label>
          <select
            value={selectedBlock}
            onChange={(e) => handleBlockChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700"
          >
            {blocks.map((block) => (
              <option key={block.id} value={block.id}>
                {block.title}
              </option>
            ))}
          </select>
        </div>

        {/* ── Add New Button ── */}
        {!showForm && (
          <button
            onClick={() => {
              setFormData({ name: "", description: "" });
              setEditingId(null);
              setShowForm(true);
            }}
            className="mb-8 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Add Sub-Subject
          </button>
        )}

        {/* ── Form ── */}
        {showForm && (
          <div className="mb-8 rounded-2xl p-6 bg-slate-800/50 border border-slate-700">
            <h3 className="text-white font-bold mb-4">
              {editingId ? "Edit Sub-Subject" : "Add New Sub-Subject"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Sub-Subject Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-700"
                  placeholder="e.g., General Pharmacology, CNS"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-700 h-24"
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-6 py-2 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── List ── */}
        <div className="space-y-3">
          <h3 className="text-white font-bold text-lg">Sub-Subjects in {blocks.find(b => b.id === selectedBlock)?.title}</h3>
          {subSubjects.length > 0 ? (
            subSubjects.map((sub) => (
              <div
                key={sub.id}
                className="rounded-xl p-4 bg-slate-800/50 border border-slate-700 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-white font-semibold">{sub.name}</h4>
                  {sub.description && (
                    <p className="text-white/60 text-sm mt-1">{sub.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(sub)}
                    className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl p-6 bg-slate-800/50 text-center text-white/60">
              No sub-subjects yet. Create one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
