import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const supabase = getServiceRoleClient();

    const { data: mcqs, error } = await supabase
      .from("mcqs")
      .select("*")
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch MCQs", detail: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      mcqs: mcqs || [],
    });
  } catch (err: any) {
    console.error("Error fetching MCQs:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch MCQs" },
      { status: 500 }
    );
  }
}
