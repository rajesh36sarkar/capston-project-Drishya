import express from 'express';
import Comment from '../models/Comment.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/video/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    return res.json(comments);
  } catch (err) {
    console.error('Comments Assembly Breakdown:', err);
    return res.status(500).json({ message: 'Failed to fetch discussion strings.' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { text, videoId } = req.body;
    if (!text || !videoId) {
      return res.status(400).json({ message: 'Discussion strings cannot transmit blank values.' });
    }

    const comment = new Comment({
      text: text.trim(), 
      user: req.user.id, 
      video: videoId
    });
    
    await comment.save();
    const populatedComment = await Comment.findById(comment._id).populate('user', 'username');
    return res.status(201).json(populatedComment);
  } catch (err) {
    console.error('Comment Injection Error:', err);
    return res.status(500).json({ message: 'Discussion insertion protocol exception.' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Discussion element non-existent.' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Operation denied. Inadequate account permissions.' });
    }

    if (!req.body.text || !req.body.text.trim()) {
      return res.status(400).json({ message: 'Text string modifications require active content.' });
    }

    comment.text = req.body.text.trim();
    await comment.save();
    return res.json(comment);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to commit text tracking modifications.' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Discussion element non-existent.' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Operation denied. Inadequate account permissions.' });
    }

    await comment.deleteOne();
    return res.json({ success: true, message: 'Discussion node completely stripped.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to extract discussion node target.' });
  }
});

export default router;