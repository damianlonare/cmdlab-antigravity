-- ========================================================
-- CMD LAB ART COLLECTIVE - SUPABASE DATABASE SCHEMA & RLS
-- Fresh installs: run this whole file in the SQL editor.
-- Existing projects: run supabase/migrations/20261122170000_restrict_rls_writes.sql
-- instead. That migration applies this same policy set without rebuilding tables.
-- ========================================================

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'Integrante del Colectivo',
  bio TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_founder BOOLEAN DEFAULT FALSE,
  genres TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'CMD Lab',
  slogan TEXT DEFAULT 'Colectivo Artístico de Música & Diseño Sonoro',
  manifesto TEXT DEFAULT 'CMD Lab es un colectivo creativo independiente que une a músicos, productores, diseñadores de sonido y artistas visuales.',
  primary_color TEXT DEFAULT '#8b5cf6',
  secondary_color TEXT DEFAULT '#06b6d4',
  accent_glow TEXT DEFAULT '#ec4899',
  bg_color TEXT DEFAULT '#09090b',
  card_bg_color TEXT DEFAULT '#121215',
  text_primary_color TEXT DEFAULT '#ffffff',
  text_secondary_color TEXT DEFAULT '#a1a1aa',
  hero_announcement TEXT DEFAULT '⚡ ¡El nuevo lanzamiento del colectivo CMD Lab ya está disponible!',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TRACKS TABLE
CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration TEXT DEFAULT '3:30',
  genre TEXT DEFAULT 'Electrónica',
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  spotify_url TEXT,
  apple_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- HELPERS
-- is_admin() is security definer so policies can read profiles.is_admin
-- without RLS recursion. Privilege flags are not self-serve.
-- ========================================================

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

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.protect_profile_privileges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  jwt_role text := coalesce(auth.role(), '');
BEGIN
  -- No end-user JWT: SQL editor (postgres) and service_role may set flags.
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

REVOKE ALL ON FUNCTION private.protect_profile_privileges() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.protect_profile_privileges() FROM anon, authenticated;

DROP TRIGGER IF EXISTS protect_profile_privileges_trg ON public.profiles;
CREATE TRIGGER protect_profile_privileges_trg
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION private.protect_profile_privileges();

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public SELECT stays open. Writes require the row owner or an admin.
-- ========================================================

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

DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
DROP POLICY IF EXISTS "Public site_settings read" ON public.site_settings;
DROP POLICY IF EXISTS "Public social_links read" ON public.social_links;
DROP POLICY IF EXISTS "Public tracks read" ON public.tracks;
DROP POLICY IF EXISTS "Public posts read" ON public.posts;
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

-- PUBLIC READ ACCESS FOR EVERYONE
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public site_settings read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public social_links read" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Public tracks read" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Public posts read" ON public.posts FOR SELECT USING (true);

-- ARTIST SELF-SERVICE. A signed-in user may change only their own rows.
CREATE POLICY "Artists update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Artists insert own tracks" ON public.tracks
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists update own tracks" ON public.tracks
  FOR UPDATE TO authenticated
  USING (auth.uid() = artist_id)
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists delete own tracks" ON public.tracks
  FOR DELETE TO authenticated
  USING (auth.uid() = artist_id);

CREATE POLICY "Artists insert own posts" ON public.posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists update own posts" ON public.posts
  FOR UPDATE TO authenticated
  USING (auth.uid() = artist_id)
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists delete own posts" ON public.posts
  FOR DELETE TO authenticated
  USING (auth.uid() = artist_id);

CREATE POLICY "Artists insert own social_links" ON public.social_links
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists update own social_links" ON public.social_links
  FOR UPDATE TO authenticated
  USING (auth.uid() = artist_id)
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists delete own social_links" ON public.social_links
  FOR DELETE TO authenticated
  USING (auth.uid() = artist_id);

-- ADMIN WRITES. profiles.is_admin is set from the SQL editor, not from sign-up.
CREATE POLICY "Admins manage site_settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "Admins manage profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "Admins manage tracks" ON public.tracks
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "Admins manage posts" ON public.posts
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "Admins manage social_links" ON public.social_links
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

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

-- SEED INITIAL SITE SETTINGS ROW
INSERT INTO public.site_settings (
  id,
  site_name,
  slogan,
  manifesto,
  primary_color,
  secondary_color,
  accent_glow,
  bg_color,
  card_bg_color,
  text_primary_color,
  text_secondary_color,
  hero_announcement
)
VALUES (
  1,
  'CMD Lab',
  'Colectivo Artístico de Música & Diseño Sonoro',
  'CMD Lab es un colectivo creativo independiente que une a músicos, productores, diseñadores de sonido y artistas visuales. Exploramos paisajes sonoros, lanzamientos digitales y colaboraciones audiovisuales sin fronteras.',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#09090b',
  '#121215',
  '#ffffff',
  '#a1a1aa',
  '⚡ ¡El nuevo lanzamiento del colectivo CMD Lab ya está disponible!'
)
ON CONFLICT (id) DO NOTHING;
