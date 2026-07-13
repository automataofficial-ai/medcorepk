import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

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
      .single();

    if (subError) throw subError;

    // Get block details for context
    const { data: block, error: blockError } = await supabase
      .from("blocks")
      .select("id, title")
      .eq("id", subSubject.block_id)
      .single();

    if (blockError) throw blockError;

    // Get MCQs for this sub-subject
    const { data: mcqs, error: mcqError } = await supabase
      .from("mcqs")
      .select("*")
      .eq("sub_subject_id", id)
      .order("created_at", { ascending: true });

    if (mcqError) throw mcqError;

    return NextResponse.json({
      sub_subject: {
        ...subSubject,
        block_title: block.title,
      },
      mcqs: mcqs || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("sub_subjects")
      .update(body)
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json({ sub_subject: data[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
