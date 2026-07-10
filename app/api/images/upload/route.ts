import { getSupabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const userId = req.headers.get("x-user-id");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const supabase = getSupabase();

    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `mcq-images/${userId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("mcq-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError || !uploadData) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("mcq-images")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // Save metadata to database
    const { data: imageData, error: dbError } = await supabase
      .from("images")
      .insert({
        user_id: userId,
        title,
        description,
        category,
        file_path: filePath,
        public_url: publicUrl,
        file_size: file.size,
        file_type: file.type,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save image metadata" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: imageData,
      url: publicUrl,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
