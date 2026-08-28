import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";

function getServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    const supabase = getServiceRoleClient();

    // Get Pharmacology block ID
    const { data: pharmBlock } = await supabase
      .from("blocks")
      .select("id")
      .ilike("title", "%pharmacology%")
      .single();

    if (!pharmBlock) {
      return NextResponse.json(
        { error: "Pharmacology block not found" },
        { status: 400 }
      );
    }

    // Delete all MCQs NOT in Pharmacology block
    const { error } = await supabase
      .from("mcqs")
      .delete()
      .neq("block_id", pharmBlock.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "✅ Cleaned up all dummy MCQs. Only Pharmacology MCQs remain.",
    });
  } catch (err: any) {
    console.error("Cleanup error:", err);
    return NextResponse.json(
      { error: err.message || "Cleanup failed" },
      { status: 500 }
    );
  }
}
