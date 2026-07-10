import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("🔍 Starting diagnostic test...\n");

    // Step 1: Get or create a test block
    console.log("Step 1: Checking blocks...");
    const { data: blocks, error: blocksError } = await supabase
      .from("blocks")
      .select("*")
      .limit(1);

    console.log("Blocks query error:", blocksError);
    console.log("Blocks found:", blocks?.length || 0);

    if (!blocks || blocks.length === 0) {
      console.log("No blocks found, creating test block...");
      const { data: newBlock, error: createError } = await supabase
        .from("blocks")
        .insert([
          {
            title: "Test Block",
            specialty: "Testing",
            description: "Test block for MCQ seeding",
            icon: "🧪",
            color: "from-blue-600 to-blue-400",
            difficulty: "Easy",
            total_mcqs: 0,
          },
        ])
        .select("id")
        .single();

      if (createError) {
        return NextResponse.json({
          error: "Failed to create test block",
          detail: createError.message,
        });
      }

      console.log("✅ Created test block:", newBlock?.id);

      // Step 2: Insert a single test MCQ
      console.log("\nStep 2: Inserting test MCQ...");

      const testMCQ = {
        block_id: newBlock?.id,
        question: "What is 2+2?",
        case_study: "A simple math question",
        option_a: "3",
        option_b: "4",
        option_c: "5",
        option_d: "6",
        correct_answer: "b",
        explanation_a: "Incorrect: 2+2 is not 3",
        explanation_b: "Correct: 2+2 equals 4",
        explanation_c: "Incorrect: 2+2 is not 5",
        explanation_d: "Incorrect: 2+2 is not 6",
        explanation_summary: "Basic arithmetic",
        difficulty: "Easy",
        subject: "Testing",
        citation: "Math 101",
        notes: "Test question",
      };

      console.log("MCQ object to insert:", JSON.stringify(testMCQ, null, 2));

      const { data: insertedMCQ, error: insertError } = await supabase
        .from("mcqs")
        .insert([testMCQ])
        .select("id");

      if (insertError) {
        console.error("❌ Insert error:", insertError);
        return NextResponse.json({
          error: "Failed to insert MCQ",
          detail: insertError.message,
          code: insertError.code,
        });
      }

      console.log("✅ Inserted MCQ:", insertedMCQ);

      // Step 3: Verify the MCQ was inserted
      console.log("\nStep 3: Verifying MCQ...");

      const { data: verifyMCQ, error: verifyError } = await supabase
        .from("mcqs")
        .select("*")
        .eq("block_id", newBlock?.id);

      if (verifyError) {
        return NextResponse.json({
          error: "Failed to verify MCQ",
          detail: verifyError.message,
        });
      }

      console.log("✅ Verified MCQs in block:", verifyMCQ?.length || 0);

      return NextResponse.json({
        success: true,
        message: "Test successful! MCQ insertion works.",
        block_id: newBlock?.id,
        mcq_inserted: insertedMCQ?.length || 0,
        mcqs_verified: verifyMCQ?.length || 0,
      });
    } else {
      console.log("Blocks exist:", blocks.map((b: any) => b.title));

      return NextResponse.json({
        success: true,
        message: "Blocks exist in database",
        blocks_count: blocks.length,
      });
    }
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "POST to run diagnostic test",
  });
}
