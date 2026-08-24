import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared helpers for the sub_subjects API routes.
 *
 * The admin panel posts { name, description, icon, order_index }. Anything the
 * client sends that is not a real column makes PostgREST reject the whole
 * request (PGRST204), so the payload is whitelisted here before it reaches
 * Supabase.
 */

export function getServiceRoleClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export const DEFAULT_SUB_SUBJECT_ICON = "📚";

export interface SubSubjectPayload {
  name?: string;
  description?: string | null;
  icon?: string;
  order_index?: number;
}

/**
 * Keeps only real sub_subjects columns and normalises their values.
 * Returns an error string when the input cannot produce a valid row.
 */
export function buildSubSubjectPayload(
  body: any,
  { requireName }: { requireName: boolean }
): { payload: SubSubjectPayload; error?: undefined } | { payload?: undefined; error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object" };
  }

  const payload: SubSubjectPayload = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return { error: "Sub-subject name is required" };
    }
    payload.name = body.name.trim();
  } else if (requireName) {
    return { error: "Sub-subject name is required" };
  }

  if (body.description !== undefined) {
    if (body.description === null) {
      payload.description = null;
    } else if (typeof body.description === "string") {
      const trimmed = body.description.trim();
      payload.description = trimmed || null;
    } else {
      return { error: "Description must be text" };
    }
  }

  if (body.icon !== undefined) {
    if (body.icon === null || body.icon === "") {
      payload.icon = DEFAULT_SUB_SUBJECT_ICON;
    } else if (typeof body.icon === "string") {
      payload.icon = body.icon.trim() || DEFAULT_SUB_SUBJECT_ICON;
    } else {
      return { error: "Icon must be text" };
    }
  }

  if (body.order_index !== undefined && body.order_index !== null) {
    const orderIndex = Number(body.order_index);
    if (!Number.isFinite(orderIndex)) {
      return { error: "order_index must be a number" };
    }
    payload.order_index = Math.trunc(orderIndex);
  }

  if (Object.keys(payload).length === 0) {
    return { error: "No updatable fields provided" };
  }

  return { payload };
}

/**
 * True when Postgres/PostgREST rejected the request because sub_subjects.icon
 * does not exist yet — i.e. migration 20260824000001_add_sub_subject_icon.sql
 * has not been applied to this database.
 */
export function isMissingIconColumnError(error: any): boolean {
  if (!error) return false;
  const code = error.code;
  const message = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  return (
    (code === "PGRST204" || code === "42703" || code === "PGRST102") &&
    message.includes("icon")
  );
}

export function withoutIcon(payload: SubSubjectPayload): SubSubjectPayload {
  const { icon, ...rest } = payload;
  return rest;
}
