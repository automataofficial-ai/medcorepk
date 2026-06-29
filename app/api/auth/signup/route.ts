import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Generate a unique user ID
    const userId = randomBytes(16).toString("hex");

    // Create auth user directly with service role (no email confirmation)
    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email to skip verification emails
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to create account" },
        { status: 400 }
      );
    }

    const createdUserId = authData.user.id;

    // Create user profile in public.users table
    try {
      await serviceClient
        .from("users")
        .insert({
          id: createdUserId,
          email,
          full_name: fullName,
        } as any);
    } catch (err) {
      console.error("Profile creation error:", err);
    }

    // Create user progress
    try {
      await serviceClient
        .from("user_progress")
        .insert({
          user_id: createdUserId,
        } as any);
    } catch (err) {
      console.error("Progress creation error:", err);
    }

    // Create study streak
    try {
      await serviceClient
        .from("study_streaks")
        .insert({
          user_id: createdUserId,
        } as any);
    } catch (err) {
      console.error("Streak creation error:", err);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: createdUserId,
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
