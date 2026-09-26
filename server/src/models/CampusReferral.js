import mongoose from 'mongoose';

const campusReferralSchema = new mongoose.Schema({
  ambassadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  referralCode: {
    type: String,
    required: true,
    index: true,
    uppercase: true,
    trim: true
  },
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  studentName: {
    type: String,
    trim: true,
    default: ''
  },
  studentEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['CLICKED', 'REGISTERED', 'VERIFICATION_PENDING', 'VERIFIED'],
    default: 'CLICKED',
    index: true
  },
  ipHash: {
    type: String,
    default: ''
  },
  clickedAt: {
    type: Date,
    default: Date.now
  },
  registeredAt: {
    type: Date,
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export const CampusReferral = mongoose.model('CampusReferral', campusReferralSchema);
