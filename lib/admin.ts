import { getSupabase } from "./supabase";

export async function checkAdminAccess(userId: string): Promise<boolean> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return data?.role === "admin";
  } catch (err) {
    console.error("Admin check error:", err);
    return false;
  }
}

export async function getCurrentUserRole(userId: string): Promise<string | null> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) return null;
    return data?.role || "user";
  } catch (err) {
    return null;
  }
}

export function isAdminRequest(request: any, userId: string): Promise<boolean> {
  return checkAdminAccess(userId);
}
