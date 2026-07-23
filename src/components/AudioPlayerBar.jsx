import React, { useRef, useEffect, useState } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { WaveformVisualizer } from './WaveformVisualizer';
import { CMDIsotype } from './brand/CMDIsotype';
import { Play, Pause, Volume2, VolumeX, Disc } from 'lucide-react';

export const AudioPlayerBar = () => {
  const { currentPlayingTrack, isPlaying, setIsPlaying, siteSettings } = useGraphQL();
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio playback prevented:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentPlayingTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  if (!currentPlayingTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-2xl px-4 py-3 shadow-2xl transition-all animate-in slide-in-from-bottom duration-300">
      
      <audio
        ref={audioRef}
        src={currentPlayingTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Progress Bar Top Edge with Blueprint Orange Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-900">
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-cyan-400 to-purple-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Track Details with Official CMD Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <img
              src={currentPlayingTrack.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&auto=format&fit=crop&q=80'}
              alt={currentPlayingTrack.title}
              className={`w-12 h-12 rounded-xl object-cover border border-neutral-800 shadow-md ${isPlaying ? 'animate-spin-slow' : ''}`}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-neutral-950 border border-neutral-700 p-0.5 shadow-md flex items-center justify-center">
              <CMDIsotype className="w-full h-full text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-white truncate flex items-center gap-2">
              <span>{currentPlayingTrack.title}</span>
            </div>
            <div className="text-xs text-neutral-400 font-mono truncate">
              {currentPlayingTrack.artistName || 'Artista de CMD Lab'} • {currentPlayingTrack.genre || 'Electrónica'}
            </div>
          </div>
        </div>

        {/* Center: Waveform Visualizer & Play Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-11 h-11 rounded-xl bg-white text-neutral-950 flex items-center justify-center shadow-lg border-2 border-orange-500 hover:scale-105 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div className="hidden md:block">
            <WaveformVisualizer
              isPlaying={isPlaying}
              primaryColor={siteSettings.primaryColor || '#8b5cf6'}
              secondaryColor={siteSettings.secondaryColor || '#06b6d4'}
            />
          </div>
        </div>

        {/* Right: External Streaming & Volume */}
        <div className="hidden sm:flex items-center gap-3">
          {currentPlayingTrack.spotifyUrl && (
            <a
              href={currentPlayingTrack.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-900 shadow-sm"
            >
              <Disc className="w-4 h-4" />
              <span>Spotify</span>
            </a>
          )}

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.muted = !muted;
                setMuted(!muted);
              }
            }}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
