import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  thumbnailUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  description: { type: String, default: '', trim: true },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true, index: true },
  views: { type: Number, default: 0, min: 0 },
  likes: { type: Number, default: 0, min: 0 },
  dislikes: { type: Number, default: 0, min: 0 },
  category: { type: String, default: 'General', index: true },
  uploadDate: { type: Date, default: Date.now }
}, { versionKey: false });

export default mongoose.model('Video', videoSchema);