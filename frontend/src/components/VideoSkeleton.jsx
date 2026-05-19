import React from 'react';

/**
 * Loading placeholder skeleton to provide visual feedback 
 * while video data streams are resolving from the API.
 */
const VideoSkeleton = () => {
  return (
    <div className="w-full flex flex-col space-y-3 pointer-events-none select-none">
      
      {/* Video thumbnail shimmer block */}
      <div className="relative aspect-video w-full rounded-2xl bg-zinc-200 dark:bg-zinc-900/60 overflow-hidden border border-zinc-100 dark:border-zinc-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-zinc-800/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      
      {/* Metadata placeholders rows */}
      <div className="flex gap-3 px-1 w-full">
        
        {/* Creator channel avatar indicator circular slot */}
        <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-900 flex-shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-zinc-800/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
        
        {/* Title and views tracking row segments */}
        <div className="flex flex-col flex-1 space-y-2 mt-1">
          <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-[85%] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-zinc-800/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-[50%] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-zinc-800/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default VideoSkeleton;