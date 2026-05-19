import React from 'react';
import { motion } from 'framer-motion';

const PremiumBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)] pointer-events-none select-none">
      
      {/* Dynamic floating gradient ambient background shapes */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full filter blur-[120px]"
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 dark:bg-pink-600/10 rounded-full filter blur-[120px]"
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      {/* Subtle pixel tech-grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0v40h40V0zM1 1h38v38H1V1z' fill='%23FFFFFF' fill-rule='evenodd' fill-opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
    </div>
  );
};

export default PremiumBackground;