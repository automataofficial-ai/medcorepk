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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id,
      block_id,
      sub_subject_id,
      total_mcqs,
      correct_count,
      incorrect_count,
      score,
      time_taken_seconds,
    } = body;

    if (!user_id || !block_id) {
      return NextResponse.json(
        { error: "Missing required fields: user_id, block_id" },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const sessionData: any = {
      user_id,
      block_id,
      total_mcqs: total_mcqs || 0,
      score: score || 0,
      correct_count: correct_count || 0,
      incorrect_count: incorrect_count || 0,
    };

    if (sub_subject_id) sessionData.sub_subject_id = sub_subject_id;

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert([sessionData])
      .select();

    if (sessionError) throw sessionError;

    return NextResponse.json({
      success: true,
      session: session?.[0],
      message: "Quiz completed and saved successfully",
    });
  } catch (err: any) {
    console.error("Session creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save quiz session" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get user_id from query params or headers
    let userId = req.nextUrl.searchParams.get("user_id");
    if (!userId) {
      userId = req.headers.get("x-user-id");
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Missing user_id parameter or header" },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ sessions: sessions || [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
