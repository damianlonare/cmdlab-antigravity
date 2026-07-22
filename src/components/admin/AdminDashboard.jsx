import React, { useState } from 'react';
import { useGraphQL } from '../../graphql/GraphQLContext';
import { Palette, UserPlus, Shield, Sparkles, Check, Trash2, Edit3, Plus, Globe } from 'lucide-react';


export const AdminDashboard = () => {
  const { siteSettings, artists, executeMutation } = useGraphQL();

  const [activeTab, setActiveTab] = useState('THEME'); // 'THEME', 'ARTISTS'

  // Theme Form State
  const [themeForm, setThemeForm] = useState({
    siteName: siteSettings.siteName || 'CMD Lab',
    slogan: siteSettings.slogan || '',
    manifesto: siteSettings.manifesto || '',
    primaryColor: siteSettings.primaryColor || '#8b5cf6',
    secondaryColor: siteSettings.secondaryColor || '#06b6d4',
    accentGlow: siteSettings.accentGlow || '#ec4899',
    heroAnnouncement: siteSettings.heroAnnouncement || ''
  });
  const [themeSaved, setThemeSaved] = useState(false);

  // New Artist Form State
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
    if (confirm(`Are you sure you want to delete artist profile "${artistName}"?`)) {
      executeMutation('deleteArtist', { id: artistId });
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-neutral-900 to-cyan-950/80 border border-purple-800/60 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-900/60 border border-purple-700 text-purple-200">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">Super Admin CMS Studio</h1>
                <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-600/40">
                  GraphQL Powered
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                Personalize site branding, theme colors, slogan, and manage all artist user profiles.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('THEME')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'THEME'
                  ? 'bg-purple-900 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Theme & Branding</span>
            </button>
            <button
              onClick={() => setActiveTab('ARTISTS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'ARTISTS'
                  ? 'bg-purple-900 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Artists & User Accounts ({artists.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Theme Personalizer */}
        {activeTab === 'THEME' && (
          <form onSubmit={handleThemeSubmit} className="space-y-6">
            
            {/* Color Palette customization */}
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Theme & Palette Personalizer</h2>
                  <p className="text-xs text-neutral-400">Live preview color accents across the collective app.</p>
                </div>
                {themeSaved && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                    <span>Theme Updated via GraphQL!</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-2">Primary Accent Color</label>
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
                  <label className="text-xs font-mono text-neutral-300 block mb-2">Secondary Accent Color</label>
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
                  <label className="text-xs font-mono text-neutral-300 block mb-2">Glow Accent Color</label>
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

              {/* Text Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-2">Collective Name</label>
                  <input
                    type="text"
                    value={themeForm.siteName}
                    onChange={(e) => setThemeForm({ ...themeForm, siteName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-2">Tagline / Slogan</label>
                  <input
                    type="text"
                    value={themeForm.slogan}
                    onChange={(e) => setThemeForm({ ...themeForm, slogan: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-2">Announcement Ticker Banner</label>
                <input
                  type="text"
                  value={themeForm.heroAnnouncement}
                  onChange={(e) => setThemeForm({ ...themeForm, heroAnnouncement: e.target.value })}
                  placeholder="e.g. New release dropping this Friday!"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-2">Collective Manifesto / About Text</label>
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
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-sm hover:scale-105 transition-all shadow-lg"
                >
                  Save Theme Settings
                </button>
              </div>

            </div>
          </form>
        )}

        {/* TAB 2: Artist Accounts & Management */}
        {activeTab === 'ARTISTS' && (
          <div className="space-y-8">
            
            {/* Create Artist Form */}
            <form onSubmit={handleCreateArtist} className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-cyan-400" />
                  <span>Create Artist User Profile</span>
                </h2>
                {artistCreatedSuccess && (
                  <span className="text-xs text-emerald-400 font-mono">
                    ✓ Artist Created!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Artist Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Beats"
                    value={artistForm.name}
                    onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Handle / Username</label>
                  <input
                    type="text"
                    placeholder="e.g. alexbeats"
                    value={artistForm.handle}
                    onChange={(e) => setArtistForm({ ...artistForm, handle: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Role / Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Mixing Engineer & Producer"
                    value={artistForm.role}
                    onChange={(e) => setArtistForm({ ...artistForm, role: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Genres (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Lo-Fi, Hip-Hop, Ambient"
                    value={artistForm.genres}
                    onChange={(e) => setArtistForm({ ...artistForm, genres: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={artistForm.avatar}
                  onChange={(e) => setArtistForm({ ...artistForm, avatar: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Bio / Description</label>
                <textarea
                  rows={2}
                  placeholder="Short introduction..."
                  value={artistForm.bio}
                  onChange={(e) => setArtistForm({ ...artistForm, bio: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
                >
                  Create Artist User Account
                </button>
              </div>
            </form>

            {/* List of Existing Artists */}
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <h2 className="text-lg font-bold text-white">Existing Artist Accounts</h2>
              
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
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                              Founder
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 font-mono">
                          @{artist.handle} • {artist.role}
                        </div>
                      </div>
                    </div>

                    {!artist.isFounder && (
                      <button
                        onClick={() => handleDeleteArtist(artist.id, artist.name)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl border border-transparent hover:border-red-900 transition-all"
                        title="Delete Artist"
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
