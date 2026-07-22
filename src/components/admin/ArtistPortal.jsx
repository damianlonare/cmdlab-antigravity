import React, { useState, useEffect } from 'react';
import { useGraphQL } from '../../graphql/GraphQLContext';
import { UserCheck, Music, FileText, Plus, Trash2, Check, Disc, ExternalLink, Globe } from 'lucide-react';


export const ArtistPortal = () => {
  const { session, artists, executeMutation } = useGraphQL();
  const activeArtist = artists.find(a => a.id === session.artistId) || artists[0];

  const [activeTab, setActiveTab] = useState('PROFILE'); // 'PROFILE', 'TRACKS', 'POSTS'

  // Profile Form State
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

  // New Track Form State
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

  // New Post Form State
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    tags: '',
    mediaUrl: ''
  });
  const [postSuccess, setPostSuccess] = useState(false);

  // New Social Link item state
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
        
        {/* Banner */}
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
                <span className="text-xs text-cyan-400 font-mono">@{activeArtist.handle}</span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Artist Self-Service Portal • {activeArtist.role}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
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
              <span>Edit Profile & Socials</span>
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
              <span>Tracks ({activeArtist.tracks?.length || 0})</span>
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
              <span>Posts ({activeArtist.posts?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Profile & Socials */}
        {activeTab === 'PROFILE' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h2 className="text-lg font-bold text-white">Artist Profile & Social Media Manager</h2>
                {profileSaved && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Artist Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Handle / Username</label>
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
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Role / Tagline</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Genres (comma separated)</label>
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
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={profileForm.coverImage}
                    onChange={(e) => setProfileForm({ ...profileForm, coverImage: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Artist Bio</label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white text-xs leading-relaxed"
                />
              </div>

              {/* Social Media Links Manager */}
              <div className="pt-4 border-t border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Social Media & Streaming Platforms</h3>
                
                {/* List of current social links */}
                <div className="space-y-2">
                  {profileForm.socialLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400 font-mono">{link.platform}:</span>
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

                {/* Add Social Link controls */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <select
                    value={newSocial.platform}
                    onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="Spotify">Spotify</option>
                    <option value="Apple Music">Apple Music</option>
                    <option value="YouTube">YouTube</option>
                    <option value="YouTube Channel">YouTube Channel</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="SoundCloud">SoundCloud</option>
                    <option value="Bandcamp">Bandcamp</option>
                    <option value="X / Twitter">X / Twitter</option>
                  </select>

                  <input
                    type="url"
                    placeholder="Platform URL (https://...)"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />

                  <input
                    type="text"
                    placeholder="Label (optional)"
                    value={newSocial.label}
                    onChange={(e) => setNewSocial({ ...newSocial, label: e.target.value })}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />

                  <button
                    type="button"
                    onClick={handleAddSocial}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold"
                  >
                    + Add Link
                  </button>
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-neutral-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>

            </div>
          </form>
        )}

        {/* TAB 2: Publish Tracks */}
        {activeTab === 'TRACKS' && (
          <div className="space-y-6">
            <form onSubmit={handleAddTrack} className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  <span>Publish New Track / Release</span>
                </h2>
                {trackSuccess && <span className="text-xs text-emerald-400 font-mono">✓ Track Released!</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Track Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Track Title"
                    value={trackForm.title}
                    onChange={(e) => setTrackForm({ ...trackForm, title: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Genre</label>
                  <input
                    type="text"
                    placeholder="e.g. Ambient / Synthwave"
                    value={trackForm.genre}
                    onChange={(e) => setTrackForm({ ...trackForm, genre: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 3:45"
                    value={trackForm.duration}
                    onChange={(e) => setTrackForm({ ...trackForm, duration: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Audio MP3 URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://... audio preview stream"
                  value={trackForm.audioUrl}
                  onChange={(e) => setTrackForm({ ...trackForm, audioUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Spotify Release Link</label>
                  <input
                    type="url"
                    placeholder="https://open.spotify.com/..."
                    value={trackForm.spotifyUrl}
                    onChange={(e) => setTrackForm({ ...trackForm, spotifyUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Apple Music Link</label>
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
                  Publish Track
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Publish Posts */}
        {activeTab === 'POSTS' && (
          <div className="space-y-6">
            <form onSubmit={handleAddPost} className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>Create Artist Update / Post</span>
                </h2>
                {postSuccess && <span className="text-xs text-emerald-400 font-mono">✓ Post Published!</span>}
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Post Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Title of post or announcement"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Post Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share updates with the collective..."
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Studio, Drop, Session"
                    value={postForm.tags}
                    onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Media / Artwork URL</label>
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
                  Publish Update
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
