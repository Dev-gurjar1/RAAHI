import mongoose from 'mongoose';

const guideSchema = new mongoose.Schema({
  guideId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.9
  },
  reviewCount: {
    type: Number,
    default: 100
  },
  languages: {
    type: [String],
    default: ['Hindi', 'English']
  },
  experience: {
    type: String,
    default: '5 Years'
  },
  guideType: {
    type: String,
    enum: ['PROFESSIONAL_GUIDE', 'LOCAL_HOST', 'STUDENT_LOCAL'],
    default: 'PROFESSIONAL_GUIDE'
  },
  pricingType: {
    type: String,
    enum: ['HOURLY', 'PER_PERSON', 'PER_GROUP', 'FIXED_TRIP', 'CUSTOM'],
    default: 'HOURLY'
  },
  startingPrice: {
    type: Number,
    default: 300
  },
  hourlyRate: {
    type: Number,
    default: 350
  },
  pricePerPerson: {
    type: Number,
    default: 400
  },
  pricePerGroup: {
    type: Number,
    default: 1200
  },
  fixedTripPrice: {
    type: Number,
    default: 1400
  },
  fixedTripDuration: {
    type: Number,
    default: 4
  },
  customPricingDescription: {
    type: String,
    default: ''
  },
  specialties: {
    type: [String],
    default: []
  },
  distanceKm: {
    type: Number,
    default: 1.0
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  verified: {
    type: Boolean,
    default: true
  },
  online: {
    type: Boolean,
    default: true
  },
  responseTime: {
    type: String,
    default: '< 5 mins'
  },
  completedTrips: {
    type: Number,
    default: 50
  },
  city: {
    type: String,
    default: 'Jaipur'
  },
  state: {
    type: String,
    default: 'Rajasthan'
  },
  bio: {
    type: String
  }
}, {
  timestamps: true
});

export const Guide = mongoose.model('Guide', guideSchema);
