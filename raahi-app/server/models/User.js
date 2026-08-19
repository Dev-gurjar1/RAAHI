const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false
    },
    role: {
      type: String,
      enum: ['tourist', 'guide', 'admin'],
      default: 'tourist'
    },
    phone: {
      type: String,
      default: '+91 98765 43210'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },

    // Guide Specific Fields
    bio: {
      type: String,
      default: 'Passionate local guide showing tourists authentic heritage, secret street food spots, and hidden gems.'
    },
    hourlyRate: {
      type: Number,
      default: 450
    },
    languages: {
      type: [String],
      default: ['English', 'Hindi']
    },
    city: {
      type: String,
      default: 'Jaipur'
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isKycVerified: {
      type: Boolean,
      default: true
    },
    kycDocumentUrl: {
      type: String,
      default: 'https://raahi.app/docs/govt-id-sample.pdf'
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 48
    },
    totalToursCompleted: {
      type: Number,
      default: 112
    },

    // 2DSphere GeoJSON Location Index for Nearby Guide Radar Dispatch
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [75.8185, 26.9124] // Default Jaipur Coordinates
      }
    }
  },
  { timestamps: true }
);

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
