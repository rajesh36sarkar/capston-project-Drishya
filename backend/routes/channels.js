import express from 'express';
import Channel from '../models/Channel.js';
import Video from '../models/Video.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { channelName, description } = req.body;
    if (!channelName) {
      return res.status(400).json({ message: 'Channel descriptor identity labels are mandatory.' });
    }

    const existingChannel = await Channel.findOne({ owner: req.user.id });
    if (existingChannel) {
      return res.status(400).json({ message: 'An active distribution studio is already linked to this profile.' });
    }

    const channel = new Channel({ 
      channelName: channelName.trim(), 
      description: description?.trim() || '', 
      owner: req.user.id 
    });
    
    await channel.save();
    return res.status(201).json(channel);
  } catch (err) {
    console.error('Channel Provision Error:', err);
    return res.status(500).json({ message: 'Channel serialization state crash.' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user.id }).populate('owner', 'username email');
    if (!channel) {
      return res.status(404).json({ message: 'No registered distribution studio discovered for this profile pointer.' });
    }

    const videos = await Video.find({ channel: channel._id }).populate('channel').sort({ uploadDate: -1 });
    return res.json({ channel, videos });
  } catch (err) {
    console.error('Studio Lookup Error:', err);
    return res.status(500).json({ message: 'Server context resolution exception.' });
  }
});

router.get('/:channelId', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId).populate('owner', 'username');
    if (!channel) return res.status(404).json({ message: 'Requested channel document missing.' });

    const videos = await Video.find({ channel: channel._id }).populate('channel').sort({ uploadDate: -1 });
    return res.json({ channel, videos });
  } catch (err) {
    console.error('Channel Fetch Failure:', err);
    return res.status(500).json({ message: 'Failed to extract targeted channel record.' });
  }
});

export default router;