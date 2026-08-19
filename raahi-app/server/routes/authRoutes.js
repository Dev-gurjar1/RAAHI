const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'raahi_jwt_secret_key_2026';

// Helper: Generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Middleware: Auth Guard
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized access: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token verification failed' });
  }
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, city, hourlyRate, languages, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'tourist',
      phone: phone || '+91 98765 43210',
      city: city || 'Jaipur',
      hourlyRate: hourlyRate ? Number(hourlyRate) : 450,
      languages: languages || ['English', 'Hindi'],
      bio: bio || 'Authentic local guide delivering verified heritage and culinary tours.',
      isKycVerified: role === 'guide' ? true : false,
      isOnline: role === 'guide' ? true : false
    });

    const token = generateToken(user);
    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({
      success: true,
      token,
      user: userObject
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({
      success: true,
      token,
      user: userObject
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

// PUT /api/auth/location - Update Guide GPS Coordinates
router.put('/location', protect, async (req, res) => {
  try {
    const { lng, lat, isOnline, isAvailable } = req.body;

    const updates = {};
    if (lng !== undefined && lat !== undefined) {
      updates.location = {
        type: 'Point',
        coordinates: [Number(lng), Number(lat)]
      };
    }
    if (isOnline !== undefined) updates.isOnline = Boolean(isOnline);
    if (isAvailable !== undefined) updates.isAvailable = Boolean(isAvailable);

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/guides/nearby - Fetch verified guides near location
router.get('/guides/nearby', async (req, res) => {
  try {
    const { lng = 75.8185, lat = 26.9124, radiusKm = 10 } = req.query;

    const guides = await User.find({
      role: 'guide',
      isKycVerified: true
    }).select('-password').limit(20);

    res.status(200).json({
      success: true,
      count: guides.length,
      guides
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = { router, protect };
