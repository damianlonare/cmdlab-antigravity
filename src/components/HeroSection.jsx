import React, { useState } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { SocialIcon } from './SocialIcon';
import { VideoModal } from './VideoModal';
import { Radio, Flame, Disc, Play } from 'lucide-react';

export const HeroSection = () => {
  const { siteSettings, artists } = useGraphQL();
  const [activeVideo, setActiveVideo] = useState(null);

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
            <div 
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-md border"
              style={{
                color: `var(--color-primary)`,
                borderColor: `var(--color-primary)`,
                backgroundColor: `rgba(255, 255, 255, 0.05)`
              }}
            >
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

          {/* Tarjeta Visual Audiovisual */}
          <div className="lg:col-span-4">
            <div className="relative rounded-3xl p-6 bg-neutral-900/60 border border-neutral-800 backdrop-blur-2xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                  <Disc className="w-4 h-4 animate-spin-slow" style={{ color: `var(--color-primary)` }} />
                  <span>Espacio Creativo CMD Lab</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Muestra Audiovisual Destacada */}
              <div className="relative group rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 aspect-video flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80"
                  alt="CMD Lab Video Drop"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                <button
                  onClick={() => setActiveVideo({
                    url: 'https://www.youtube.com/@cmd_lab',
                    title: 'CMD Lab Art Collective - Canal Oficial'
                  })}
                  className="relative z-10 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
                  }}
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-xs font-bold text-white truncate">
                  ▶ Transmisión & Videos Oficiales
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
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

      {/* Video Modal Lightbox */}
      {activeVideo && (
        <VideoModal
          videoUrl={activeVideo.url}
          videoTitle={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
};
