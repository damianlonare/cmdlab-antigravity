import React, { useState, useEffect } from 'react';
import { useGraphQL } from '../../graphql/GraphQLContext';
import { UserCheck, Music, FileText, Trash2, Check } from 'lucide-react';

export const ArtistPortal = () => {
  const { session, artists, executeMutation } = useGraphQL();
  const activeArtist = artists.find(a => a.id === session.artistId) || artists[0];

  const [activeTab, setActiveTab] = useState('PROFILE'); // 'PROFILE', 'TRACKS', 'POSTS'

  // Formulario del Perfil
  const [profileForm, setProfileForm] = useState({
    name: '',
    handle: '',
    role: '',
    bio: '',
    avatar: '',
    coverImage: '',
    genres: '',
    socialLinks: []
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Formulario de Nueva Canción
  const [trackForm, setTrackForm] = useState({
    title: '',
    duration: '',
    genre: '',
    audioUrl: '',
    coverUrl: '',
    spotifyUrl: '',
    appleUrl: ''
  });
  const [trackSuccess, setTrackSuccess] = useState(false);

  // Formulario de Nueva Publicación
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    tags: '',
    mediaUrl: ''
  });
  const [postSuccess, setPostSuccess] = useState(false);

  // Estado para nuevo enlace social
  const [newSocial, setNewSocial] = useState({ platform: 'Spotify', url: '', label: '' });

  useEffect(() => {
    if (activeArtist) {
      setProfileForm({
        name: activeArtist.name || '',
        handle: activeArtist.handle || '',
        role: activeArtist.role || '',
        bio: activeArtist.bio || '',
        avatar: activeArtist.avatar || '',
        coverImage: activeArtist.coverImage || '',
        genres: (activeArtist.genres || []).join(', '),
        socialLinks: activeArtist.socialLinks || []
      });
    }
  }, [activeArtist]);

  if (!activeArtist) return null;

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    executeMutation('updateArtist', {
      id: activeArtist.id,
      input: {
        ...profileForm,
        genres: profileForm.genres.split(',').map(g => g.trim()).filter(Boolean)
      }
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleAddSocial = () => {
    if (!newSocial.url) return;
    const updated = [...profileForm.socialLinks, newSocial];
    setProfileForm({ ...profileForm, socialLinks: updated });
    setNewSocial({ platform: 'Spotify', url: '', label: '' });
  };

  const handleRemoveSocial = (index) => {
    const updated = profileForm.socialLinks.filter((_, i) => i !== index);
    setProfileForm({ ...profileForm, socialLinks: updated });
  };

  const handleAddTrack = (e) => {
    e.preventDefault();
    if (!trackForm.title || !trackForm.audioUrl) return;

    executeMutation('createTrack', {
      artistId: activeArtist.id,
      input: trackForm
    });

    setTrackForm({ title: '', duration: '', genre: '', audioUrl: '', coverUrl: '', spotifyUrl: '', appleUrl: '' });
    setTrackSuccess(true);
    setTimeout(() => setTrackSuccess(false), 3000);
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) return;

    executeMutation('createPost', {
      artistId: activeArtist.id,
      input: {
        ...postForm,
        tags: postForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      }
    });

    setPostForm({ title: '', content: '', tags: '', mediaUrl: '' });
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 3000);
  };

  return (
    <div className="bg-neutral-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Banner del Perfil */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={activeArtist.avatar}
              alt={activeArtist.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{activeArtist.name}</h1>
                <span className="text-xs text-cyan-400 font-medium">@{activeArtist.handle}</span>
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                Panel Personal del Artista • {activeArtist.role}
              </p>
            </div>
          </div>

          {/* Pestañas del Artista */}
          <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('PROFILE')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'PROFILE'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Perfil y Redes</span>
            </button>
            <button
              onClick={() => setActiveTab('TRACKS')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'TRACKS'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Muestras ({activeArtist.tracks?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('POSTS')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'POSTS'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Publicaciones ({activeArtist.posts?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* PESTAÑA 1: Perfil y Redes */}
        {activeTab === 'PROFILE' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h2 className="text-lg font-bold text-white">Editar Información Personal y Redes Sociales</h2>
                {profileSaved && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Perfil Guardado!</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Nombre Artístico</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Usuario / Manejo</label>
                  <input
                    type="text"
                    value={profileForm.handle}
                    onChange={(e) => setProfileForm({ ...profileForm, handle: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Especialidad / Rol</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Géneros (separados por coma)</label>
                  <input
                    type="text"
                    value={profileForm.genres}
                    onChange={(e) => setProfileForm({ ...profileForm, genres: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Imagen de Perfil (URL)</label>
                  <input
                    type="url"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Imagen de Portada (URL)</label>
                  <input
                    type="url"
                    value={profileForm.coverImage}
                    onChange={(e) => setProfileForm({ ...profileForm, coverImage: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">Biografía del Artista</label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white text-xs leading-relaxed"
                />
              </div>

              {/* Gestión de Enlaces Sociales */}
              <div className="pt-4 border-t border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Redes Sociales y Enlaces de Streaming</h3>
                
                <div className="space-y-2">
                  {profileForm.socialLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400">{link.platform}:</span>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:underline truncate max-w-xs sm:max-w-md">
                          {link.url}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSocial(idx)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <select
                    value={newSocial.platform}
                    onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="Spotify">Spotify</option>
                    <option value="Apple Music">Apple Music</option>
                    <option value="YouTube">YouTube</option>
                    <option value="YouTube Channel">Canal de YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="SoundCloud">SoundCloud</option>
                    <option value="Bandcamp">Bandcamp</option>
                    <option value="X / Twitter">X / Twitter</option>
                  </select>

                  <input
                    type="url"
                    placeholder="URL de la plataforma (https://...)"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />

                  <input
                    type="text"
                    placeholder="Etiqueta opcional"
                    value={newSocial.label}
                    onChange={(e) => setNewSocial({ ...newSocial, label: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />

                  <button
                    type="button"
                    onClick={handleAddSocial}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold"
                  >
                    + Añadir Enlace
                  </button>
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-neutral-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-colors"
                >
                  Guardar Cambios de Perfil
                </button>
              </div>

            </div>
          </form>
        )}

        {/* PESTAÑA 2: Muestras de Música */}
        {activeTab === 'TRACKS' && (
          <div className="space-y-6">
            <form onSubmit={handleAddTrack} className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  <span>Publicar Nueva Muestra o Lanzamiento</span>
                </h2>
                {trackSuccess && <span className="text-xs text-emerald-400 font-medium">✓ ¡Muestra Publicada!</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Título de la Canción *</label>
                  <input
                    type="text"
                    required
                    placeholder="Título de la pista"
                    value={trackForm.title}
                    onChange={(e) => setTrackForm({ ...trackForm, title: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Género</label>
                  <input
                    type="text"
                    placeholder="ej. Ambient / Synthwave"
                    value={trackForm.genre}
                    onChange={(e) => setTrackForm({ ...trackForm, genre: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Duración</label>
                  <input
                    type="text"
                    placeholder="ej. 3:45"
                    value={trackForm.duration}
                    onChange={(e) => setTrackForm({ ...trackForm, duration: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">URL del Archivo de Audio (MP3) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://... enlace de audio"
                  value={trackForm.audioUrl}
                  onChange={(e) => setTrackForm({ ...trackForm, audioUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Enlace a Spotify</label>
                  <input
                    type="url"
                    placeholder="https://open.spotify.com/..."
                    value={trackForm.spotifyUrl}
                    onChange={(e) => setTrackForm({ ...trackForm, spotifyUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Enlace a Apple Music</label>
                  <input
                    type="url"
                    placeholder="https://music.apple.com/..."
                    value={trackForm.appleUrl}
                    onChange={(e) => setTrackForm({ ...trackForm, appleUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Publicar Canción
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PESTAÑA 3: Publicaciones */}
        {activeTab === 'POSTS' && (
          <div className="space-y-6">
            <form onSubmit={handleAddPost} className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>Publicar Novedad o Actualización</span>
                </h2>
                {postSuccess && <span className="text-xs text-emerald-400 font-medium">✓ ¡Publicación Compartida!</span>}
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">Título de la Publicación *</label>
                <input
                  type="text"
                  required
                  placeholder="Título del anuncio o nota"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">Contenido de la Publicación *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Comparte novedades con la comunidad y el colectivo..."
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Etiquetas (separadas por coma)</label>
                  <input
                    type="text"
                    placeholder="ej. Estudio, Lanzamiento, Sesión"
                    value={postForm.tags}
                    onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">Imagen o Arte (URL)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={postForm.mediaUrl}
                    onChange={(e) => setPostForm({ ...postForm, mediaUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Publicar Novedad
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
