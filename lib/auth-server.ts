/**
 * Server-side admin authentication (SEC-1).
 *
 * This module must only ever be imported from route handlers or other server
 * code. It reads SUPABASE_SERVICE_ROLE_KEY, which is not a NEXT_PUBLIC_ variable
 * and therefore is not available in the browser bundle - importing it from a
 * "use client" component will fail at build time rather than leak the key.
 *
 * The rule: the browser is never the authority on who is an admin. It sends a
 * Supabase access token, the server verifies that token against Supabase Auth,
 * and then reads the role from the database. A client cannot forge either step.
 */

import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getServiceRoleClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type AdminIdentity = {
  id: string;
  email: string;
  fullName: string | null;
};

/**
 * A string discriminant rather than a boolean one. This project compiles with
 * `strict: false`, and TypeScript will not narrow a union on a boolean literal
 * discriminant without strictNullChecks - `auth.response` would be a type error
 * at every call site. String literals narrow correctly either way.
 */
export type AdminAuthResult =
  | { status: "authorized"; admin: AdminIdentity }
  | { status: "denied"; response: NextResponse };

/**
 * Pull the Supabase access token off the request.
 *
 * Primary transport is the Authorization header, which is what lib/admin-client
 * sends. The cookie names are a fallback for anything that stores the session in
 * cookies instead.
 */
function readAccessToken(req: Request): string | null {
  const header = req.headers.get("authorization") || req.headers.get("Authorization");
  if (header) {
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (match && match[1].trim()) return match[1].trim();
  }

  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    for (const part of cookieHeader.split(";")) {
      const [rawName, ...rest] = part.split("=");
      const name = rawName?.trim();
      if (name === "sb-access-token" || name === "supabase-auth-token") {
        const value = decodeURIComponent(rest.join("=").trim());
        if (value) return value;
      }
    }
  }

  return null;
}

function deny(status: 401 | 403, message: string, reason: string, req: Request): AdminAuthResult {
  // Deliberately terse for the client, detailed in the log. Telling an attacker
  // whether the token was invalid or merely non-admin is free information.
  console.warn(
    `[admin-auth] denied ${status} ${reason} ${new URL(req.url).pathname} ${req.method}`
  );
  return {
    status: "denied",
    response: NextResponse.json({ error: message }, { status }),
  };
}

/**
 * Verify that the caller is a signed-in admin.
 *
 * Returns either the admin identity or a ready-to-return error response, so
 * handlers read as:
 *
 *   const auth = await requireAdmin(req);
 *   if (auth.status === "denied") return auth.response;
 */
export async function requireAdmin(req: Request): Promise<AdminAuthResult> {
  const token = readAccessToken(req);

  if (!token) {
    return deny(401, "Authentication required", "no-token", req);
  }

  let supabase: SupabaseClient;
  try {
    supabase = getServiceRoleClient();
  } catch (err: any) {
    console.error("[admin-auth] service client unavailable:", err?.message);
    return {
      status: "denied",
      response: NextResponse.json({ error: "Server misconfigured" }, { status: 500 }),
    };
  }

  // Step 1: is the token a real, unexpired Supabase session token?
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData?.user) {
    return deny(401, "Authentication required", "invalid-token", req);
  }

  const authUser = userData.user;

  // Step 2: does that verified identity carry the admin role in our own table?
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, email, full_name, role")
    .eq("id", authUser.id)
    .maybeSingle();

  if (profileError) {
    console.error("[admin-auth] role lookup failed:", profileError.message);
    return {
      status: "denied",
      response: NextResponse.json({ error: "Authorization check failed" }, { status: 500 }),
    };
  }

  if (!profile || (profile as any).role !== "admin") {
    return deny(403, "Administrator access required", `not-admin:${authUser.id}`, req);
  }

  return {
    status: "authorized",
    admin: {
      id: (profile as any).id,
      email: (profile as any).email || authUser.email || "",
      fullName: (profile as any).full_name ?? null,
    },
  };
}
