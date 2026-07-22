import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { pharmacologyBlock1MCQs } from "@/lib/pharmacology-block1-mcqs";

function getServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getServiceRoleClient();

    console.log(`\n🌱 Starting Pharmacology Block 1 MCQ seeding...\n`);

    // Step 1: Create or get Pharmacology block
    const { data: existingBlock } = await supabase
      .from("blocks")
      .select("id")
      .eq("title", "Pharmacology")
      .single();

    let blockId: string;

    if (existingBlock) {
      blockId = existingBlock.id;
      console.log(`📌 Using existing Pharmacology block (${blockId})`);
    } else {
      const { data: newBlock, error: blockError } = await supabase
        .from("blocks")
        .insert([
          {
            title: "Pharmacology",
            specialty: "Pharmacology",
            description: "Master Pharmacology with comprehensive MCQs and explanations",
            icon: "💊",
            color: "from-red-600 to-red-400",
            difficulty: "Medium",
            total_mcqs: 0,
          },
        ])
        .select("id")
        .single();

      if (blockError || !newBlock) {
        throw new Error(`Failed to create Pharmacology block: ${blockError?.message}`);
      }

      blockId = newBlock.id;
      console.log(`✨ Created Pharmacology block (${blockId})`);
    }

    // Step 2: Get the existing "General Pharmacology" sub-subject
    const { data: existingSubSubject, error: subError } = await supabase
      .from("sub_subjects")
      .select("id")
      .eq("block_id", blockId)
      .eq("name", "General Pharmacology")
      .single();

    if (subError) {
      throw new Error(`Failed to find General Pharmacology sub-subject: ${subError?.message}`);
    }

    const subSubjectId = existingSubSubject.id;
    console.log(`📌 Using existing "General Pharmacology" sub-subject (${subSubjectId})`);

    // Step 3: Delete existing MCQs for this sub-subject to avoid duplicates
    const { count: existingCount } = await supabase
      .from("mcqs")
      .select("*", { count: "exact", head: true })
      .eq("sub_subject_id", subSubjectId);

    if (existingCount && existingCount > 0) {
      console.log(`🗑️ Removing ${existingCount} existing MCQs for this sub-subject...`);
      await supabase
        .from("mcqs")
        .delete()
        .eq("sub_subject_id", subSubjectId);
    }

    // Step 4: Prepare MCQs for insertion
    const mcqsToInsert = pharmacologyBlock1MCQs.map((mcq) => ({
      sub_subject_id: subSubjectId,
      block_id: blockId,
      question: mcq.question,
      case_study: mcq.case_study || "",
      option_a: mcq.option_a,
      option_b: mcq.option_b,
      option_c: mcq.option_c,
      option_d: mcq.option_d,
      option_e: mcq.option_e || "",
      correct_answer: mcq.correct_answer,
      explanation_a: mcq.explanation_a,
      explanation_b: mcq.explanation_b,
      explanation_c: mcq.explanation_c,
      explanation_d: mcq.explanation_d,
      explanation_e: mcq.explanation_e || "",
      is_fcps_pearl: mcq.is_fcps_pearl || false,
      fcps_pearl_content: mcq.fcps_pearl_content || null,
    }));

    // Step 5: Insert MCQs in batches
    const batchSize = 10;
    let totalInserted = 0;

    for (let i = 0; i < mcqsToInsert.length; i += batchSize) {
      const batch = mcqsToInsert.slice(i, i + batchSize);

      const { error: insertError, data: insertedData } = await supabase
        .from("mcqs")
        .insert(batch)
        .select("id");

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError);
        throw insertError;
      }

      totalInserted += insertedData?.length || batch.length;
      console.log(
        `✅ Batch ${Math.floor(i / batchSize) + 1}: Inserted ${
          insertedData?.length || batch.length
        } MCQs (Total: ${totalInserted}/${mcqsToInsert.length})`
      );
    }

    // Step 6: Update block total_mcqs count
    await supabase
      .from("blocks")
      .update({ total_mcqs: totalInserted })
      .eq("id", blockId);

    console.log(`\n✅ SEEDING COMPLETE!\n`);
    console.log(`📊 Summary:`);
    console.log(`   - Block: Pharmacology (${blockId})`);
    console.log(`   - Sub-subject: General Pharmacology: Pharmacokinetics & Pharmacodynamics`);
    console.log(`   - Total MCQs inserted: ${totalInserted}`);
    console.log(`   - All questions are unique (no duplicates)\n`);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${totalInserted} unique MCQs for Pharmacology Block 1`,
      block_id: blockId,
      sub_subject_id: subSubjectId,
      mcqs_inserted: totalInserted,
    });
  } catch (error: any) {
    console.error("❌ Seed error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed MCQs" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "POST to this endpoint to seed Pharmacology Block 1 MCQs (20 unique questions)",
    endpoint: "POST /api/seed/pharmacology-block1",
  });
}
