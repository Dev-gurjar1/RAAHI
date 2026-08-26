import { create } from 'zustand';

export interface TourItineraryDay {
  day: number;
  title: string;
  places: string[];
  activities: string[];
  durationHours: number;
}

export interface TourReview {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PublishedTour {
  id: string;
  guideId: string;
  guideName: string;
  guideAvatar: string;
  title: string;
  category: 'Heritage' | 'Food' | 'Culture' | 'Shopping' | 'Photography';
  destination: string;
  summary: string;
  coverImage: string;
  pricePerPerson: number;
  maxCapacity: number;
  availableDates: string[];
  itinerary: TourItineraryDay[];
  highlights: string[];
  included: string[];
  meetingPoint: string;
  rating: number;
  reviewCount: number;
  reviews: TourReview[];
  publishedAt: string;
}

const DEFAULT_TOURS: PublishedTour[] = [
  {
    id: 'tp_1',
    guideId: 'g1',
    guideName: 'Vikram Singh Rathore',
    guideAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    title: 'Amer Fort Secret Passages & Royal Heritage Walk',
    category: 'Heritage',
    destination: 'Jaipur',
    summary: 'Discover hidden tunnels, royal courtyards, and secret stepwells of Amer Fort with a certified heritage storyteller.',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
    pricePerPerson: 899,
    maxCapacity: 8,
    availableDates: ['2026-08-27', '2026-08-28', '2026-08-29', '2026-08-30'],
    itinerary: [
      {
        day: 1,
        title: 'Sun Gate & Upper Fort Secret Tunnels',
        places: ['Suraj Pol', 'Jaleb Chowk', 'Sheesh Mahal'],
        activities: ['Walk through 16th-century royal entrance', 'Explore glass mirror palace lighting demo', 'Visit secret subterranean escape tunnel'],
        durationHours: 3.5
      },
      {
        day: 2,
        title: 'Jaigarh Fort Ramparts & Cannon Foundry',
        places: ['Jaigarh Fort', 'Jaivana Cannon', 'Armory Museum'],
        activities: ['Inspect world largest cannon on wheels', 'Panoramic view over Maota Lake', 'Local Rajasthani chai break'],
        durationHours: 3.0
      }
    ],
    highlights: ['Subterranean escape tunnels', 'Sheesh Mahal private walkthrough', 'Zero pushy shopping guarantee'],
    included: ['Certified Heritage Host', 'Water bottle & royal tea', 'Fort entry guidance'],
    meetingPoint: 'Amer Fort Sun Gate Entrance',
    rating: 4.98,
    reviewCount: 42,
    reviews: [
      {
        id: 'rev_1',
        reviewer: 'Sarah Jenkins (UK)',
        rating: 5.0,
        comment: 'Unbelievable experience! Vikram took us through secret passages we would never have found on our own.',
        date: '2026-08-24'
      }
    ],
    publishedAt: new Date().toISOString()
  },
  {
    id: 'tp_2',
    guideId: 'g2',
    guideName: 'Priya Sharma',
    guideAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    title: 'Old Pink City Authentic Street Food Crawl',
    category: 'Food',
    destination: 'Jaipur',
    summary: 'Taste 100-year-old kachori recipes, rabri lassi, and royal ghewar in hidden alleys of Johari Bazaar.',
    coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    pricePerPerson: 650,
    maxCapacity: 6,
    availableDates: ['2026-08-27', '2026-08-28', '2026-08-29'],
    itinerary: [
      {
        day: 1,
        title: 'Johari Bazaar Heritage Tastings',
        places: ['Rawat Mishthan Bhandar', 'Lassiwala M.I. Road', 'Wind Palace Alley'],
        activities: ['Pyaaz kachori tasting', 'Clay-cup saffron rabri lassi', 'Traditional spices talk'],
        durationHours: 3.0
      }
    ],
    highlights: ['Hygiene-checked street food stalls', '100-year-old recipe secrets', 'Vegetarian friendly options'],
    included: ['All food tastings included', 'Mineral water', 'Local foodie guide'],
    meetingPoint: 'Hawa Mahal Front Plaza',
    rating: 4.95,
    reviewCount: 38,
    reviews: [],
    publishedAt: new Date().toISOString()
  }
];

interface TourStoreState {
  tours: PublishedTour[];
  addTour: (tour: PublishedTour) => void;
  addReviewToTour: (tourId: string, review: TourReview) => void;
  deleteTour: (tourId: string) => void;
}

const loadSavedTours = (): PublishedTour[] => {
  try {
    const saved = localStorage.getItem('raahi_published_tours');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error loading published tours:', err);
  }
  return DEFAULT_TOURS;
};

export const useTourStore = create<TourStoreState>((set) => ({
  tours: loadSavedTours(),

  addTour: (newTour) => set((state) => {
    const updated = [newTour, ...state.tours];
    localStorage.setItem('raahi_published_tours', JSON.stringify(updated));
    return { tours: updated };
  }),

  addReviewToTour: (tourId, review) => set((state) => {
    const updated = state.tours.map((t) => {
      if (t.id !== tourId) return t;
      const updatedReviews = [review, ...t.reviews];
      const newReviewCount = updatedReviews.length;
      const newRating = parseFloat(
        (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newReviewCount).toFixed(2)
      );
      return {
        ...t,
        reviews: updatedReviews,
        reviewCount: newReviewCount,
        rating: newRating
      };
    });
    localStorage.setItem('raahi_published_tours', JSON.stringify(updated));
    return { tours: updated };
  }),

  deleteTour: (tourId) => set((state) => {
    const updated = state.tours.filter((t) => t.id !== tourId);
    localStorage.setItem('raahi_published_tours', JSON.stringify(updated));
    return { tours: updated };
  })
}));
