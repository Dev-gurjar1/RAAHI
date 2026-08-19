const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour'
    },
    bookingType: {
      type: String,
      enum: ['ON_DEMAND_HOURLY', 'CUSTOM_TOUR_PACKAGE'],
      default: 'ON_DEMAND_HOURLY'
    },
    title: {
      type: String,
      default: 'On-Demand Heritage Guide Booking'
    },
    city: {
      type: String,
      default: 'Jaipur'
    },
    meetingPoint: {
      type: String,
      default: 'Hawa Mahal Main Gate, Old City'
    },
    meetingCoordinates: {
      type: [Number], // [lng, lat]
      default: [75.8267, 26.9239]
    },
    hoursCount: {
      type: Number,
      default: 3
    },
    travelersCount: {
      type: Number,
      default: 2
    },
    totalAmount: {
      type: Number,
      required: true
    },
    platformFee: {
      type: Number,
      required: true,
      default: 100
    },
    guideEarnings: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['REQUESTED', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'REQUESTED'
    },
    startOtp: {
      type: String,
      required: true
    },
    endOtp: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING_ESCROW', 'HELD_ESCROW', 'RELEASED_TO_GUIDE', 'REFUNDED'],
      default: 'HELD_ESCROW'
    },
    startedAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
