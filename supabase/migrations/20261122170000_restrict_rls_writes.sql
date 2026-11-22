-- Restrict CMD Lab writes on an existing Supabase project.
-- Run this once in the Supabase SQL editor. It does not delete rows.
-- Fresh installs should use supabase_setup.sql instead; that file matches this policy set.
--
-- Auth model this enforces:
--   * Anyone (including anonymous visitors) can SELECT public content.
--   * site_settings writes require profiles.is_admin = true.
--   * A signed-in artist can insert, update, and delete only their own
--     tracks, posts, and social links, and can update only their own profile.
--   * profiles.is_admin and profiles.is_founder cannot be changed through the
--     Data API. Promote the first admin with the commented statement at the bottom
--     of this file (the SQL editor bypasses RLS).
--
-- Open sign-up stays available, but a new account is not an admin.

BEGIN;

-- Columns the theme studio already sends. Without them the site_settings
-- upsert is rejected before RLS even runs.
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT '#09090b',
  ADD COLUMN IF NOT EXISTS card_bg_color TEXT DEFAULT '#121215',
  ADD COLUMN IF NOT EXISTS text_primary_color TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS text_secondary_color TEXT DEFAULT '#a1a1aa';

-- Keep helpers out of public so PostgREST does not expose them as RPC.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(
    (
      SELECT p.is_admin
      FROM public.profiles AS p
      WHERE p.id = auth.uid()
    ),
    false
  );
$$;

COMMENT ON FUNCTION private.is_admin() IS
  'True when the current JWT user has profiles.is_admin. Security definer so policies can call it without RLS recursion.';

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.protect_profile_privileges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
BEGIN
  -- auth.jwt() is null in the SQL editor, so promotions from there are allowed.
  -- The Data API cannot change is_admin or is_founder: those columns are left
  -- out of the UPDATE grant, including for admins. This UPDATE branch is the
  -- backstop if that grant is widened later.
  IF jwt_role NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF (COALESCE(NEW.is_admin, false) OR COALESCE(NEW.is_founder, false))
       AND NOT private.is_admin() THEN
      RAISE EXCEPTION 'Only an admin can grant is_admin or is_founder';
    END IF;
    RETURN NEW;
  END IF;

  IF (NEW.is_admin IS DISTINCT FROM OLD.is_admin
      OR NEW.is_founder IS DISTINCT FROM OLD.is_founder)
     AND NOT private.is_admin() THEN
    RAISE EXCEPTION 'Only an admin can change is_admin or is_founder';
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION private.protect_profile_privileges() IS
  'Blocks anon and authenticated users from granting is_admin or is_founder unless they are already an admin. Column grants also omit those columns, so nobody can promote through the Data API; promotions run in the SQL editor.';

REVOKE ALL ON FUNCTION private.protect_profile_privileges() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.protect_profile_privileges() FROM anon, authenticated;

DROP TRIGGER IF EXISTS protect_profile_privileges_trg ON public.profiles;
CREATE TRIGGER protect_profile_privileges_trg
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION private.protect_profile_privileges();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings FORCE ROW LEVEL SECURITY;
ALTER TABLE public.social_links FORCE ROW LEVEL SECURITY;
ALTER TABLE public.tracks FORCE ROW LEVEL SECURITY;
ALTER TABLE public.posts FORCE ROW LEVEL SECURITY;

-- Drop every write policy that allows all rows, whatever its name is.
-- Public SELECT policies use USING (true) and are left in place.
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('profiles', 'site_settings', 'social_links', 'tracks', 'posts')
      AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      AND (
        btrim(COALESCE(qual, '')) ~* '^\(?true\)?$'
        OR btrim(COALESCE(with_check, '')) ~* '^\(?true\)?$'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- Recreate the write policies we own so this script is safe to re-run.
DROP POLICY IF EXISTS "Enable site_settings update for all" ON public.site_settings;
DROP POLICY IF EXISTS "Enable site_settings insert for all" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Artists update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Artists insert own tracks" ON public.tracks;
DROP POLICY IF EXISTS "Artists update own tracks" ON public.tracks;
DROP POLICY IF EXISTS "Artists delete own tracks" ON public.tracks;
DROP POLICY IF EXISTS "Admins manage tracks" ON public.tracks;
DROP POLICY IF EXISTS "Artists insert own posts" ON public.posts;
DROP POLICY IF EXISTS "Artists update own posts" ON public.posts;
DROP POLICY IF EXISTS "Artists delete own posts" ON public.posts;
DROP POLICY IF EXISTS "Admins manage posts" ON public.posts;
DROP POLICY IF EXISTS "Artists insert own social_links" ON public.social_links;
DROP POLICY IF EXISTS "Artists update own social_links" ON public.social_links;
DROP POLICY IF EXISTS "Artists delete own social_links" ON public.social_links;
DROP POLICY IF EXISTS "Admins manage social_links" ON public.social_links;

-- Public reads. Created only when missing so a re-run does not duplicate them.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Public profiles read'
  ) THEN
    CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'Public site_settings read'
  ) THEN
    CREATE POLICY "Public site_settings read" ON public.site_settings FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'social_links' AND policyname = 'Public social_links read'
  ) THEN
    CREATE POLICY "Public social_links read" ON public.social_links FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tracks' AND policyname = 'Public tracks read'
  ) THEN
    CREATE POLICY "Public tracks read" ON public.tracks FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'Public posts read'
  ) THEN
    CREATE POLICY "Public posts read" ON public.posts FOR SELECT USING (true);
  END IF;
END $$;

CREATE POLICY "Admins manage site_settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "Artists update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins manage profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "Artists insert own tracks"
  ON public.tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists update own tracks"
  ON public.tracks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = artist_id)
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists delete own tracks"
  ON public.tracks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = artist_id);

CREATE POLICY "Admins manage tracks"
  ON public.tracks
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "Artists insert own posts"
  ON public.posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists update own posts"
  ON public.posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = artist_id)
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists delete own posts"
  ON public.posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = artist_id);

CREATE POLICY "Admins manage posts"
  ON public.posts
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "Artists insert own social_links"
  ON public.social_links
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists update own social_links"
  ON public.social_links
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = artist_id)
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists delete own social_links"
  ON public.social_links
  FOR DELETE
  TO authenticated
  USING (auth.uid() = artist_id);

CREATE POLICY "Admins manage social_links"
  ON public.social_links
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- anon keeps public reads and loses every write grant.
-- authenticated keeps writes; RLS decides which rows.
-- is_admin and is_founder are omitted from UPDATE on purpose. The admin
-- profile policy is FOR ALL, but this grant still blocks privilege changes
-- through PostgREST. Promote an account from the SQL editor.
REVOKE ALL ON TABLE
  public.profiles,
  public.site_settings,
  public.social_links,
  public.tracks,
  public.posts
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE
  public.profiles,
  public.site_settings,
  public.social_links,
  public.tracks,
  public.posts
TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON TABLE
  public.site_settings,
  public.social_links,
  public.tracks,
  public.posts
TO authenticated;

GRANT INSERT, DELETE ON TABLE public.profiles TO authenticated;
GRANT UPDATE (
  email,
  name,
  handle,
  role,
  bio,
  avatar_url,
  cover_url,
  genres
) ON TABLE public.profiles TO authenticated;

DO $$
DECLARE
  leftover integer;
BEGIN
  SELECT count(*) INTO leftover
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'site_settings', 'social_links', 'tracks', 'posts')
    AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    AND (
      btrim(COALESCE(qual, '')) ~* '^\(?true\)?$'
      OR btrim(COALESCE(with_check, '')) ~* '^\(?true\)?$'
    );

  IF leftover > 0 THEN
    RAISE EXCEPTION 'Permissive write policies are still present (%).', leftover;
  END IF;
END $$;

COMMIT;

-- Promote your login after you have signed up once. Replace the email, then run
-- this statement on its own in the SQL editor. The Data API cannot set is_admin.
-- The handle is derived from the email so it does not reuse a fixed value.
-- ON CONFLICT only sets the flag and leaves an existing handle alone.
-- If the INSERT fails on the handle unique constraint, pick another handle.
--
--   INSERT INTO public.profiles (id, email, name, handle, is_admin)
--   SELECT id,
--          email,
--          COALESCE(raw_user_meta_data->>'name', 'Admin'),
--          lower(regexp_replace(split_part(email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'))
--            || '_' || substr(replace(id::text, '-', ''), 1, 8),
--          true
--   FROM auth.users
--   WHERE email = 'you@example.com'
--   ON CONFLICT (id) DO UPDATE SET is_admin = true;
--
-- The navbar "admin" switch only changes this browser. Database writes use the
-- Supabase session and succeed only when that profile has is_admin = true.
