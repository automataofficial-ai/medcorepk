"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

interface Block {
  id: string;
  title: string;
}

export default function ImportMCQsPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [admin, setAdmin] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);

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
      }
    };
    if (admin) loadBlocks();
  }, [admin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Parse CSV handling quoted fields with commas
  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showError("Error", "Please select a CSV file");
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        showError("Error", "CSV file must have header row and at least one data row");
        return;
      }

      const mcqs = lines.slice(1).map((line, index) => {
        if (!line.trim()) return null;

        const values = parseCSVLine(line);

        // Validate that we have at least the required fields
        if (values.length < 8 || !values[0] || !values[1] || !values[7]) {
          console.warn(`Row ${index + 2}: Missing required fields. Block: ${values[0]}, Question: ${values[1]}, Correct Answer: ${values[7]}`);
          return null;
        }

        return {
          block_name: values[0],
          question: values[1],
          case_study: values[2] || "",
          option_a: values[3] || "",
          option_b: values[4] || "",
          option_c: values[5] || "",
          option_d: values[6] || "",
          correct_answer: values[7],
          explanation_a: values[8] || "",
          explanation_b: values[9] || "",
          explanation_c: values[10] || "",
          explanation_d: values[11] || "",
          difficulty: values[12] || "Medium",
          image_url: values[13] || "",
        };
      }).filter(Boolean);

      if (mcqs.length === 0) {
        showError("Error", "No valid MCQs found in CSV file. Make sure all rows have block_name, question, and correct_answer.");
        return;
      }

      const res = await fetch("/api/import/mcqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mcqs }),
      });

      const result = await res.json();
      if (res.ok) {
        success("Imported", `${result.inserted || 0} MCQs imported successfully!`);
        setFile(null);
      } else {
        showError("Error", result.error || "Import failed");
      }
    } catch (err: any) {
      showError("Error", err?.message || "Failed to import");
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      {/* Header */}
      <div
        className="px-6 py-6 border-b"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))",
          borderColor: "rgba(99,102,241,0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Import MCQs</h1>
            <p className="text-slate-400 text-sm">
              Bulk import questions from CSV file
            </p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 rounded-lg font-semibold text-slate-300"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div
          className="glass rounded-2xl p-8"
          style={{
            background: "rgba(30,27,75,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <form onSubmit={handleImport} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-semibold mb-4">
                📥 Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white"
              />
              {file && (
                <p className="text-sm text-emerald-400 mt-2">
                  ✓ Selected: {file.name}
                </p>
              )}
            </div>

            <div
              className="p-4 rounded-lg text-sm space-y-4"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <div>
                <p className="text-blue-300 font-semibold mb-2">📋 CSV Format:</p>
                <p className="text-slate-400 text-xs font-mono mb-3">
                  block_name,question,case_study,option_a,option_b,option_c,option_d,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,difficulty,image_url
                </p>
              </div>

              {blocks.length > 0 && (
                <div>
                  <p className="text-green-300 font-semibold mb-2">✅ Available Blocks (Use these as block_name):</p>
                  <div className="text-slate-400 text-xs font-mono flex flex-wrap gap-2">
                    {blocks.map((block) => (
                      <span key={block.id} className="px-2 py-1 rounded" style={{ background: "rgba(16,185,129,0.2)" }}>
                        "{block.title}"
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-amber-300 font-semibold mb-2">📝 Example Row:</p>
                <p className="text-slate-400 text-xs font-mono">
                  Anatomy Fundamentals,What is the heart?,A 45-year-old patient presents with...,Cerebrum,Cerebellum,Medulla,Thalamus,c,Controls movement not heartbeat,Coordinates balance not heartbeat,CORRECT - controls heart rate,Relays sensory signals,Medium,heart_diagram
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #00CED1, #00B5CC)",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Importing..." : "Import MCQs"}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          💡 See CSV_IMPORT_GUIDE.md in project for detailed instructions
        </p>
      </div>
    </div>
  );
}
