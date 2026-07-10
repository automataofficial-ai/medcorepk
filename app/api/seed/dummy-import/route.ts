import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("\n🌱 Starting Dummy MCQ Import for Testing...\n");

    // Step 1: Get all blocks
    const { data: blocks, error: blocksError } = await supabase
      .from("blocks")
      .select("id, title, specialty")
      .limit(100);

    if (blocksError || !blocks || blocks.length === 0) {
      return NextResponse.json({
        error: "No blocks found. Create blocks first.",
        detail: blocksError?.message,
      });
    }

    console.log(`✅ Found ${blocks.length} blocks\n`);

    // Step 2: Create dummy MCQs for each block
    const allMCQs: any[] = [];

    const mcqTemplates = [
      {
        questions: [
          {
            q: "What is the normal range for this parameter?",
            cs: "A 30-year-old healthy patient",
            a: "Low value",
            b: "Normal range",
            c: "High value",
            d: "Very high value",
            correct: "b",
            ea: "Too low",
            eb: "CORRECT: This is the expected normal range",
            ec: "Too high",
            ed: "Abnormally high",
            es: "The normal range for this parameter is the standard reference value",
            diff: "Easy",
          },
          {
            q: "What causes elevation of this marker?",
            cs: "Patient with elevated levels",
            a: "Decreased metabolism",
            b: "Increased production or release",
            c: "Impaired clearance",
            d: "All of the above",
            correct: "d",
            ea: "Only one cause",
            eb: "Partial answer",
            ec: "Partial answer",
            ed: "CORRECT: Multiple mechanisms can cause elevation",
            es: "Elevation can result from increased production, release, or decreased clearance",
            diff: "Medium",
          },
          {
            q: "Which condition is associated with abnormal values?",
            cs: "Patient presenting with symptoms",
            a: "Benign condition",
            b: "Systemic disease",
            c: "Localized process",
            d: "Lab error",
            correct: "b",
            ea: "Usually benign",
            eb: "CORRECT: Often indicates systemic involvement",
            ec: "Localized only",
            ed: "Not a lab error",
            es: "Abnormalities in this marker often reflect systemic pathology",
            diff: "Medium",
          },
          {
            q: "What is the clinical significance of mild elevation?",
            cs: "Mildly elevated value on routine test",
            a: "Always indicates disease",
            b: "May be normal variation",
            c: "Requires immediate treatment",
            d: "Indicates severe pathology",
            correct: "b",
            ea: "Not always pathological",
            eb: "CORRECT: Mild elevation can be physiologic variation",
            ec: "Not urgent",
            ed: "Mild doesn't mean severe",
            es: "Mild elevation should be interpreted with clinical context",
            diff: "Hard",
          },
          {
            q: "How should a mildly elevated value be managed?",
            cs: "First-time mild elevation in asymptomatic patient",
            a: "Immediate aggressive treatment",
            b: "Repeat testing and clinical correlation",
            c: "No action needed",
            d: "Hospitalization required",
            correct: "b",
            ea: "Too aggressive for mild elevation",
            eb: "CORRECT: Repeat testing helps confirm and allows clinical assessment",
            ec: "Some values need monitoring",
            ed: "Not warranted for mild elevation",
            es: "Mild elevations warrant repeat testing before initiating treatment",
            diff: "Hard",
          },
        ],
      },
    ];

    // Map MCQs to blocks (cycle through blocks if more MCQs than blocks)
    let mcqIndex = 0;

    blocks.forEach((block) => {
      const template = mcqTemplates[mcqIndex % mcqTemplates.length];

      template.questions.forEach((q, idx) => {
        const question = q.q.replace(
          "parameter",
          block.specialty.toLowerCase()
        );
        const caseStudy = q.cs.replace(
          "parameter",
          block.specialty.toLowerCase()
        );

        allMCQs.push({
          block_id: block.id,
          question: question,
          case_study: caseStudy,
          option_a: q.a,
          option_b: q.b,
          option_c: q.c,
          option_d: q.d,
          correct_answer: q.correct,
          explanation_a: q.ea,
          explanation_b: q.eb,
          explanation_c: q.ec,
          explanation_d: q.ed,
          explanation_summary: q.es,
          difficulty: q.diff,
          subject: block.specialty,
          citation: "Test Data - Replace with Real MCQs",
          notes: `Sample MCQ #${idx + 1} for testing. Replace with real content from admin panel.`,
        });
      });

      mcqIndex++;
    });

    console.log(`📝 Generated ${allMCQs.length} dummy MCQs\n`);

    // Step 3: Insert MCQs in batches
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < allMCQs.length; i += batchSize) {
      const batch = allMCQs.slice(i, i + batchSize);

      const { data: inserted, error: insertError } = await supabase
        .from("mcqs")
        .insert(batch)
        .select("id");

      if (insertError) {
        console.error(`❌ Batch error:`, insertError);
        continue;
      }

      totalInserted += inserted?.length || batch.length;
      console.log(
        `✅ Batch ${Math.floor(i / batchSize) + 1}: ${
          inserted?.length || batch.length
        } MCQs`
      );
    }

    console.log(`\n📊 Updating block MCQ counts...\n`);

    // Step 4: Update block total_mcqs
    let blocksUpdated = 0;
    for (const block of blocks) {
      const { count } = await supabase
        .from("mcqs")
        .select("*", { count: "exact", head: true })
        .eq("block_id", block.id);

      if (count && count > 0) {
        await supabase
          .from("blocks")
          .update({ total_mcqs: count })
          .eq("id", block.id);

        console.log(`📚 ${block.title}: ${count} MCQs`);
        blocksUpdated++;
      }
    }

    console.log(`\n✅ IMPORT COMPLETE!\n`);
    console.log(`Summary:`);
    console.log(`  - Total MCQs inserted: ${totalInserted}`);
    console.log(`  - Blocks with MCQs: ${blocksUpdated}/${blocks.length}`);
    console.log(`  - Average per block: ${Math.round(totalInserted / blocks.length)}\n`);

    return NextResponse.json({
      success: true,
      message: `✅ Imported ${totalInserted} dummy MCQs for testing`,
      total_mcqs: totalInserted,
      blocks_updated: blocksUpdated,
      total_blocks: blocks.length,
      note: "These are test MCQs. Replace with real data from admin dashboard.",
    });
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: error.message || "Import failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "POST to import dummy MCQs for testing",
    note: "This will create 5 sample MCQs per block for testing purposes",
  });
}
