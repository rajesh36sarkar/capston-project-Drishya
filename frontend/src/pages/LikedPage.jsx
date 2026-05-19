import React from 'react';
import { FaThumbsUp, FaCompass } from 'react-icons/fa';

const LikedPage = () => (
  <div className="w-full flex flex-col items-center justify-center py-28 text-center border border-dashed border-gray-200 dark:border-zinc-800/60 rounded-3xl max-w-md mx-auto px-4">
    <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
      <FaThumbsUp className="text-lg text-pink-500" />
    </div>
    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Liked Material Sync</h3>
    <p className="text-xs text-[var(--text-muted)] max-w-xs">Videos you explicitly give upvotes to inside the streaming player deck will cluster automatically onto this dashboard.</p>
  </div>
);

export default LikedPage;