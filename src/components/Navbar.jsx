import React, { useState } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { AuthModal } from './admin/AuthModal';
import { CMDIsotype } from './brand/CMDIsotype';
import { CMDWordmark } from './brand/CMDWordmark';
import { supabase } from '../lib/supabase';
import { Shield, LogIn, LogOut, Menu, X, LayoutDashboard, Eye } from 'lucide-react';

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
      authUser: user
    }));
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (session.role !== 'VISITOR') {
      setSession(prev => ({ ...prev, role: 'VISITOR' }));
    }
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-neutral-950/90 border-b border-neutral-800/80 transition-all duration-300 relative overflow-hidden">
      {/* Subtle blueprint accent line at the very top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-cyan-500 to-purple-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        
        {/* Logo de la Marca: Isotipo CMD + Tag xCMDLABx */}
        <div 
          onClick={(e) => handleNavClick(e, 'manifesto')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Official CMD Isotype badge */}
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700/80 p-1.5 shadow-xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-orange-500 group-hover:shadow-orange-500/20">
            <CMDIsotype className="w-full h-full text-white" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <CMDWordmark size="text-lg" />
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-orange-950/80 text-orange-400 rounded-md border border-orange-800/80">
                Monterrey
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium hidden sm:block">
              {siteSettings.slogan}
            </p>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
          <a
            href="#manifesto"
            onClick={(e) => handleNavClick(e, 'manifesto')}
            className="hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            <span className="text-orange-500 font-sans text-xs">//</span>
            <span>Manifiesto</span>
          </a>
          <a
            href="#roster"
            onClick={(e) => handleNavClick(e, 'roster')}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <span className="text-cyan-500 font-sans text-xs">//</span>
            <span>Artistas</span>
          </a>
          <a
            href="#feed"
            onClick={(e) => handleNavClick(e, 'feed')}
            className="hover:text-pink-400 transition-colors flex items-center gap-1"
          >
            <span className="text-pink-500 font-sans text-xs">//</span>
            <span>Lanzamientos</span>
          </a>
        </nav>

        {/* Botones de Control de Sesión */}
        <div className="hidden lg:flex items-center gap-3">
          {session.authUser ? (
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-1 shadow-md">
              <button
                onClick={() => setSession(prev => ({ ...prev, role: session.role === 'ADMIN' ? 'VISITOR' : 'ADMIN' }))}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-neutral-200 hover:text-white bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all"
              >
                {session.role === 'ADMIN' ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ver Sitio</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ir a Panel Admin</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 px-2 text-xs font-semibold text-purple-300">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate max-w-[120px]">{session.authUser.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 px-2 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md hover:scale-105 border border-orange-500/50"
              style={{
                background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
              }}
            >
              <LogIn className="w-4 h-4" />
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
          <div className="flex flex-col space-y-3 font-mono font-bold text-neutral-300 text-xs uppercase tracking-wider">
            <a
              href="#manifesto"
              onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'manifesto'); }}
              className="hover:text-orange-400"
            >
              // Manifiesto
            </a>
            <a
              href="#roster"
              onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'roster'); }}
              className="hover:text-cyan-400"
            >
              // Artistas
            </a>
            <a
              href="#feed"
              onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'feed'); }}
              className="hover:text-pink-400"
            >
              // Lanzamientos
            </a>
          </div>

          <div className="pt-4 border-t border-neutral-800">
            {session.authUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSession(prev => ({ ...prev, role: session.role === 'ADMIN' ? 'VISITOR' : 'ADMIN' }));
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  <span>{session.role === 'ADMIN' ? 'Ver Sitio Público' : 'Ir a Panel Admin'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-red-400 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg"
                style={{
                  background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
                }}
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
