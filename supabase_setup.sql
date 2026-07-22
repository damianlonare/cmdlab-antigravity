-- ========================================================
-- CMD LAB ART COLLECTIVE - SUPABASE DATABASE SCHEMA & RLS
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS FOR EVERYONE
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public site_settings read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public social_links read" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Public tracks read" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Public posts read" ON public.posts FOR SELECT USING (true);

-- ARTIST SELF EDIT ACCESS
CREATE POLICY "Artists update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Artists insert own tracks" ON public.tracks 
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists update own tracks" ON public.tracks 
  FOR UPDATE USING (auth.uid() = artist_id);

CREATE POLICY "Artists delete own tracks" ON public.tracks 
  FOR DELETE USING (auth.uid() = artist_id);

CREATE POLICY "Artists insert own posts" ON public.posts 
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists insert own social_links" ON public.social_links 
  FOR INSERT WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists delete own social_links" ON public.social_links 
  FOR DELETE USING (auth.uid() = artist_id);

-- ADMIN & PUBLIC SITE SETTINGS PERSISTENCE
CREATE POLICY "Enable site_settings update for all" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Enable site_settings insert for all" ON public.site_settings FOR INSERT WITH CHECK (true);


-- SEED INITIAL SITE SETTINGS ROW
INSERT INTO public.site_settings (id, site_name, slogan, manifesto, primary_color, secondary_color, accent_glow, hero_announcement)
VALUES (
  1,
  'CMD Lab',
  'Colectivo Artístico de Música & Diseño Sonoro',
  'CMD Lab es un colectivo creativo independiente que une a músicos, productores, diseñadores de sonido y artistas visuales. Exploramos paisajes sonoros, lanzamientos digitales y colaboraciones audiovisuales sin fronteras.',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '⚡ ¡El nuevo lanzamiento del colectivo CMD Lab ya está disponible!'
)
ON CONFLICT (id) DO NOTHING;
