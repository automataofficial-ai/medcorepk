import { NextRequest, NextResponse } from "next/server";
import { appendSession, readAllSessions } from "@/lib/csv";
import type { BlockSession } from "@/lib/types";
import {
  createSession,
  updateSession,
  saveAnswer,
  getUserProgress,
  updateUserProgress,
  saveDailyStats,
} from "@/lib/supabase";

export async function GET() {
  try {
    const sessions = readAllSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read sessions", detail: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: BlockSession = await req.json();

    // Basic validation
    if (!body.id || !body.blockId || typeof body.score !== "number") {
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 });
    }

    // Get user ID from request header or body
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      // Fall back to CSV storage if no user ID (for backwards compatibility)
      appendSession(body);
      return NextResponse.json({ success: true });
    }

    // Save to Supabase database
    // Create session
    const sessionResult = await createSession(
      userId,
      body.blockId,
      body.totalMcqs
    );

    if (sessionResult.error || !sessionResult.data) {
      throw new Error(sessionResult.error?.message || "Failed to create session");
    }

    const sessionId = sessionResult.data.id;

    // Update session with final scores
    await updateSession(sessionId, {
      correct_count: body.correctCount,
      incorrect_count: body.totalMcqs - body.correctCount,
      score: body.score,
      time_taken_seconds: body.timeTakenSeconds,
      completed_at: body.completedAt,
    });

    // Save individual answers
    for (const answer of body.answers) {
      const mcqId = `mcq-${body.blockId}-${answer.mcqIndex}`;
      await saveAnswer(
        sessionId,
        mcqId,
        String.fromCharCode(65 + answer.selectedIndex), // Convert index to A, B, C, D
        answer.isCorrect,
        answer.timeTakenSeconds
      );
    }

    // Update user progress
    const progressResult = await getUserProgress(userId);
    const currentProgress = progressResult.data as any;
    if (currentProgress) {
      const newProgress = {
        total_mcqs_attempted: (currentProgress.total_mcqs_attempted || 0) + body.totalMcqs,
        total_correct: (currentProgress.total_correct || 0) + body.correctCount,
        overall_accuracy:
          (((currentProgress.total_correct || 0) + body.correctCount) /
            ((currentProgress.total_mcqs_attempted || 0) + body.totalMcqs)) *
          100,
        blocks_completed: (currentProgress.blocks_completed || 0) + 1,
        study_hours: (currentProgress.study_hours || 0) + body.timeTakenSeconds / 3600,
      };

      await updateUserProgress(userId, newProgress);
    }

    // Save daily stats
    const today = new Date().toISOString().split("T")[0];
    await saveDailyStats(userId, today, {
      mcqs_attempted: body.totalMcqs,
      correct_answers: body.correctCount,
      study_minutes: Math.round(body.timeTakenSeconds / 60),
      streak_maintained: true,
    } as any);

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
