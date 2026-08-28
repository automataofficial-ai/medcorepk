"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Copy, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { adminFetch } from "@/lib/admin-client";
import { useAdminGuard } from "@/lib/use-admin-guard";

interface ImageData {
  id: string;
  title: string;
  description: string;
  category: string;
  public_url: string;
  file_size: number;
  created_at: string;
}

const CATEGORIES = [
  "Radiology",
  "Histology",
  "ECG",
  "Ultrasound",
  "CT Scan",
  "MRI",
  "Pathology",
  "Clinical",
  "Anatomy",
  "Other",
];

export default function ImageManagementPage() {
  const { success, error, info } = useToast();
  const { admin } = useAdminGuard();
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Radiology",
  });

  useEffect(() => {
    if (admin) fetchImages();
  }, [selectedCategory, admin]);

  const fetchImages = async () => {
    try {
      setLoading(true);

      const query = selectedCategory !== "All" ? `?category=${selectedCategory}` : "";
      const res = await adminFetch(`/api/images${query}`);

      if (!res.ok) throw new Error("Failed to fetch images");

      const data = await res.json();
      setImages(data.images || []);
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title || !e.currentTarget.file?.files?.[0]) {
      error("Error", "Please fill all fields");
      return;
    }

    try {
      setUploading(true);

      const form = new FormData();
      form.append("file", e.currentTarget.file.files[0]);
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("category", formData.category);

      const res = await adminFetch("/api/images/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      success("Success! 🎉", "Image uploaded successfully");
      setFormData({ title: "", description: "", category: "Radiology" });
      e.currentTarget.reset();
      fetchImages();
    } catch (err: any) {
      error("Upload Error", err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      const res = await adminFetch(`/api/images?id=${imageId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      success("Deleted", "Image removed successfully");
      fetchImages();
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    info("Copied!", "Image URL copied to clipboard");
  };

  const filteredImages = images.filter(
    (img) =>
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div className="border-b border-slate-800/30"
        style={{
          background: "linear-gradient(135deg, rgba(5,11,24,0.98), rgba(15,23,42,0.95))",
          backdropFilter: "blur(20px)"
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">📸 Image Library</h1>
              <p className="text-white/60 text-sm mt-1">Upload and manage your medical images</p>
            </div>
            <Link href="/dashboard" className="px-4 py-2 rounded-lg font-semibold text-white border border-white/20 hover:border-white/40 transition-all">
              ← Back
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Upload Section */}
        <div className="glass rounded-2xl p-8 border border-slate-700/50"
          style={{
            background: "linear-gradient(135deg, rgba(30,27,75,0.4), rgba(15,23,42,0.4))",
          }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Upload size={20} /> Upload New Image
          </h2>

          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Chest X-ray - Pneumonia"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-white mb-2 block">Description</label>
              <textarea
                placeholder="Describe what this image shows..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-white mb-2 block">Select Image File</label>
              <input
                type="file"
                name="file"
                accept="image/*"
                className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-white/60 mt-1">Supported: JPG, PNG, GIF, WebP (Max 10MB)</p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: uploading ? "rgba(30,27,75,0.8)" : "linear-gradient(135deg, #00CED1 0%, #00B5CC 100%)",
              }}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </form>
        </div>

        {/* Filter and Search */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-white mb-2 block">Search</label>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-white mb-2 block">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === "All"
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-800/50 text-white/70 hover:text-white border border-slate-700/50"
                }`}
              >
                All ({images.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = images.filter((img) => img.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-800/50 text-white/70 hover:text-white border border-slate-700/50"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-white/60">Loading images...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={48} className="mx-auto text-white/40 mb-4" />
            <p className="text-white/60">No images found. Upload one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="glass rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
                style={{
                  background: "linear-gradient(135deg, rgba(30,27,75,0.4), rgba(15,23,42,0.4))",
                }}
              >
                {/* Image Preview */}
                <div className="relative w-full h-48 bg-slate-800/50 overflow-hidden">
                  <img
                    src={image.public_url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">{image.title}</h3>
                      <p className="text-xs text-cyan-400 font-semibold">{image.category}</p>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 mb-4 line-clamp-2">{image.description}</p>

                  <div className="text-xs text-white/50 mb-4">
                    {new Date(image.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyImageUrl(image.public_url)}
                      className="flex-1 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-white text-sm font-semibold flex items-center justify-center gap-1 transition-all"
                    >
                      <Copy size={14} /> Copy URL
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
