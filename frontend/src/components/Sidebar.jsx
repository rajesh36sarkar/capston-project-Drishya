import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, FaFire, FaSubscript, FaVideo, FaHistory, FaThumbsUp,
  FaMusic, FaGamepad, FaCode, FaLaugh, FaFutbol, FaPlayCircle,
  FaList, FaRegClock
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  
  // Main core navigation pages configuration array
  const menuItems = [
    { icon: <FaHome />, label: 'Home', path: '/' },
    { icon: <FaFire />, label: 'Trending', path: '/trending' },
    { icon: <FaSubscript />, label: 'Subscriptions', path: '/subscriptions' },
    { icon: <FaVideo />, label: 'Your Videos', path: '/channel' },
    { icon: <FaHistory />, label: 'History', path: '/history' },
    { icon: <FaRegClock />, label: 'Watch Later', path: '/watch-later' },
    { icon: <FaList />, label: 'Playlists', path: '/playlists' },
    { icon: <FaThumbsUp />, label: 'Liked Videos', path: '/liked' },
  ];

  // Video categorization exploration filters matching project requirements
  const categories = [
    { icon: <FaPlayCircle />, label: 'All', category: 'All' },
    { icon: <FaMusic />, label: 'Music', category: 'Music' },
    { icon: <FaGamepad />, label: 'Gaming', category: 'Gaming' },
    { icon: <FaCode />, label: 'Coding', category: 'Coding' },
    { icon: <FaLaugh />, label: 'Comedy', category: 'Comedy' },
    { icon: <FaFutbol />, label: 'Sports', category: 'Sports' },
  ];

  // Simple active helper route check
  const isActive = (path) => location.pathname === path;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="sidebar fixed left-0 top-[70px] bottom-0 w-64 overflow-y-auto z-40 border-r border-gray-200 dark:border-zinc-800"
        >
          <div className="py-4 flex flex-col justify-between h-full">
            <div>
              {/* Primary Application Route Navigation Links List */}
              <div className="px-3 mb-4 space-y-1">
                {menuItems.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`sidebar-item flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                        active 
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' 
                          : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className={`text-lg ${active ? 'text-purple-500' : ''}`}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Decorative clean section separation line wrapper */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent my-4" />

              {/* Explore Category Filters Menu List Blocks */}
              <div className="px-3">
                <h3 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest px-4 mb-3">
                  Explore
                </h3>
                <div className="space-y-1">
                  {categories.map((item, index) => (
                    <Link
                      key={index}
                      to={`/?category=${item.category}`}
                      className="sidebar-item flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-colors group"
                    >
                      <span className="text-base text-gray-400 group-hover:text-pink-500 transition-colors">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Minimalist Footer Branding Credit Tag */}
            <div className="p-4 mt-auto border-t border-gray-100 dark:border-zinc-900 text-center">
              <div className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 space-y-0.5">
                <p>© 2026 Drishyaa TV</p>
                <p>Premium Video Platform</p>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;