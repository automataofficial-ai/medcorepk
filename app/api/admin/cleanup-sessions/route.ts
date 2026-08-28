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

    // Delete all sessions NOT from Pharmacology block
    const { data: deletedSessions, error: sessionsError } = await supabase
      .from("sessions")
      .delete()
      .neq("block_id", pharmBlock.id);

    if (sessionsError) throw sessionsError;

    // Delete all sub_subject_progress records (reset analytics)
    const { error: progressError } = await supabase
      .from("sub_subject_progress")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    // Reset user_progress stats
    const { data: users } = await supabase
      .from("users")
      .select("id");

    if (users && users.length > 0) {
      for (const user of users) {
        await supabase
          .from("user_progress")
          .upsert({
            user_id: user.id,
            total_mcqs_attempted: 0,
            total_correct: 0,
            overall_accuracy: 0,
          }, {
            onConflict: "user_id",
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: "✅ Analytics cleaned up - kept only Pharmacology sessions. Dashboard reset.",
    });
  } catch (err: any) {
    console.error("Cleanup error:", err);
    return NextResponse.json(
      { error: err.message || "Cleanup failed" },
      { status: 500 }
    );
  }
}
