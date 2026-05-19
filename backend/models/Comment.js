import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true, index: true },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

export default mongoose.model('Comment', commentSchema);