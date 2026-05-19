import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelName: { type: String, required: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  description: { type: String, default: '', trim: true },
  channelBanner: { type: String, default: '' },
  subscribers: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

export default mongoose.model('Channel', channelSchema);