import React from 'react';
import { Link } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaTrash, FaEye } from 'react-icons/fa';

const WatchLaterPage = () => {
  const { watchLater, removeFromWatchLater } = usePlaylist();

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views;
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <div className="border-b border-gray-100 dark:border-zinc-900 pb-4">
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2.5 text-[var(--text-primary)]">
          <FaClock className="text-indigo-500 text-lg" /> Saved for Later
        </h1>
      </div>

      {watchLater.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-gray-200 dark:border-zinc-800/60 rounded-3xl max-w-md mx-auto px-4">
          <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
            <FaClock className="text-xl text-indigo-400" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Queue layer clear</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-xs">Flag video objects inside browsing views to stage them in this clean playback shelf context loop.</p>
          <Link to="/" className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs rounded-xl shadow-md">Browse Content</Link>
        </motion.div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-3">
          <AnimatePresence mode="popLayout">
            {watchLater.map((video) => (
              <motion.div
                key={video._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-4 p-3 bg-gray-50/50 dark:bg-zinc-900/10 border border-gray-100 dark:border-zinc-900/60 rounded-2xl hover:bg-white dark:hover:bg-zinc-900/40 hover:border-purple-500/10 shadow-sm group transition-all duration-200"
              >
                <Link to={`/video/${video._id}`} className="flex gap-4 flex-1 min-w-0">
                  <div className="relative w-36 sm:w-44 aspect-video bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={video.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={video.title} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold text-sm text-[var(--text-primary)] line-clamp-1 group-hover:text-purple-500 transition-colors leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs font-semibold text-[var(--text-muted)] mt-1 truncate">{video.channel?.channelName || 'Independent Creator'}</p>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--text-muted)] mt-2">
                      <span className="flex items-center gap-1"><FaEye className="text-[10px]" /> {formatViews(video.views)} views</span>
                    </div>
                  </div>
                </Link>
                <button 
                  onClick={() => removeFromWatchLater(video._id)}
                  className="p-3 text-zinc-400 hover:text-rose-500 bg-gray-100 dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors flex-shrink-0"
                >
                  <FaTrash className="text-xs" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WatchLaterPage;