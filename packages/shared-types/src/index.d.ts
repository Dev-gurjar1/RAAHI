/**
 * RAAHI — Shared Type Definitions & Data Models
 */
export type UserRole = 'tourist' | 'guide' | 'admin';
export interface User {
    id: string;
    phone: string;
    name: string;
    email?: string;
    avatar?: string;
    role: UserRole;
    verified: boolean;
    createdAt: string;
}
export interface GuideProfile {
    id: string;
    userId: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    languages: string[];
    experience: string;
    hourlyRate: number;
    specialties: string[];
    distanceKm: number;
    lat: number;
    lng: number;
    verified: boolean;
    online: boolean;
    responseTime: string;
    completedTrips: number;
    bio?: string;
}
export type BookingStatus = 'IDLE' | 'SERVICE_SELECTED' | 'LOCATION_CONFIRMED' | 'FARE_CALCULATED' | 'SEARCHING' | 'MATCHED' | 'GUIDE_EN_ROUTE' | 'GUIDE_ARRIVED' | 'OTP_PENDING' | 'TRIP_STARTED' | 'TRIP_COMPLETED' | 'CANCELLED';
export type ServiceTier = 'Express Walk' | 'Heritage Host' | 'Guide + E-Rickshaw';
export interface Booking {
    id: string;
    touristId: string;
    guideId?: string;
    serviceTier: ServiceTier;
    pickupLocation: string;
    destination?: string;
    status: BookingStatus;
    estimatedFare: number;
    finalFare?: number;
    startOtp?: string;
    etaMinutes?: number;
    createdAt: string;
    completedAt?: string;
}
export type TransportVehicleType = 'auto' | 'eRickshaw' | 'guide';
export interface FairPriceQuery {
    mode: TransportVehicleType;
    distanceKm: number;
    waitingMinutes: number;
    isNightRate: boolean;
    city?: string;
    askingPrice?: number;
}
export interface FairPriceEstimate {
    minFare: number;
    recommendedFare: number;
    maxFare: number;
    askingPrice?: number;
    potentialOvercharge?: number;
    percentageOvercharge?: number;
    warningLevel: 'none' | 'moderate' | 'severe';
    currency: string;
}
export type ScamCategory = 'Overcharging' | 'Fake Guide' | 'Fake Booking' | 'Unsafe Behavior' | 'Refused Meter';
export interface ScamReport {
    id: string;
    userId: string;
    category: ScamCategory;
    expectedFare: number;
    chargedFare: number;
    description: string;
    locationDetails: string;
    status: 'submitted' | 'under_review' | 'resolved';
    createdAt: string;
}
export interface TourPackage {
    id: string;
    guideId: string;
    guideName: string;
    title: string;
    category: 'Heritage' | 'Food' | 'Culture' | 'Shopping' | 'Photography';
    duration: string;
    price: number;
    rating: number;
    image: string;
    highlights: string[];
    included: string[];
    meetingPoint: string;
    description: string;
}
export interface ItineraryDayItem {
    time: string;
    location: string;
    duration: string;
    ticketCost: string;
    transportCost: string;
    guideTip: string;
}
export interface ItineraryPlan {
    days: number;
    style: string;
    activities: ItineraryDayItem[];
    budget: {
        guide: number;
        transport: number;
        tickets: number;
        total: number;
    };
}
export interface KycStatus {
    governmentIdVerified: boolean;
    tourismLicenseActive: boolean;
    policeClearanceApproved: boolean;
    overallStatus: 'Pending' | 'Verified' | 'Rejected';
    isDemo: boolean;
}
export declare enum SocketEvents {
    BOOKING_CREATED = "booking:created",
    BOOKING_SEARCHING = "booking:searching",
    BOOKING_MATCHED = "booking:matched",
    GUIDE_ACCEPTED = "guide:accepted",
    GUIDE_LOCATION = "guide:location",
    GUIDE_ARRIVED = "guide:arrived",
    TRIP_STARTED = "trip:started",
    TRIP_COMPLETED = "trip:completed",
    BOOKING_CANCELLED = "booking:cancelled",
    GUIDE_REQUEST = "guide:request",
    NOTIFICATION_NEW = "notification:new"
}
//# sourceMappingURL=index.d.ts.map