export type UserRole = 'TOURIST' | 'GUIDE' | 'ADMIN';

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  bio: string;
  city: string;
  createdAt: string;
}

export interface GuideProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  languages: string[];
  serviceAreas: string[];
  startingPrice: number;
  completedTours: number;
  availability: string;
  bio: string;
  verificationStatus: VerificationStatus;
  verificationBadges: string[];
  expectedPricing: string;
  emergencyContact?: string;
  cancellationPolicy: string;
  responseRate: string;
}

export interface GuideVerification {
  id: string;
  guideId: string;
  fullName: string;
  age: number;
  city: string;
  languages: string[];
  areasKnown: string[];
  experienceYears: number;
  interests: string[];
  idDocName: string;
  whyChooseMe: string;
  expectedPricePerDay: number;
  emergencyContact: string;
  submittedAt: string;
  status: VerificationStatus;
  adminNotes?: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  image: string;
  tagline: string;
  popularCount: number;
  description: string;
  topAttractions: string[];
}

export interface Place {
  id: string;
  destinationId: string;
  destinationName: string;
  name: string;
  category: 'Heritage' | 'Food' | 'Nature' | 'Culture' | 'Shopping' | 'Temple';
  rating: number;
  priceLevel: 'Free' | 'Budget' | 'Moderate' | 'Premium';
  address: string;
  image: string;
  description: string;
  estimatedFairCost: string;
}

export interface ItineraryStep {
  id: string;
  time: string;
  title: string;
  description: string;
  location?: string;
  estimatedCost?: number;
  category?: string;
}

export interface CostBreakdown {
  transport: number;
  hotel: number;
  food: number;
  guide: number;
  other: number;
  estimatedTotal: number;
}

export interface Tour {
  id: string;
  guideId: string;
  guideName: string;
  guideAvatar: string;
  guideRating: number;
  title: string;
  destination: string;
  description: string;
  durationHours: number;
  durationDays?: number;
  isMultiDay: boolean;
  maxTravelers: number;
  pricePerPerson: number;
  meetingPoint: string;
  itinerary: ItineraryStep[];
  includes: string[];
  excludes: string[];
  costBreakdown?: CostBreakdown;
  image: string;
  cancellationPolicy: string;
}

export interface GuideRequest {
  id: string;
  touristId: string;
  touristName: string;
  touristAvatar: string;
  destination: string;
  date: string;
  travelersCount: number;
  durationHours: number;
  interests: string[];
  language: string;
  budget: number;
  specialRequirements: string;
  status: 'OPEN' | 'BIDDED' | 'ACCEPTED' | 'CLOSED';
  createdAt: string;
}

export interface TourOffer {
  id: string;
  requestId: string;
  guideId: string;
  guideName: string;
  guideAvatar: string;
  guideRating: number;
  guideExperience: number;
  price: number;
  durationHours: number;
  includedServices: string[];
  excludedServices: string[];
  tourTitle: string;
  pitch: string;
  highlights: string[];
  badgeLabel?: 'Best Match' | 'Best Value' | 'Most Experienced' | 'Lowest Price';
  cancellationPolicy: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface Booking {
  id: string;
  touristId: string;
  touristName: string;
  guideId?: string;
  guideName?: string;
  guideAvatar?: string;
  tourId?: string;
  title: string;
  destination: string;
  date: string;
  time: string;
  travelersCount: number;
  totalPrice: number;
  platformFee: number;
  guideEarnings: number;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  bookingStatus: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  meetingPoint: string;
  createdAt: string;
  isReviewed?: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  touristId: string;
  touristName: string;
  touristAvatar: string;
  guideId: string;
  tourId?: string;
  overallRating: number;
  knowledgeRating: number;
  behaviourRating: number;
  punctualityRating: number;
  communicationRating: number;
  valueRating: number;
  comment: string;
  wouldRecommend: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  guideId: string;
  guideName: string;
  reason: 'Misleading price' | 'Unsafe behaviour' | 'No-show' | 'Misrepresentation' | 'Harassment' | 'Other';
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface FairPriceRule {
  id: string;
  destination: string;
  category: 'AUTO_TAXI' | 'GUIDE_HERITAGE' | 'STREET_FOOD' | 'ENTRY_TICKET' | 'INTERCITY_CAB';
  routeOrItem: string;
  priceRangeMin: number;
  priceRangeMax: number;
  unit: string;
  trustedSource: string;
  lastUpdated: string;
}

export interface LocalQuestion {
  id: string;
  touristName: string;
  touristAvatar: string;
  destination: string;
  question: string;
  createdAt: string;
  likes: number;
  answersCount: number;
}

export interface LocalAnswer {
  id: string;
  questionId: string;
  responderName: string;
  responderAvatar: string;
  isVerifiedLocal: boolean;
  answer: string;
  helpfulVotes: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  roleTarget: UserRole;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface GeneratedItineraryDay {
  dayNumber: number;
  title: string;
  activities: {
    time: string;
    title: string;
    description: string;
    placeName?: string;
    cost: number;
    category: 'Guide' | 'Transport' | 'Food' | 'Activity' | 'Stay';
  }[];
}

export interface GeneratedItineraryPlan {
  destination: string;
  durationDays: number;
  travelersCount: number;
  budgetAllocated: number;
  totalEstimatedCost: number;
  budgetRemaining: number;
  recommendedGuides: GuideProfile[];
  recommendedTours: Tour[];
  days: GeneratedItineraryDay[];
  costBreakdown: {
    transport: number;
    guide: number;
    food: number;
    activities: number;
    stay: number;
  };
  warnings: string[];
}
