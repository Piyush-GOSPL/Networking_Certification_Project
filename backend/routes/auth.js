const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, mobile, email, password } = req.body;
    if (!fullName || !mobile) {
      return res.status(400).json({ error: 'Full name and mobile number are required' });
    }
    let user = await User.findOne({ where: { mobile } });
    if (user) {
      // User exists, log them in
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      return res.json({ user: user.toSafeJSON(), token, message: 'Welcome back!' });
    }
    user = await User.create({
      fullName,
      mobile,
      email: email || null,
      password: password || mobile,
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(201).json({ user: user.toSafeJSON(), token, message: 'Registration successful!' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }
    const user = await User.findOne({ where: { mobile } });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is disabled' });
    }
    if (password) {
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }
    user.lastActivity = new Date();
    await user.save();
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ user: user.toSafeJSON(), token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, email, displayName, showOnLeaderboard, preferences } = req.body;
    if (fullName) req.user.fullName = fullName;
    if (email !== undefined) req.user.email = email;
    if (displayName) req.user.displayName = displayName;
    if (showOnLeaderboard !== undefined) req.user.showOnLeaderboard = showOnLeaderboard;
    if (preferences) req.user.preferences = { ...req.user.preferences, ...preferences };
    await req.user.save();
    res.json({ user: req.user.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Logout
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
