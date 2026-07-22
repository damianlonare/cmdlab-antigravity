import React, { useState } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { AuthModal } from './admin/AuthModal';
import { supabase } from '../lib/supabase';
import { Music, Shield, LogIn, LogOut, UserCheck, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { siteSettings, session, setSession } = useGraphQL();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(prev => ({
      ...prev,
      role: 'VISITOR',
      authUser: null
    }));
  };

  const handleAuthSuccess = (user) => {
    setSession(prev => ({
      ...prev,
      authUser: user,
      role: 'ADMIN' // Switch to authenticated portal
    }));
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

        {/* Botón de Acceso / Login de Producción */}
        <div className="hidden lg:flex items-center gap-3">
          {session.authUser ? (
            <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 shadow-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="truncate max-w-[140px]">{session.authUser.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-neutral-800 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white text-xs font-semibold transition-all shadow-sm hover:scale-105"
            >
              <LogIn className="w-4 h-4 text-purple-400" />
              <span>Acceso Artistas</span>
            </button>
          )}
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

          <div className="pt-4 border-t border-neutral-800">
            {session.authUser ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-red-400 text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión ({session.authUser.email})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-semibold shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                <span>Acceso Artistas</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </header>
  );
};
