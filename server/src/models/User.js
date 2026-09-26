import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String
  },
  name: {
    type: String,
    default: 'Smart Traveler'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  role: {
    type: String,
    enum: ['tourist', 'guide', 'admin', 'campus_ambassador', 'local_host'],
    default: 'tourist'
  },
  roles: {
    type: [String],
    default: ['tourist']
  },
  verified: {
    type: Boolean,
    default: true
  },
  city: {
    type: String,
    default: 'Jaipur'
  },
  languages: {
    type: [String],
    default: ['Hindi', 'English']
  },
  specialties: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    default: ''
  },
  hourlyRate: {
    type: Number,
    default: 450
  },
  idDocument: {
    type: String
  },
  verificationStatus: {
    type: String,
    enum: ['Pending Verification', 'Verified', 'Rejected'],
    default: 'Verified'
  },

  // Student Profile (Campus Ambassador)
  studentProfile: {
    fullName: { type: String, trim: true },
    college: { type: String, trim: true },
    campus: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    course: { type: String, trim: true },
    yearOfStudy: { type: String, trim: true },
    expectedGraduationYear: { type: String, trim: true },
    collegeEmail: { type: String, trim: true, lowercase: true },
    linkedin: { type: String, trim: true },
    instagram: { type: String, trim: true },
    portfolio: { type: String, trim: true }
  },

  // Student Verification Status & Workflow
  studentVerification: {
    status: {
      type: String,
      enum: ['NOT_STARTED', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REQUIRES_UPDATE'],
      default: 'NOT_STARTED'
    },
    method: {
      type: String,
      enum: ['college_email', 'student_id', 'institution_details'],
      default: 'student_id'
    },
    documentUrl: { type: String },
    documentName: { type: String },
    submittedAt: { type: Date },
    reviewedAt: { type: Date },
    reviewerNotes: { type: String, default: '' }
  },

  // Campus Ambassador Profile & Referral State
  campusAmbassadorProfile: {
    referralCode: { type: String, sparse: true, index: true },
    campusReach: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    ambassadorStatus: {
      type: String,
      enum: ['ACTIVE', 'PENDING', 'SUSPENDED'],
      default: 'ACTIVE'
    },
    joinedDate: { type: Date, default: Date.now },
    profileCompletionPercentage: { type: Number, default: 85 }
  },

  // Direct Referral attribution
  referralCode: { type: String, sparse: true, index: true },
  referredBy: { type: String, trim: true }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
