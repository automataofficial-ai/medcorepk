"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, CheckCircle, AlertCircle, ChevronLeft } from "lucide-react";

export default function ImportMCQsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
      setPreview(null);
      setShowPreview(false);
    }
  };

  const handlePreview = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const csvText = await file.text();
      const response = await fetch("/api/import/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to preview CSV");
      } else {
        setPreview(data);
        setShowPreview(true);
      }
    } catch (err: any) {
      setError(err.message || "Error previewing CSV file");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.trim().split("\n");

      if (lines.length < 2) {
        setError("CSV file must have at least a header row and one data row");
        setLoading(false);
        return;
      }

      const headers = lines[0].split(",").map(h => h.trim());
      const mcqs = [];

      // Helper to parse CSV line with proper quoted field handling
      const parseCSVLine = (line: string): string[] => {
        const values: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          const nextChar = line[j + 1];

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              current += '"';
              j++; // Skip next quote (escaped quote)
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === "," && !inQuotes) {
            values.push(current.trim().replace(/^"|"$/g, ""));
            current = "";
          } else {
            current += char;
          }
        }
        values.push(current.trim().replace(/^"|"$/g, ""));
        return values;
      };

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = parseCSVLine(lines[i]);
        const mcq: any = {};
        headers.forEach((header, index) => {
          mcq[header] = values[index] || null;
        });
        mcqs.push(mcq);
      }

      if (mcqs.length === 0) {
        setError("No MCQs found in CSV file");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/import/mcqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mcqs }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.detail || "Failed to import MCQs");
      } else {
        setResult({
          success: true,
          message: data.message,
          inserted: data.inserted,
          blocks_updated: data.blocks_updated,
        });
        setFile(null);
      }
    } catch (err: any) {
      setError(err.message || "Error parsing or uploading CSV file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      <div className="sticky top-0 z-40 border-b border-slate-800/30"
        style={{
          background: "linear-gradient(135deg, rgba(5,11,24,0.98), rgba(15,23,42,0.95))",
          backdropFilter: "blur(20px)",
        }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="MedCore" className="h-10 w-auto" />
          </Link>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-white/10 transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Import MCQs from CSV</h1>
          <p className="text-white/70 text-lg">Upload a CSV file to import medical MCQs into the database</p>
        </div>

        <div className="rounded-2xl p-8 border-2 border-dashed border-slate-700/50 mb-8"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.05), rgba(15,23,42,0.4))",
          }}>
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload size={48} className="text-cyan-400" />
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-2">Select your CSV file</p>
              <p className="text-white/60 text-sm">Format: block_name,question,case_study,option_a,option_b,option_c,option_d,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,difficulty,image_url</p>
            </div>
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-input" />
            <label htmlFor="csv-input" className="cursor-pointer">
              <div className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Select CSV File
              </div>
            </label>
            {file && <p className="text-emerald-400 text-sm font-semibold mt-4">✓ {file.name}</p>}
          </div>
        </div>

        {result && (
          <div className="rounded-2xl p-6 border border-emerald-700/50 mb-8" style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(15,23,42,0.4))",
          }}>
            <div className="flex items-start gap-4">
              <CheckCircle size={24} className="text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-emerald-300 font-bold text-lg mb-2">{result.message}</h3>
                <p className="text-white/70 text-sm">{result.inserted} MCQs imported • {result.blocks_updated} blocks updated</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl p-6 border border-red-700/50 mb-8" style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(15,23,42,0.4))",
          }}>
            <div className="flex items-start gap-4">
              <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-red-300 font-bold text-lg mb-2">Import Error</h3>
                <p className="text-white/70 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {showPreview && preview && (
          <div className="rounded-2xl p-6 border border-blue-700/50 mb-8" style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(15,23,42,0.4))",
          }}>
            <div className="mb-4">
              <h3 className="text-blue-300 font-bold text-lg mb-2">CSV Preview</h3>
              <p className="text-white/70 text-sm mb-4">Headers: {preview.headers.join(", ")}</p>
              <p className="text-white/70 text-sm mb-4">Total rows: {preview.totalRows}</p>
            </div>

            {preview.issues && preview.issues.length > 0 && (
              <div className="mb-4 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                <p className="text-red-300 font-bold mb-2">Issues Found:</p>
                {preview.issues.map((issue: any, idx: number) => (
                  <div key={idx} className="text-red-200 text-sm mb-1">
                    Row {issue.row}: {issue.warnings.join("; ")}
                  </div>
                ))}
              </div>
            )}

            {preview.preview && preview.preview.length > 0 && (
              <div className="mb-4">
                <p className="text-white/70 text-sm font-bold mb-2">First Row Preview:</p>
                <div className="bg-black/30 p-3 rounded-lg text-white/60 text-xs max-h-40 overflow-y-auto">
                  {Object.entries(preview.preview[0].data).map(([key, value]: [string, any]) => (
                    <div key={key} className="mb-1">
                      <span className="text-cyan-300">{key}:</span> {String(value).substring(0, 50)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={handlePreview} disabled={!file || loading}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: file && !loading ? "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)" : "rgba(30,27,75,0.8)",
              boxShadow: file && !loading ? "0 8px 24px rgba(6,182,212,0.3)" : "none",
            }}>
            {loading ? "Previewing..." : "Preview CSV"}
          </button>

          <button onClick={handleImport} disabled={!file || loading}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: file && !loading ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)" : "rgba(30,27,75,0.8)",
              boxShadow: file && !loading ? "0 8px 24px rgba(59,130,246,0.3)" : "none",
            }}>
            {loading ? "Importing..." : file ? "Import MCQs" : "Select a file to import"}
          </button>
        </div>
      </div>
    </div>
  );
}
