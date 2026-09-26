import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const generateToken = (id, role, phone) => {
  return jwt.sign(
    { id, role, phone },
    process.env.JWT_SECRET || 'raahi_jwt_secret_token_key_2026_super_secure',
    { expiresIn: '7d' }
  );
};

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    return res.status(200).json({
      success: true,
      message: 'Demo OTP sent successfully',
      demoCode: '123456',
      phone: phone || '+91 9876543210'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone = '+91 9876543210', code, role = 'tourist', name } = req.body;

    if (code !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Use demo code 123456' });
    }

    let user;
    if (isDbConnected()) {
      try {
        user = await User.findOne({ phone });
        if (!user) {
          user = await User.create({
            phone,
            name: name || (role === 'guide' ? 'Vikram Singh Rathore' : 'Smart Traveler'),
            role,
            verified: true,
            verificationStatus: 'Verified'
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB User find/create fallback:', dbErr.message);
      }
    }

    if (!user) {
      user = {
        _id: `usr_${Date.now()}`,
        id: `usr_${Date.now()}`,
        phone,
        name: name || (role === 'guide' ? 'Vikram Singh Rathore' : 'Smart Traveler'),
        role,
        verified: true,
        verificationStatus: 'Verified',
        createdAt: new Date().toISOString()
      };
    }

    const token = generateToken(user._id || user.id, user.role, user.phone);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id ? user._id.toString() : user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          verified: user.verified,
          city: user.city,
          languages: user.languages,
          specialties: user.specialties,
          bio: user.bio,
          hourlyRate: user.hourlyRate,
          verificationStatus: user.verificationStatus,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, phone = '+91 9876543210', password = 'password123', role = 'tourist', city, languages, specialties } = req.body;

    let user;
    if (isDbConnected()) {
      try {
        const existing = await User.findOne({ $or: [{ phone }, ...(email ? [{ email }] : [])] });
        if (existing) {
          return res.status(400).json({ success: false, message: 'User already exists with this phone or email' });
        }
        user = await User.create({
          name: name || 'Smart Traveler',
          email,
          phone,
          password,
          role,
          city: city || 'Jaipur',
          languages: languages || ['English', 'Hindi'],
          specialties: specialties || ['Heritage'],
          verified: true
        });
      } catch (err) {
        console.warn('MongoDB register fallback:', err.message);
      }
    }

    if (!user) {
      user = {
        _id: `usr_${Date.now()}`,
        id: `usr_${Date.now()}`,
        name: name || 'Smart Traveler',
        email,
        phone,
        role,
        city: city || 'Jaipur',
        verified: true,
        createdAt: new Date().toISOString()
      };
    }

    const token = generateToken(user._id || user.id, user.role, user.phone);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id ? user._id.toString() : user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          city: user.city,
          verified: user.verified
        },
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    let user;
    if (isDbConnected()) {
      try {
        const query = phone ? { phone } : (email ? { email } : null);
        if (query) {
          user = await User.findOne(query).select('+password');
          if (user && password && user.comparePassword) {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
              return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
          }
        }
      } catch (err) {
        console.warn('MongoDB login fallback:', err.message);
      }
    }

    if (!user) {
      user = {
        _id: `usr_demo_${Date.now()}`,
        id: `usr_demo_${Date.now()}`,
        name: 'Smart Traveler',
        phone: phone || '+91 9876543210',
        email: email || 'traveler@raahi.in',
        role: 'tourist',
        verified: true,
        createdAt: new Date().toISOString()
      };
    }

    const token = generateToken(user._id || user.id, user.role, user.phone);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id ? user._id.toString() : user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          verified: user.verified
        },
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const updates = req.body;

    let updatedUser;
    if (isDbConnected()) {
      try {
        updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
      } catch (err) {
        console.warn('MongoDB updateProfile fallback:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser || { ...req.user, ...updates }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
