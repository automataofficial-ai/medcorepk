import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function PUT(req: NextRequest) {
  try {
    const { userId, updates } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // Use service role key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build update object with timestamps
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Filter out invalid fields
    const validFields = ["full_name", "specialty", "updated_at"];
    const filteredUpdate: any = {};
    validFields.forEach((field) => {
      if (field in updateData) {
        filteredUpdate[field] = updateData[field];
      }
    });

    // Update user profile
    const { data: userData, error: userError } = await supabase
      .from("users")
      .update(filteredUpdate)
      .eq("id", userId)
      .select()
      .single();

    if (userError) {
      console.error("User profile update error:", userError);
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
