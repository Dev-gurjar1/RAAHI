import mongoose from 'mongoose';

const scamReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: 'usr_demo'
  },
  userName: {
    type: String
  },
  category: {
    type: String,
    enum: ['Overcharging', 'Fake Guide', 'Fake Booking', 'Unsafe Behavior', 'Refused Meter'],
    default: 'Overcharging'
  },
  expectedFare: {
    type: Number,
    required: true
  },
  chargedFare: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  locationDetails: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'resolved'],
    default: 'submitted'
  }
}, {
  timestamps: true
});

export const ScamReport = mongoose.model('ScamReport', scamReportSchema);
