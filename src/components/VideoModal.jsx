import React from 'react';
import { SocialIcon } from './SocialIcon';
import { X, ExternalLink } from 'lucide-react';

export const VideoModal = ({ videoUrl, videoTitle, onClose }) => {
  if (!videoUrl) return null;

  // Convert standard YouTube URLs to embed URLs
  const getEmbedUrl = (url) => {
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const id = url.split('watch?v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
    } catch (e) {
      console.error('Error parsing video URL', e);
    }
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-2xl animate-in fade-in duration-200">

      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <SocialIcon platform="YouTube" className="w-5 h-5" />
            <span className="truncate">{videoTitle || 'CMD Lab Video Drop'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video iFrame Container */}
        <div className="relative w-full aspect-video bg-black">
          {embedUrl.includes('youtube.com') ? (
            <iframe
              src={embedUrl}
              title={videoTitle || 'YouTube Video'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-3 p-6 text-center">
              <p className="text-sm text-neutral-300">Open external video channel:</p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
