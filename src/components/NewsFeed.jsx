import React, { useState } from 'react';
import { useGraphQL } from '../graphql/GraphQLContext';
import { Radio, Calendar, User, Tag, Sparkles, Send } from 'lucide-react';

export const NewsFeed = () => {
  const { artists } = useGraphQL();
  const [selectedTag, setSelectedTag] = useState('ALL');

  // Aggregate all posts across all artists
  const allPosts = artists.flatMap(artist =>
    (artist.posts || []).map(post => ({
      ...post,
      artistName: artist.name,
      artistHandle: artist.handle,
      artistAvatar: artist.avatar,
      artistRole: artist.role
    }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const allTags = ['ALL', ...new Set(allPosts.flatMap(p => p.tags || []))];

  const filteredPosts = selectedTag === 'ALL'
    ? allPosts
    : allPosts.filter(p => p.tags && p.tags.includes(selectedTag));

  return (
    <section id="feed" className="py-20 bg-neutral-950/40 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-purple-400 mb-2">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Collective Drops & Newsfeed</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Updates & Log
            </h2>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg font-bold'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Feed List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 font-mono text-sm">
            No updates posted under #{selectedTag} yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl hover:border-neutral-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Author Header */}
                  <div className="flex items-center gap-3 border-b border-neutral-800/80 pb-3">
                    <img
                      src={post.artistAvatar}
                      alt={post.artistName}
                      className="w-10 h-10 rounded-xl object-cover border border-neutral-700"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">{post.artistName}</div>
                      <div className="text-xs text-neutral-400 font-mono">
                        @{post.artistHandle} • {post.artistRole}
                      </div>
                    </div>
                  </div>

                  {/* Title & Media */}
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300">
                    {post.title}
                  </h3>

                  {post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-2xl border border-neutral-800"
                    />
                  )}

                  <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800/60 text-xs text-neutral-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {post.createdAt}
                  </span>

                  {post.tags && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-purple-400" />
                      <span>{post.tags.map(t => `#${t}`).join(' ')}</span>
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
