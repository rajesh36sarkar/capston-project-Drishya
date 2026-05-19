import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, FaSearch, FaVideo, FaSignOutAlt, 
  FaBell, FaHistory, FaThumbsUp, FaSun, FaMoon, FaTimes
} from 'react-icons/fa';

const Header = ({ toggleSidebar, onSearch }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const notifyRef = useRef(null);

  // Add subtle shadow/background effect when scrolling down the page
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for outside clicks to close the dropdown menus automatically
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    setMobileSearchOpen(false); // Close mobile bar view if open
  };

  return (
    <header className={`fixed top-0 left-0 right-0 h-[70px] z-50 transition-all duration-300 border-b ${
      scrolled 
        ? 'bg-white/80 dark:bg-[#0a0a0af0] backdrop-blur-md shadow-sm border-gray-200/80 dark:border-zinc-800/80' 
        : 'bg-white/95 dark:bg-[#0a0a0a] border-gray-100 dark:border-zinc-900'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-6 h-full w-full max-w-screen-2xl mx-auto">
        
        {/* Left Side: Controls & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl hover:bg-[var(--hover-bg)] transition-all duration-200 text-[var(--text-secondary)] active:scale-95"
          >
            <FaBars className="text-lg" />
          </button>
          
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform duration-300">
              <span className="text-white font-extrabold text-lg">D</span>
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:inline-block tracking-tight">
              Drishyaa
            </span>
          </Link>
        </div>

        {/* Center Section: Desktop Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-xl mx-6">
          <div className="relative w-full group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-5 pr-12 py-2.5 bg-gray-100/80 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-4 focus:ring-purple-500/10 transition-all text-sm text-[var(--text-primary)] placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl text-gray-400 hover:text-purple-500 transition-colors"
            >
              <FaSearch className="text-sm" />
            </button>
          </div>
        </form>

        {/* Right Side: Navigation & Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button (Hidden on Desktop) */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="p-2.5 rounded-xl hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] lg:hidden"
          >
            <FaSearch className="text-base" />
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-[var(--hover-bg)] transition-all duration-200 active:scale-90"
          >
            {darkMode ? (
              <FaSun className="text-amber-500 text-base" />
            ) : (
              <FaMoon className="text-indigo-900 text-base" />
            )}
          </button>

          {/* Alerts Notification bell icon */}
          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl hover:bg-[var(--hover-bg)] transition-all text-[var(--text-secondary)] relative"
            >
              <FaBell className="text-base" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full ring-2 ring-white dark:ring-zinc-950" />
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
                    <h3 className="font-bold text-sm">Notifications</h3>
                  </div>
                  <div className="p-6 text-center text-xs text-[var(--text-muted)] font-medium">
                    No new activity alerts.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Account Menu Trigger */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-[var(--hover-bg)] transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-sm text-white font-bold text-xs">
                  {user.username ? user.username[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline text-xs font-semibold max-w-[90px] truncate">{user.username}</span>
              </button>
              
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                      <p className="font-bold text-sm text-[var(--text-primary)] truncate">{user.username}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        to="/channel"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--hover-bg)] text-xs font-medium text-[var(--text-secondary)]"
                        onClick={() => setShowMenu(false)}
                      >
                        <FaVideo className="text-purple-500 text-xs" /> My Channel
                      </Link>
                      <Link
                        to="/history"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--hover-bg)] text-xs font-medium text-[var(--text-secondary)]"
                        onClick={() => setShowMenu(false)}
                      >
                        <FaHistory className="text-indigo-500 text-xs" /> Watch History
                      </Link>
                      <Link
                        to="/liked"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--hover-bg)] text-xs font-medium text-[var(--text-secondary)]"
                        onClick={() => setShowMenu(false)}
                      >
                        <FaThumbsUp className="text-pink-500 text-xs" /> Liked Content
                      </Link>
                    </div>
                    <div className="p-1.5 border-t border-gray-100 dark:border-zinc-800">
                      <button
                        onClick={() => { logout(); setShowMenu(false); }}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold text-rose-600 transition-colors"
                      >
                        <FaSignOutAlt className="text-xs" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/auth" className="ml-1">
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs hover:opacity-95 transition-opacity shadow-md shadow-purple-500/10">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Full-screen Search Overlay for Mobile Screens */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-[#0a0a0a] z-50 p-4 flex flex-col lg:hidden"
          >
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search streams..."
                  className="w-full pl-4 pr-10 py-3 bg-gray-100 dark:bg-zinc-900 rounded-xl outline-none text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaSearch className="text-sm" />
                </button>
              </form>
              <button 
                onClick={() => setMobileSearchOpen(false)}
                className="p-3 bg-gray-100 dark:bg-zinc-900 rounded-xl hover:bg-gray-200"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;