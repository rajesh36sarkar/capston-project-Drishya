import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCog, FaExpand, FaCompress, FaSlidersH, FaCheck } from 'react-icons/fa';

const VideoControls = ({ videoRef }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef(null);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const qualities = ['Auto', '1080p', '720p', '480p'];

  // Handle clicking outside the menu panel to drop settings view state
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const changeSpeed = (newSpeed) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
      else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 bg-black/60 backdrop-blur-md text-white rounded-xl hover:bg-black/80 transition-all duration-200 active:scale-90 shadow-lg border border-white/5"
        >
          <FaCog className={`text-sm ${showSettings ? 'animate-spin' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-3 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 min-w-[220px] shadow-2xl space-y-4 text-white"
            >
              {/* Playback rate speed selector block */}
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2 flex items-center gap-1.5">
                  <FaSlidersH /> Playback Speed
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {speeds.map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        speed === s 
                          ? 'bg-purple-600 text-white shadow-md' 
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-zinc-900" />

              {/* Streaming layout presentation quality picker */}
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2 flex items-center gap-1.5">
                  Stream Quality
                </p>
                <div className="space-y-0.5">
                  {qualities.map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                    >
                      <span>{q}</span>
                      {quality === q && <FaCheck className="text-[9px] text-purple-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screen sizing window configuration expand toggle switch */}
      <button
        onClick={toggleFullscreen}
        className="p-3 bg-black/60 backdrop-blur-md text-white rounded-xl hover:bg-black/80 transition-all duration-200 active:scale-90 shadow-lg border border-white/5"
      >
        {isFullscreen ? <FaCompress className="text-sm" /> : <FaExpand className="text-sm" />}
      </button>
    </div>
  );
};

export default VideoControls;