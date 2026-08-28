"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { adminFetch } from "@/lib/admin-client";
import { useAdminGuard } from "@/lib/use-admin-guard";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  specialty: string;
  created_at: string;
  updated_at: string;
}

export default function UsersPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  const { admin } = useAdminGuard();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchEmail, setSearchEmail] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "student",
    specialty: "",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await adminFetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };
    if (admin) loadUsers();
  }, [admin]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.full_name) {
      showError("Error", "Email and name required");
      return;
    }

    try {
      if (editingId) {
        const res = await adminFetch(`/api/admin/users/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Update failed");
        success("Updated", "User updated!");
      } else {
        const res = await adminFetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Create failed");
        success("Created", "User created!");
      }

      const res = await adminFetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);

      setShowForm(false);
      setEditingId(null);
      setFormData({ email: "", full_name: "", role: "student", specialty: "" });
    } catch (err: any) {
      showError("Error", err?.message || "Failed to save");
    }
  };

  const handleEdit = (user: UserProfile) => {
    setFormData({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      specialty: user.specialty || "",
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user account? This cannot be undone.")) return;
    try {
      const res = await adminFetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      success("Deleted", "User deleted!");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: any) {
      showError("Error", err?.message || "Failed to delete");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.email.toLowerCase().includes(searchEmail.toLowerCase()) || u.full_name.toLowerCase().includes(searchEmail.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "all") return true;
    if (filter === "admin") return u.role === "admin";
    if (filter === "student") return u.role === "user";
    return true;
  });

  if (!admin) return null;

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      <div className="px-6 py-6 border-b" style={{ background: "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))", borderColor: "rgba(99,102,241,0.1)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Users Management</h1>
            <p className="text-slate-400 text-sm">Manage student and admin accounts</p>
          </div>
          <button onClick={() => router.push("/admin")} className="px-4 py-2 rounded-lg font-semibold text-slate-300" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>← Back</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex gap-4 items-center flex-wrap">
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ email: "", full_name: "", role: "student", specialty: "" }); }} className="px-6 py-2 rounded-lg font-bold text-white" style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}>
            {showForm ? "Cancel" : "+ Add User"}
          </button>

          <input type="text" placeholder="Search by email or name..." value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className="px-4 py-2 rounded-lg bg-slate-700 text-white" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 rounded-lg bg-slate-700 text-white ml-auto">
            <option value="all">All Users</option>
            <option value="student">Students Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>

        {showForm && (
          <div className="glass rounded-2xl p-8 mb-8" style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? "Edit User" : "Add New User"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" placeholder="student@example.com" />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Full Name *</label>
                  <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" placeholder="e.g., John Doe" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Role</label>
                  <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white">
                    <option value="user">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Specialty</label>
                  <input type="text" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white" placeholder="e.g., Cardiology" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-bold text-white" style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}>
                {editingId ? "Update User" : "Add User"}
              </button>
            </form>
          </div>
        )}

        <div className="glass rounded-2xl overflow-hidden" style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">All Users ({filteredUsers.length} / {users.length})</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-slate-400">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-slate-400">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-white font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Role</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Specialty</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Joined</th>
                    <th className="px-6 py-3 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const joinDate = new Date(user.created_at).toLocaleDateString();
                    return (
                      <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-900/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full" style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}></div>
                            <span className="text-white font-medium">{user.full_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300 text-sm">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: user.role === "admin" ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)", color: user.role === "admin" ? "#EF4444" : "#3B82F6" }}>
                            {user.role === "admin" ? "Admin" : "Student"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300 text-sm">{user.specialty || "—"}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{joinDate}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(user)} className="px-3 py-1 rounded-lg text-blue-400 hover:bg-blue-900/30 font-semibold">Edit</button>
                            <button onClick={() => handleDelete(user.id)} className="px-3 py-1 rounded-lg text-red-400 hover:bg-red-900/30 font-semibold">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
