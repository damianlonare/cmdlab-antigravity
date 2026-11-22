import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from './initialData';
import { supabase } from '../lib/supabase';

const GraphQLContext = createContext();

const LOCAL_STORAGE_KEY = 'CMDLAB_ART_COLLECTIVE_STATE_V3';

export const GraphQLProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.siteSettings) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return initialData;
  });

  const [session, setSession] = useState({
    role: 'VISITOR', // 'VISITOR', 'ADMIN', 'ARTIST'
    artistId: 'artist-lonare',
    authUser: null
  });

  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync state from Supabase on mount
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        // 1. Fetch site settings
        const { data: settings } = await supabase.from('site_settings').select('*').single();
        // 2. Fetch profiles
        const { data: profiles } = await supabase.from('profiles').select('*');
        // 3. Fetch tracks
        const { data: tracks } = await supabase.from('tracks').select('*');
        // 4. Fetch posts
        const { data: posts } = await supabase.from('posts').select('*');
        // 5. Fetch social links
        const { data: socials } = await supabase.from('social_links').select('*');

        if (profiles && profiles.length > 0) {
          const formattedArtists = profiles.map(p => ({
            id: p.id,
            name: p.name,
            handle: p.handle,
            role: p.role || 'Integrante del Colectivo',
            bio: p.bio || '',
            avatar: p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
            coverImage: p.cover_url || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80',
            isFounder: p.is_founder || false,
            genres: p.genres || ['Música'],
            socialLinks: (socials || []).filter(s => s.artist_id === p.id).map(s => ({
              platform: s.platform,
              url: s.url,
              label: s.label
            })),
            tracks: (tracks || []).filter(t => t.artist_id === p.id).map(t => ({
              id: t.id,
              title: t.title,
              duration: t.duration || '3:30',
              genre: t.genre || 'Electrónica',
              audioUrl: t.audio_url,
              coverUrl: t.cover_url,
              spotifyUrl: t.spotify_url,
              appleUrl: t.apple_url
            })),
            posts: (posts || []).filter(post => post.artist_id === p.id).map(post => ({
              id: post.id,
              title: post.title,
              content: post.content,
              createdAt: post.created_at ? post.created_at.split('T')[0] : '2026-07-22',
              tags: post.tags || [],
              mediaUrl: post.media_url
            }))
          }));

          setData(prev => {
            const updated = {
              ...prev,
              artists: formattedArtists,
              siteSettings: settings ? {
                siteName: settings.site_name || prev.siteSettings.siteName,
                slogan: settings.slogan || prev.siteSettings.slogan,
                manifesto: settings.manifesto || prev.siteSettings.manifesto,
                primaryColor: settings.primary_color || prev.siteSettings.primaryColor,
                secondaryColor: settings.secondary_color || prev.siteSettings.secondaryColor,
                accentGlow: settings.accent_glow || prev.siteSettings.accentGlow,
                bgColor: settings.bg_color || prev.siteSettings.bgColor,
                cardBgColor: settings.card_bg_color || prev.siteSettings.cardBgColor,
                textPrimaryColor: settings.text_primary_color || prev.siteSettings.textPrimaryColor,
                textSecondaryColor: settings.text_secondary_color || prev.siteSettings.textSecondaryColor,
                heroAnnouncement: settings.hero_announcement || prev.siteSettings.heroAnnouncement,
                groupSocials: prev.siteSettings.groupSocials
              } : prev.siteSettings
            };
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      } catch (err) {
        console.log('Supabase sync notice: Using cached settings', err);
      }
    };

    fetchSupabaseData();
  }, []);

  // Listen to Supabase Auth State Changes.
  // The admin studio is for profiles.is_admin only. A signed-in artist is not an admin.
  // The lookup is deferred so it does not run inside the auth client's lock.
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, authSession) => {
      setTimeout(async () => {
        if (!authSession?.user) {
          setSession(prev => ({
            ...prev,
            authUser: null,
            role: 'VISITOR'
          }));
          return;
        }

        let isAdmin = false;
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', authSession.user.id)
            .maybeSingle();
          isAdmin = !error && profile?.is_admin === true;
        } catch (err) {
          console.error('Failed to read admin flag', err);
        }

        setSession(prev => ({
          ...prev,
          authUser: authSession.user,
          role: isAdmin ? 'ADMIN' : 'VISITOR'
        }));
      }, 0);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Persist state to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [data]);

  // Apply dynamic CSS Variables to document root
  useEffect(() => {
    if (data.siteSettings) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', data.siteSettings.primaryColor || '#8b5cf6');
      root.style.setProperty('--color-secondary', data.siteSettings.secondaryColor || '#06b6d4');
      root.style.setProperty('--color-accent-glow', data.siteSettings.accentGlow || '#ec4899');
      root.style.setProperty('--color-bg', data.siteSettings.bgColor || '#0a0a0a');
      root.style.setProperty('--color-card-bg', data.siteSettings.cardBgColor || '#171717');
      root.style.setProperty('--color-text-primary', data.siteSettings.textPrimaryColor || '#ffffff');
      root.style.setProperty('--color-text-secondary', data.siteSettings.textSecondaryColor || '#a3a3a3');
    }
  }, [data.siteSettings]);

  const executeQuery = (queryName, variables = {}) => {
    switch (queryName) {
      case 'getSiteSettings':
        return data.siteSettings;
      case 'getArtists':
        return data.artists;
      case 'getArtist':
        return data.artists.find(a => a.id === variables.id) || null;
      default:
        return null;
    }
  };

  const executeMutation = async (mutationName, variables = {}) => {
    let newData = { ...data };

    if (mutationName === 'updateSiteSettings') {
      newData.siteSettings = {
        ...newData.siteSettings,
        ...variables.input
      };
      
      // Instantly update React state & localStorage
      setData(newData);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      } catch (e) {}

      // Instantly apply root CSS variables on document
      const root = document.documentElement;
      if (variables.input.primaryColor) root.style.setProperty('--color-primary', variables.input.primaryColor);
      if (variables.input.secondaryColor) root.style.setProperty('--color-secondary', variables.input.secondaryColor);
      if (variables.input.accentGlow) root.style.setProperty('--color-accent-glow', variables.input.accentGlow);
      if (variables.input.bgColor) root.style.setProperty('--color-bg', variables.input.bgColor);
      if (variables.input.cardBgColor) root.style.setProperty('--color-card-bg', variables.input.cardBgColor);
      if (variables.input.textPrimaryColor) root.style.setProperty('--color-text-primary', variables.input.textPrimaryColor);
      if (variables.input.textSecondaryColor) root.style.setProperty('--color-text-secondary', variables.input.textSecondaryColor);

      // supabase-js returns { error } for RLS failures. It does not throw.
      let synced = false;
      try {
        const { error } = await supabase.from('site_settings').upsert({
          id: 1,
          site_name: variables.input.siteName,
          slogan: variables.input.slogan,
          manifesto: variables.input.manifesto,
          primary_color: variables.input.primaryColor,
          secondary_color: variables.input.secondaryColor,
          accent_glow: variables.input.accentGlow,
          bg_color: variables.input.bgColor,
          card_bg_color: variables.input.cardBgColor,
          text_primary_color: variables.input.textPrimaryColor,
          text_secondary_color: variables.input.textSecondaryColor,
          hero_announcement: variables.input.heroAnnouncement
        });
        if (error) {
          console.error('Supabase settings update error', error.message);
        } else {
          synced = true;
        }
      } catch (err) {
        console.error('Supabase settings update error', err);
      }

      return { settings: newData.siteSettings, synced };
    }

    if (mutationName === 'createArtist') {
      const newArtist = {
        id: `artist-${Date.now()}`,
        name: variables.input.name,
        handle: variables.input.handle || variables.input.name.toLowerCase().replace(/\s+/g, ''),
        role: variables.input.role || 'Integrante del Colectivo',
        bio: variables.input.bio || '',
        avatar: variables.input.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
        coverImage: variables.input.coverImage || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80',
        isFounder: false,
        genres: variables.input.genres || ['Música'],
        socialLinks: variables.input.socialLinks || [],
        tracks: [],
        posts: []
      };
      newData.artists = [...newData.artists, newArtist];
      setData(newData);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      } catch (e) {}
      return newArtist;
    }

    if (mutationName === 'updateArtist') {
      const index = newData.artists.findIndex(a => a.id === variables.id);
      if (index !== -1) {
        newData.artists[index] = {
          ...newData.artists[index],
          ...variables.input
        };
        setData(newData);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {}
        return newData.artists[index];
      }
    }

    if (mutationName === 'deleteArtist') {
      newData.artists = newData.artists.filter(a => a.id !== variables.id);
      setData(newData);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      } catch (e) {}
      return true;
    }

    if (mutationName === 'createPost') {
      const artistIndex = newData.artists.findIndex(a => a.id === variables.artistId);
      if (artistIndex !== -1) {
        const newPost = {
          id: `post-${Date.now()}`,
          title: variables.input.title,
          content: variables.input.content,
          createdAt: new Date().toISOString().split('T')[0],
          tags: variables.input.tags || [],
          mediaUrl: variables.input.mediaUrl || null
        };
        newData.artists[artistIndex].posts = [newPost, ...newData.artists[artistIndex].posts];
        setData(newData);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {}
        return newPost;
      }
    }

    if (mutationName === 'createTrack') {
      const artistIndex = newData.artists.findIndex(a => a.id === variables.artistId);
      if (artistIndex !== -1) {
        const newTrack = {
          id: `track-${Date.now()}`,
          title: variables.input.title,
          duration: variables.input.duration || '3:30',
          genre: variables.input.genre || 'Electrónica',
          releaseDate: new Date().toISOString().split('T')[0],
          audioUrl: variables.input.audioUrl,
          coverUrl: variables.input.coverUrl || newData.artists[artistIndex].avatar,
          spotifyUrl: variables.input.spotifyUrl || '',
          appleUrl: variables.input.appleUrl || ''
        };
        newData.artists[artistIndex].tracks = [newTrack, ...newData.artists[artistIndex].tracks];
        setData(newData);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {}
        return newTrack;
      }
    }

    return null;
  };

  const resetToDefault = () => {
    setData(initialData);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const playTrack = (track, artistName) => {
    if (currentPlayingTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPlayingTrack({ ...track, artistName });
      setIsPlaying(true);
    }
  };

  return (
    <GraphQLContext.Provider
      value={{
        siteSettings: data.siteSettings,
        artists: data.artists,
        session,
        setSession,
        executeQuery,
        executeMutation,
        resetToDefault,
        currentPlayingTrack,
        isPlaying,
        setIsPlaying,
        playTrack
      }}
    >
      {children}
    </GraphQLContext.Provider>
  );
};

export const useGraphQL = () => useContext(GraphQLContext);
