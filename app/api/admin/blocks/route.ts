import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function checkAdminAccess(userId: string, serviceKey: string, supabaseUrl: string) {
  try {
    const supabase = createClient(supabaseUrl, serviceKey);
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || data?.role !== "admin") {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Get user ID from auth header or body
    const authHeader = req.headers.get("authorization");
    const { userId, action, block, mcq } = await req.json();

    if (!userId || !authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await checkAdminAccess(userId, serviceKey, supabaseUrl);
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Handle different actions
    if (action === "create-block") {
      const { data, error } = await supabase
        .from("blocks")
        .insert({
          title: block.title,
          specialty: block.specialty,
          description: block.description,
          icon: block.icon,
          color: block.color,
          difficulty: block.difficulty,
          total_mcqs: 0,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, block: data });
    }

    if (action === "update-block") {
      const { data, error } = await supabase
        .from("blocks")
        .update({
          title: block.title,
          specialty: block.specialty,
          description: block.description,
          icon: block.icon,
          color: block.color,
          difficulty: block.difficulty,
        })
        .eq("id", block.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, block: data });
    }

    if (action === "delete-block") {
      const { error } = await supabase
        .from("blocks")
        .delete()
        .eq("id", block.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "create-mcq") {
      const { data, error } = await supabase
        .from("mcqs")
        .insert({
          block_id: mcq.block_id,
          case_study: mcq.case_study,
          question: mcq.question,
          image_url: mcq.image_url,
          option_a: mcq.option_a,
          option_b: mcq.option_b,
          option_c: mcq.option_c,
          option_d: mcq.option_d,
          correct_answer: mcq.correct_answer,
          explanation: mcq.explanation,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, mcq: data });
    }

    if (action === "delete-mcq") {
      const { error } = await supabase
        .from("mcqs")
        .delete()
        .eq("id", mcq.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
