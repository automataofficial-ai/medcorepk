import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { mcqs, block_id, sub_subject_id, mark_as_fcps_pearl } = await req.json();

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

    // Fetch all sub-subjects to create a mapping
    const { data: allSubSubjects, error: subSubjectError } = await supabase
      .from("sub_subjects")
      .select("id, name, block_id");

    if (subSubjectError) {
      console.log("Note: Could not fetch sub-subjects, they will need to be created or specified by ID");
    }

    // Key sub-subjects by "<block_id>::<name>" so a name that exists under more
    // than one block (e.g. "Cardiovascular" in both Physiology and Pharmacology)
    // can never be matched against the wrong block.
    const subSubjectNameToId: Record<string, string> = {};
    const subSubjectNamesByBlock: Record<string, string[]> = {};
    allSubSubjects?.forEach((sub: any) => {
      const name = sub.name.toLowerCase().trim();
      subSubjectNameToId[`${sub.block_id}::${name}`] = sub.id;
      (subSubjectNamesByBlock[sub.block_id] ??= []).push(sub.name.trim());
    });

    console.log(`✅ Found ${allSubSubjects?.length ?? 0} sub-subjects\n`);

    // Sub-subject names in the CSV that matched no row, reported back to the user
    // instead of only being written to the server console.
    const unmatchedSubSubjects = new Set<string>();

    // Validate data and resolve block names to IDs
    const validatedMCQs = mcqs.map((mcq: any) => {
      // block_id here is the block chosen in the import UI dropdown; it acts as a
      // fallback for rows that carry no block_name/block_id of their own.
      if (!mcq.block_name && !mcq.block_id && !block_id) {
        throw new Error("Missing required field: block_name (or block_id)");
      }

      if (!mcq.question) {
        throw new Error("Missing required field: question");
      }

      if (!["a", "b", "c", "d", "e"].includes(mcq.correct_answer?.toLowerCase())) {
        throw new Error(`Invalid correct_answer: ${mcq.correct_answer}. Must be: a, b, c, d, or e`);
      }

      // Resolve block name to ID (CSV value wins; UI selection is the fallback)
      let blockId = mcq.block_id || block_id;
      if (mcq.block_name) {
        blockId = blockNameToId[mcq.block_name.toLowerCase().trim()];
        if (!blockId) {
          throw new Error(
            `Block not found: "${mcq.block_name}". Available blocks: ${Object.keys(blockNameToId).join(", ")}`
          );
        }
      }

      // Resolve sub-subject if needed
      let resolvedSubSubjectId = sub_subject_id || mcq.sub_subject_id || null;

      // If sub_subject_name is provided, look it up within this block only
      if (mcq.sub_subject_name && !resolvedSubSubjectId) {
        const wanted = mcq.sub_subject_name.toLowerCase().trim();
        resolvedSubSubjectId = subSubjectNameToId[`${blockId}::${wanted}`];
        if (!resolvedSubSubjectId) {
          unmatchedSubSubjects.add(mcq.sub_subject_name.trim());
          console.warn(`⚠️ Sub-subject not found: "${mcq.sub_subject_name}". MCQ will be imported without sub-subject assignment.`);
        }
      }

      return {
        block_id: blockId,
        sub_subject_id: resolvedSubSubjectId,
        question: mcq.question,
        case_study: mcq.case_study || "",
        option_a: mcq.option_a || "",
        option_b: mcq.option_b || "",
        option_c: mcq.option_c || "",
        option_d: mcq.option_d || "",
        option_e: mcq.option_e || null,
        correct_answer: mcq.correct_answer.toLowerCase(),
        explanation_a: mcq.explanation_a || null,
        explanation_b: mcq.explanation_b || null,
        explanation_c: mcq.explanation_c || null,
        explanation_d: mcq.explanation_d || null,
        explanation_e: mcq.explanation_e || null,
        difficulty_level: mcq.difficulty?.toLowerCase() || "medium",
        image_url: mcq.image_url || null,
        references: mcq.references || null,
        is_fcps_pearl: mark_as_fcps_pearl || mcq.is_fcps_pearl === "true" || mcq.is_fcps_pearl === true || false,
        fcps_pearl_content: mcq.fcps_pearl_content || null,
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

    const warnings: string[] = [];
    if (unmatchedSubSubjects.size > 0) {
      const available = blockIds
        .flatMap((id: any) => subSubjectNamesByBlock[id] ?? [])
        .join(", ");
      warnings.push(
        `These sub_subject_name values did not match any sub-subject in the target block, so those MCQs were imported without a sub-subject: ${[
          ...unmatchedSubSubjects,
        ].join(", ")}. Available for this block: ${available || "(none)"}`
      );
    }

    return NextResponse.json({
      success: true,
      message: `✅ Successfully imported ${insertedCount} MCQs`,
      inserted: insertedCount,
      blocks_updated: blockIds.length,
      ...(warnings.length > 0 ? { warnings } : {}),
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
    csv_format: "block_name,sub_subject_name,question,case_study,option_a,option_b,option_c,option_d,option_e,correct_answer,explanation_a,explanation_b,explanation_c,explanation_d,explanation_e,difficulty,image_url,references,is_fcps_pearl,fcps_pearl_content",
  });
}
