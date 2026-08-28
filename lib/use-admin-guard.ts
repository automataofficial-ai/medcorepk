"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminSession, type AdminIdentity } from "./admin-client";

export type AdminGuardState = {
  /** The verified administrator, or null while the check is in flight. */
  admin: AdminIdentity | null;
  /** True until the server has answered. Render nothing meaningful until then. */
  checking: boolean;
};

/**
 * Gate an admin page on a server-verified session.
 *
 * Replaces the old `localStorage.getItem("admin_token")` check, which any
 * visitor could satisfy by typing one line into the browser console. The answer
 * now comes from /api/admin/session and is never persisted, so a revoked role
 * takes effect on the next page load.
 *
 * This is a user experience guard. The data itself is protected by requireAdmin
 * on each API route.
 */
export function useAdminGuard(): AdminGuardState {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const identity = await verifyAdminSession();
      if (cancelled) return;

      if (!identity) {
        // Leave `checking` true so the page renders its loading state rather
        // than a flash of admin chrome on the way out.
        router.replace("/admin/login");
        return;
      }

      setAdmin(identity);
      setChecking(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return { admin, checking };
}
