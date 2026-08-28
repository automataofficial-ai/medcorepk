import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth-server";

function getServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

/** Request field -> database column. `difficulty` is stored as difficulty_level. */
const FIELD_TO_COLUMN: Record<string, string> = {
  question: "question",
  case_study: "case_study",
  option_a: "option_a",
  option_b: "option_b",
  option_c: "option_c",
  option_d: "option_d",
  option_e: "option_e",
  correct_answer: "correct_answer",
  explanation: "explanation",
  explanation_a: "explanation_a",
  explanation_b: "explanation_b",
  explanation_c: "explanation_c",
  explanation_d: "explanation_d",
  explanation_e: "explanation_e",
  difficulty: "difficulty_level",
  image_url: "image_url",
  references: "references",
  is_fcps_pearl: "is_fcps_pearl",
  fcps_pearl_content: "fcps_pearl_content",
  keywords: "keywords",
  sub_subject_id: "sub_subject_id",
  block_id: "block_id",
};

/** Columns that are NOT NULL in the database and must never be blanked. */
const REQUIRED_COLUMNS = new Set([
  "question",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_answer",
]);

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    const { id } = await params;

    let data: any;
    try {
      data = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Only update fields the caller actually sent. Previously every column was
    // written on every request, so a form that had not loaded the existing
    // explanations would overwrite them with empty strings.
    const updates: Record<string, any> = {};

    for (const [field, column] of Object.entries(FIELD_TO_COLUMN)) {
      if (!(field in data) || data[field] === undefined) continue;

      let value = data[field];

      if (field === "correct_answer") {
        if (!["a", "b", "c", "d", "e"].includes(String(value).toLowerCase())) {
          return NextResponse.json(
            { error: `Invalid correct_answer: ${value}. Must be a, b, c, d or e` },
            { status: 400 }
          );
        }
        value = String(value).toLowerCase();
      }

      if (field === "difficulty" && value) {
        value = String(value).toLowerCase();
      }

      if (field === "is_fcps_pearl") {
        value = value === true || value === "true";
      }

      if (REQUIRED_COLUMNS.has(column)) {
        if (typeof value !== "string" || !value.trim()) {
          return NextResponse.json(
            { error: `${field} cannot be empty` },
            { status: 400 }
          );
        }
      } else if (value === "") {
        // Optional text columns store NULL rather than an empty string
        value = column === "case_study" ? "" : null;
      }

      updates[column] = value;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const supabase = getServiceRoleClient();

    const { data: updated, error } = await supabase
      .from("mcqs")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { error: `Question not found: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, mcq: updated[0] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    const { id } = await params;
    const supabase = getServiceRoleClient();

    const { error } = await supabase.from("mcqs").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete question" },
      { status: 500 }
    );
  }
}
