import React, { createContext, useContext, useState, useEffect } from 'react';

const PlaylistContext = createContext(null);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error('usePlaylist must be called within an explicitly initialized PlaylistProvider state hub.');
  return context;
};

export const PlaylistProvider = ({ children }) => {
  const [watchLater, setWatchLater] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    const savedWatchLater = localStorage.getItem('watchLater');
    const savedPlaylists = localStorage.getItem('playlists');
    const savedHistory = localStorage.getItem('watchHistory');
    
    try {
      if (savedWatchLater) setWatchLater(JSON.parse(savedWatchLater));
      if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
      if (savedHistory) setWatchHistory(JSON.parse(savedHistory));
    } catch (err) {
      console.error("Local storage cluster indexing recovery failure:", err);
    }
  }, []);

  const addToWatchLater = (video) => {
    if (!video?._id) return;
    setWatchLater(prev => {
      if (!prev.find(v => v._id === video._id)) {
        const newList = [video, ...prev];
        localStorage.setItem('watchLater', JSON.stringify(newList));
        return newList;
      }
      return prev;
    });
  };

  const removeFromWatchLater = (videoId) => {
    setWatchLater(prev => {
      const newList = prev.filter(v => v._id !== videoId);
      localStorage.setItem('watchLater', JSON.stringify(newList));
      return newList;
    });
  };

  const addToWatchHistory = (video) => {
    if (!video?._id) return;
    setWatchHistory(prev => {
      const filtered = prev.filter(v => v._id !== video._id);
      const newHistory = [{ ...video, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 100);
      localStorage.setItem('watchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setWatchHistory([]);
    localStorage.setItem('watchHistory', JSON.stringify([]));
  };

  const createPlaylist = (name, description = '') => {
    if (!name.trim()) return null;
    const newPlaylist = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      videos: [],
      createdAt: new Date().toISOString(),
      videoCount: 0
    };
    setPlaylists(prev => {
      const updated = [...prev, newPlaylist];
      localStorage.setItem('playlists', JSON.stringify(updated));
      return updated;
    });
    return newPlaylist;
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => {
      const updated = prev.filter(p => p.id !== playlistId);
      localStorage.setItem('playlists', JSON.stringify(updated));
      return updated;
    });
  };

  const addToPlaylist = (playlistId, video) => {
    if (!video?._id) return;
    setPlaylists(prev => {
      const updatedPlaylists = prev.map(playlist => {
        if (playlist.id === playlistId && !playlist.videos.find(v => v._id === video._id)) {
          const updatedVideos = [...playlist.videos, video];
          return {
            ...playlist,
            videos: updatedVideos,
            videoCount: updatedVideos.length
          };
        }
        return playlist;
      });
     
      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
      return updatedPlaylists;
    });
  };

  const removeFromPlaylist = (playlistId, videoId) => {
    setPlaylists(prev => {
      const updatedPlaylists = prev.map(playlist => {
        if (playlist.id === playlistId) {
          const updatedVideos = playlist.videos.filter(v => v._id !== videoId);
          return {
            ...playlist,
            videos: updatedVideos,
            videoCount: updatedVideos.length
          };
        }
        return playlist;
      });

      localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
      return updatedPlaylists;
    });
  };

  return (
    <PlaylistContext.Provider value={{
      watchLater, playlists, watchHistory,
      addToWatchLater, removeFromWatchLater, addToWatchHistory, clearHistory,
      createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};