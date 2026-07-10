import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { mcqs } = await req.json();

    if (!mcqs || !Array.isArray(mcqs) || mcqs.length === 0) {
      return NextResponse.json(
        { error: "Invalid MCQs array" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`\n📥 Importing ${mcqs.length} MCQs...\n`);

    // Fetch all blocks to create a mapping of block names to IDs
    const { data: allBlocks, error: blockError } = await supabase
      .from("blocks")
      .select("id, title");

    if (blockError) {
      return NextResponse.json(
        { error: "Failed to fetch blocks", detail: blockError.message },
        { status: 400 }
      );
    }

    const blockNameToId: Record<string, string> = {};
    allBlocks?.forEach((block: any) => {
      blockNameToId[block.title.toLowerCase().trim()] = block.id;
    });

    console.log(`✅ Found ${Object.keys(blockNameToId).length} blocks\n`);

    // Validate data and resolve block names to IDs
    const validatedMCQs = mcqs.map((mcq: any) => {
      if (!mcq.block_name && !mcq.block_id) {
        throw new Error("Missing required field: block_name (or block_id)");
      }

      if (!mcq.question) {
        throw new Error("Missing required field: question");
      }

      if (!["a", "b", "c", "d"].includes(mcq.correct_answer?.toLowerCase())) {
        throw new Error(`Invalid correct_answer: ${mcq.correct_answer}`);
      }

      // Resolve block name to ID
      let blockId = mcq.block_id;
      if (mcq.block_name) {
        blockId = blockNameToId[mcq.block_name.toLowerCase().trim()];
        if (!blockId) {
          throw new Error(
            `Block not found: "${mcq.block_name}". Available blocks: ${Object.keys(blockNameToId).join(", ")}`
          );
        }
      }

      return {
        block_id: blockId,
        question: mcq.question,
        case_study: mcq.case_study || "",
        option_a: mcq.option_a || "",
        option_b: mcq.option_b || "",
        option_c: mcq.option_c || "",
        option_d: mcq.option_d || "",
        correct_answer: mcq.correct_answer.toLowerCase(),
        explanation_a: mcq.explanation_a || null,
        explanation_b: mcq.explanation_b || null,
        explanation_c: mcq.explanation_c || null,
        explanation_d: mcq.explanation_d || null,
        difficulty_level: mcq.difficulty?.toLowerCase() || "medium",
        image_url: mcq.image_url || null,
      };
    });

    console.log(`✅ Validated ${validatedMCQs.length} MCQs\n`);

    // Insert into database
    const { data: inserted, error: insertError } = await supabase
      .from("mcqs")
      .insert(validatedMCQs)
      .select("id");

    if (insertError) {
      console.error("❌ Insert error:", insertError);
      return NextResponse.json(
        {
          error: "Failed to insert MCQs",
          detail: insertError.message,
          code: insertError.code,
        },
        { status: 400 }
      );
    }

    const insertedCount = inserted?.length || 0;
    console.log(`✅ Successfully inserted ${insertedCount} MCQs\n`);

    // Update block total_mcqs counts
    const blockIds = [...new Set(validatedMCQs.map((m: any) => m.block_id))];

    for (const blockId of blockIds) {
      const { count } = await supabase
        .from("mcqs")
        .select("*", { count: "exact", head: true })
        .eq("block_id", blockId);

      if (count && count > 0) {
        await supabase
          .from("blocks")
          .update({ total_mcqs: count })
          .eq("id", blockId);

        console.log(`📊 Updated block ${blockId}: ${count} MCQs`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `✅ Successfully imported ${insertedCount} MCQs`,
      inserted: insertedCount,
      blocks_updated: blockIds.length,
    });
  } catch (error: any) {
    console.error("❌ Import error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to import MCQs",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "POST CSV data as JSON to import MCQs. Use block_name (not block_id) for easier reference.",
    example: {
      mcqs: [
        {
          block_name: "Anatomy Fundamentals",
          question: "Question text?",
          case_study: "Case details",
          option_a: "Option A",
          option_b: "Option B",
          option_c: "Option C",
          option_d: "Option D",
          correct_answer: "b",
          explanation_a: "Why A is wrong",
          explanation_b: "Why B is correct",
          explanation_c: "Why C is wrong",
          explanation_d: "Why D is wrong",
          difficulty: "Medium",
          image_url: "ecg",
        },
      ],
    },
    csv_format: "block_name,question,case_study,option_a,option_b,option_c,option_d,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,difficulty,image_url",
  });
}
