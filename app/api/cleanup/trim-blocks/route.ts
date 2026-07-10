import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: blocks, error: fetchError } = await supabase
      .from("blocks")
      .select("id, title");

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 });
    }

    const blocksToUpdate = blocks?.filter((b: any) => b.title !== b.title.trim()) || [];

    if (blocksToUpdate.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No blocks with trailing whitespace found",
        updated: 0,
      });
    }

    for (const block of blocksToUpdate) {
      await supabase
        .from("blocks")
        .update({ title: block.title.trim() })
        .eq("id", block.id);
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${blocksToUpdate.length} blocks with trimmed titles`,
      updated: blocksToUpdate.length,
      blocks: blocksToUpdate.map((b: any) => ({
        id: b.id,
        before: b.title,
        after: b.title.trim(),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to trim block titles" },
      { status: 500 }
    );
  }
}
