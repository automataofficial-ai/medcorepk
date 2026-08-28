"use client";

/**
 * Client-side helpers for the admin panel (SEC-1).
 *
 * These exist for user experience only - to show a login screen instead of a
 * wall of failed requests. They are not a security boundary. Every admin API
 * route calls requireAdmin() in lib/auth-server, and that is what actually
 * protects the data. Anything here can be bypassed with dev tools, and that is
 * fine, because bypassing it gets you a 401 from the server.
 */

import { getSupabase } from "./supabase";

export type AdminIdentity = {
  id: string;
  email: string;
  fullName: string | null;
};

/** The Supabase access token for the current session, if any. */
export async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await getSupabase().auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

/**
 * fetch() with the caller's Supabase access token attached.
 *
 * Use this for every admin API call. Without the header the server returns 401.
 */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();

  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, { ...init, headers });
}

/**
 * Ask the server who we are. The server is the only thing that can answer this
 * truthfully, so the answer is never cached in localStorage.
 *
 * Returns null when the caller is not a signed-in admin.
 */
export async function verifyAdminSession(): Promise<AdminIdentity | null> {
  try {
    const res = await adminFetch("/api/admin/session");
    if (!res.ok) return null;
    const body = await res.json();
    return body?.admin ?? null;
  } catch {
    return null;
  }
}

/** Sign out of Supabase and clear any local profile cache. */
export async function adminSignOut(): Promise<void> {
  try {
    await getSupabase().auth.signOut();
  } catch {
    // Signing out locally matters more than the network round trip.
  }
  try {
    localStorage.removeItem("medcore_user");
    // Remove the retired client-side admin flag from anyone who still has it.
    localStorage.removeItem("admin_token");
  } catch {
    // Storage can be unavailable in private browsing modes.
  }
}
