import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import FilterButtons from '../components/FilterButtons';
import VideoSkeleton from '../components/VideoSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVideo, FaPlay, FaInfoCircle, FaCompass } from 'react-icons/fa';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('search') || '');
    const category = params.get('category');
    if (category) setActiveCategory(category);
  }, [location]);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, activeCategory, searchQuery]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/videos');
      setVideos(res.data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setLoading(false);
  };

  const filterVideos = () => {
    let filtered = [...videos];
    if (activeCategory !== 'All') {
      filtered = filtered.filter(v => v.category === activeCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredVideos(filtered);
  };

  const spotlightVideo = videos.length > 0 ? videos[0] : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {!loading && spotlightVideo && !searchQuery && activeCategory === 'All' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full rounded-3xl overflow-hidden aspect-[21/9] min-h-[300px] shadow-2xl border border-gray-200/20 dark:border-zinc-800/50 bg-zinc-900"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10" />
          <img 
            src={spotlightVideo.thumbnailUrl} 
            alt="Spotlight"
            className="absolute inset-0 w-full h-full object-cover transform scale-105 filter brightness-90 animate-pulse-slow"
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-12 z-20 max-w-2xl space-y-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-md shadow-purple-600/20">
              Featured Release
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-white line-clamp-2 leading-none">
              {spotlightVideo.title}
            </h1>
            <p className="text-zinc-300 text-xs md:text-sm line-clamp-2 font-medium hidden sm:block">
              Explore premium content streams curated live. Connect directly with independent producers worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link to={`/video/${spotlightVideo._id}`} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-zinc-200 active:scale-95 transition-all shadow-lg">
                <FaPlay className="text-xs" /> Watch Stream
              </Link>
              <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-white/20 transition-all">
                <FaInfoCircle className="text-sm" /> More Details
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="sticky top-[70px] z-30 bg-[var(--bg-primary)]/80 backdrop-blur-md py-3 -mx-4 px-4 border-b border-gray-100 dark:border-zinc-900/50">
        <FilterButtons activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>
      
      <div className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {[...Array(8)].map((_, i) => (
              <VideoSkeleton key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredVideos.length > 0 ? (
              <motion.div
                key={activeCategory + searchQuery}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8"
              >
                {filteredVideos.map((video, idx) => (
                  <VideoCard key={video._id} video={video} index={idx} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center rounded-3xl bg-gray-50/50 dark:bg-zinc-900/10 border border-dashed border-gray-200 dark:border-zinc-800/60 max-w-xl mx-auto px-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-[var(--text-secondary)] mb-4 shadow-inner">
                  <FaCompass className="text-2xl text-purple-500 animate-spin-slow" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">No matches in current feed</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm">
                  We couldn't locate streams using active tag parameters. Try broadening your keywords or reset filters.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default HomePage;