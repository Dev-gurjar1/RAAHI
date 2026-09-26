import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  touristId: {
    type: String
  },
  touristName: {
    type: String,
    default: 'Smart Traveler'
  },
  touristPhone: {
    type: String
  },
  bookingType: {
    type: String,
    enum: ['GUIDE_HIRE', 'TOUR_BOOKING', 'EXPERIENCE_BOOKING', 'CUSTOM_REQUEST'],
    default: 'GUIDE_HIRE'
  },
  tourId: {
    type: String
  },
  tourTitle: {
    type: String
  },
  tourHostId: {
    type: String
  },
  pricingType: {
    type: String,
    default: 'HOURLY'
  },
  priceBreakdown: {
    unitPrice: Number,
    travelersCount: Number,
    subtotal: Number,
    serviceFee: Number,
    total: Number
  },
  guideId: {
    type: String,
    required: true
  },
  guideName: {
    type: String,
    required: true
  },
  guideAvatar: {
    type: String
  },
  guideHourlyRate: {
    type: Number,
    required: true
  },
  guideSpecialties: {
    type: [String],
    default: []
  },
  serviceTier: {
    type: String,
    default: 'Express Walk'
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  durationHours: {
    type: Number,
    required: true
  },
  travelersCount: {
    type: Number,
    default: 1
  },
  specialRequirements: {
    type: String,
    default: ''
  },
  meetingPoint: {
    type: String,
    required: true
  },
  hourlySubtotal: {
    type: Number,
    required: true
  },
  serviceFee: {
    type: Number,
    default: 50
  },
  totalAmount: {
    type: Number,
    required: true
  },
  startOtp: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'SEARCHING', 'MATCHED', 'GUIDE_ARRIVED', 'TRIP_STARTED', 'TRIP_COMPLETED'],
    default: 'Pending'
  },
  etaMinutes: {
    type: Number,
    default: 4
  }
}, {
  timestamps: true
});

export const Booking = mongoose.model('Booking', bookingSchema);
