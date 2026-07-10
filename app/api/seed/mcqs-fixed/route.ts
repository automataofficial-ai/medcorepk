import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateDummyMCQs } from "@/lib/dummy-mcqs";

export async function POST(req: NextRequest) {
  try {
    const { count = 500 } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`\n🌱 Starting MCQ seeding (${count} questions)...\n`);

    // Step 1: Generate MCQs
    const dummyMCQs = generateDummyMCQs(count);
    console.log(`✅ Generated ${dummyMCQs.length} questions`);

    // Step 2: Create or get blocks
    const subjects = [
      "Anatomy",
      "Physiology",
      "Pharmacology",
      "Pathology",
      "Biochemistry",
      "Microbiology",
      "Biostatistics",
      "Behavioral Science",
    ];

    const blockMap = new Map<string, string>(); // subject -> block_id

    for (const subject of subjects) {
      // Check if block already exists
      const { data: existingBlock } = await supabase
        .from("blocks")
        .select("id")
        .eq("title", subject)
        .single();

      if (existingBlock) {
        blockMap.set(subject, existingBlock.id);
        console.log(`📌 Block exists: ${subject} (${existingBlock.id})`);
        continue;
      }

      // Create new block
      const { data: newBlock, error: blockError } = await supabase
        .from("blocks")
        .insert([
          {
            title: subject,
            specialty: subject,
            description: `Master ${subject} with comprehensive MCQs and explanations`,
            icon: getIconForSubject(subject),
            color: getColorForSubject(subject),
            difficulty: "Medium",
            total_mcqs: 0,
          },
        ])
        .select("id")
        .single();

      if (blockError || !newBlock) {
        console.error(`❌ Error creating block for ${subject}:`, blockError);
        continue;
      }

      blockMap.set(subject, newBlock.id);
      console.log(`✨ Created block: ${subject} (${newBlock.id})`);
    }

    console.log(`\n📊 Blocks ready: ${blockMap.size}/${subjects.length}\n`);

    // Step 3: Insert MCQs in batches
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < dummyMCQs.length; i += batchSize) {
      const batch = dummyMCQs.slice(i, i + batchSize);

      const mcqsToInsert = batch
        .map((mcq) => {
          const blockId = blockMap.get(mcq.subject);
          if (!blockId) {
            console.warn(`⚠️ No block found for subject: ${mcq.subject}`);
            return null;
          }

          return {
            block_id: blockId,
            question: mcq.question,
            case_study: mcq.caseStudy || null,
            option_a: mcq.options.a,
            option_b: mcq.options.b,
            option_c: mcq.options.c,
            option_d: mcq.options.d,
            correct_answer: mcq.correctAnswer,
            explanation_a: mcq.explanations.a,
            explanation_b: mcq.explanations.b,
            explanation_c: mcq.explanations.c,
            explanation_d: mcq.explanations.d,
            explanation_summary: mcq.explanation_summary || null,
            difficulty: mcq.difficulty,
            subject: mcq.subject,
            citation: mcq.citation || null,
            notes: null,
          };
        })
        .filter(Boolean);

      if (mcqsToInsert.length === 0) {
        console.warn(`⚠️ Batch ${i / batchSize} has no valid MCQs`);
        continue;
      }

      const { error: insertError, data: insertedData } = await supabase
        .from("mcqs")
        .insert(mcqsToInsert)
        .select("id");

      if (insertError) {
        console.error(`❌ Error inserting batch ${i / batchSize}:`, insertError);
      } else {
        totalInserted += insertedData?.length || mcqsToInsert.length;
        console.log(
          `✅ Batch ${Math.floor(i / batchSize) + 1}: Inserted ${
            insertedData?.length || mcqsToInsert.length
          } MCQs (Total: ${totalInserted}/${count})`
        );
      }
    }

    console.log(`\n📊 Verifying...\n`);

    // Step 4: Verify and update block MCQ counts
    const blockStats: Record<string, number> = {};

    for (const [subject, blockId] of blockMap) {
      const { count: mcqCount } = await supabase
        .from("mcqs")
        .select("*", { count: "exact", head: true })
        .eq("block_id", blockId);

      blockStats[subject] = mcqCount || 0;
      console.log(`📚 ${subject}: ${mcqCount || 0} MCQs`);

      // Update block total_mcqs
      if (mcqCount && mcqCount > 0) {
        await supabase
          .from("blocks")
          .update({ total_mcqs: mcqCount })
          .eq("id", blockId);
      }
    }

    const totalMCQs = Object.values(blockStats).reduce((a, b) => a + b, 0);

    console.log(`\n✅ SEEDING COMPLETE!\n`);
    console.log(`📊 Summary:`);
    console.log(`   - Blocks created/updated: ${blockMap.size}`);
    console.log(`   - Total MCQs inserted: ${totalMCQs}`);
    console.log(`   - Average per block: ${Math.round(totalMCQs / blockMap.size)}`);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${totalMCQs} MCQs across ${blockMap.size} blocks`,
      blocks_created: blockMap.size,
      mcqs_inserted: totalMCQs,
      block_stats: blockStats,
    });
  } catch (error: any) {
    console.error("❌ Seed error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "POST to this endpoint with { count: 500 } to seed MCQs",
    example: "POST /api/seed/mcqs-fixed with body {count: 500}",
  });
}

function getIconForSubject(subject: string): string {
  const icons: Record<string, string> = {
    Anatomy: "🫀",
    Physiology: "🧬",
    Pharmacology: "💊",
    Pathology: "🔬",
    Biochemistry: "⚗️",
    Microbiology: "🦠",
    Biostatistics: "📊",
    "Behavioral Science": "🧠",
  };
  return icons[subject] || "📚";
}

function getColorForSubject(subject: string): string {
  const colors: Record<string, string> = {
    Anatomy: "from-blue-600 to-blue-400",
    Physiology: "from-purple-600 to-purple-400",
    Pharmacology: "from-red-600 to-red-400",
    Pathology: "from-pink-600 to-pink-400",
    Biochemistry: "from-green-600 to-green-400",
    Microbiology: "from-yellow-600 to-yellow-400",
    Biostatistics: "from-cyan-600 to-cyan-400",
    "Behavioral Science": "from-indigo-600 to-indigo-400",
  };
  return colors[subject] || "from-slate-600 to-slate-400";
}
