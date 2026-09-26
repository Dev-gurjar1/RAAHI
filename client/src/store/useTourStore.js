import { create } from 'zustand';
import api from '../services/api.js';

export const INITIAL_FALLBACK_TOURS = [
  {
    id: 'tp_1',
    tourId: 'tp_1',
    guideId: 'g1',
    guideName: 'Vikram Singh Rathore',
    guideAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    guideType: 'PROFESSIONAL_GUIDE',
    guideVerified: true,
    guideRating: 4.95,
    guideCompletedTrips: 260,
    guideLanguages: ['Hindi', 'English'],
    title: 'Jaipur Old City Heritage Walk & Secret Passages',
    category: 'Heritage',
    destination: 'Jaipur',
    summary: 'Discover hidden tunnels, royal courtyards, and secret stepwells of the Pink City with an authorized historian.',
    description: 'Immerse yourself in Jaipur’s royal past on this immersive walking tour through UNESCO World Heritage sites. We start at the iconic Hawa Mahal before ducking into the ancient medieval alleys and private havelis seldom seen by regular tourists. Vikram uncovers royal secrets, astrological palace foundations, and secret water conservation tunnels.',
    duration: '3 Hours',
    durationHours: 3,
    pricingType: 'PER_PERSON',
    price: 699,
    pricePerPerson: 699,
    pricePerGroup: 2200,
    fixedPrice: 699,
    minParticipants: 1,
    maxCapacity: 6,
    maxParticipants: 6,
    languages: ['English', 'Hindi'],
    ageSuitability: 'All ages welcome (Easy walking)',
    difficultyLevel: 'Easy',
    meetingPoint: 'Hawa Mahal Front Plaza, Badi Choupad, Jaipur',
    highlights: ['Subterranean escape tunnels', 'Private haveli courtyards', 'Zero pushy shopping guarantee', 'Authentic Vedic astrology talk'],
    included: ['Licensed Rajasthan Heritage Guide', 'Water bottle & herbal tea', 'Audio assistance device'],
    excluded: ['Monument Entrance Tickets', 'Personal Transport', 'Gratuities'],
    cancellationPolicy: 'Free cancellation up to 24 hours before tour start for 100% refund.',
    safetyInfo: 'Licensed tourist police escort access, verified first aid, and strict anti-scam route.',
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80'
    ],
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      timeSlots: ['09:00 AM', '03:30 PM'],
      availableDates: ['2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30'],
      blockedDates: []
    },
    availableDates: ['2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30'],
    itinerary: [
      {
        stopNumber: 1,
        time: '09:00 AM',
        title: 'Meet at Hawa Mahal Plaza',
        durationMinutes: 30,
        description: 'Orientation, architectural history of the 953 jharokhas, and early morning crowd-free photos.',
        location: 'Hawa Mahal'
      },
      {
        stopNumber: 2,
        time: '09:30 AM',
        title: 'Old City Medieval Backalleys',
        durationMinutes: 45,
        description: 'Walk through residential quarters with 200-year-old wooden carved doorways and hidden stepwells.',
        location: 'Sireh Deori Bazaar'
      },
      {
        stopNumber: 3,
        time: '10:15 AM',
        title: 'Local Brass & Spice Ateliers',
        durationMinutes: 45,
        description: 'Observe multi-generational brass beaters and medicinal spice purveyors with zero purchase requirement.',
        location: 'Kishanpole Bazaar'
      },
      {
        stopNumber: 4,
        time: '11:00 AM',
        title: 'Traditional Saffron Tea & Haveli Courtyard',
        durationMinutes: 30,
        description: 'Relax in a restored family haveli courtyard with kulhad saffron chai and local almond cookies.',
        location: 'Heritage Haveli'
      },
      {
        stopNumber: 5,
        time: '11:30 AM',
        title: 'City Palace Perimeter & Tour Conclusion',
        durationMinutes: 30,
        description: 'Wrap-up briefing, directions for the afternoon, and local insider restaurant recommendations.',
        location: 'City Palace North Gate'
      }
    ],
    status: 'PUBLISHED',
    bookingCount: 42,
    rating: 4.88,
    reviewCount: 42,
    reviews: [
      {
        id: 'rev_1',
        reviewer: 'Sarah Jenkins (UK)',
        rating: 5.0,
        comment: 'Unbelievable experience! Vikram took us through secret passages we would never have found on our own without any shopping harassment.',
        date: '2026-08-24'
      }
    ],
    publishedAt: new Date().toISOString()
  },
  {
    id: 'tp_2',
    tourId: 'tp_2',
    guideId: 'g2',
    guideName: 'Priya Sharma',
    guideAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    guideType: 'LOCAL_HOST',
    guideVerified: true,
    guideRating: 4.98,
    guideCompletedTrips: 310,
    guideLanguages: ['Hindi', 'English', 'French'],
    title: 'Jaipur Street Food Trail & Century-Old Recipes',
    category: 'Food',
    destination: 'Jaipur',
    summary: 'Taste 100-year-old kachori recipes, creamy rabri lassi, and royal ghewar in the legendary alleys of Johari Bazaar.',
    description: 'Food is the living heartbeat of the Pink City. Join culinary host Priya Sharma for an evening safari through Jaipur’s most celebrated street delicacies. Every vendor visited has been vetted for pure filtered water, hygiene standards, and multigenerational recipe heritage.',
    duration: '2.5 Hours',
    durationHours: 2.5,
    pricingType: 'PER_PERSON',
    price: 499,
    pricePerPerson: 499,
    pricePerGroup: 1800,
    fixedPrice: 499,
    minParticipants: 1,
    maxCapacity: 6,
    maxParticipants: 6,
    languages: ['English', 'Hindi'],
    ageSuitability: 'All ages (Vegetarian friendly)',
    difficultyLevel: 'Easy',
    meetingPoint: 'Front of Lassiwala, Shop 312, M.I. Road, Jaipur',
    highlights: ['5+ curated tastings included', 'Hygiene-inspected food stalls', '100-year-old recipe secrets', 'Vegetarian & vegan friendly'],
    included: ['All street food tastings', 'Bottled mineral water', 'Local culinary host narration'],
    excluded: ['Personal extra takeaways', 'Hotel transport'],
    cancellationPolicy: 'Free cancellation up to 12 hours before tour time.',
    safetyInfo: 'Stalls pre-checked for filtered RO water and hygienic preparation standards.',
    coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'
    ],
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      timeSlots: ['04:30 PM', '06:30 PM'],
      availableDates: ['2026-09-27', '2026-09-28', '2026-09-29'],
      blockedDates: []
    },
    availableDates: ['2026-09-27', '2026-09-28', '2026-09-29'],
    itinerary: [
      {
        stopNumber: 1,
        time: '04:30 PM',
        title: 'Clay Cup Lassi at Original Lassiwala',
        durationMinutes: 30,
        description: 'Taste traditional hand-churned thick curd lassi in clay kulhads, unchanged since 1944.',
        location: 'M.I. Road'
      },
      {
        stopNumber: 2,
        time: '05:00 PM',
        title: 'Golden Hing Pyaaz Kachori Tasting',
        durationMinutes: 35,
        description: 'Hot flaky onion kachoris paired with sweet tamarind chutney at an iconic 80-year-old shop.',
        location: 'Ajmer Gate'
      },
      {
        stopNumber: 3,
        time: '05:35 PM',
        title: 'Royal Ghewar & Mawa Sweets',
        durationMinutes: 35,
        description: 'Honeycomb-textured sweet infused with saffron and pistachios, fresh from the kadai.',
        location: 'Johari Bazaar'
      },
      {
        stopNumber: 4,
        time: '06:10 PM',
        title: 'Kathi Roll & Masala Chai Finale',
        durationMinutes: 20,
        description: 'Paneer tikka or spiced potato rolls followed by ginger cardamom tea.',
        location: 'Badi Choupad'
      }
    ],
    status: 'PUBLISHED',
    bookingCount: 56,
    rating: 4.96,
    reviewCount: 38,
    reviews: [],
    publishedAt: new Date().toISOString()
  },
  {
    id: 'tp_3',
    tourId: 'tp_3',
    guideId: 'g4',
    guideName: 'Sunita Kanwar',
    guideAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    guideType: 'PROFESSIONAL_GUIDE',
    guideVerified: true,
    guideRating: 4.89,
    guideCompletedTrips: 210,
    guideLanguages: ['Hindi', 'English', 'German'],
    title: 'Jaipur Sunset & Photography Walk',
    category: 'Photography',
    destination: 'Jaipur',
    summary: 'Capture Jaipur’s most striking architectural facades and golden hour fort panoramas with an expert photo host.',
    description: 'Discover the best viewpoints in the Pink City right as the sun dips behind the Aravalli hills. From the symmetry of Patrika Gate to the quiet ramparts of Nahargarh Fort, Sunita shares focal composition techniques, lighting adjustments, and secret rooftop vantage points.',
    duration: '3 Hours',
    durationHours: 3,
    pricingType: 'PER_PERSON',
    price: 899,
    pricePerPerson: 899,
    pricePerGroup: 2600,
    fixedPrice: 899,
    minParticipants: 1,
    maxCapacity: 6,
    maxParticipants: 6,
    languages: ['English', 'Hindi', 'German'],
    ageSuitability: '10+ years',
    difficultyLevel: 'Moderate',
    meetingPoint: 'Wind View Cafe Rooftop, Hawa Mahal Road',
    highlights: ['Golden Hour Hawa Mahal views', 'Nahargarh panoramic sunset ramparts', 'Mobile & DSLR composition tips', 'Chai overlooking the Pink City'],
    included: ['Pro Photographer Guide', 'Rooftop access fees', 'Evening chai & snacks'],
    excluded: ['Camera rental', 'Taxi transport to Nahargarh'],
    cancellationPolicy: 'Full refund up to 24 hours before tour start.',
    safetyInfo: 'Guided mountain road transit, escorted descent before dark.',
    coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80'
    ],
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      timeSlots: ['03:30 PM'],
      availableDates: ['2026-09-27', '2026-09-28', '2026-09-30'],
      blockedDates: []
    },
    availableDates: ['2026-09-27', '2026-09-28', '2026-09-30'],
    itinerary: [
      {
        stopNumber: 1,
        time: '03:30 PM',
        title: 'Wind View Cafe Rooftop Shoot',
        durationMinutes: 45,
        description: 'Shoot the symmetrical grid facade of Hawa Mahal while learning framing fundamentals.',
        location: 'Hawa Mahal Road'
      },
      {
        stopNumber: 2,
        time: '04:30 PM',
        title: 'Panna Meena Ka Kund Stepwell Geometry',
        durationMinutes: 45,
        description: 'Photograph the optical-illusion crisscross staircases of the 16th-century stepwell.',
        location: 'Amer Village'
      },
      {
        stopNumber: 3,
        time: '05:30 PM',
        title: 'Nahargarh Sunset Fort Ramparts',
        durationMinutes: 60,
        description: 'Catch the sun setting across the entire expanse of Jaipur city from the elevated bastion.',
        location: 'Nahargarh Fort'
      }
    ],
    status: 'PUBLISHED',
    bookingCount: 29,
    rating: 4.93,
    reviewCount: 29,
    reviews: [],
    publishedAt: new Date().toISOString()
  },
  {
    id: 'tp_4',
    tourId: 'tp_4',
    guideId: 'g3',
    guideName: 'Rajesh Saini',
    guideAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    guideType: 'LOCAL_HOST',
    guideVerified: true,
    guideRating: 4.82,
    guideCompletedTrips: 175,
    guideLanguages: ['Hindi', 'English'],
    title: 'Johari & Bapu Bazaar Artisan Workshop Trail',
    category: 'Markets',
    destination: 'Jaipur',
    summary: 'Explore century-old artisan workshops and learn to identify authentic gemstones and block prints at direct fair prices.',
    description: 'Skip overpriced commission tourist emporiums. Rajesh brings you straight into back-lane family workshops where gemstone cutters have operated since the era of Maharaja Jai Singh II.',
    duration: '3 Hours',
    durationHours: 3,
    pricingType: 'PER_PERSON',
    price: 550,
    pricePerPerson: 550,
    pricePerGroup: 1600,
    fixedPrice: 550,
    minParticipants: 1,
    maxCapacity: 8,
    maxParticipants: 8,
    languages: ['English', 'Hindi'],
    ageSuitability: 'All ages',
    difficultyLevel: 'Easy',
    meetingPoint: 'Sargasuli Tower, Tripolia Bazaar, Jaipur',
    highlights: ['Hand-block printing studio visit', 'Authentic gemstone cutting demo', 'Zero shopping commission guarantee', 'Artisan wholesale direct access'],
    included: ['Artisan Guide', 'Anti-Overcharge Shopping Escort', 'Clay cup chai'],
    excluded: ['Personal merchandise purchases'],
    cancellationPolicy: 'Free cancellation up to 24 hours prior to booking.',
    safetyInfo: 'Zero commission guarantee: guide accepts no kickbacks from shop owners.',
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80'],
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      timeSlots: ['10:30 AM', '02:30 PM'],
      availableDates: ['2026-09-27', '2026-09-29', '2026-09-30'],
      blockedDates: []
    },
    availableDates: ['2026-09-27', '2026-09-29', '2026-09-30'],
    itinerary: [
      {
        stopNumber: 1,
        time: '10:30 AM',
        title: 'Tripolia Lac Bangle Makers',
        durationMinutes: 45,
        description: 'Watch live melting of lac resin over open coal embers to form intricate bridal bangles.',
        location: 'Tripolia Bazaar'
      },
      {
        stopNumber: 2,
        time: '11:15 AM',
        title: 'Gopalji Ka Rasta Gemstone Cutting',
        durationMinutes: 50,
        description: 'Witness emerald and ruby faceting on water-cooled diamond wheels.',
        location: 'Johari Bazaar'
      },
      {
        stopNumber: 3,
        time: '12:15 PM',
        title: 'Hand-Block Printing Atelier',
        durationMinutes: 50,
        description: 'Try your own hand at stamping teakwood blocks onto organic cotton with mineral dyes.',
        location: 'Bapu Bazaar'
      }
    ],
    status: 'PUBLISHED',
    bookingCount: 22,
    rating: 4.85,
    reviewCount: 22,
    reviews: [],
    publishedAt: new Date().toISOString()
  }
];

