import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  // This route used to read a `userId` out of the request body and look up that
  // user's role - so anyone who knew an administrator's UUID was treated as an
  // administrator. Identity now comes from the verified session instead, and
  // any userId in the body is ignored.
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const { action, mcq } = await req.json();

    const supabase = createClient(supabaseUrl, serviceKey);

    // CREATE MCQ
    if (action === "create-mcq") {
      const { data, error } = await supabase
        .from("mcqs")
        .insert({
          block_id: mcq.block_id,
          case_study: mcq.case_study,
          question: mcq.question,
          image_url: mcq.image_url || null,
          option_a: mcq.option_a,
          option_b: mcq.option_b,
          option_c: mcq.option_c,
          option_d: mcq.option_d,
          correct_answer: mcq.correct_answer.toUpperCase(),
          explanation: mcq.explanation || null,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Update block's total_mcqs count
      await supabase
        .from("blocks")
        .update({ total_mcqs: supabase.rpc("increment_mcq_count", { block_id: mcq.block_id }) })
        .eq("id", mcq.block_id);

      return NextResponse.json({ success: true, mcq: data });
    }

    // UPDATE MCQ
    if (action === "update-mcq") {
      const { data, error } = await supabase
        .from("mcqs")
        .update({
          case_study: mcq.case_study,
          question: mcq.question,
          image_url: mcq.image_url || null,
          option_a: mcq.option_a,
          option_b: mcq.option_b,
          option_c: mcq.option_c,
          option_d: mcq.option_d,
          correct_answer: mcq.correct_answer.toUpperCase(),
          explanation: mcq.explanation || null,
        })
        .eq("id", mcq.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, mcq: data });
    }

    // DELETE MCQ
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
    console.error("MCQ API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
