import React, { useRef, useEffect } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { Play, Pause, Volume2, VolumeX, Music, Disc } from 'lucide-react';

export const AudioPlayerBar = () => {
  const { currentPlayingTrack, isPlaying, setIsPlaying } = useGraphQL();
  const audioRef = useRef(null);
  const [muted, setMuted] = React.useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio playback prevented:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentPlayingTrack]);

  if (!currentPlayingTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-2xl px-4 py-3 shadow-2xl transition-all animate-in slide-in-from-bottom duration-300">
      
      <audio
        ref={audioRef}
        src={currentPlayingTrack.audioUrl}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={currentPlayingTrack.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&auto=format&fit=crop&q=80'}
            alt={currentPlayingTrack.title}
            className={`w-12 h-12 rounded-xl object-cover border border-neutral-800 shadow-md ${isPlaying ? 'animate-spin-slow' : ''}`}
          />
          <div className="min-w-0">
            <div className="text-sm font-bold text-white truncate">
              {currentPlayingTrack.title}
            </div>
            <div className="text-xs text-neutral-400 font-mono truncate">
              {currentPlayingTrack.artistName || 'CMD Lab Artist'} • {currentPlayingTrack.genre || 'Electronic'}
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30 hover:scale-105 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* External Links & Volume */}
        <div className="hidden sm:flex items-center gap-3">
          {currentPlayingTrack.spotifyUrl && (
            <a
              href={currentPlayingTrack.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-900"
            >
              <Disc className="w-3.5 h-3.5" />
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
