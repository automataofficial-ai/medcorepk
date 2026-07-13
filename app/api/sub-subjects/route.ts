import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

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
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from("sub_subjects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ sub_subjects: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("sub_subjects")
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json({ sub_subject: data[0] }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
