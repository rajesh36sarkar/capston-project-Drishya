import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaUsers, FaVideo, FaUpload, FaSpinner, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const ChannelPage = () => {
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({ channelName: '', description: '' });
  const [videoData, setVideoData] = useState({ 
    title: '', 
    thumbnailUrl: '', 
    videoUrl: '', 
    description: '', 
    category: 'General' 
  });

  useEffect(() => {
    fetchChannel();
  }, [user]);

  useEffect(() => {
    if (showVideoForm || editingVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showVideoForm, editingVideo]);

  const fetchChannel = async () => {
    try {
      const res = await axios.get('/channels/me');
      setChannel(res.data.channel);
      setVideos(res.data.videos || []);
    } catch (err) {
      if (err.response?.status === 404) setShowCreateForm(true);
    }
  };

  const createChannel = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/channels', formData);
      setChannel(res.data);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file format extension package.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      alert('File payload boundaries exceed maximum server allocations (100MB max limit).');
      return;
    }

    const payload = new FormData();
    payload.append('video', file);
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const res = await axios.post('/upload-video', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      setVideoData(prev => ({ 
        ...prev, 
        videoUrl: res.data.videoUrl,
        thumbnailUrl: res.data.thumbnailUrl || prev.thumbnailUrl
      }));
    } catch (error) {
      console.error('Upload operation exception:', error);
      alert('File staging disruption error bounds check: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const addVideo = async (e) => {
    e.preventDefault();
    if (!videoData.videoUrl) {
      alert('Please sync or complete an active video file transit upload pipeline structure first.');
      return;
    }
    try {
      const res = await axios.post('/videos', videoData);
      setVideos([res.data, ...videos]);
      setShowVideoForm(false);
      setVideoData({ title: '', thumbnailUrl: '', videoUrl: '', description: '', category: 'General' });
    } catch (error) {
      console.error('Data appending anomaly:', error);
    }
  };

  const updateVideo = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/videos/${editingVideo._id}`, videoData);
      setVideos(videos.map(v => v._id === editingVideo._id ? res.data : v));
      setEditingVideo(null);
      setVideoData({ title: '', thumbnailUrl: '', videoUrl: '', description: '', category: 'General' });
    } catch (error) {
      console.error('Update patch failure parameters:', error);
    }
  };

  const deleteVideo = async (videoId) => {
    if (window.confirm('Are you strictly certain you wish to discard this stream component asset record permanently?')) {
      try {
        await axios.delete(`/videos/${videoId}`);
        setVideos(videos.filter(v => v._id !== videoId));
      } catch (error) {
        console.error('Deletion operation failure:', error);
      }
    }
  };

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views;
  };

  if (showCreateForm) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 w-full">
        <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-xl text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4"><FaVideo /></div>
          <h2 className="text-xl font-black text-[var(--text-primary)]">Initialize Creator Studio</h2>
          <p className="text-xs font-semibold text-[var(--text-muted)] mt-1.5 max-w-xs mx-auto">Configure a distribution identity moniker channel before launching live public data streams.</p>
          <form onSubmit={createChannel} className="space-y-3.5 mt-6">
            <input type="text" placeholder="Channel Studio Identity Name" value={formData.channelName} onChange={(e) => setFormData({ ...formData, channelName: e.target.value })} className="w-full px-4 py-3 text-xs md:text-sm bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 text-[var(--text-primary)] font-medium placeholder:text-zinc-400" required />
            <textarea placeholder="Broad descriptive parameters regarding target formats..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 text-xs md:text-sm bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 text-[var(--text-primary)] font-medium placeholder:text-zinc-400" rows="3" />
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-bold text-xs rounded-xl shadow-md transition hover:opacity-95">Establish Studio</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-12">
      {channel && (
        <>
          <div className="relative h-44 md:h-56 rounded-3xl overflow-hidden bg-zinc-900 border border-gray-200/10 dark:border-zinc-800/60 shadow-md">
            {channel.channelBanner ? (
              <img src={channel.channelBanner} className="w-full h-full object-cover" alt="Banner background track" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-zinc-900 to-pink-900/40 opacity-75" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 back via-indigo-600 to-pink-600 flex items-center justify-center text-2xl md:text-3xl font-black text-white shadow-lg ring-4 ring-black/40">
                  {channel.channelName ? channel.channelName[0].toUpperCase() : 'C'}
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">{channel.channelName}</h1>
                  <p className="text-zinc-300 font-semibold text-xs flex items-center gap-1.5 mt-0.5"><FaUsers className="text-purple-400 text-xs" /> {formatViews(channel.subscribers)} audience subscribers</p>
                </div>
              </div>
              <button onClick={() => { setVideoData({ title: '', thumbnailUrl: '', videoUrl: '', description: '', category: 'General' }); setShowVideoForm(true); }} className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 shadow-xl transition-all self-start sm:self-center">
                <FaPlus className="text-[10px]" /> Stream Upload
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-zinc-900/20 border border-gray-100 dark:border-zinc-900/50 rounded-2xl">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-[var(--text-muted)] mb-1">About Stream House</h2>
            <p className="text-xs md:text-sm font-medium leading-relaxed text-[var(--text-secondary)]">{channel.description || 'No custom bio information appended to this hub configuration.'}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)] border-b border-gray-100 dark:border-zinc-900 pb-2">Management Asset Dashboard</h2>
            {videos.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-200 dark:border-zinc-800/80 rounded-2xl max-w-md mx-auto px-4">
                <FaVideo className="text-4xl text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-sm font-bold text-[var(--text-primary)]">Asset registry clear</p>
                <p className="text-xs font-semibold text-[var(--text-muted)] max-w-xs mx-auto mt-0.5">No video records matching this account are synchronized across clusters yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {videos.map((video) => (
                  <div key={video._id} className="group bg-gray-50/50 dark:bg-zinc-900/20 border border-gray-100 dark:border-zinc-900 rounded-2xl overflow-hidden flex flex-col relative shadow-sm">
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-800 border-b border-gray-100 dark:border-zinc-900">
                      <img src={video.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="card preview asset" />
                      
                      <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-20">
                        <button onClick={() => { setEditingVideo(video); setVideoData(video); }} className="p-2 bg-black/70 backdrop-blur-md rounded-xl hover:bg-purple-600 transition text-white text-xs"><FaEdit /></button>
                        <button onClick={() => deleteVideo(video._id)} className="p-2 bg-black/70 backdrop-blur-md rounded-xl hover:bg-rose-600 transition text-white text-xs"><FaTrash /></button>
                      </div>
                    </div>
                    <div className="p-3.5 flex flex-col flex-1">
                      <h3 className="font-bold text-xs md:text-sm text-[var(--text-primary)] line-clamp-1 group-hover:text-purple-500 transition-colors">{video.title}</h3>
                      <p className="text-[11px] font-semibold text-[var(--text-muted)] mt-1">{formatViews(video.views)} system views</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {(showVideoForm || editingVideo) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowVideoForm(false); setEditingVideo(null); }}>
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 md:p-6 w-full max-w-md shadow-2xl relative max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              
              <button onClick={() => { setShowVideoForm(false); setEditingVideo(null); }} className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"><FaTimes /></button>
              
              <h2 className="text-lg font-black text-[var(--text-primary)] mb-4">{editingVideo ? 'Modify Active Core Stream' : 'Transit New Content Packet'}</h2>
              
              <form onSubmit={editingVideo ? updateVideo : addVideo} className="space-y-4">
                {!editingVideo && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">Target Media Source Binary</label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-4 bg-gray-50/50 dark:bg-zinc-950/40 relative group hover:border-purple-500 transition-colors">
                      <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                      <FaCloudUploadAlt className="text-3xl text-zinc-400 group-hover:scale-110 group-hover:text-purple-500 transition-all mb-1" />
                      <span className="text-[11px] font-bold text-[var(--text-secondary)]">Click or Drop Video Asset here</span>
                      <span className="text-[9px] text-[var(--text-muted)] mt-0.5">MP4, WebM (Max allocations 100M limit bounds)</span>
                    </div>

                    {uploading && (
                      <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/40">
                        <div className="flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400">
                          <span className="flex items-center gap-1.5"><FaSpinner className="animate-spin" /> Uplinking asset chunks...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}
                    {videoData.videoUrl && !uploading && <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✓ Transport handshake finalized. Storage pointers ready.</p>}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-[var(--text-muted)]">Stream Heading Label</label>
                  <input type="text" placeholder="Title matching contents description parameters..." value={videoData.title} onChange={(e) => setVideoData({ ...videoData, title: e.target.value })} className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 text-[var(--text-primary)] font-medium" required />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-[var(--text-muted)]">Thumbnail Resource Asset URL (Optional)</label>
                  <input type="text" placeholder="https://domain.cdn/path/image.jpg" value={videoData.thumbnailUrl} onChange={(e) => setVideoData({ ...videoData, thumbnailUrl: e.target.value })} className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 text-[var(--text-primary)] font-medium" />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-[var(--text-muted)]">Classification Tags Index Category</label>
                  <select value={videoData.category} onChange={(e) => setVideoData({ ...videoData, category: e.target.value })} className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 text-[var(--text-primary)] font-semibold">
                    <option>General</option>
                    <option>Music</option>
                    <option>Gaming</option>
                    <option>Coding</option>
                    <option>Comedy</option>
                    <option>Sports</option>
                    <option>Education</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-[var(--text-muted)]">Context Deck Descriptions Block</label>
                  <textarea placeholder="Detailed documentation notes appended to watch lists context panes..." value={videoData.description} onChange={(e) => setVideoData({ ...videoData, description: e.target.value })} className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-purple-500 text-[var(--text-primary)] font-medium" rows="3" />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={(!editingVideo && !videoData.videoUrl) || uploading} className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95">
                    {uploading ? 'Awaiting Upload Completeness' : (editingVideo ? 'Finalize Changes' : 'Publish to Feed')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChannelPage;