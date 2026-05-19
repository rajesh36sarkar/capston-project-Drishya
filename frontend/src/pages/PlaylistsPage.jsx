import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaList, FaPlus, FaTrash, FaEye, FaFolderPlus, FaTimes } from 'react-icons/fa';

const PlaylistsPage = () => {
  const { playlists, createPlaylist, deletePlaylist, removeFromPlaylist } = usePlaylist();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName, newPlaylistDesc);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreateForm(false);
    }
  };

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views;
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 dark:border-zinc-900 pb-4">
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2.5 text-[var(--text-primary)]">
          <FaList className="text-purple-500 text-lg" /> Custom Playlists
        </h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-xl text-white flex items-center gap-2 font-bold text-xs shadow-md shadow-purple-600/10 active:scale-95 transition-transform"
        >
          <FaPlus className="text-[9px]" /> New Collection
        </button>
      </div>

      <AnimatePresence>
        {showCreateForm && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            className="p-5 bg-gray-50/60 dark:bg-zinc-900/20 border border-gray-100 dark:border-zinc-800/60 rounded-2xl max-w-md"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm flex items-center gap-2"><FaFolderPlus className="text-purple-500" /> Assemble Playlist</h3>
              <button type="button" onClick={() => setShowCreateForm(false)} className="text-zinc-400 hover:text-[var(--text-primary)] transition"><FaTimes className="text-xs" /></button>
            </div>
            <form onSubmit={handleCreatePlaylist} className="space-y-3">
              <input
                type="text"
                placeholder="Collection name (e.g., Chill Beats, Tech Study)"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 text-[var(--text-primary)] font-medium"
                required
              />
              <textarea
                placeholder="Add an operational description summary (optional)..."
                value={newPlaylistDesc}
                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 text-[var(--text-primary)] font-medium"
                rows="2"
              />
              <div className="flex gap-2 pt-1">
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-lg shadow-sm">Create</button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-[var(--text-secondary)] font-bold text-xs rounded-lg">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {playlists.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-gray-200 dark:border-zinc-800/60 rounded-3xl max-w-md mx-auto px-4">
          <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
            <FaList className="text-xl text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">No custom folders created</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-xs">Organize custom media streams into segmented libraries for distinct context sessions.</p>
          <button onClick={() => setShowCreateForm(true)} className="mt-4 text-xs font-bold text-purple-500 border border-purple-500/20 px-4 py-2 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 transition">Assemble First Library</button>
        </motion.div>
      ) : (
        <div className="space-y-6 max-w-5xl">
          {playlists.map(playlist => (
            <div key={playlist.id} className="bg-gray-50/50 dark:bg-zinc-900/10 border border-gray-100 dark:border-zinc-900/40 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[var(--text-primary)] tracking-tight">{playlist.name}</h2>
                  {playlist.description && <p className="text-zinc-400 text-xs mt-1 font-medium">{playlist.description}</p>}
                  <span className="inline-block mt-2 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">{playlist.videoCount || 0} Tracks Packed</span>
                </div>
                <button onClick={() => deletePlaylist(playlist.id)} className="p-2 text-zinc-400 hover:text-rose-500 bg-gray-100 dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"><FaTrash className="text-xs" /></button>
              </div>
              
              {playlist.videos.length === 0 ? (
                <p className="text-[var(--text-muted)] text-xs font-medium py-4 text-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl bg-white/40 dark:bg-zinc-950/10">This shelf is vacant. Save items directly from the media theater window layer configuration frame panels.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <AnimatePresence mode="popLayout">
                    {playlist.videos.map(video => (
                      <motion.div key={video._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 p-2 bg-white dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-900/60 rounded-xl group transition-all">
                        <Link to={`/video/${video._id}`} className="flex gap-3 flex-1 min-w-0">
                          <img src={video.thumbnailUrl} className="w-24 aspect-video object-cover rounded-lg flex-shrink-0" alt={video.title} />
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-bold text-xs text-[var(--text-primary)] truncate group-hover:text-purple-500 transition-colors leading-snug">{video.title}</h4>
                            <p className="text-[11px] font-semibold text-[var(--text-muted)] mt-0.5 truncate">{video.channel?.channelName}</p>
                            <span className="text-[10px] font-medium text-[var(--text-muted)] mt-0.5 flex items-center gap-1"><FaEye /> {formatViews(video.views)}</span>
                          </div>
                        </Link>
                        <button onClick={() => removeFromPlaylist(playlist.id, video._id)} className="text-zinc-400 hover:text-rose-500 p-2 rounded-lg transition hover:bg-rose-50 dark:hover:bg-rose-950/10"><FaTrash className="text-[11px]" /></button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;