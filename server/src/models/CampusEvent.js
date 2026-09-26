import mongoose from 'mongoose';

const campusEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  campus: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'PAST', 'CANCELLED'],
    default: 'UPCOMING'
  },
  registrationUrl: {
    type: String,
    default: ''
  },
  maxAttendees: {
    type: Number,
    default: 100
  },
  registeredCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const CampusEvent = mongoose.model('CampusEvent', campusEventSchema);
