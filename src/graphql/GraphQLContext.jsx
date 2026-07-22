import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from './initialData';

const GraphQLContext = createContext();

const LOCAL_STORAGE_KEY = 'CMDLAB_ART_COLLECTIVE_STATE_V1';

export const GraphQLProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return initialData;
  });

  // Role Management: 'VISITOR', 'ADMIN', 'ARTIST'
  const [session, setSession] = useState({
    role: 'VISITOR', // 'VISITOR', 'ADMIN', 'ARTIST'
    artistId: 'artist-lonare' // default artist when logged in as ARTIST
  });

  // Audio Player Global State
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [data]);

  // Apply dynamic CSS Variables for site customization
  useEffect(() => {
    if (data.siteSettings) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', data.siteSettings.primaryColor || '#8b5cf6');
      root.style.setProperty('--color-secondary', data.siteSettings.secondaryColor || '#06b6d4');
      root.style.setProperty('--color-accent-glow', data.siteSettings.accentGlow || '#ec4899');
    }
  }, [data.siteSettings]);

  // GraphQL Resolver Engine
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

  const executeMutation = (mutationName, variables = {}) => {
    let newData = { ...data };

    if (mutationName === 'updateSiteSettings') {
      newData.siteSettings = {
        ...newData.siteSettings,
        ...variables.input
      };
      setData(newData);
      return newData.siteSettings;
    }

    if (mutationName === 'createArtist') {
      const newArtist = {
        id: `artist-${Date.now()}`,
        name: variables.input.name,
        handle: variables.input.handle || variables.input.name.toLowerCase().replace(/\s+/g, ''),
        role: variables.input.role || 'Member Artist',
        bio: variables.input.bio || '',
        avatar: variables.input.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
        coverImage: variables.input.coverImage || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80',
        isFounder: false,
        genres: variables.input.genres || ['Music'],
        socialLinks: variables.input.socialLinks || [],
        tracks: [],
        posts: []
      };
      newData.artists = [...newData.artists, newArtist];
      setData(newData);
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
        return newData.artists[index];
      }
    }

    if (mutationName === 'deleteArtist') {
      newData.artists = newData.artists.filter(a => a.id !== variables.id);
      setData(newData);
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
          genre: variables.input.genre || 'Electronic',
          releaseDate: new Date().toISOString().split('T')[0],
          audioUrl: variables.input.audioUrl,
          coverUrl: variables.input.coverUrl || newData.artists[artistIndex].avatar,
          spotifyUrl: variables.input.spotifyUrl || '',
          appleUrl: variables.input.appleUrl || ''
        };
        newData.artists[artistIndex].tracks = [newTrack, ...newData.artists[artistIndex].tracks];
        setData(newData);
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
