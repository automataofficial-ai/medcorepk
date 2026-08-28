import { NextRequest, NextResponse } from "next/server";
import {
  buildSubSubjectPayload,
  getServiceRoleClient,
  isMissingIconColumnError,
  withoutIcon,
} from "@/lib/sub-subjects";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServiceRoleClient();

    // Get sub-subject details
    const { data: subSubject, error: subError } = await supabase
      .from("sub_subjects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (subError) throw subError;

    if (!subSubject) {
      return NextResponse.json(
        { error: `Sub-subject not found: ${id}` },
        { status: 404 }
      );
    }

    // Get block details for context
    const { data: block, error: blockError } = await supabase
      .from("blocks")
      .select("id, title")
      .eq("id", subSubject.block_id)
      .maybeSingle();

    if (blockError) throw blockError;

    // Get MCQs for this sub-subject
    const { data: mcqs, error: mcqError } = await supabase
      .from("mcqs")
      .select("*")
      .eq("sub_subject_id", id)
      .order("created_at", { ascending: true });

    if (mcqError) throw mcqError;

    // Remove duplicate MCQs by ID
    const uniqueMcqs = Array.from(
      new Map((mcqs || []).map((mcq) => [mcq.id, mcq])).values()
    );

    return NextResponse.json({
      sub_subject: {
        ...subSubject,
        block_title: block?.title ?? null,
      },
      mcqs: uniqueMcqs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    const { id } = await params;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { payload, error: validationError } = buildSubSubjectPayload(body, {
      requireName: false,
    });

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    const update = (row: Record<string, any>) =>
      supabase
        .from("sub_subjects")
        .update({ ...row, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();

    let { data, error } = await update(payload);

    // The icon column is added by migration 20260824000001. If that migration
    // has not been applied yet, save the remaining fields rather than failing.
    if (isMissingIconColumnError(error)) {
      console.warn(
        "sub_subjects.icon is missing - apply supabase/migrations/20260824000001_add_sub_subject_icon.sql"
      );
      ({ data, error } = await update(withoutIcon(payload)));
    }

    if (error) {
      return NextResponse.json(
        { error: "Failed to update sub-subject", detail: error.message },
        { status: 400 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: `Sub-subject not found: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, sub_subject: data[0] });
  } catch (err: any) {
    console.error("Error updating sub-subject:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update sub-subject" },
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

    const { error } = await supabase
      .from("sub_subjects")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
