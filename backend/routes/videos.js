import express from 'express';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filterQuery = {};

    // Assignment strict filter and category metrics compliance hooks
    if (category && category !== 'All') {
      filterQuery.category = category;
    }
    if (search) {
      filterQuery.title = { $regex: search, $options: 'i' };
    }

    const videos = await Video.find(filterQuery)
      .populate({ path: 'channel', populate: { path: 'owner', select: 'username' } })
      .sort({ uploadDate: -1 });

    return res.json(videos);
  } catch (err) {
    console.error('Feed Engine Failure:', err);
    return res.status(500).json({ message: 'Failed to resolve content streams compilation index.' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user.id });
    if (!channel) {
      return res.status(403).json({ message: 'Operation denied. Create a channel studio profile first.' });
    }

    const { title, thumbnailUrl, videoUrl, description, category } = req.body;
    if (!title || !thumbnailUrl || !videoUrl) {
      return res.status(400).json({ message: 'Core stream payload paths are missing parameters.' });
    }

    const video = new Video({
      title: title.trim(),
      thumbnailUrl,
      videoUrl,
      description: description?.trim() || '',
      category: category || 'General',
      channel: channel._id
    });

    await video.save();
    return res.status(201).json(video);
  } catch (err) {
    console.error('Publish Route Failure:', err);
    return res.status(500).json({ message: 'Failed to preserve stream registration parameters.' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('channel');
    if (!video) return res.status(404).json({ message: 'Stream document pointer missing.' });

    if (video.channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized modification attempt intercepted.' });
    }

    const { title, description, category, thumbnailUrl } = req.body;
    video.title = title?.trim() || video.title;
    video.description = description?.trim() || video.description;
    video.category = category || video.category;
    video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;

    await video.save();
    return res.json(video);
  } catch (err) {
    console.error('Asset Modification Error:', err);
    return res.status(500).json({ message: 'Failed to apply structural parameter changes.' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('channel');
    if (!video) return res.status(404).json({ message: 'Target stream node missing.' });

    if (video.channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized asset purge attempt intercepted.' });
    }

    await video.deleteOne();
    return res.json({ success: true, message: 'Stream record permanently unlinked.' });
  } catch (err) {
    console.error('Purge Operation Failure:', err);
    return res.status(500).json({ message: 'Failed to safely uncouple video references.' });
  }
});

router.patch('/:id/like', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id, 
      { $inc: { likes: 1 } }, 
      { new: true }
    );
    if (!video) return res.status(404).json({ message: 'Video entry missing matching transaction scope.' });
    return res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to scale metrics tally.' });
  }
});

router.patch('/:id/dislike', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id, 
      { $inc: { dislikes: 1 } }, 
      { new: true }
    );
    if (!video) return res.status(404).json({ message: 'Video entry missing matching transaction scope.' });
    return res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to scale metrics tally.' });
  }
});

export default router;