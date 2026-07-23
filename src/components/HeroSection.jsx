import React, { useState } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { CMDIsotype } from './brand/CMDIsotype';
import { CMDWordmark } from './brand/CMDWordmark';
import { SocialIcon } from './SocialIcon';
import { VideoModal } from './VideoModal';
import { Flame, Play, Cpu, Building2, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  const { siteSettings, artists } = useGraphQL();
  const [activeVideo, setActiveVideo] = useState(null);

  const totalTracks = artists.reduce((acc, a) => acc + (a.tracks?.length || 0), 0);

  return (
    <section id="manifesto" className="relative overflow-hidden pt-12 pb-24 border-b border-neutral-800/80 bg-blueprint-grid">
      
      {/* Blueprint & Ambient Glowing Backdrop */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[150px] opacity-20 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, var(--color-primary) 0%, var(--color-secondary) 50%, transparent 100%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Banner de Anuncio Destacado */}
        {siteSettings.heroAnnouncement && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/90 border border-orange-500/40 text-xs font-mono font-bold text-orange-400 shadow-xl backdrop-blur-md">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>{siteSettings.heroAnnouncement}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Contenido Principal de Texto & Narrativa de Marca */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline Oficial de la Marca */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-neutral-900/90 px-3 py-1.5 rounded-lg border border-neutral-700 shadow-sm">
              <CMDIsotype className="w-4 h-4 text-white" />
              <span>C + // + # + Ganchos = CMD LAB</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-sans leading-[1.05]">
              CMD es la música <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-cyan-400">
                urbana de Monterrey.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-2xl">
              {siteSettings.manifesto}
            </p>

            {/* Fórmulas y Pilares del Isotipo (Página 2 del PDF) */}
            <div className="p-4 rounded-2xl bg-neutral-950/90 border border-orange-500/30 font-mono text-xs text-neutral-300 space-y-2 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between text-orange-400 font-bold border-b border-neutral-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Composición de Identidad</span>
                </span>
                <span className="text-[10px] text-neutral-400">PDF Brand Specification</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-bold">
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-purple-300">
                  <span className="text-white">C</span> (Comando)
                </div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-cyan-300">
                  <span className="text-white">//</span> (Slashes)
                </div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-pink-300">
                  <span className="text-white">#</span> (Grid Sharp)
                </div>
                <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-lime-300">
                  <span className="text-white">Ganchos</span> (Loops)
                </div>
              </div>
            </div>

            {/* Enlaces Oficiales del Colectivo */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mr-1">Canales Oficiales:</span>
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

          {/* Tarjeta Visual: Isotipo & Dualidad Circuito vs Concreto (Página 2 del PDF) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Display de la Insignia Isotipo Monocromática */}
            <div className="relative rounded-3xl p-6 bg-neutral-900/80 border border-neutral-800 backdrop-blur-2xl shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-200">
                  <CMDIsotype className="w-5 h-5 text-white" />
                  <span>ISOTIPO Y MARCA REGISTRADA</span>
                </div>
                <CMDWordmark size="text-sm" />
              </div>

              {/* Muestra Audiovisual / Video Drop */}
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
                  className="relative z-10 w-14 h-14 rounded-2xl bg-white text-neutral-950 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 border-2 border-orange-500"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-xs font-mono font-bold text-white truncate flex items-center justify-between">
                  <span>▶ Transmisión & Drops Oficiales</span>
                  <span className="text-orange-400">Monterrey</span>
                </div>
              </div>

              {/* Dualidad Digital vs Urbanidad (Página 2 del PDF) */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-neutral-950/90 rounded-2xl border border-cyan-900/60 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Época Digital</div>
                    <div className="text-[10px] text-neutral-400">Sistemas & Loops</div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-950/90 rounded-2xl border border-orange-900/60 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-orange-950 text-orange-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Urbanidad MTY</div>
                    <div className="text-[10px] text-neutral-400">Calle & Concreto</div>
                  </div>
                </div>
              </div>

              {/* Métricas del Colectivo */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800">
                  <div className="text-2xl font-bold text-white">{artists.length}</div>
                  <div className="text-[10px] font-mono text-neutral-400 font-bold uppercase mt-0.5">Artistas Integrantes</div>
                </div>
                <div className="p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800">
                  <div className="text-2xl font-bold text-cyan-400">{totalTracks}+</div>
                  <div className="text-[10px] font-mono text-neutral-400 font-bold uppercase mt-0.5">Producciones Urbanas</div>
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
