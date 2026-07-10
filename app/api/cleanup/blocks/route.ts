import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { keep_count = 5 } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`\n🧹 Cleaning up blocks (keeping ${keep_count})...\n`);

    // Step 1: Get all blocks
    const { data: allBlocks, error: blocksError } = await supabase
      .from("blocks")
      .select("id, title")
      .order("created_at", { ascending: true });

    if (blocksError || !allBlocks) {
      return NextResponse.json({
        error: "Failed to fetch blocks",
        detail: blocksError?.message,
      });
    }

    console.log(`📊 Total blocks: ${allBlocks.length}`);
    console.log(`📌 Keeping: ${keep_count} blocks\n`);

    // Step 2: Separate blocks to keep and delete
    const blocksToKeep = allBlocks.slice(0, keep_count);
    const blocksToDelete = allBlocks.slice(keep_count);

    if (blocksToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Already at target block count",
        total_blocks: allBlocks.length,
      });
    }

    console.log(`✅ Keeping blocks:`);
    blocksToKeep.forEach((b, i) => {
      console.log(`   ${i + 1}. ${b.title} (${b.id})`);
    });

    console.log(`\n🗑️  Deleting ${blocksToDelete.length} blocks:\n`);

    // Step 3: Delete MCQs for blocks being removed
    let mcqsDeleted = 0;
    const blockIdsToDelete = blocksToDelete.map((b) => b.id);

    for (const blockId of blockIdsToDelete) {
      const { data: mcqs } = await supabase
        .from("mcqs")
        .select("id")
        .eq("block_id", blockId);

      if (mcqs && mcqs.length > 0) {
        const { error: deleteMcqError } = await supabase
          .from("mcqs")
          .delete()
          .eq("block_id", blockId);

        if (!deleteMcqError) {
          mcqsDeleted += mcqs.length;
          console.log(
            `   Deleted ${mcqs.length} MCQs from block ${blockId}`
          );
        }
      }
    }

    console.log(`\n   Total MCQs deleted: ${mcqsDeleted}\n`);

    // Step 4: Delete the blocks
    console.log(`🗑️  Deleting blocks...\n`);

    for (const block of blocksToDelete) {
      const { error: deleteBlockError } = await supabase
        .from("blocks")
        .delete()
        .eq("id", block.id);

      if (deleteBlockError) {
        console.error(`   ❌ Error deleting ${block.title}:`, deleteBlockError);
      } else {
        console.log(`   ✅ Deleted: ${block.title}`);
      }
    }

    // Step 5: Verify
    console.log(`\n✅ Verifying cleanup...\n`);

    const { data: remainingBlocks } = await supabase
      .from("blocks")
      .select("id, title, total_mcqs")
      .order("created_at", { ascending: true });

    if (remainingBlocks) {
      console.log(`📊 Remaining blocks:\n`);
      remainingBlocks.forEach((b, i) => {
        console.log(`   ${i + 1}. ${b.title}: ${b.total_mcqs || 0} MCQs`);
      });
    }

    console.log(`\n✅ CLEANUP COMPLETE!\n`);
    console.log(`Summary:`);
    console.log(`  - Blocks kept: ${blocksToKeep.length}`);
    console.log(`  - Blocks deleted: ${blocksToDelete.length}`);
    console.log(`  - MCQs deleted: ${mcqsDeleted}`);
    console.log(`  - Remaining blocks: ${remainingBlocks?.length || 0}\n`);

    return NextResponse.json({
      success: true,
      message: `✅ Cleanup complete! Kept ${blocksToKeep.length} blocks, deleted ${blocksToDelete.length}`,
      blocks_kept: blocksToKeep.length,
      blocks_deleted: blocksToDelete.length,
      mcqs_deleted: mcqsDeleted,
      remaining_blocks: remainingBlocks?.length || 0,
    });
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: error.message || "Cleanup failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "POST to cleanup and keep only first N blocks",
    example: { keep_count: 5 },
    warning:
      "This will DELETE extra blocks and their MCQs. Use with caution!",
  });
}
