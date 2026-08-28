import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

/**
 * Who am I?
 *
 * The admin panel calls this on every page load to decide whether to render or
 * bounce to the login screen. It is the only source of truth for admin identity
 * on the client - the answer is not stored, so revoking someone's role takes
 * effect on their next navigation rather than whenever they happen to clear
 * their browser storage.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.status === "denied") return auth.response;

  return NextResponse.json(
    { admin: auth.admin },
    { headers: { "Cache-Control": "no-store" } }
  );
}
