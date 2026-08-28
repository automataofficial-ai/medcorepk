import { NextRequest, NextResponse } from "next/server";
import {
  buildSubSubjectPayload,
  getServiceRoleClient,
  isMissingIconColumnError,
  withoutIcon,
} from "@/lib/sub-subjects";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from("sub_subjects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ sub_subjects: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { payload, error: validationError } = buildSubSubjectPayload(body, {
      requireName: true,
    });

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (typeof body.block_id !== "string" || !body.block_id.trim()) {
      return NextResponse.json(
        { error: "block_id is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const insert = (row: Record<string, any>) =>
      supabase.from("sub_subjects").insert([row]).select();

    let { data, error } = await insert({
      ...payload,
      block_id: body.block_id.trim(),
    });

    // See migration 20260824000001_add_sub_subject_icon.sql
    if (isMissingIconColumnError(error)) {
      console.warn(
        "sub_subjects.icon is missing - apply supabase/migrations/20260824000001_add_sub_subject_icon.sql"
      );
      ({ data, error } = await insert({
        ...withoutIcon(payload),
        block_id: body.block_id.trim(),
      }));
    }

    if (error) {
      return NextResponse.json(
        { error: "Failed to create sub-subject", detail: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ sub_subject: data![0] }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
