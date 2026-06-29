import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json();

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create anon client for auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Sign up user
    const { data: authData, error: authError } = await anonClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to create account" },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // Use service role to create user profile (bypasses RLS)
    const { error: profileError } = await serviceClient
      .from("users")
      .insert({
        id: userId,
        email,
        full_name: fullName,
      } as any);

    if (profileError) {
      // If profile creation fails, we still return success for the auth part
      console.error("Profile creation error:", profileError);
    }

    // Create user progress
    await serviceClient
      .from("user_progress")
      .insert({
        user_id: userId,
      } as any)
      .catch((err) => console.error("Progress creation error:", err));

    // Create study streak
    await serviceClient
      .from("study_streaks")
      .insert({
        user_id: userId,
      } as any)
      .catch((err) => console.error("Streak creation error:", err));

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: authData.user.email,
        full_name: fullName,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sign up" },
      { status: 500 }
    );
  }
}
