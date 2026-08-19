const mongoose = require('mongoose');

const ItineraryItemSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  inclusions: [String]
});

const TourSchema = new mongoose.Schema(
  {
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Tour description is required']
    },
    city: {
      type: String,
      required: true,
      default: 'Jaipur'
    },
    category: {
      type: String,
      enum: ['Heritage', 'Food & Culinary', 'Photography', 'Adventure', 'Shopping & Crafts'],
      default: 'Heritage'
    },
    durationDays: {
      type: Number,
      default: 1
    },
    durationHours: {
      type: Number,
      default: 6
    },
    pricePerPerson: {
      type: Number,
      required: true,
      default: 1500
    },
    maxGroupSize: {
      type: Number,
      default: 6
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    },
    itinerary: [ItineraryItemSchema],
    includedServices: {
      type: [String],
      default: ['Certified Local Host', 'Monument Ticket Assistance', 'Street Food Tasting', 'Bottled Mineral Water']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', TourSchema);
