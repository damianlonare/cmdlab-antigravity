import React, { useState } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { CMDIsotype } from './brand/CMDIsotype';
import { CMDWordmark } from './brand/CMDWordmark';
import { Radio, Calendar, Tag } from 'lucide-react';

export const NewsFeed = () => {
  const { artists } = useGraphQL();
  const [selectedTag, setSelectedTag] = useState('TODAS');

  // Recopilar todas las publicaciones de los artistas
  const allPosts = artists.flatMap(artist =>
    (artist.posts || []).map(post => ({
      ...post,
      artistName: artist.name,
      artistHandle: artist.handle,
      artistAvatar: artist.avatar,
      artistRole: artist.role
    }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const allTags = ['TODAS', ...new Set(allPosts.flatMap(p => p.tags || []))];

  const filteredPosts = selectedTag === 'TODAS'
    ? allPosts
    : allPosts.filter(p => p.tags && p.tags.includes(selectedTag));

  return (
    <section id="feed" className="py-20 bg-neutral-950/80 border-t border-neutral-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Encabezado de la Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-pink-400 mb-2">
              <Radio className="w-4 h-4 animate-pulse text-pink-400" />
              <span>Bitácora & Drops de Calle</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Lanzamientos CMD</span>
              <CMDWordmark size="text-2xl sm:text-3xl" />
            </h2>
          </div>

          {/* Filtro por Etiquetas */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedTag === tag
                    ? 'bg-white text-neutral-950 shadow-lg border-2 border-orange-500'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Publicaciones */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 font-mono text-xs">
            No hay publicaciones bajo la etiqueta #{selectedTag} aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-xl hover:border-orange-500/50 transition-all shadow-2xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Encabezado del Autor con Insignia CMD */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.artistAvatar}
                        alt={post.artistName}
                        className="w-10 h-10 rounded-xl object-cover border border-neutral-700"
                      />
                      <div>
                        <div className="text-sm font-black text-white">{post.artistName}</div>
                        <div className="text-xs font-mono text-neutral-400">
                          @{post.artistHandle} • {post.artistRole}
                        </div>
                      </div>
                    </div>
                    <CMDIsotype className="w-5 h-5 text-neutral-600" />
                  </div>

                  {/* Título y Arte */}
                  <h3 className="text-xl font-black text-white tracking-tight">
                    {post.title}
                  </h3>

                  {post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-full h-52 object-cover rounded-2xl border border-neutral-800"
                    />
                  )}

                  <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Pie de Publicación */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5 font-bold text-orange-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.createdAt}
                  </span>

                  {post.tags && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-bold text-neutral-300">{post.tags.map(t => `#${t}`).join(' ')}</span>
                    </div>
                  )}
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
