import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { userId, email, fullName } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use service role key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email: email,
        full_name: fullName || null,
        subscription_tier: "free",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError) {
      console.error("User profile creation error:", userError);
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    // Create user progress
    const { error: progressError } = await supabase.from("user_progress").insert({
      user_id: userId,
      total_mcqs_attempted: 0,
      total_correct: 0,
      overall_accuracy: 0,
      blocks_completed: 0,
      study_hours: 0,
    });

    if (progressError) {
      console.error("User progress creation error:", progressError);
    }

    // Create study streak
    const { error: streakError } = await supabase.from("study_streaks").insert({
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      last_study_date: new Date().toISOString(),
    });

    if (streakError) {
      console.error("Study streak creation error:", streakError);
    }

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error: any) {
    console.error("Create profile error:", error);
    return NextResponse.json({ error: error.message || "Failed to create profile" }, { status: 500 });
  }
}
