import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, specialty, description, icon, difficulty } =
      await request.json();

    if (!title || !specialty) {
      return NextResponse.json(
        { error: "Title and specialty required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("blocks")
      .update({
        title,
        specialty,
        description,
        icon,
        difficulty,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      block: data?.[0],
    });
  } catch (error: any) {
    console.error("Block update error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update block" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("blocks")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Block deletion error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete block" },
      { status: 500 }
    );
  }
}
