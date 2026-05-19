import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All authentication fields are mandatory.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    const existingUser = await User.findOne({ 
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }] 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User identity already registered under this system.' });
    }

    const user = new User({ username: normalizedUsername, email: normalizedEmail, password });
    await user.save();

    // Assignment explicit requirement redirect validation criteria alignment
    return res.status(201).json({ 
      success: true, 
      message: 'Account initialized successfully. Please proceed to session sign in.' 
    });
  } catch (err) {
    console.error('Registration API Error:', err);
    return res.status(500).json({ message: 'Internal transaction state failure.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password credentials are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid authentication matrix parameters.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Login API Error:', err);
    return res.status(500).json({ message: 'Internal processing context crash.' });
  }
});

export default router;