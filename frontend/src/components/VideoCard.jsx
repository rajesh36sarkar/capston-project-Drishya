import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaThumbsUp, FaPlay } from 'react-icons/fa';

/**
 * Standard content display grid block component for videos.
 * Handles display formatting metrics and features high-fidelity animation interactions.
 */
const VideoCard = ({ video }) => {
  
  // Numerical rounding converter function for streaming view metrics
  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views;
  };

  // Numerical formatting layout handler for likes evaluation count metrics
  const formatLikes = (likes) => {
    if (!likes) return '0';
    if (likes >= 1000000) return (likes / 1000000).toFixed(1) + 'M';
    if (likes >= 1000) return (likes / 1000).toFixed(1) + 'K';
    return likes;
  };

  // Clean animation variant configs for layout animations
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 25 }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      className="group flex flex-col w-full relative"
    >
      <Link to={`/video/${video._id}`} className="flex flex-col w-full h-full">
        
        {/* Thumbnail Image Wrapper Container layout card sheet element */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-900/60 shadow-sm group-hover:shadow-xl group-hover:shadow-purple-500/5 transition-all duration-300">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ease-[cubic-bezier(0.25,1,0.5,1)]"
            onError={(e) => { 
              // Fallback placeholder string url if network image request crashes
              e.target.src = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop';
            }}
          />
          
          {/* Glass Overlay Play hover interface effect button block layer */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-600/30"
            >
              <FaPlay className="text-white text-base ml-0.5" />
            </motion.div>
          </div>
          
          {/* Static design timestamp layout indicator badge pip */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/75 backdrop-blur-md rounded-md text-white font-semibold tracking-wider text-[10px] z-10">
            12:34
          </div>
        </div>
        
        {/* Video Content Details Metadata Block Section */}
        <div className="flex gap-3 pt-3 px-1">
          
          {/* Minimalist channel custom icon badge placeholder */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-[var(--text-primary)] border border-gray-100 dark:border-zinc-800 font-bold text-xs flex items-center justify-center group-hover:border-purple-500/40 transition-colors shadow-sm">
              {video.channel?.channelName ? video.channel.channelName[0].toUpperCase() : 'C'}
            </div>
          </div>

          {/* Description strings metrics alignment list items text segments */}
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="font-bold text-[var(--text-primary)] leading-snug tracking-tight text-sm line-clamp-2 group-hover:text-purple-500 transition-colors duration-200">
              {video.title}
            </h3>
            
            <p className="text-xs font-semibold text-[var(--text-muted)] mt-1 hover:text-[var(--text-primary)] transition-colors truncate">
              {video.channel?.channelName || 'Premium Creator'}
            </p>
            
            {/* View counter tally and like logs section blocks */}
            <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--text-muted)] mt-0.5">
              <span className="flex items-center gap-1">
                <FaEye className="text-[10px]" /> {formatViews(video.views)}
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-700" />
              <span className="flex items-center gap-1">
                <FaThumbsUp className="text-[10px]" /> {formatLikes(video.likes)}
              </span>
            </div>
          </div>
          
        </div>

      </Link>
    </motion.div>
  );
};

export default VideoCard;