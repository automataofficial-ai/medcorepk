import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.status === "denied") return auth.response;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      users: data || [],
    });
  } catch (error: any) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.status === "denied") return auth.response;

  try {
    const { email, full_name, role, specialty } = await request.json();

    if (!email || !full_name) {
      return NextResponse.json(
        { error: "Email and name required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          full_name,
          role: role || "user",
          specialty: specialty || null,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      user: data?.[0],
    });
  } catch (error: any) {
    console.error("User creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
