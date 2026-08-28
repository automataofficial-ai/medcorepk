import { getSupabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    // Identity comes from the verified session, never from a client header.
    // The old x-user-id header let any caller read any account's images by
    // guessing a user id.
    const userId = auth.admin.id;
    const category = req.nextUrl.searchParams.get("category");

    const supabase = getSupabase();

    let query = supabase
      .from("images")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch images" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: data || [],
      count: data?.length || 0,
    });
  } catch (error: any) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    const userId = auth.admin.id;
    const imageId = req.nextUrl.searchParams.get("id");

    if (!imageId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Get image details
    const { data: imageData, error: fetchError } = await supabase
      .from("images")
      .select("*")
      .eq("id", imageId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !imageData) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("mcq-images")
      .remove([imageData.file_path]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("images")
      .delete()
      .eq("id", imageId)
      .eq("user_id", userId);

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete image" },
      { status: 500 }
    );
  }
}
