import React from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { SocialIcon } from './SocialIcon';
import { Radio, Sparkles, Flame, Music, Disc, Volume2 } from 'lucide-react';

export const HeroSection = () => {
  const { siteSettings, artists } = useGraphQL();

  const totalTracks = artists.reduce((acc, a) => acc + (a.tracks?.length || 0), 0);

  return (
    <section id="manifesto" className="relative overflow-hidden pt-12 pb-20 border-b border-neutral-800/60">
      
      {/* Resplandor ambiental de fondo */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, var(--color-primary) 0%, var(--color-secondary) 50%, transparent 100%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner de Anuncio Destacado */}
        {siteSettings.heroAnnouncement && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-medium text-cyan-300 mb-8 shadow-lg backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{siteSettings.heroAnnouncement}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Contenido Principal */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-purple-400 bg-purple-950/40 px-3 py-1 rounded-md border border-purple-800/50">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Colectivo Artístico CMD Lab</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-sans leading-none">
              Donde el Sonido, <br />
              la Música y el Arte <br />
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary), var(--color-accent-glow))`
                }}
              >
                Convergen.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl">
              {siteSettings.manifesto}
            </p>

            {/* Enlaces Oficiales del Colectivo */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium uppercase text-neutral-400 mr-2">Canales Oficiales:</span>
              {siteSettings.groupSocials?.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white text-xs font-medium transition-all shadow-sm hover:scale-105"
                >
                  <SocialIcon platform={social.platform} className="w-4 h-4" />
                  <span>{social.label || social.platform}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Tarjeta Visual Musical (Reemplaza la caja de código por arte sonoro) */}
          <div className="lg:col-span-4">
            <div className="relative rounded-3xl p-6 bg-neutral-900/60 border border-neutral-800 backdrop-blur-2xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                  <Disc className="w-4 h-4 text-purple-400 animate-spin-slow" />
                  <span>Espacio Creativo CMD Lab</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Equalizador Animado */}
              <div className="bg-neutral-950/80 rounded-2xl p-5 border border-neutral-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Laboratorio Sonoro</span>
                  </div>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800 font-medium">
                    En Vivo
                  </span>
                </div>

                {/* Barritasa de Audio Visual */}
                <div className="flex items-end justify-between h-16 gap-1 px-2 pt-2">
                  <div className="w-2 bg-purple-500 rounded-t h-12 animate-pulse" />
                  <div className="w-2 bg-cyan-400 rounded-t h-8 animate-pulse" />
                  <div className="w-2 bg-pink-500 rounded-t h-14 animate-pulse" />
                  <div className="w-2 bg-purple-400 rounded-t h-6 animate-pulse" />
                  <div className="w-2 bg-cyan-500 rounded-t h-16 animate-pulse" />
                  <div className="w-2 bg-pink-400 rounded-t h-10 animate-pulse" />
                  <div className="w-2 bg-purple-600 rounded-t h-14 animate-pulse" />
                  <div className="w-2 bg-cyan-300 rounded-t h-7 animate-pulse" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 text-center">
                <div className="p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800">
                  <div className="text-2xl font-bold text-white">{artists.length}</div>
                  <div className="text-[11px] text-neutral-400 font-medium mt-0.5">Artistas</div>
                </div>
                <div className="p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800">
                  <div className="text-2xl font-bold text-cyan-400">{totalTracks}+</div>
                  <div className="text-[11px] text-neutral-400 font-medium mt-0.5">Producciones</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
