import React, { useState } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { ArtistModal } from './ArtistModal';
import { SocialIcon } from './SocialIcon';
import { Play, Pause, Sparkles, ExternalLink, Star } from 'lucide-react';

export const ArtistRoster = () => {
  const { artists, currentPlayingTrack, isPlaying, playTrack } = useGraphQL();
  const [selectedArtist, setSelectedArtist] = useState(null);

  return (
    <section id="roster" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Collective Members & Collaborators</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Artist Roster
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Meet the sound designers, music producers, and visual creators shaping the CMD Lab soundscape.
          </p>
        </div>

        {/* Grid of Artist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => {
            const featuredTrack = artist.tracks && artist.tracks.length > 0 ? artist.tracks[0] : null;
            const isTrackPlaying = currentPlayingTrack && featuredTrack && currentPlayingTrack.id === featuredTrack.id && isPlaying;

            return (
              <div
                key={artist.id}
                className="group relative rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
              >
                {/* Cover Header */}
                <div className="relative h-40 w-full overflow-hidden bg-neutral-950">
                  <img
                    src={artist.coverImage || artist.avatar}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                  {artist.isFounder && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/90 text-neutral-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Founder</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 relative z-10 -mt-12 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Avatar & Title */}
                    <div className="flex items-end gap-4 mb-3">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-20 h-20 rounded-2xl border-2 border-neutral-800 object-cover shadow-2xl bg-neutral-950 group-hover:border-[var(--color-primary)] transition-colors"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {artist.name}
                        </h3>
                        <p className="text-xs text-neutral-400 font-mono">
                          @{artist.handle}
                        </p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="text-xs font-semibold text-purple-400 mb-2 font-mono">
                      {artist.role}
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                      {artist.bio}
                    </p>

                    {/* Genres */}
                    {artist.genres && artist.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {artist.genres.map((g, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[10px] rounded-md bg-neutral-800/80 border border-neutral-700/60 text-neutral-300">
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Social Links Pills */}
                  <div className="space-y-3 pt-3 border-t border-neutral-800/80">
                    <div className="flex flex-wrap gap-2">
                      {artist.socialLinks?.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link.label || link.platform}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-all"
                        >
                          <SocialIcon platform={link.platform} className="w-3.5 h-3.5" />
                          <span className="font-mono">{link.platform}</span>
                        </a>
                      ))}
                    </div>

                    {/* Audio Preview & View Profile CTA */}
                    <div className="flex items-center justify-between pt-2">
                      {featuredTrack ? (
                        <button
                          onClick={() => playTrack(featuredTrack, artist.name)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/80 text-purple-200 text-xs font-semibold transition-all"
                        >
                          {isTrackPlaying ? (
                            <Pause className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-purple-300" />
                          )}
                          <span>{isTrackPlaying ? 'Pause Audio' : 'Preview Track'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 italic">No tracks yet</span>
                      )}

                      <button
                        onClick={() => setSelectedArtist(artist)}
                        className="text-xs text-neutral-300 hover:text-white font-medium flex items-center gap-1 hover:underline underline-offset-4"
                      >
                        <span>Full Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Artist Profile Modal */}
      {selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
        />
      )}
    </section>
  );
};
