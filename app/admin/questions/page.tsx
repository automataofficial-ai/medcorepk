"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

interface MCQ {
  id: string;
  block_id: string;
  sub_subject_id: string | null;
  question: string;
  case_study: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string | null;
  correct_answer: string;
  explanation_a: string | null;
  explanation_b: string | null;
  explanation_c: string | null;
  explanation_d: string | null;
  explanation_e: string | null;
  difficulty_level: string | null;
  image_url: string | null;
  references: string | null;
  is_fcps_pearl: boolean | null;
  fcps_pearl_content: string | null;
}

interface Block {
  id: string;
  title: string;
}

interface SubSubject {
  id: string;
  name: string;
  icon?: string | null;
}

const ALL = "__all__";
const UNASSIGNED = "none";

const EMPTY_FORM = {
  sub_subject_id: "",
  question: "",
  case_study: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  option_e: "",
  correct_answer: "a",
  difficulty: "Medium",
  explanation_a: "",
  explanation_b: "",
  explanation_c: "",
  explanation_d: "",
  explanation_e: "",
  image_url: "",
  references: "",
  is_fcps_pearl: false,
  fcps_pearl_content: "",
};

async function readError(res: Response, fallback: string) {
  try {
    const data = await res.json();
    return [data?.error, data?.detail].filter(Boolean).join(": ") || fallback;
  } catch {
    return fallback;
  }
}

