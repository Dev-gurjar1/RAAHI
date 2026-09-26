import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewer: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const itineraryStopSchema = new mongoose.Schema({
  stopNumber: { type: Number, default: 1 },
  time: { type: String, default: '10:00 AM' },
  title: { type: String, required: true },
  durationMinutes: { type: Number, default: 45 },
  description: { type: String, default: '' },
  location: { type: String, default: '' }
});

const tourPackageSchema = new mongoose.Schema({
  tourId: {
    type: String,
    required: true,
    unique: true
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
  guideType: {
    type: String,
    enum: ['PROFESSIONAL_GUIDE', 'LOCAL_HOST', 'STUDENT_LOCAL', 'VERIFIED_GUIDE'],
    default: 'PROFESSIONAL_GUIDE'
  },
  guideVerified: {
    type: Boolean,
    default: true
  },
  guideRating: {
    type: Number,
    default: 4.9
  },
  guideCompletedTrips: {
    type: Number,
    default: 120
  },
  guideLanguages: {
    type: [String],
    default: ['Hindi', 'English']
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'Heritage',
      'Food',
      'Culture',
      'Photography',
      'Adventure',
      'Nature',
      'Night Tours',
      'Markets',
      'Spiritual',
      'Hidden Gems',
      'Family',
      'Budget Tours',
      'Shopping'
    ],
    default: 'Heritage'
  },
  destination: {
    type: String,
    default: 'Jaipur'
  },
  summary: {
    type: String
  },
  description: {
    type: String
  },
  duration: {
    type: String,
    default: '3 Hours'
  },
  durationUnit: {
    type: String,
    enum: ['HOURS', 'DAYS', 'BOTH'],
    default: 'HOURS'
  },
  durationHours: {
    type: Number,
    default: 3
  },
  durationDays: {
    type: Number,
    default: 1
  },
  pricingType: {
    type: String,
    enum: ['PER_PERSON', 'PER_GROUP', 'FIXED_PRICE'],
    default: 'PER_PERSON'
  },
  price: {
    type: Number,
    required: true
  },
  pricePerPerson: {
    type: Number
  },
  pricePerGroup: {
    type: Number
  },
  fixedPrice: {
    type: Number
  },
  minParticipants: {
    type: Number,
    default: 1
  },
  maxCapacity: {
    type: Number,
    default: 8
  },
  maxParticipants: {
    type: Number,
    default: 8
  },
  languages: {
    type: [String],
    default: ['English', 'Hindi']
  },
  ageSuitability: {
    type: String,
    default: 'All ages welcome'
  },
  difficultyLevel: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging'],
    default: 'Easy'
  },
  meetingPoint: {
    type: String,
    required: true
  },
  highlights: {
    type: [String],
    default: []
  },
  included: {
    type: [String],
    default: ['Verified Local Guide', 'Heritage Route Access']
  },
  excluded: {
    type: [String],
    default: ['Monument Entry Tickets', 'Personal Transport']
  },
  cancellationPolicy: {
    type: String,
    default: 'Free cancellation up to 24 hours before tour start time with 100% refund.'
  },
  safetyInfo: {
    type: String,
    default: 'Background-verified guide, SOS button integrated, no commission shopping pressure.'
  },
  availability: {
    days: {
      type: [String],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    timeSlots: {
      type: [String],
      default: ['09:00 AM', '02:30 PM']
    },
    availableDates: {
      type: [String],
      default: []
    },
    blockedDates: {
      type: [String],
      default: []
    }
  },
  availableDates: {
    type: [String],
    default: []
  },
  itinerary: [itineraryStopSchema],
  coverImage: {
    type: String
  },
  image: {
    type: String
  },
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'PAUSED', 'REJECTED', 'ARCHIVED'],
    default: 'PUBLISHED'
  },
  moderationNotes: {
    type: String,
    default: ''
  },
  bookingCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.9
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const TourPackage = mongoose.model('TourPackage', tourPackageSchema);
