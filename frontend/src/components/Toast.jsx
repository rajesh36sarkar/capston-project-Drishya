import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose }) => {
  
  // Automatically clear the alert toast after 3.5 seconds
  useEffect(() => {
    const tracker = setTimeout(onClose, 3500);
    return () => clearTimeout(tracker);
  }, [onClose]);

  // Map out simple border matching style properties
  const configuration = {
    success: { icon: <FaCheckCircle className="text-emerald-500" />, border: 'border-emerald-500/20' },
    error: { icon: <FaExclamationCircle className="text-rose-500" />, border: 'border-rose-500/20' },
    info: { icon: <FaInfoCircle className="text-blue-500" />, border: 'border-blue-500/20' }
  };

  return (
    <motion.div
      initial={{ x: 60, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 60, opacity: 0, scale: 0.95 }}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3.5 px-4 py-3.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border ${configuration[type].border} rounded-2xl shadow-xl max-w-sm text-xs font-semibold text-[var(--text-primary)]`}
    >
      <span className="text-base flex-shrink-0">
        {configuration[type].icon}
      </span>
      <span className="leading-normal">
        {message}
      </span>
    </motion.div>
  );
};

export default Toast;