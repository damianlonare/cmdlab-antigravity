import React from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { SocialIcon } from './SocialIcon';
import { Radio, Sparkles, Flame } from 'lucide-react';

export const HeroSection = () => {
  const { siteSettings } = useGraphQL();

  return (
    <section id="manifesto" className="relative overflow-hidden pt-12 pb-20 border-b border-neutral-800/60">
      
      {/* Background Ambient Glow FX */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, var(--color-primary) 0%, var(--color-secondary) 50%, transparent 100%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Ticker / Announcement */}
        {siteSettings.heroAnnouncement && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-mono text-cyan-300 mb-8 shadow-lg backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{siteSettings.heroAnnouncement}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-purple-400 bg-purple-950/40 px-3 py-1 rounded-md border border-purple-800/50">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>CMD Lab Art Collective</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-sans leading-none">
              Where Sound, Code & <br />
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary), var(--color-accent-glow))`
                }}
              >
                Art Converge.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl">
              {siteSettings.manifesto}
            </p>

            {/* CMD Lab Collective Social Media Links */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono uppercase text-neutral-400 mr-2">Official Channels:</span>
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

          {/* Right Visual Graphic / Spectrum Box */}
          <div className="lg:col-span-4">
            <div className="relative rounded-3xl p-6 bg-neutral-900/60 border border-neutral-800 backdrop-blur-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>GRAPHQL_EXECUTOR :: QUERY</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="bg-neutral-950 rounded-xl p-4 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto border border-neutral-900">
                <pre className="text-purple-300">
{`query GetCollectiveInfo {
  siteSettings {
    siteName: "${siteSettings.siteName}"
    artistsCount: 3
    themeMode: "${siteSettings.themeMode}"
  }
}`}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800">
                  <div className="text-xl font-bold text-white font-mono">01</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Art Collective</div>
                </div>
                <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800">
                  <div className="text-xl font-bold text-cyan-400 font-mono">100%</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Independent</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