const loadSavedTours = () => {
  try {
    const saved = localStorage.getItem('raahi_published_tours');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error loading published tours from storage:', err);
  }
  return INITIAL_FALLBACK_TOURS;
};

export const useTourStore = create((set, get) => ({
  tours: loadSavedTours(),
  isLoading: false,

  fetchToursFromBackend: async (params = {}) => {
    set({ isLoading: true });
    try {
      const res = await api.tours.getAll(params);
      if (res && res.data && res.data.length > 0) {
        localStorage.setItem('raahi_published_tours', JSON.stringify(res.data));
        set({ tours: res.data, isLoading: false });
        return res.data;
      }
    } catch (e) {
      console.warn('Backend tours sync notice:', e.message);
    }
    set({ isLoading: false });
    return get().tours;
  },

  addTour: async (newTour) => {
    const tourId = newTour.tourId || newTour.id || `tp_${Date.now()}`;
    const standardized = {
      ...newTour,
      id: tourId,
      tourId,
      status: newTour.status || 'PUBLISHED',
      publishedAt: newTour.publishedAt || new Date().toISOString(),
      bookingCount: 0,
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };

    set((state) => {
      const updated = [standardized, ...state.tours];
      localStorage.setItem('raahi_published_tours', JSON.stringify(updated));
      return { tours: updated };
    });

    try {
      await api.tours.create(standardized);
    } catch (e) {
      console.warn('Backend tour create sync notice:', e.message);
    }
    return standardized;
  },

  updateTour: async (tourId, updates) => {
    set((state) => {
      const updated = state.tours.map((t) =>
        (t.id === tourId || t.tourId === tourId) ? { ...t, ...updates } : t
      );
      localStorage.setItem('raahi_published_tours', JSON.stringify(updated));
      return { tours: updated };
    });

    try {
      await api.tours.update(tourId, updates);
    } catch (e) {
      console.warn('Backend tour update sync notice:', e.message);
    }
  },

  updateTourStatus: async (tourId, status, moderationNotes = '') => {
    set((state) => {
      const updated = state.tours.map((t) =>
        (t.id === tourId || t.tourId === tourId) ? { ...t, status, moderationNotes } : t
      );
      localStorage.setItem('raahi_published_tours', JSON.stringify(updated));
      return { tours: updated };
    });

    try {
      await api.tours.updateStatus(tourId, status, moderationNotes);
    } catch (e) {
      console.warn('Backend tour status update notice:', e.message);
    }
  },

  duplicateTour: async (tourId) => {
    const target = get().tours.find((t) => t.id === tourId || t.tourId === tourId);
    if (!target) return null;

    const newId = `tp_${Date.now()}`;
    const duplicated = {
      ...target,
      id: newId,
      tourId: newId,
      title: `${target.title} (Copy)`,
      status: 'DRAFT',
      bookingCount: 0,
      reviewCount: 0,
      reviews: [],
      publishedAt: new Date().toISOString()
    };

    set((state) => {
      const updated = [duplicated, ...state.tours];
      localStorage.setItem('raahi_published_tours', JSON.stringify(updated));
      return { tours: updated };
    });

    try {
      await api.tours.duplicate(tourId);
    } catch (e) {
      console.warn('Backend tour duplicate notice:', e.message);
    }
    return duplicated;
  },

  deleteTour: async (tourId) => {
    set((state) => {
      const updated = state.tours.filter((t) => t.id !== tourId && t.tourId !== tourId);
      localStorage.setItem('raahi_published_tours', JSON.stringify(updated));
      return { tours: updated };
    });

    try {
      await api.tours.delete(tourId);
    } catch (e) {
      console.warn('Backend tour delete notice:', e.message);
    }
  },

  addReviewToTour: async (tourId, review) => {
    set((state) => {
      const updated = state.tours.map((t) => {
        if (t.id !== tourId && t.tourId !== tourId) return t;
        const updatedReviews = [review, ...(t.reviews || [])];
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
    });

    try {
      await api.tours.addReview(tourId, review);
    } catch (e) {
      console.warn('Backend tour review sync notice:', e.message);
    }
  }
}));
