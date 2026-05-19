import React from 'react';
import { motion } from 'framer-motion';

/**
 * A reusable, interactive button component built with Framer Motion.
 * Supports primary, secondary, and outline visual variants.
 */
const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '' 
}) => {
  
  // Clean style maps matching the design system
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-lg shadow-purple-500/10 hover:opacity-95',
    secondary: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800/50',
    outline: 'border border-purple-500 text-purple-500 bg-transparent hover:bg-purple-500/10',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-colors duration-300 select-none flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {/* Premium background hover shimmer effect */}
      <motion.span
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
      />
      
      {/* Button content label */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default AnimatedButton;