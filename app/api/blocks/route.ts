import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Use service role to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all blocks with their MCQs
    const { data: blocks, error } = await supabase
      .from("blocks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Blocks fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // For each block, fetch its MCQs
    const blocksWithMCQs = await Promise.all(
      (blocks || []).map(async (block: any) => {
        const { data: mcqs, error: mcqError } = await supabase
          .from("mcqs")
          .select("*")
          .eq("block_id", block.id);

        if (mcqError) {
          console.error(`Error fetching MCQs for block ${block.id}:`, mcqError);
        }

        const mcqList = mcqs || [];
        console.log(`Block ${block.title} (${block.id}): ${mcqList.length} MCQs found`);

        return {
          ...block,
          mcqs: mcqList,
          total_mcqs: mcqList.length,
        };
      })
    );

    console.log(`Returning ${blocksWithMCQs.length} blocks with MCQs`);
    return NextResponse.json({ blocks: blocksWithMCQs });
  } catch (error: any) {
    console.error("API blocks error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blocks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { title, specialty, description, icon, color, difficulty, mcqs } =
      await req.json();

    // Insert block
    const { data: blockData, error: blockError } = await supabase
      .from("blocks")
      .insert({
        title,
        specialty,
        description,
        icon,
        color,
        difficulty,
        total_mcqs: mcqs?.length || 0,
      })
      .select()
      .single();

    if (blockError) {
      return NextResponse.json({ error: blockError.message }, { status: 400 });
    }

    // Insert MCQs
    if (mcqs && mcqs.length > 0) {
      const mcqsWithBlockId = mcqs.map((mcq: any) => ({
        ...mcq,
        block_id: blockData.id,
      }));

      await supabase.from("mcqs").insert(mcqsWithBlockId);
    }

    return NextResponse.json({
      success: true,
      block: blockData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create block" },
      { status: 500 }
    );
  }
}
