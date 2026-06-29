"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

interface Block {
  id: string;
  title: string;
  specialty: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  total_mcqs: number;
}

export default function AdminBlocksPage() {
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    specialty: "",
    description: "",
    icon: "📚",
    color: "from-blue-600 to-blue-800",
    difficulty: "Medium",
  });
  const [userId, setUserId] = useState("");

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

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
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setBlocks(data || []);
      }
    } catch (err) {
      console.error("Error fetching blocks:", err);
    }
  }

  async function handleCreateBlock(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/blocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify({
          userId,
          action: "create-block",
          block: formData,
        }),
      });

      const result = await res.json();

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
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Error creating block:", err);
      alert("Failed to create block");
    }
  }

  async function handleDeleteBlock(blockId: string) {
    if (!confirm("Are you sure you want to delete this block?")) return;

    try {
      const res = await fetch("/api/admin/blocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify({
          userId,
          action: "delete-block",
          block: { id: blockId },
        }),
      });

      if (res.ok) {
        fetchBlocks();
      } else {
        alert("Failed to delete block");
      }
    } catch (err) {
      console.error("Error deleting block:", err);
    }
  }

  if (loading) return null;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-800/50"
        style={{ background: "rgba(5,11,24,0.95)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Blocks</h1>
            <p className="text-sm text-slate-400">Create, edit, and delete MCQ blocks</p>
          </div>
          <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Back to Admin
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
          {showForm ? "Cancel" : "+ Create New Block"}
        </button>

        {/* Create Form */}
        {showForm && (
          <div className="glass rounded-2xl p-8 mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Create Block</h2>
            <form onSubmit={handleCreateBlock} className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <input
                  type="text"
                  placeholder="Color gradient"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="px-4 py-3 rounded-lg text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>

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
          <h2 className="text-xl font-bold text-white mb-6">{blocks.length} Blocks</h2>

          {blocks.map((block) => (
            <div key={block.id} className="glass rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-3xl">{block.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{block.title}</h3>
                  <p className="text-sm text-slate-400">
                    {block.specialty} • {block.difficulty} • {block.total_mcqs} MCQs
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{block.description}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/mcqs-manage?blockId=${block.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-400"
                  style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)" }}
                >
                  Manage MCQs
                </Link>
                <button
                  onClick={() => handleDeleteBlock(block.id)}
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
