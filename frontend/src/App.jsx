import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PlaylistProvider } from './context/PlaylistContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import ChannelPage from './pages/ChannelPage';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';

// Sub-pages
import HistoryPage from './pages/HistoryPage';
import WatchLaterPage from './pages/WatchLaterPage';
import PlaylistsPage from './pages/PlaylistsPage';
import TrendingPage from './pages/TrendingPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import LikedPage from './pages/LikedPage';

// Animated Route Shell for high-end page entry
const AnimatedRouteLayout = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="p-4 md:p-6 lg:p-8 w-full max-w-[1800px] mx-auto min-h-[calc(100vh-70px)]"
    >
      {children}
    </motion.div>
  );
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Smart responsive screen check: Automatically collapse sidebar on tablets and phones
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Set initial size correctly
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 relative overflow-x-hidden">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      
      {/* Sidebar Navigation Layer */}
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      {/* Mobile Backdrop Overlay - closes sidebar when clicking outside on mobile screens */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Workspace Layout Wrapper */}
      <main 
        className={`pt-[70px] min-h-screen transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          sidebarOpen ? 'lg:pl-64 pl-0' : 'pl-0'
        }`}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedRouteLayout><HomePage /></AnimatedRouteLayout>} />
            <Route path="/trending" element={<AnimatedRouteLayout><TrendingPage /></AnimatedRouteLayout>} />
            <Route path="/subscriptions" element={<AnimatedRouteLayout><SubscriptionsPage /></AnimatedRouteLayout>} />
            <Route path="/history" element={<AnimatedRouteLayout><PrivateRoute><HistoryPage /></PrivateRoute></AnimatedRouteLayout>} />
            <Route path="/liked" element={<AnimatedRouteLayout><PrivateRoute><LikedPage /></PrivateRoute></AnimatedRouteLayout>} />
            <Route path="/watch-later" element={<AnimatedRouteLayout><PrivateRoute><WatchLaterPage /></PrivateRoute></AnimatedRouteLayout>} />
            <Route path="/playlists" element={<AnimatedRouteLayout><PrivateRoute><PlaylistsPage /></PrivateRoute></AnimatedRouteLayout>} />
            <Route path="/auth" element={<AnimatedRouteLayout><AuthPage /></AnimatedRouteLayout>} />
            <Route path="/video/:id" element={<AnimatedRouteLayout><VideoPlayerPage /></AnimatedRouteLayout>} />
            <Route path="/channel" element={<AnimatedRouteLayout><PrivateRoute><ChannelPage /></PrivateRoute></AnimatedRouteLayout>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlaylistProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ScrollToTop />
            <AppContent />
          </BrowserRouter>
        </PlaylistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;