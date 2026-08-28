-- Admin authentication hardening (SEC-1)
--
-- The admin panel used to accept a hardcoded email/password pair that shipped
-- in the public JavaScript bundle. Admin identity now comes from Supabase Auth
-- plus the `role` column on public.users, so this migration makes that column
-- explicit, constrained and indexed.
--
-- Safe to run against the live database: the column already exists there, so
-- every statement is written to be idempotent.

-- 1. The role column itself.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- 2. Only two roles are meaningful. Anything else is a typo that would silently
--    lock someone out or, worse, be treated as a non-admin when it was meant to
--    grant access.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check'
  ) THEN
    -- Normalise any stray values before the constraint goes on, otherwise
    -- adding it fails on existing rows.
    UPDATE public.users
       SET role = 'user'
     WHERE role IS NULL OR role NOT IN ('user', 'admin');

    ALTER TABLE public.users
      ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- 3. Admin lookups happen on every admin API request. Partial index because
--    admins are a tiny fraction of the table.
CREATE INDEX IF NOT EXISTS users_role_admin_idx
  ON public.users (id)
  WHERE role = 'admin';

-- 4. Helper for row level security policies: is the caller an admin?
--    SECURITY DEFINER so the policy can read public.users even when the
--    caller's own RLS would not allow it, avoiding infinite policy recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
      FROM public.users
     WHERE id = auth.uid()
       AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

COMMENT ON COLUMN public.users.role IS
  'Authorisation role. ''admin'' grants access to /admin and /api/admin. Verified server side only - never trust a client claim.';
