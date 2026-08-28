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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const blockId = params.id;

    const supabase = getServiceRoleClient();

    const { data: subSubjects, error } = await supabase
      .from("sub_subjects")
      .select("*")
      .eq("block_id", blockId)
      .order("order_index", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch sub-subjects", detail: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      sub_subjects: subSubjects || [],
    });
  } catch (err: any) {
    console.error("Error fetching sub-subjects:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch sub-subjects" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    const params = await context.params;
    const blockId = params.id;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { payload, error: validationError } = buildSubSubjectPayload(body, {
      requireName: true,
    });

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    // Confirm the block exists so a bad id gives a clear message instead of a
    // raw foreign-key violation.
    const { data: block, error: blockError } = await supabase
      .from("blocks")
      .select("id")
      .eq("id", blockId)
      .maybeSingle();

    if (blockError) {
      return NextResponse.json(
        { error: "Failed to verify block", detail: blockError.message },
        { status: 400 }
      );
    }

    if (!block) {
      return NextResponse.json(
        { error: `Block not found: ${blockId}` },
        { status: 404 }
      );
    }

    const insert = (row: Record<string, any>) =>
      supabase.from("sub_subjects").insert([row]).select().single();

    let { data: subSubject, error } = await insert({
      ...payload,
      block_id: blockId,
    });

    // The icon column is added by migration 20260824000001. If that migration
    // has not been applied yet, save the sub-subject without it rather than
    // failing the whole request.
    if (isMissingIconColumnError(error)) {
      console.warn(
        "sub_subjects.icon is missing - apply supabase/migrations/20260824000001_add_sub_subject_icon.sql"
      );
      ({ data: subSubject, error } = await insert({
        ...withoutIcon(payload),
        block_id: blockId,
      }));
    }

    if (error) {
      return NextResponse.json(
        { error: "Failed to create sub-subject", detail: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, sub_subject: subSubject },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating sub-subject:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create sub-subject" },
      { status: 500 }
    );
  }
}
