import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { appendSession, readAllSessions } from "@/lib/csv";
import type { BlockSession } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    // First try to get from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from header if provided
    const userId = req.headers.get("x-user-id");

    // Join sessions with blocks to get block title
    let query = supabase
      .from("sessions")
      .select("*, blocks(title, specialty, icon, color, difficulty_level)")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: dbSessions, error: dbError } = await query;

    if (dbError) {
      console.error("Database sessions fetch error:", dbError);
      // Fall back to CSV
      const csvSessions = readAllSessions();
      return NextResponse.json({ sessions: csvSessions });
    }

    // Transform data to include block title and fetch block info if not included in join
    let transformedSessions = (dbSessions || []).map((s: any) => ({
      ...s,
      blockTitle: s.blocks?.title || s.block_id || "Unknown Block",
      specialty: s.blocks?.specialty || "",
    }));

    // If join didn't work, fetch blocks separately and add titles
    const missingSessions = transformedSessions.filter((s) => s.blockTitle === s.block_id);
    if (missingSessions.length > 0) {
      const { data: blocks } = await supabase.from("blocks").select("id, title, specialty");
      const blockMap = Object.fromEntries((blocks || []).map((b: any) => [b.id, b]));

      transformedSessions = transformedSessions.map((s: any) => ({
        ...s,
        blockTitle: blockMap[s.block_id]?.title || s.block_id || "Unknown Block",
        specialty: blockMap[s.block_id]?.specialty || "",
      }));
    }

    console.log("Transformed sessions sample:", transformedSessions[0]);
    return NextResponse.json({ sessions: transformedSessions });
  } catch (error) {
    console.error("Sessions fetch error:", error);
    // Fall back to CSV if database fails
    try {
      const sessions = readAllSessions();
      return NextResponse.json({ sessions });
    } catch {
      return NextResponse.json(
        { error: "Failed to read sessions", detail: String(error) },
        { status: 500 }
      );
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: BlockSession = await req.json();

    // Basic validation
    if (!body.id || !body.blockId || typeof body.score !== "number") {
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 });
    }

    // Get user ID from request header
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      // Fall back to CSV storage if no user ID
      appendSession(body);
      return NextResponse.json({ success: true });
    }

    // Create service role Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Saving session for user:", userId, "block:", body.blockId);

    // Create session
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        user_id: userId,
        block_id: body.blockId,
        total_mcqs: body.totalMcqs,
        correct_count: body.correctCount,
        incorrect_count: body.totalMcqs - body.correctCount,
        score: body.score,
        time_taken_seconds: body.timeTakenSeconds,
        completed_at: body.completedAt,
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Session creation error:", sessionError);
      throw new Error(sessionError.message || "Failed to create session");
    }

    if (!sessionData) {
      throw new Error("No session data returned");
    }

    const sessionId = sessionData.id;
    console.log("Session created:", sessionId);

    // Save individual answers
    let answerCount = 0;
    for (const answer of body.answers) {
      const { error: answerError } = await supabase.from("answers").insert({
        session_id: sessionId,
        mcq_id: `mcq-${body.blockId}-${answer.mcqIndex}`,
        user_answer: String.fromCharCode(65 + answer.selectedIndex),
        is_correct: answer.isCorrect,
        time_spent_seconds: answer.timeTakenSeconds,
      });

      if (!answerError) {
        answerCount++;
      } else {
        console.error("Answer save error:", answerError);
      }
    }
    console.log(`Saved ${answerCount}/${body.answers.length} answers`);

    // Update user progress - use upsert to create if missing
    const { data: progressData, error: progressFetchError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    const totalMcqs = (progressData?.total_mcqs_attempted || 0) + body.totalMcqs;
    const totalCorrect = (progressData?.total_correct || 0) + body.correctCount;
    const accuracy = totalMcqs > 0 ? (totalCorrect / totalMcqs) * 100 : 0;

    console.log("Upserting user progress:", { userId, totalMcqs, totalCorrect, accuracy });

    const { error: upsertError } = await supabase
      .from("user_progress")
      .upsert({
        user_id: userId,
        total_mcqs_attempted: totalMcqs,
        total_correct: totalCorrect,
        overall_accuracy: accuracy,
        blocks_completed: (progressData?.blocks_completed || 0) + 1,
        study_hours: (progressData?.study_hours || 0) + body.timeTakenSeconds / 3600,
      })
      .eq("user_id", userId);

    if (upsertError) {
      console.error("User progress upsert error:", upsertError);
    } else {
      console.log("User progress upserted successfully");
    }

    // Update study streak
    const { data: streakData } = await supabase
      .from("study_streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (streakData) {
      const newStreak = (streakData.current_streak || 0) + 1;
      const { error: streakError } = await supabase
        .from("study_streaks")
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(streakData.longest_streak || 0, newStreak),
          last_study_date: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (streakError) {
        console.error("Study streak update error:", streakError);
      }
    } else {
      // Create if missing
      const { error: streakCreateError } = await supabase
        .from("study_streaks")
        .insert({
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_study_date: new Date().toISOString(),
        });

      if (streakCreateError) {
        console.error("Study streak create error:", streakCreateError);
      }
    }

    // Save daily stats
    const today = new Date().toISOString().split("T")[0];
    const { error: statsError } = await supabase.from("daily_stats").upsert({
      user_id: userId,
      study_date: today,
      mcqs_attempted: body.totalMcqs,
      correct_answers: body.correctCount,
      study_minutes: Math.round(body.timeTakenSeconds / 60),
      streak_maintained: true,
    });

    if (statsError) {
      console.error("Daily stats save error:", statsError);
    } else {
      console.log("Daily stats saved successfully");
    }

    // Also save to CSV for backwards compatibility
    appendSession(body);

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error("Session save error:", error);
    return NextResponse.json(
      { error: "Failed to save session", detail: String(error) },
      { status: 500 }
    );
  }
}
