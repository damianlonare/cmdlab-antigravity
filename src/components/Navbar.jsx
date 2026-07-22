import React, { useState } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { Music, Shield, UserCheck, Eye, RefreshCw, Menu, X, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { siteSettings, session, setSession, artists, resetToDefault } = useGraphQL();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleChange = (e) => {
    const role = e.target.value;
    if (role === 'ARTIST') {
      const lonare = artists.find(a => a.id === 'artist-lonare') || artists[0];
      setSession({ role: 'ARTIST', artistId: lonare ? lonare.id : '' });
    } else {
      setSession({ ...session, role });
    }
  };

  const handleArtistSelect = (e) => {
    setSession({ role: 'ARTIST', artistId: e.target.value });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-neutral-950/80 border-b border-neutral-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo del Colectivo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-0.5 shadow-lg shadow-[var(--color-primary)]/20 animate-pulse">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-white">
                {siteSettings.siteName}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest bg-neutral-800 text-neutral-300 rounded-full border border-neutral-700">
                Colectivo
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium hidden sm:block">
              {siteSettings.slogan}
            </p>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <a href="#manifesto" className="hover:text-white transition-colors">Manifiesto</a>
          <a href="#roster" className="hover:text-white transition-colors">Artistas</a>
          <a href="#feed" className="hover:text-white transition-colors">Lanzamientos</a>
        </nav>

        {/* Selector de Modo para el Usuario */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-1.5 shadow-inner">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
              {session.role === 'VISITOR' && <Eye className="w-3.5 h-3.5 text-emerald-400" />}
              {session.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-purple-400" />}
              {session.role === 'ARTIST' && <UserCheck className="w-3.5 h-3.5 text-cyan-400" />}
              <span>Vista:</span>
            </div>

            <select
              value={session.role}
              onChange={handleRoleChange}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="VISITOR" className="bg-neutral-900 text-white">Visitante Público</option>
              <option value="ADMIN" className="bg-neutral-900 text-white">Administrador General</option>
              <option value="ARTIST" className="bg-neutral-900 text-white">Panel de Artista</option>
            </select>

            {session.role === 'ARTIST' && (
              <select
                value={session.artistId}
                onChange={handleArtistSelect}
                className="bg-neutral-800 text-cyan-300 text-xs px-2 py-1 rounded border border-neutral-700 focus:outline-none cursor-pointer font-medium"
              >
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id} className="bg-neutral-900 text-white">
                    {artist.name} {artist.isFounder ? '(Fundador)' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={() => {
              if (confirm('¿Restablecer los ajustes del sitio y perfiles al contenido inicial?')) {
                resetToDefault();
              }
            }}
            title="Restablecer contenido inicial"
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-transparent hover:border-neutral-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Menú Móvil */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-t border-neutral-800 bg-neutral-950/95 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-neutral-300 text-sm">
            <a href="#manifesto" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Manifiesto</a>
            <a href="#roster" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Artistas</a>
            <a href="#feed" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">Lanzamientos</a>
          </div>

          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <label className="text-xs text-neutral-400 font-medium block">Seleccionar Modo:</label>
            <select
              value={session.role}
              onChange={handleRoleChange}
              className="w-full bg-neutral-900 border border-neutral-700 text-white text-sm p-2 rounded-lg"
            >
              <option value="VISITOR">Visitante Público</option>
              <option value="ADMIN">Administrador General</option>
              <option value="ARTIST">Panel de Artista</option>
            </select>

            {session.role === 'ARTIST' && (
              <select
                value={session.artistId}
                onChange={handleArtistSelect}
                className="w-full bg-neutral-900 border border-neutral-700 text-cyan-300 text-sm p-2 rounded-lg"
              >
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name} {artist.isFounder ? '(Fundador)' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
