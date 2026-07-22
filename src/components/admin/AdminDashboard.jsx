import React, { useState } from 'react';
import { useGraphQL } from '../../graphql/GraphQLContext';
import { Palette, UserPlus, Shield, Check, Trash2, Sparkles, Wand2 } from 'lucide-react';

export const AdminDashboard = () => {
  const { siteSettings, artists, executeMutation } = useGraphQL();

  const [activeTab, setActiveTab] = useState('THEME'); // 'THEME', 'ARTISTS'

  // Formulario del Tema Completo
  const [themeForm, setThemeForm] = useState({
    siteName: siteSettings.siteName || 'CMD Lab',
    slogan: siteSettings.slogan || '',
    manifesto: siteSettings.manifesto || '',
    primaryColor: siteSettings.primaryColor || '#8b5cf6',
    secondaryColor: siteSettings.secondaryColor || '#06b6d4',
    accentGlow: siteSettings.accentGlow || '#ec4899',
    bgColor: siteSettings.bgColor || '#0a0a0a',
    cardBgColor: siteSettings.cardBgColor || '#171717',
    textPrimaryColor: siteSettings.textPrimaryColor || '#ffffff',
    textSecondaryColor: siteSettings.textSecondaryColor || '#a3a3a3',
    heroAnnouncement: siteSettings.heroAnnouncement || ''
  });
  const [themeSaved, setThemeSaved] = useState(false);

  // Formulario de Nuevo Artista
  const [artistForm, setArtistForm] = useState({
    name: '',
    handle: '',
    role: '',
    bio: '',
    avatar: '',
    coverImage: '',
    genres: ''
  });
  const [artistCreatedSuccess, setArtistCreatedSuccess] = useState(false);

  const presets = [
    {
      name: 'Cyberpunk Neon',
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      glow: '#ec4899',
      bg: '#060913',
      cardBg: '#0f172a',
      textPrimary: '#ffffff',
      textSecondary: '#94a3b8'
    },
    {
      name: 'Dark Velvet',
      primary: '#a855f7',
      secondary: '#e11d48',
      glow: '#f43f5e',
      bg: '#0a0612',
      cardBg: '#140b24',
      textPrimary: '#ffffff',
      textSecondary: '#a78bfa'
    },
    {
      name: 'Synthwave Gold',
      primary: '#f59e0b',
      secondary: '#06b6d4',
      glow: '#38bdf8',
      bg: '#0c0c0e',
      cardBg: '#18181b',
      textPrimary: '#ffffff',
      textSecondary: '#a1a1aa'
    },
    {
      name: 'Emerald Studio',
      primary: '#10b981',
      secondary: '#14b8a6',
      glow: '#34d399',
      bg: '#04120e',
      cardBg: '#0b241c',
      textPrimary: '#ffffff',
      textSecondary: '#6ee7b7'
    },
    {
      name: 'Obsidian Minimal',
      primary: '#e5e5e5',
      secondary: '#a3a3a3',
      glow: '#ffffff',
      bg: '#000000',
      cardBg: '#121212',
      textPrimary: '#ffffff',
      textSecondary: '#a3a3a3'
    }
  ];

  const applyPreset = (preset) => {
    const updated = {
      ...themeForm,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentGlow: preset.glow,
      bgColor: preset.bg,
      cardBgColor: preset.cardBg,
      textPrimaryColor: preset.textPrimary,
      textSecondaryColor: preset.textSecondary
    };
    setThemeForm(updated);
    executeMutation('updateSiteSettings', { input: updated });
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 3000);
  };

  const handleThemeSubmit = (e) => {
    e.preventDefault();
    executeMutation('updateSiteSettings', { input: themeForm });
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 3000);
  };

  const handleCreateArtist = (e) => {
    e.preventDefault();
    if (!artistForm.name) return;

    executeMutation('createArtist', {
      input: {
        ...artistForm,
        genres: artistForm.genres.split(',').map(g => g.trim()).filter(Boolean)
      }
    });

    setArtistForm({ name: '', handle: '', role: '', bio: '', avatar: '', coverImage: '', genres: '' });
    setArtistCreatedSuccess(true);
    setTimeout(() => setArtistCreatedSuccess(false), 3000);
  };

  const handleDeleteArtist = (artistId, artistName) => {
    if (confirm(`¿Estás seguro de eliminar el perfil del artista "${artistName}"?`)) {
      executeMutation('deleteArtist', { id: artistId });
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner Superior */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-2xl border text-white"
              style={{
                background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`,
                borderColor: `var(--color-primary)`
              }}
            >
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Estudio de Administración General</h1>
              <p className="text-xs text-neutral-300">
                Personaliza absolutamente todos los colores del sitio, fondos, textos y administra las cuentas de los artistas.
              </p>
            </div>
          </div>

          {/* Pestañas de Navegación del Admin */}
          <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('THEME')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'THEME'
                  ? 'bg-neutral-800 text-white shadow border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Estilo y Colores Totales</span>
            </button>
            <button
              onClick={() => setActiveTab('ARTISTS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'ARTISTS'
                  ? 'bg-neutral-800 text-white shadow border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Cuentas de Artistas ({artists.length})</span>
            </button>
          </div>
        </div>

        {/* PESTAÑA 1: Estilo y Colores Totales */}
        {activeTab === 'THEME' && (
          <form onSubmit={handleThemeSubmit} className="space-y-6">
            
            {/* Presets de Color Rápidos */}
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Wand2 className="w-4 h-4 text-amber-400" />
                <span>Estilos Predeterminados (1-Click Presets)</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-left space-y-2 transition-all hover:scale-105"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primary }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.secondary }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.bg }} />
                    </div>
                    <div className="text-xs font-bold text-white truncate">{p.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Colores Detallado */}
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Personalizador de Cada Color del Sitio</h2>
                  <p className="text-xs text-neutral-400">Modifica los colores primarios, secundarios, fondos y tipografía.</p>
                </div>
                {themeSaved && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Colores Aplicados y Guardados!</span>
                  </span>
                )}
              </div>

              {/* Colores de Acento */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-mono tracking-widest text-neutral-400">1. Colores de Acento y Botones</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-2">Color Principal de Acento</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={themeForm.primaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl border border-neutral-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeForm.primaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-2">Color Secundario de Acento</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={themeForm.secondaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl border border-neutral-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeForm.secondaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-2">Color de Resplandor / Neon</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={themeForm.accentGlow}
                        onChange={(e) => setThemeForm({ ...themeForm, accentGlow: e.target.value })}
                        className="w-12 h-12 rounded-xl border border-neutral-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeForm.accentGlow}
                        onChange={(e) => setThemeForm({ ...themeForm, accentGlow: e.target.value })}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Colores de Fondo */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <h3 className="text-xs uppercase font-mono tracking-widest text-neutral-400">2. Fondos de Pantalla y Tarjetas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-2">Color de Fondo del Sitio (Body)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={themeForm.bgColor}
                        onChange={(e) => setThemeForm({ ...themeForm, bgColor: e.target.value })}
                        className="w-12 h-12 rounded-xl border border-neutral-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeForm.bgColor}
                        onChange={(e) => setThemeForm({ ...themeForm, bgColor: e.target.value })}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-2">Fondo de Tarjetas y Módulos</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={themeForm.cardBgColor}
                        onChange={(e) => setThemeForm({ ...themeForm, cardBgColor: e.target.value })}
                        className="w-12 h-12 rounded-xl border border-neutral-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeForm.cardBgColor}
                        onChange={(e) => setThemeForm({ ...themeForm, cardBgColor: e.target.value })}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Colores de Texto */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <h3 className="text-xs uppercase font-mono tracking-widest text-neutral-400">3. Colores de Tipografía y Textos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-2">Color de Texto Principal (Títulos)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={themeForm.textPrimaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, textPrimaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl border border-neutral-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeForm.textPrimaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, textPrimaryColor: e.target.value })}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-2">Color de Texto Secundario (Descripciones)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={themeForm.textSecondaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, textSecondaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl border border-neutral-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeForm.textSecondaryColor}
                        onChange={(e) => setThemeForm({ ...themeForm, textSecondaryColor: e.target.value })}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Textos del Colectivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-2">Nombre del Colectivo</label>
                  <input
                    type="text"
                    value={themeForm.siteName}
                    onChange={(e) => setThemeForm({ ...themeForm, siteName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-2">Lema / Frase Principal</label>
                  <input
                    type="text"
                    value={themeForm.slogan}
                    onChange={(e) => setThemeForm({ ...themeForm, slogan: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-2">Banner de Anuncio Destacado</label>
                <input
                  type="text"
                  value={themeForm.heroAnnouncement}
                  onChange={(e) => setThemeForm({ ...themeForm, heroAnnouncement: e.target.value })}
                  placeholder="ej. ¡Nuevo álbum disponible este viernes!"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-2">Manifiesto o Presentación del Colectivo</label>
                <textarea
                  rows={4}
                  value={themeForm.manifesto}
                  onChange={(e) => setThemeForm({ ...themeForm, manifesto: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white text-sm leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl text-white font-bold text-sm hover:scale-105 transition-all shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
                  }}
                >
                  Guardar Todos los Colores y Ajustes
                </button>
              </div>

            </div>
          </form>
        )}

        {/* PESTAÑA 2: Cuentas de Artistas */}
        {activeTab === 'ARTISTS' && (
          <div className="space-y-8">
            
            {/* Formulario para Crear Artista */}
            <form onSubmit={handleCreateArtist} className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-cyan-400" />
                  <span>Crear Cuenta de Artista Integrante</span>
                </h2>
                {artistCreatedSuccess && (
                  <span className="text-xs text-emerald-400 font-medium">
                    ✓ ¡Artista Creado Exitosamente!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Nombre del Artista *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Mateo Sonidos"
                    value={artistForm.name}
                    onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Nombre de Usuario / Manejo</label>
                  <input
                    type="text"
                    placeholder="ej. mateosonidos"
                    value={artistForm.handle}
                    onChange={(e) => setArtistForm({ ...artistForm, handle: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Especialidad / Rol</label>
                  <input
                    type="text"
                    placeholder="ej. Productor & Mezclador"
                    value={artistForm.role}
                    onChange={(e) => setArtistForm({ ...artistForm, role: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Géneros (separados por coma)</label>
                  <input
                    type="text"
                    placeholder="ej. Lo-Fi, Hip-Hop, Ambient"
                    value={artistForm.genres}
                    onChange={(e) => setArtistForm({ ...artistForm, genres: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">Imagen de Perfil (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={artistForm.avatar}
                  onChange={(e) => setArtistForm({ ...artistForm, avatar: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">Biografía / Presentación</label>
                <textarea
                  rows={2}
                  placeholder="Breve biografía del artista..."
                  value={artistForm.bio}
                  onChange={(e) => setArtistForm({ ...artistForm, bio: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-colors shadow-md"
                  style={{
                    background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
                  }}
                >
                  Crear Cuenta de Artista
                </button>
              </div>
            </form>

            {/* Lista de Artistas Existentes */}
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <h2 className="text-lg font-bold text-white">Artistas Registrados</h2>
              
              <div className="space-y-3">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-800"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-10 h-10 rounded-xl object-cover border border-neutral-700"
                      />
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{artist.name}</span>
                          {artist.isFounder && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-medium">
                              Fundador
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 font-medium">
                          @{artist.handle} • {artist.role}
                        </div>
                      </div>
                    </div>

                    {!artist.isFounder && (
                      <button
                        onClick={() => handleDeleteArtist(artist.id, artist.name)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl border border-transparent hover:border-red-900 transition-all"
                        title="Eliminar Artista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
