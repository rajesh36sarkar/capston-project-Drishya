import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePlaylist } from '../context/PlaylistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaThumbsUp, FaThumbsDown, FaUser, FaEdit, FaTrash, 
  FaClock, FaList, FaShare, FaCog, FaExpand, FaCompress,
  FaPlay, FaEye, FaCalendarAlt
} from 'react-icons/fa';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

const VideoPlayerPage = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const settingsRef = useRef(null);
  const playlistRef = useRef(null);
  const shareRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  
  const { user } = useAuth();
  const { addToWatchLater, playlists, addToPlaylist, addToWatchHistory } = usePlaylist();

  useKeyboardShortcuts(videoRef, () => document.getElementById('search-input')?.focus());

  useEffect(() => {
    fetchVideo();
    fetchComments();
    fetchRecommendations();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (video && video._id) {
      addToWatchHistory(video);
    }
  }, [video]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettings(false);
      if (playlistRef.current && !playlistRef.current.contains(e.target)) setShowPlaylistMenu(false);
      if (shareRef.current && !shareRef.current.contains(e.target)) setShowShareMenu(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const fetchVideo = async () => {
    try {
      const res = await axios.get('/videos');
      const found = res.data.find(v => v._id === id);
      setVideo(found);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/video/${id}`);
      setComments(res.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get('/videos');
      const otherVideos = res.data.filter(v => v._id !== id).slice(0, 8);
      setRecommendations(otherVideos);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      await axios.patch(`/videos/${id}/like`);
      setVideo(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      setLiked(true);
      if (disliked) setDisliked(false);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) return;
    try {
      await axios.patch(`/videos/${id}/dislike`);
      setDisliked(true);
      if (liked) setLiked(false);
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post('/comments', { text: newComment, videoId: id });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const updateComment = async (commentId, text) => {
    try {
      const res = await axios.put(`/comments/${commentId}`, { text });
      setComments(comments.map(c => c._id === commentId ? res.data : c));
      setEditingComment(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const changeSpeed = (newSpeed) => {
    setSpeed(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!isFullscreen) {
      videoRef.current.requestFullscreen?.() || videoRef.current.webkitRequestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const shareVideo = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link dispatched to local clipboard layer successfully!');
    setShowShareMenu(false);
  };

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  
  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views;
  };

  if (!video) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-purple-600 animate-spin" />
    </div>
  );

  return (
    <div className="w-full mx-auto xl:px-4 max-w-[1650px]">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        <div className="flex-1 w-full lg:max-w-[calc(100%-400px)]">
          <div className="relative aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.2)] group border border-zinc-900">
            <video 
              ref={videoRef}
              src={video.videoUrl} 
              controls 
              className="w-full h-full object-contain" 
              poster={video.thumbnailUrl}
              controlsList="nodownload"
            />
            
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-3 bg-black/60 backdrop-blur-md text-white rounded-xl hover:bg-black/80 transition active:scale-90"
                >
                  <FaCog className={showSettings ? 'animate-spin' : ''} />
                </button>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-xl p-3 min-w-[180px] shadow-2xl z-30"
                    >
                      <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">Speed Factor</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {speeds.map(s => (
                          <button
                            key={s}
                            onClick={() => changeSpeed(s)}
                            className={`px-1 py-1.5 rounded-lg font-bold text-xs transition ${
                              speed === s ? 'bg-purple-600 text-white shadow-md' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={toggleFullscreen}
                className="p-3 bg-black/60 backdrop-blur-md text-white rounded-xl hover:bg-black/80 transition active:scale-90"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
          
          <h1 className="text-xl md:text-2xl font-black tracking-tight mt-5 leading-tight text-[var(--text-primary)]">
            {video.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pb-5 border-b border-gray-100 dark:border-zinc-900">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                {video.channel?.channelName ? video.channel.channelName[0].toUpperCase() : 'C'}
              </div>
              <div>
                <h2 className="font-bold text-sm text-[var(--text-primary)]">{video.channel?.channelName || 'Independent Producer'}</h2>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-semibold mt-0.5">
                  <span className="flex items-center gap-1"><FaEye /> {formatViews(video.views)}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-500" />
                  <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(video.uploadDate).toLocaleDateString(undefined, {dateStyle:'medium'})}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-gray-100 dark:bg-zinc-900 rounded-xl p-1 border border-transparent dark:border-zinc-800/60 shadow-sm">
                <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 font-bold text-xs rounded-lg transition-all ${liked ? 'bg-purple-600 text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}>
                  <FaThumbsUp /> {formatViews(video.likes)}
                </button>
                <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-800 mx-1" />
                <button onClick={handleDislike} className={`flex items-center gap-2 px-4 py-2 font-bold text-xs rounded-lg transition-all ${disliked ? 'bg-rose-600 text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}>
                  <FaThumbsDown />
                </button>
              </div>
              
              <button onClick={() => addToWatchLater(video)} className="flex items-center gap-2 px-4 py-3 font-bold text-xs rounded-xl bg-gray-100 dark:bg-zinc-900 border dark:border-zinc-800/40 hover:bg-gray-200 dark:hover:bg-zinc-800 transition shadow-sm text-[var(--text-secondary)]">
                <FaClock className="text-purple-500" /> Watch Later
              </button>
              
              <div className="relative" ref={playlistRef}>
                <button onClick={() => setShowPlaylistMenu(!showPlaylistMenu)} className="flex items-center gap-2 px-4 py-3 font-bold text-xs rounded-xl bg-gray-100 dark:bg-zinc-900 border dark:border-zinc-800/40 hover:bg-gray-200 dark:hover:bg-zinc-800 transition shadow-sm text-[var(--text-secondary)]">
                  <FaList className="text-indigo-500" /> Save
                </button>
                <AnimatePresence>
                  {showPlaylistMenu && playlists?.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-1.5 shadow-2xl z-30">
                      {playlists.map(p => (
                        <button key={p.id} onClick={() => { addToPlaylist(p.id, video); setShowPlaylistMenu(false); }} className="block w-full text-left px-3 py-2 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg">
                          {p.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="relative" ref={shareRef}>
                <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center gap-2 px-4 py-3 font-bold text-xs rounded-xl bg-gray-100 dark:bg-zinc-900 border dark:border-zinc-800/40 hover:bg-gray-200 dark:hover:bg-zinc-800 transition shadow-sm text-[var(--text-secondary)]">
                  <FaShare className="text-pink-500" /> Share
                </button>
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-1.5 shadow-2xl z-30">
                      <button onClick={shareVideo} className="block w-full text-left px-3 py-2 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg">Copy Link Block</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div className="mt-5 p-4 md:p-5 bg-gray-50 dark:bg-zinc-900/40 rounded-2xl border border-gray-100 dark:border-zinc-900/60 shadow-inner">
            <p className="text-xs md:text-sm leading-relaxed text-[var(--text-secondary)] font-medium whitespace-pre-line">
              {video.description || 'No descriptive information accompanied this premium content transmission release.'}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] mb-5">
              Discussions ({comments.length})
            </h3>
            
            {user ? (
              <form onSubmit={addComment} className="mb-6 flex gap-3 items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Join the discussion thread..."
                  className="flex-1 px-5 py-3 text-xs bg-gray-100 dark:bg-zinc-900 border border-transparent focus:border-purple-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-[var(--text-primary)] placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                />
                <button type="submit" className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition">Post</button>
              </form>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 text-center mb-6">
                <p className="text-xs text-[var(--text-muted)] font-semibold">Please authenticate an active profile session to post comments.</p>
              </div>
            )}
            
            <div className="space-y-3.5">
              <AnimatePresence mode="popLayout">
                {comments.map((comment) => (
                  <motion.div key={comment._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex gap-3 p-4 bg-gray-50/60 dark:bg-zinc-900/20 border border-gray-100 dark:border-zinc-900/40 rounded-xl">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{comment.user?.username ? comment.user.username[0].toUpperCase() : 'U'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <div className="truncate">
                          <span className="font-bold text-xs text-[var(--text-primary)] mr-2">{comment.user?.username}</span>
                          <span className="text-[10px] font-semibold text-[var(--text-muted)]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        {user && user.id === comment.user?._id && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => setEditingComment(comment)} className="text-zinc-400 hover:text-purple-500 text-xs transition"><FaEdit /></button>
                            <button onClick={() => deleteComment(comment._id)} className="text-zinc-400 hover:text-rose-500 text-xs transition"><FaTrash /></button>
                          </div>
                        )}
                      </div>
                      {editingComment?._id === comment._id ? (
                        <form onSubmit={(e) => { e.preventDefault(); updateComment(comment._id, e.target.text.value); }} className="mt-2 flex gap-2">
                          <input name="text" defaultValue={comment.text} className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg outline-none" autoFocus />
                          <button type="submit" className="text-xs font-bold text-purple-500 px-2">Save</button>
                        </form>
                      ) : (
                        <p className="mt-1 text-xs md:text-sm text-[var(--text-secondary)] font-medium leading-normal">{comment.text}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-zinc-900 pt-6 lg:pt-0 lg:pl-6">
          <h3 className="text-md font-black tracking-tight mb-4 text-[var(--text-primary)]">Up Next</h3>
          <div className="flex flex-col gap-3.5">
            {recommendations.map(rec => (
              <Link to={`/video/${rec._id}`} key={rec._id} className="flex gap-3 group relative w-full items-start">
                <div className="relative w-36 aspect-[16/10] bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 border border-transparent dark:border-zinc-800">
                  <img src={rec.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={rec.title} />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FaPlay className="text-white text-[10px]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs group-hover:text-purple-500 text-[var(--text-primary)] line-clamp-2 leading-tight transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-1 truncate">{rec.channel?.channelName || 'Premium Creator'}</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">{formatViews(rec.views)} views</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoPlayerPage;