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

/**
 * List MCQs for the admin question manager.
 *
 * ?block_id=<uuid>        required - the subject
 * ?sub_subject_id=<uuid>  optional - narrow to one sub-subject
 * ?sub_subject_id=none    optional - only MCQs with no sub-subject assigned
 *
 * Filtering happens in the query rather than by fetching every block and its
 * questions and picking one out client-side.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get("block_id");
    const subSubjectId = searchParams.get("sub_subject_id");

    if (!blockId) {
      return NextResponse.json(
        { error: "block_id is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    let query = supabase
      .from("mcqs")
      .select("*")
      .eq("block_id", blockId);

    if (subSubjectId === "none") {
      query = query.is("sub_subject_id", null);
    } else if (subSubjectId) {
      query = query.eq("sub_subject_id", subSubjectId);
    }

    const { data, error } = await query.order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch questions", detail: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ mcqs: data || [], count: data?.length || 0 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

/**
 * Bulk delete. Body: { ids: string[] }
 * Used by the select-all / multi-select controls in the question manager.
 */
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const ids = body?.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!ids.every((id) => typeof id === "string" && id.trim())) {
      return NextResponse.json(
        { error: "ids must all be strings" },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data: deleted, error } = await supabase
      .from("mcqs")
      .delete()
      .in("id", ids)
      .select("id");

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete questions", detail: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: deleted?.length ?? 0,
      requested: ids.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete questions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    const data = await req.json();

    if (!data.block_id) {
      return NextResponse.json({ error: "block_id is required" }, { status: 400 });
    }
    if (!data.question?.trim()) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }
    for (const opt of ["option_a", "option_b", "option_c", "option_d"]) {
      if (!data[opt]?.trim()) {
        return NextResponse.json(
          { error: `${opt} is required` },
          { status: 400 }
        );
      }
    }
    if (!["a", "b", "c", "d", "e"].includes(data.correct_answer?.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid correct_answer: ${data.correct_answer}. Must be a, b, c, d or e` },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data: created, error } = await supabase
      .from("mcqs")
      .insert([
        {
          block_id: data.block_id,
          sub_subject_id: data.sub_subject_id || null,
          question: data.question,
          case_study: data.case_study || "",
          option_a: data.option_a,
          option_b: data.option_b,
          option_c: data.option_c,
          option_d: data.option_d,
          option_e: data.option_e || null,
          correct_answer: data.correct_answer.toLowerCase(),
          explanation: data.explanation || "",
          explanation_a: data.explanation_a || null,
          explanation_b: data.explanation_b || null,
          explanation_c: data.explanation_c || null,
          explanation_d: data.explanation_d || null,
          explanation_e: data.explanation_e || null,
          difficulty_level: data.difficulty?.toLowerCase() || "medium",
          keywords: data.keywords || null,
          image_url: data.image_url || null,
          references: data.references || null,
          is_fcps_pearl: data.is_fcps_pearl === true || data.is_fcps_pearl === "true",
          fcps_pearl_content: data.fcps_pearl_content || null,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, mcq: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create question" },
      { status: 500 }
    );
  }
}
