import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateDummyMCQs } from "@/lib/dummy-mcqs";

export async function POST(req: NextRequest) {
  try {
    const { count = 500 } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Seeding database with ${count} MCQs...`);

    // Generate dummy MCQs
    const dummyMCQs = generateDummyMCQs(count);

    // Group by subject to create/update blocks
    const blockMap = new Map<string, any>();

    for (const mcq of dummyMCQs) {
      if (!blockMap.has(mcq.subject)) {
        blockMap.set(mcq.subject, {
          title: mcq.block,
          specialty: mcq.subject_area || mcq.subject,
          description: `Learn and master ${mcq.subject} with comprehensive MCQs and explanations`,
          icon: getIconForSubject(mcq.subject),
          color: getColorForSubject(mcq.subject),
          difficulty: "Medium",
          total_mcqs: 0,
        });
      }

      const block = blockMap.get(mcq.subject)!;
      block.total_mcqs++;
    }

    // Insert blocks and get their IDs
    const blockIds = new Map<string, string>();

    for (const [subject, blockData] of blockMap) {
      const { data: existingBlock, error: checkError } = await supabase
        .from("blocks")
        .select("id")
        .eq("title", blockData.title)
        .single();

      if (existingBlock) {
        blockIds.set(subject, existingBlock.id);
        console.log(`Block already exists: ${subject}`);
        continue;
      }

      const { data: newBlock, error: blockError } = await supabase
        .from("blocks")
        .insert([blockData])
        .select("id")
        .single();

      if (blockError) {
        console.error(`Error creating block for ${subject}:`, blockError);
        continue;
      }

      blockIds.set(subject, newBlock.id);
      console.log(`Created block: ${subject} (ID: ${newBlock.id})`);
    }

    // Insert MCQs in batches
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < dummyMCQs.length; i += batchSize) {
      const batch = dummyMCQs.slice(i, i + batchSize).map((mcq) => {
        const blockId = blockIds.get(mcq.subject);
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
      });

      const { error: insertError } = await supabase
        .from("mcqs")
        .insert(batch);

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize}:`, insertError);
      } else {
        inserted += batch.length;
        console.log(`Inserted ${inserted}/${count} MCQs`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted} MCQs across ${blockIds.size} blocks`,
      blocks_created: blockIds.size,
      mcqs_inserted: inserted,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "POST to this endpoint with { count: 500 } to seed MCQs",
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
