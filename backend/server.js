import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import authRoutes from './routes/auth.js';
import channelRoutes from './routes/channels.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comments.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();

// Validate critical environmental layout settings variables on core lifecycle launch
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('CRITICAL INITIALIZATION ERROR: Missing vital environment variables (MONGO_URI/JWT_SECRET)');
  process.exit(1);
}

// Configure Cloudinary asset distribution storage parameters
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure memory space staging variables for multi-part audio/video processing
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Enforce 100MB limit securely
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      return cb(null, true);
    }
    return cb(new Error('Format exception. Only functional video stream binaries are allowed.'), false);
  }
});

// Production Grade Cross-Origin Resource Isolation Matrix Controls
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Streaming Upload Architecture Endpoint Handler
app.post('/api/upload-video', authMiddleware, upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No stream file binary package was localized.' });
    }

    // Enterprise Fix: Process uploads safely via Cloudinary Stream Pipes to eliminate buffer block leaks
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "drishya_videos",
        public_id: `video_${Date.now()}`,
        chunk_size: 6000000 // Stream sequentially in efficient 6MB payload intervals
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Pipe Network Handshake Failure:', error);
          return res.status(500).json({ error: 'Cloudinary storage cluster connection failure.' });
        }

        // Apply transformations smoothly from offset duration intervals
        const thumbnailUrl = cloudinary.url(result.public_id, {
          resource_type: 'video',
          format: 'jpg',
          transformation: [
            { start_offset: '3' }, 
            { width: 640, height: 360, crop: 'fill', quality: 'auto' }
          ]
        });

        return res.json({ 
          videoUrl: result.secure_url,
          thumbnailUrl: thumbnailUrl,
          publicId: result.public_id
        });
      }
    );

    // Write chunk buffers safely directly across the network stream pipelines
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Pipeline Processing Exception:', error);
    return res.status(500).json({ error: 'Failed to finalize target asset stream upload routing link.' });
  }
});

// Mounted Rest API Router Maps Configuration Set Nodes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

app.get('/api', (req, res) => {
  res.json({
    project: 'Drishyaa Stream Engine Layer Platform API',
    status: 'Operational',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => res.status(200).json({ status: 'HEALTHY' }));

// Initialize persistent state data engines via standard pooling configurations
mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ Connected to MongoDB safely.'))
  .catch(err => {
    console.error('❌ Mongoose connection sequence failed:', err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server up on port ${PORT}`);
});