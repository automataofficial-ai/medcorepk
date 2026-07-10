import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check blocks
    const { data: blocks, error: blocksError } = await supabase
      .from("blocks")
      .select("*")
      .order("created_at", { ascending: false });

    if (blocksError) {
      return NextResponse.json({
        error: "Failed to fetch blocks",
        detail: blocksError.message,
      });
    }

    // Check MCQs count
    const { data: mcqs, error: mcqsError } = await supabase
      .from("mcqs")
      .select("id, block_id, question")
      .limit(10);

    if (mcqsError) {
      return NextResponse.json({
        error: "Failed to fetch MCQs",
        detail: mcqsError.message,
      });
    }

    // Check MCQs per block
    const mcqCounts: Record<string, number> = {};
    for (const block of blocks || []) {
      const { count } = await supabase
        .from("mcqs")
        .select("*", { count: "exact", head: true })
        .eq("block_id", block.id);

      mcqCounts[block.id] = count || 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        blocks_count: blocks?.length || 0,
        blocks: blocks?.map((b: any) => ({
          id: b.id,
          title: b.title,
          specialty: b.specialty,
          mcqs_count: mcqCounts[b.id] || 0,
        })),
        sample_mcqs: mcqs?.slice(0, 3) || [],
        total_mcqs: mcqs?.length || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to check data" },
      { status: 500 }
    );
  }
}
