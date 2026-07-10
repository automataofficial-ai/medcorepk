import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("🚀 Direct MCQ Insert Starting...\n");

    // Get first block
    const { data: blocks, error: blockError } = await supabase
      .from("blocks")
      .select("id, title")
      .limit(1);

    if (blockError || !blocks || blocks.length === 0) {
      return NextResponse.json({
        error: "No blocks found",
        detail: blockError?.message,
      });
    }

    const blockId = blocks[0].id;
    console.log(`✅ Using block: ${blocks[0].title} (${blockId})\n`);

    // Create 10 simple test MCQs
    const testMCQs = [];
    for (let i = 1; i <= 10; i++) {
      testMCQs.push({
        block_id: blockId,
        question: `Test Question ${i}: What is the correct answer?`,
        case_study: `This is a test case study for question ${i}`,
        option_a: `Option A for Q${i}`,
        option_b: `Option B for Q${i}`,
        option_c: `Option C for Q${i}`,
        option_d: `Option D for Q${i}`,
        correct_answer: "b",
        explanation_a: `A is wrong because...`,
        explanation_b: `B is correct because...`,
        explanation_c: `C is wrong because...`,
        explanation_d: `D is wrong because...`,
        explanation_summary: `This is the summary explanation for Q${i}`,
        difficulty: i % 3 === 0 ? "Hard" : i % 2 === 0 ? "Medium" : "Easy",
        subject: "Test",
        citation: "Test Citation",
        notes: `Test notes for Q${i}`,
      });
    }

    console.log(`📝 Prepared ${testMCQs.length} MCQs for insertion`);
    console.log(`Sample MCQ:`, JSON.stringify(testMCQs[0], null, 2));
    console.log("\n⏳ Inserting MCQs...\n");

    // Insert MCQs
    const { data: inserted, error: insertError } = await supabase
      .from("mcqs")
      .insert(testMCQs)
      .select("id, question");

    if (insertError) {
      console.error("❌ Insert Error:", insertError);
      return NextResponse.json({
        error: "Failed to insert MCQs",
        detail: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
      });
    }

    console.log(`✅ Inserted ${inserted?.length || 0} MCQs\n`);

    // Verify insertion
    console.log("⏳ Verifying...\n");

    const { data: verified, error: verifyError } = await supabase
      .from("mcqs")
      .select("id, question")
      .eq("block_id", blockId);

    if (verifyError) {
      return NextResponse.json({
        error: "Failed to verify",
        detail: verifyError.message,
      });
    }

    console.log(`✅ Verification: Found ${verified?.length || 0} MCQs in block\n`);

    return NextResponse.json({
      success: true,
      message: `✅ Successfully inserted ${inserted?.length || 0} test MCQs`,
      block_id: blockId,
      block_title: blocks[0].title,
      mcqs_inserted: inserted?.length || 0,
      total_in_block: verified?.length || 0,
      sample_mcqs: inserted?.slice(0, 2) || [],
    });
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "POST to insert 10 test MCQs directly into first block",
  });
}
