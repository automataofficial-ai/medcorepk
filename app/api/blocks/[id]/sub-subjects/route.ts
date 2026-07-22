import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
