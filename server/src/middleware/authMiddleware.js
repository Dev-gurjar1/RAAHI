import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'raahi_jwt_secret_token_key_2026_super_secure');

      // Attach user to req without password if DB connected
      let user = null;
      if (isDbConnected() && mongoose.isValidObjectId(decoded.id)) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch (dbErr) {
          console.warn('Auth user find fallback:', dbErr.message);
        }
      }

      if (user) {
        req.user = user;
        return next();
      }

      // If user not found in DB but token valid (demo fallback)
      req.user = { id: decoded.id, _id: decoded.id, role: decoded.role || 'tourist', phone: decoded.phone };
      return next();
    } catch (error) {
      console.error('JWT auth error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this route`
      });
    }
    next();
  };
};
