import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm z-50">
      <div className="text-center space-y-4">
        
        {/* Simple CSS-animated loading spinner circle */}
        <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-purple-600 animate-spin mx-auto shadow-inner" />
        
        {/* Pulsing loading state text underneath */}
        <motion.p 
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-xs font-black uppercase tracking-widest"
        >
          Loading Drishya...
        </motion.p>
        
      </div>
    </div>
  );
};

export default LoadingSpinner;