import { useEffect } from 'react';

const useKeyboardShortcuts = (videoRef, onSearchFocus) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      const activeElementTag = document.activeElement?.tagName;
      if (
        activeElementTag === 'INPUT' || 
        activeElementTag === 'TEXTAREA' || 
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      const video = videoRef?.current;
      if (!video) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (video.paused) {
            video.play().catch(err => console.log("Play operation interrupted:", err));
          } else {
            video.pause();
          }
          break;

        case 'KeyF':
          e.preventDefault();
          if (!document.fullscreenElement) {
            video.requestFullscreen?.() || video.webkitRequestFullscreen?.();
          } else {
            document.exitFullscreen?.();
          }
          break;

        case 'KeyM':
          e.preventDefault();
          video.muted = !video.muted;
          break;

        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          break;

        case 'ArrowRight':
          e.preventDefault();
          const targetDuration = video.duration || video.currentTime;
          video.currentTime = Math.min(targetDuration, video.currentTime + 5);
          break;

        case 'Slash':
          if (onSearchFocus) {
            e.preventDefault();
            onSearchFocus();
          }
          break;

        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen?.();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [videoRef, onSearchFocus]);
};

export default useKeyboardShortcuts;