export default function MCQManagementPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [admin, setAdmin] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [subSubjects, setSubSubjects] = useState<SubSubject[]>([]);
  const [mcqs, setMCQs] = useState<MCQ[]>([]);

  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedSubSubject, setSelectedSubSubject] = useState<string>(ALL);

  const [loadingSubs, setLoadingSubs] = useState(false);
  const [loadingMcqs, setLoadingMcqs] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }
    setAdmin(JSON.parse(adminToken));
  }, [router]);

  // ── 1. Load the subject list ──────────────────────────────
  useEffect(() => {
    if (!admin) return;
    (async () => {
      try {
        const res = await fetch("/api/blocks");
        if (!res.ok) throw new Error(await readError(res, "Failed to load subjects"));
        const data = await res.json();
        setBlocks(data.blocks || []);
        if (data.blocks?.length > 0) setSelectedBlock(data.blocks[0].id);
      } catch (err: any) {
        showError("Error", err.message || "Failed to load subjects");
      }
    })();
  }, [admin, showError]);

  // ── 2. Subject chosen -> load its sub-subjects ────────────
  useEffect(() => {
    if (!selectedBlock) {
      setSubSubjects([]);
      return;
    }
    let cancelled = false;

    (async () => {
      setLoadingSubs(true);
      try {
        const res = await fetch(`/api/blocks/${selectedBlock}/sub-subjects`);
        if (!res.ok) throw new Error(await readError(res, "Failed to load sub-subjects"));
        const data = await res.json();
        if (!cancelled) setSubSubjects(data.sub_subjects || []);
      } catch (err: any) {
        if (!cancelled) {
          setSubSubjects([]);
          showError("Error", err.message || "Failed to load sub-subjects");
        }
      } finally {
        if (!cancelled) setLoadingSubs(false);
      }
    })();

    // Changing subject clears any sub-subject narrowing
    setSelectedSubSubject(ALL);
    return () => {
      cancelled = true;
    };
  }, [selectedBlock, showError]);

  // ── 3. Subject or sub-subject chosen -> load its MCQs ─────
  const loadMCQs = useCallback(async () => {
    if (!selectedBlock) {
      setMCQs([]);
      return;
    }
    setLoadingMcqs(true);
    try {
      const params = new URLSearchParams({ block_id: selectedBlock });
      if (selectedSubSubject !== ALL) params.set("sub_subject_id", selectedSubSubject);

      const res = await fetch(`/api/admin/questions?${params.toString()}`);
      if (!res.ok) throw new Error(await readError(res, "Failed to load questions"));
      const data = await res.json();
      setMCQs(data.mcqs || []);
    } catch (err: any) {
      setMCQs([]);
      showError("Error", err.message || "Failed to load questions");
    } finally {
      // A different set of questions is on screen, so any selection is stale
      setSelectedIds(new Set());
      setLoadingMcqs(false);
    }
  }, [selectedBlock, selectedSubSubject, showError]);

  useEffect(() => {
    loadMCQs();
  }, [loadMCQs]);

  const subSubjectName = (id: string | null) =>
    id ? subSubjects.find((s) => s.id === id)?.name ?? "Other sub-subject" : null;

  const selectedBlockTitle = blocks.find((b) => b.id === selectedBlock)?.title ?? "";

  // ── Selection ─────────────────────────────────────────────
  // Select-all covers exactly the questions currently listed under the chosen
  // subject and sub-subject, never the whole database.
  const allSelected = mcqs.length > 0 && selectedIds.size === mcqs.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(mcqs.map((m) => m.id)));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;

    const scope =
      selectedSubSubject === ALL
        ? selectedBlockTitle
        : `${selectedBlockTitle} → ${
            selectedSubSubject === UNASSIGNED
              ? "Unassigned"
              : subSubjectName(selectedSubSubject) ?? ""
          }`;

    if (
      !confirm(
        `Delete ${ids.length} question${ids.length === 1 ? "" : "s"} from ${scope}?\n\nThis cannot be undone.`
      )
    )
      return;

    setBulkDeleting(true);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error(await readError(res, "Failed to delete questions"));
      const data = await res.json();

      setMCQs((prev) => prev.filter((m) => !selectedIds.has(m.id)));
      setSelectedIds(new Set());
      success("Deleted", `${data.deleted} question${data.deleted === 1 ? "" : "s"} deleted`);
    } catch (err: any) {
      showError("Error", err?.message || "Failed to delete questions");
    } finally {
      setBulkDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ...EMPTY_FORM,
      sub_subject_id: selectedSubSubject !== ALL && selectedSubSubject !== UNASSIGNED
        ? selectedSubSubject
        : "",
    });
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      showError("Validation", "Question is required");
      return;
    }
    for (const letter of ["a", "b", "c", "d"] as const) {
      if (!(formData[`option_${letter}` as keyof typeof formData] as string).trim()) {
        showError("Validation", `Option ${letter.toUpperCase()} is required`);
        return;
      }
    }
    if (formData.correct_answer === "e" && !formData.option_e.trim()) {
      showError("Validation", "Option E is the answer but is empty");
      return;
    }

    const payload = {
      ...formData,
      sub_subject_id: formData.sub_subject_id || null,
      block_id: selectedBlock,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/questions/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await readError(res, "Failed to update question"));
        success("Updated", "MCQ updated");
      } else {
        const res = await fetch("/api/admin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await readError(res, "Failed to create question"));
        success("Created", "MCQ created");
      }

      await loadMCQs();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      showError("Error", err?.message || "Failed to save");
    }
  };

  // Loads every stored value, so saving cannot blank fields the form did not show
  const handleEdit = (mcq: MCQ) => {
    setFormData({
      sub_subject_id: mcq.sub_subject_id ?? "",
      question: mcq.question ?? "",
      case_study: mcq.case_study ?? "",
      option_a: mcq.option_a ?? "",
      option_b: mcq.option_b ?? "",
      option_c: mcq.option_c ?? "",
      option_d: mcq.option_d ?? "",
      option_e: mcq.option_e ?? "",
      correct_answer: mcq.correct_answer ?? "a",
      difficulty: mcq.difficulty_level
        ? mcq.difficulty_level.charAt(0).toUpperCase() + mcq.difficulty_level.slice(1)
        : "Medium",
      explanation_a: mcq.explanation_a ?? "",
      explanation_b: mcq.explanation_b ?? "",
      explanation_c: mcq.explanation_c ?? "",
      explanation_d: mcq.explanation_d ?? "",
      explanation_e: mcq.explanation_e ?? "",
      image_url: mcq.image_url ?? "",
      references: mcq.references ?? "",
      is_fcps_pearl: mcq.is_fcps_pearl ?? false,
      fcps_pearl_content: mcq.fcps_pearl_content ?? "",
    });
    setEditingId(mcq.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (mcq: MCQ) => {
    if (!confirm(`Delete this MCQ?\n\n${mcq.question.slice(0, 120)}`)) return;
    try {
      const res = await fetch(`/api/admin/questions/${mcq.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await readError(res, "Failed to delete question"));
      success("Deleted", "MCQ deleted");
      setMCQs((prev) => prev.filter((m) => m.id !== mcq.id));
    } catch (err: any) {
      showError("Error", err?.message || "Failed to delete");
    }
  };

  if (!admin) return null;

  const inputClass = "w-full px-4 py-2 rounded-lg bg-slate-700 text-white";

  return (
    <div className="min-h-screen" style={{ background: "#050B18" }}>
      <div
        className="px-6 py-6 border-b"
        style={{
          background: "linear-gradient(135deg, rgba(5,11,24,0.97), rgba(15,23,42,0.95))",
          borderColor: "rgba(99,102,241,0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">MCQ Management</h1>
            <p className="text-slate-400 text-sm">Add, edit, and delete questions</p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 rounded-lg font-semibold text-slate-300"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ── Cascading filters ── */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Subject</label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className={inputClass}
              >
                {blocks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Sub-Subject
                {loadingSubs && <span className="text-slate-400 font-normal"> · loading…</span>}
              </label>
              <select
                value={selectedSubSubject}
                onChange={(e) => setSelectedSubSubject(e.target.value)}
                className={inputClass}
                disabled={loadingSubs}
              >
                <option value={ALL}>All sub-subjects</option>
                {subSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon ? `${s.icon} ` : ""}
                    {s.name}
                  </option>
                ))}
                <option value={UNASSIGNED}>— Unassigned —</option>
              </select>
              {!loadingSubs && subSubjects.length === 0 && (
                <p className="text-slate-400 text-xs mt-2">
                  {selectedBlockTitle} has no sub-subjects yet. Create them in Admin → Sub-Subjects.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <button
              onClick={() => {
                if (showForm) {
                  setShowForm(false);
                  resetForm();
                } else {
                  resetForm();
                  setShowForm(true);
                }
              }}
              className="px-6 py-2 rounded-lg font-bold text-white"
              style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}
            >
              {showForm ? "Cancel" : "+ Add MCQ"}
            </button>
          </div>
        </div>

        {showForm && (
          <div
            className="glass rounded-2xl p-8 mb-8"
            style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? "Edit MCQ" : "Add New MCQ"}
            </h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-white font-bold mb-4">📋 Question Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Sub-Subject</label>
                    <select
                      value={formData.sub_subject_id}
                      onChange={(e) => setFormData({ ...formData, sub_subject_id: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">— No sub-subject —</option>
                      {subSubjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Case Study / Scenario
                    </label>
                    <textarea
                      value={formData.case_study}
                      onChange={(e) => setFormData({ ...formData, case_study: e.target.value })}
                      className={inputClass}
                      rows={3}
                      placeholder="Clinical case or scenario..."
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Question *</label>
                    <textarea
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className={inputClass}
                      rows={2}
                      placeholder="Enter question..."
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-white font-bold mb-4">🔤 Answer Options</h3>
                <div className="space-y-3">
                  {(["a", "b", "c", "d", "e"] as const).map((letter) => (
                    <div key={letter}>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Option {letter.toUpperCase()} {letter === "e" ? "(optional)" : "*"}
                      </label>
                      <input
                        type="text"
                        value={formData[`option_${letter}` as keyof typeof formData] as string}
                        onChange={(e) =>
                          setFormData({ ...formData, [`option_${letter}`]: e.target.value } as any)
                        }
                        className={inputClass}
                        placeholder={`Option ${letter.toUpperCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-white font-bold mb-4">💡 Why Each Option Is Correct/Wrong</h3>
                <div className="space-y-4">
                  {(["a", "b", "c", "d", "e"] as const).map((letter) => (
                    <div key={letter}>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Explanation for Option {letter.toUpperCase()}
                      </label>
                      <textarea
                        value={formData[`explanation_${letter}` as keyof typeof formData] as string}
                        onChange={(e) =>
                          setFormData({ ...formData, [`explanation_${letter}`]: e.target.value } as any)
                        }
                        className={inputClass}
                        rows={2}
                        placeholder={`Explain why option ${letter.toUpperCase()} is correct/incorrect...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-white font-bold mb-4">⚙️ Question Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Correct Answer *</label>
                    <select
                      value={formData.correct_answer}
                      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                      className={inputClass}
                    >
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="c">C</option>
                      <option value="d">D</option>
                      <option value="e">E</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className={inputClass}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Image URL</label>
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className={inputClass}
                      placeholder="e.g., ecg, xray"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-bold">📝 References & FCPS Pearl</h3>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">References</label>
                  <input
                    type="text"
                    value={formData.references}
                    onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                    className={inputClass}
                    placeholder="e.g., Guyton and Hall, 14th ed, Ch 33"
                  />
                </div>
                <label className="flex items-center gap-3 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_fcps_pearl}
                    onChange={(e) => setFormData({ ...formData, is_fcps_pearl: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Mark as FCPS Pearl 💎</span>
                </label>
                {formData.is_fcps_pearl && (
                  <textarea
                    value={formData.fcps_pearl_content}
                    onChange={(e) => setFormData({ ...formData, fcps_pearl_content: e.target.value })}
                    className={inputClass}
                    rows={2}
                    placeholder="The pearl itself..."
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, #00CED1, #00B5CC)" }}
              >
                {editingId ? "Update MCQ" : "Add MCQ"}
              </button>
            </form>
          </div>
        )}

        {/* ── Results ── */}
        <div
          className="glass rounded-2xl overflow-hidden"
          style={{ background: "rgba(30,27,75,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <input
                ref={selectAllRef}
                type="checkbox"
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
                checked={allSelected}
                onChange={toggleAll}
                disabled={mcqs.length === 0}
                aria-label={allSelected ? "Clear selection" : "Select all listed questions"}
                id="select-all-mcqs"
              />
              <label htmlFor="select-all-mcqs" className="text-xl font-bold text-white cursor-pointer">
                Questions ({mcqs.length})
              </label>
            </div>
            <p className="text-slate-400 text-sm">
              {selectedBlockTitle}
              {selectedSubSubject === ALL
                ? " · all sub-subjects"
                : selectedSubSubject === UNASSIGNED
                ? " · unassigned"
                : ` · ${subSubjectName(selectedSubSubject) ?? ""}`}
            </p>
          </div>

          {/* ── Bulk action bar ── */}
          {selectedIds.size > 0 && (
            <div
              className="px-6 py-3 border-b border-slate-700 flex items-center justify-between gap-4 flex-wrap"
              style={{ background: "rgba(6,182,212,0.08)" }}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-white font-semibold">
                  {selectedIds.size} selected
                </span>
                {!allSelected && mcqs.length > selectedIds.size && (
                  <button
                    onClick={toggleAll}
                    className="text-cyan-400 text-sm font-semibold hover:underline"
                  >
                    Select all {mcqs.length} shown
                  </button>
                )}
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-slate-300 text-sm font-semibold hover:underline"
                >
                  Clear
                </button>
              </div>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #DC2626, #B91C1C)" }}
              >
                {bulkDeleting
                  ? "Deleting…"
                  : `Delete ${selectedIds.size} selected`}
              </button>
            </div>
          )}

          {loadingMcqs ? (
            <div className="p-6 text-center text-slate-400">Loading…</div>
          ) : mcqs.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              No MCQs found for this selection.
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {mcqs.map((mcq, idx) => {
                const subName = subSubjectName(mcq.sub_subject_id);
                const checked = selectedIds.has(mcq.id);
                return (
                  <div
                    key={mcq.id}
                    className="p-6 hover:bg-slate-900/30"
                    style={checked ? { background: "rgba(6,182,212,0.07)" } : undefined}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 mt-1 accent-cyan-500 cursor-pointer flex-shrink-0"
                        checked={checked}
                        onChange={() => toggleOne(mcq.id)}
                        aria-label={`Select question ${idx + 1}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold mb-2">
                          {idx + 1}. {mcq.question}
                        </p>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-400 mb-3">
                          <p>A: {mcq.option_a}</p>
                          <p>B: {mcq.option_b}</p>
                          <p>C: {mcq.option_c}</p>
                          <p>D: {mcq.option_d}</p>
                          {mcq.option_e && <p>E: {mcq.option_e}</p>}
                        </div>
                        <div className="flex gap-2 text-xs flex-wrap">
                          <span
                            className="px-2 py-1 rounded"
                            style={{ background: "rgba(16,185,129,0.2)", color: "#10B981" }}
                          >
                            Correct: {mcq.correct_answer?.toUpperCase()}
                          </span>
                          <span
                            className="px-2 py-1 rounded"
                            style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}
                          >
                            {mcq.difficulty_level
                              ? mcq.difficulty_level.charAt(0).toUpperCase() +
                                mcq.difficulty_level.slice(1)
                              : "Medium"}
                          </span>
                          <span
                            className="px-2 py-1 rounded"
                            style={
                              subName
                                ? { background: "rgba(59,130,246,0.2)", color: "#60A5FA" }
                                : { background: "rgba(148,163,184,0.15)", color: "#94A3B8" }
                            }
                          >
                            {subName ?? "Unassigned"}
                          </span>
                          {mcq.is_fcps_pearl && (
                            <span
                              className="px-2 py-1 rounded"
                              style={{ background: "rgba(168,85,247,0.2)", color: "#C084FC" }}
                            >
                              💎 Pearl
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(mcq)}
                          className="px-3 py-1 rounded-lg text-sm font-semibold text-blue-400 hover:bg-blue-900/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(mcq)}
                          className="px-3 py-1 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-900/30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
