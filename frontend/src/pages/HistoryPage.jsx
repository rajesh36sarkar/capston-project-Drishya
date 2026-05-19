import React from 'react';
import { Link } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHistory, FaTrash, FaEye, FaCalendarAlt } from 'react-icons/fa';

const HistoryPage = () => {
  const { watchHistory, clearHistory } = usePlaylist();

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views;
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 dark:border-zinc-900 pb-4">
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2.5 text-[var(--text-primary)]">
          <FaHistory className="text-purple-500 text-lg" /> Watch History
        </h1>
        {watchHistory.length > 0 && (
          <button 
            onClick={clearHistory} 
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl transition flex items-center gap-2 active:scale-95"
          >
            <FaTrash className="text-[10px]" /> Clear All Logs
          </button>
        )}
      </div>

      {watchHistory.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-gray-200 dark:border-zinc-800/60 rounded-3xl max-w-md mx-auto px-4">
          <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
            <FaHistory className="text-xl text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Your timeline is empty</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-xs">Videos you stream will be cataloged here for continuous playback tracking.</p>
          <Link to="/" className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/10">Browse Content</Link>
        </motion.div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-3">
          <AnimatePresence mode="popLayout">
            {watchHistory.map((video, idx) => (
              <motion.div
                key={video._id + '-' + idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <Link 
                  to={`/video/${video._id}`} 
                  className="flex gap-4 p-3 bg-gray-50/50 dark:bg-zinc-900/10 border border-gray-100 dark:border-zinc-900/60 rounded-2xl hover:bg-white dark:hover:bg-zinc-900/40 hover:border-purple-500/20 shadow-sm group transition-all duration-200"
                >
                  <div className="relative w-36 sm:w-44 aspect-video bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 border border-transparent dark:border-zinc-800">
                    <img src={video.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={video.title} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold text-sm text-[var(--text-primary)] line-clamp-1 group-hover:text-purple-500 transition-colors duration-150 leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs font-semibold text-[var(--text-muted)] mt-1 truncate">{video.channel?.channelName || 'Premium Creator'}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[var(--text-muted)] mt-2">
                      <span className="flex items-center gap-1"><FaEye className="text-[10px]" /> {formatViews(video.views)}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                      <span className="flex items-center gap-1 text-purple-500 dark:text-purple-400 font-semibold"><FaCalendarAlt className="text-[10px]" /> {new Date(video.watchedAt || Date.now()).toLocaleDateString(undefined, {dateStyle: 'medium'})}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;