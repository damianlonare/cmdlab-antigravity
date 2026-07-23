import React, { useState } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { ArtistModal } from './ArtistModal';
import { SocialIcon } from './SocialIcon';
import { CMDIsotype } from './brand/CMDIsotype';
import { CMDWordmark } from './brand/CMDWordmark';
import { Play, Pause, Sparkles, ExternalLink, Star } from 'lucide-react';

export const ArtistRoster = () => {
  const { artists, currentPlayingTrack, isPlaying, playTrack } = useGraphQL();
  const [selectedArtist, setSelectedArtist] = useState(null);

  return (
    <section id="roster" className="py-20 relative bg-urban-grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Encabezado con Estilo de Marca */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-orange-400 mb-2">
              <CMDIsotype className="w-4 h-4 text-orange-400" />
              <span>Integrantes del Colectivo</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Artistas CMD</span>
              <CMDWordmark size="text-2xl sm:text-3xl" />
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Músicos, productores, diseñadores de sonido y creadores visuales impulsando la música urbana y digital de Monterrey.
          </p>
        </div>

        {/* Cuadrícula de Tarjetas de Artista (Inspirado en la Página 5 del PDF - Bloques de Color & Merch Posters) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist, idx) => {
            const featuredTrack = artist.tracks && artist.tracks.length > 0 ? artist.tracks[0] : null;
            const isTrackPlaying = currentPlayingTrack && featuredTrack && currentPlayingTrack.id === featuredTrack.id && isPlaying;

            // Page 5 Merch Color Blocks: Alternate border accent colors
            const colorAccents = [
              'border-l-4 border-l-lime-400',
              'border-l-4 border-l-cyan-400',
              'border-l-4 border-l-pink-500',
              'border-l-4 border-l-orange-500',
              'border-l-4 border-l-purple-400',
              'border-l-4 border-l-yellow-400'
            ];
            const accentClass = colorAccents[idx % colorAccents.length];

            return (
              <div
                key={artist.id}
                className={`group relative rounded-3xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-2xl flex flex-col justify-between ${accentClass}`}
              >
                {/* Imagen de Portada */}
                <div className="relative h-44 w-full overflow-hidden bg-neutral-950">
                  <img
                    src={artist.coverImage || artist.avatar}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                  {artist.isFounder && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500 text-neutral-950 text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Fundador</span>
                    </div>
                  )}

                  {/* Badge Isotipo en la Portada */}
                  <div className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-neutral-950/80 border border-neutral-700 p-1 flex items-center justify-center shadow-md">
                    <CMDIsotype className="w-full h-full text-white" />
                  </div>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-6 relative z-10 -mt-12 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Avatar y Nombre */}
                    <div className="flex items-end gap-4 mb-3">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-20 h-20 rounded-2xl border-2 border-neutral-800 object-cover shadow-2xl bg-neutral-950 group-hover:border-orange-500 transition-colors"
                      />
                      <div>
                        <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                          {artist.name}
                        </h3>
                        <p className="text-xs font-mono text-neutral-400 font-semibold">
                          @{artist.handle}
                        </p>
                      </div>
                    </div>

                    {/* Rol */}
                    <div className="text-xs font-mono font-bold text-orange-400 mb-2 uppercase tracking-wide">
                      // {artist.role}
                    </div>

                    {/* Biografía */}
                    <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                      {artist.bio}
                    </p>

                    {/* Géneros */}
                    {artist.genres && artist.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {artist.genres.map((g, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-neutral-950 border border-neutral-800 text-neutral-300">
                            #{g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enlaces Sociales */}
                  <div className="space-y-3 pt-3 border-t border-neutral-800">
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
                          <span>{link.platform}</span>
                        </a>
                      ))}
                    </div>

                    {/* Reproductor de Audio y Botón Perfil */}
                    <div className="flex items-center justify-between pt-2">
                      {featuredTrack ? (
                        <button
                          onClick={() => playTrack(featuredTrack, artist.name)}
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-orange-500/60 text-white text-xs font-mono font-bold transition-all shadow-sm"
                        >
                          {isTrackPlaying ? (
                            <Pause className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-orange-400" />
                          )}
                          <span>{isTrackPlaying ? 'Pausar' : 'Escuchar Muestra'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-neutral-500 italic">Sin muestras</span>
                      )}

                      <button
                        onClick={() => setSelectedArtist(artist)}
                        className="text-xs font-mono font-bold text-neutral-300 hover:text-white flex items-center gap-1 hover:underline underline-offset-4"
                      >
                        <span>Ver Perfil</span>
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

      {/* Modal de Detalle de Artista */}
      {selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
        />
      )}
    </section>
  );
};
