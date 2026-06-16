import { NextRequest, NextResponse } from "next/server";
import { appendSession, readAllSessions } from "@/lib/csv";
import type { BlockSession } from "@/lib/types";

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
    appendSession(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save session", detail: String(error) },
      { status: 500 }
    );
  }
}
