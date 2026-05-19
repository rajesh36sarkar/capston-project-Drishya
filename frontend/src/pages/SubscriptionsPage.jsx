import React from 'react';
import { FaSubscript, FaSatelliteDish } from 'react-icons/fa';

const SubscriptionsPage = () => (
  <div className="w-full flex flex-col items-center justify-center py-28 text-center border border-dashed border-gray-200 dark:border-zinc-800/60 rounded-3xl max-w-md mx-auto px-4">
    <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
      <FaSatelliteDish className="text-lg text-indigo-500 animate-pulse" />
    </div>
    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Creator Feed Ecosystem</h3>
    <p className="text-xs text-[var(--text-muted)] max-w-xs">Follow independent studio profiles around the grid networks to compile their targeted channel uploads directly here.</p>
  </div>
);

export default SubscriptionsPage;