import React from 'react';
import { GraphQLProvider, useGraphQL } from './graphql/GraphQLContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ArtistRoster } from './components/ArtistRoster';
import { NewsFeed } from './components/NewsFeed';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ArtistPortal } from './components/admin/ArtistPortal';

const MainContent = () => {
  const { session, siteSettings } = useGraphQL();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col justify-between">
      
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Body depending on Active Session Mode */}
      <main className="flex-1 pb-24">
        {session.role === 'VISITOR' && (
          <>
            <HeroSection />
            <ArtistRoster />
            <NewsFeed />
          </>
        )}

        {session.role === 'ADMIN' && (
          <AdminDashboard />
        )}

        {session.role === 'ARTIST' && (
          <ArtistPortal />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800/80 py-10 font-mono text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-widest">{siteSettings.siteName}</span>
            <span>•</span>
            <span>Art Collective & Music Laboratory</span>
          </div>

          <div className="flex items-center gap-4">
            {siteSettings.groupSocials?.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {social.label || social.platform}
              </a>
            ))}
          </div>

          <div className="text-neutral-300 flex items-center gap-1">
            <span>Built for CMD Lab</span>
          </div>
        </div>
      </footer>

      {/* Global Persistent Audio Player */}
      <AudioPlayerBar />

    </div>
  );
};

export default function App() {
  return (
    <GraphQLProvider>
      <MainContent />
    </GraphQLProvider>
  );
}
