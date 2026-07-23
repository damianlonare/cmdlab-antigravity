import React from 'react';
import { createPortal } from 'react-dom';
import { useGraphQL } from '../graphql/GraphQLContext';
import { SocialIcon } from './SocialIcon';
import { CMDIsotype } from './brand/CMDIsotype';
import { CMDWordmark } from './brand/CMDWordmark';
import { X, Play, Pause, Disc, Music, Calendar, Star } from 'lucide-react';

export const ArtistModal = ({ artist, onClose }) => {
  const { currentPlayingTrack, isPlaying, playTrack } = useGraphQL();

  if (!artist) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      
      {/* Tarjeta Modal */}
      <div className="relative w-full max-w-3xl my-8 bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl space-y-6">
        
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-950/80 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado con Portada */}
        <div className="relative h-56 sm:h-72 w-full bg-neutral-950">
          <img
            src={artist.coverImage || artist.avatar}
            alt={artist.name}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            {artist.isFounder && (
              <div className="flex items-center gap-1.5 bg-amber-500 text-neutral-950 font-mono font-extrabold text-xs px-3 py-1 rounded-md shadow-lg uppercase">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Fundador CMD</span>
              </div>
            )}
            <div className="w-7 h-7 rounded-lg bg-neutral-950/80 border border-neutral-700 p-1 flex items-center justify-center shadow-md">
              <CMDIsotype className="w-full h-full text-white" />
            </div>
          </div>
        </div>

        {/* Info del Artista */}
        <div className="px-6 sm:px-8 relative -mt-16 sm:-mt-20 z-10 flex flex-col sm:flex-row items-start sm:items-end gap-6 border-b border-neutral-800 pb-6">
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-neutral-900 object-cover shadow-2xl bg-neutral-950"
          />
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {artist.name}
              </h2>
              <CMDWordmark size="text-sm" />
            </div>
            <p className="text-xs font-mono font-bold text-orange-400">
              @{artist.handle} • <span className="text-cyan-300">// {artist.role}</span>
            </p>

            {artist.genres && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {artist.genres.map((g, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 text-xs font-mono rounded-md bg-neutral-950 text-neutral-300 border border-neutral-800">
                    #{g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cuerpo del Perfil */}
        <div className="px-6 sm:px-8 space-y-8 pb-8">
          
          {/* Biografía */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-neutral-400">// Sobre el Artista</h3>
            <p className="text-neutral-200 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {artist.bio}
            </p>
          </div>

          {/* Redes Sociales y Plataformas */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-neutral-400">// Canales Oficiales & Streaming</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {artist.socialLinks?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white text-xs font-medium transition-all shadow-sm"
                >
                  <SocialIcon platform={link.platform} className="w-4 h-4" />
                  <span className="truncate">{link.label || link.platform}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Discografía / Muestras */}
          {artist.tracks && artist.tracks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-neutral-400">// Discografía y Muestras Sonoras</h3>
              <div className="space-y-2">
                {artist.tracks.map((track) => {
                  const isTrackPlaying = currentPlayingTrack?.id === track.id && isPlaying;
                  return (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => playTrack(track, artist.name)}
                          className="w-10 h-10 rounded-xl bg-white text-neutral-950 border border-orange-500 flex items-center justify-center transition-colors shadow-md"
                        >
                          {isTrackPlaying ? (
                            <Pause className="w-4 h-4 text-orange-600 animate-pulse" />
                          ) : (
                            <Play className="w-4 h-4 text-neutral-950 ml-0.5" />
                          )}
                        </button>
                        <div>
                          <div className="text-sm font-bold text-white">{track.title}</div>
                          <div className="text-xs text-neutral-400 font-mono">
                            {track.genre} • {track.duration}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {track.spotifyUrl && (
                          <a
                            href={track.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-neutral-900 hover:bg-emerald-950 text-emerald-400 text-xs font-mono flex items-center gap-1 border border-neutral-800"
                          >
                            <Disc className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Spotify</span>
                          </a>
                        )}
                        {track.appleUrl && (
                          <a
                            href={track.appleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-neutral-900 hover:bg-pink-950 text-pink-400 text-xs font-mono flex items-center gap-1 border border-neutral-800"
                          >
                            <Music className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Apple Music</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Publicaciones */}
          {artist.posts && artist.posts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-neutral-400">// Últimas Novedades</h3>
              <div className="space-y-3">
                {artist.posts.map((post) => (
                  <div key={post.id} className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                      <span className="font-bold text-orange-400">{post.title}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        {post.createdAt}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {post.content}
                    </p>
                    {post.tags && (
                      <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="text-cyan-400 font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>,
    document.body
  );
};
