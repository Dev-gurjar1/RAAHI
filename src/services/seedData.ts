import {
  Destination,
  GuideProfile,
  Tour,
  FairPriceRule,
  GuideRequest,
  TourOffer,
  Booking,
  Review,
  Report,
  GuideVerification,
  LocalQuestion,
  LocalAnswer,
  Place
} from '../types';

export const SEED_DESTINATIONS: Destination[] = [
  {
    id: 'dest-jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    tagline: 'The Pink City of Forts, Palaces & Royal Heritage',
    popularCount: 1420,
    description: 'Explore the majestic Amber Fort, Hawa Mahal, vibrant bazaars, and legendary Rajasthani food with verified local historians.',
    topAttractions: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Chokhi Dhani']
  },
  {
    id: 'dest-delhi',
    name: 'Delhi',
    state: 'National Capital Territory',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Heart of India — Old Spice Markets to Imperial Architecture',
    popularCount: 2150,
    description: 'Walk through centuries of Mughal history in Chandni Chowk, marvel at Qutub Minar, and savor authentic street food safely.',
    topAttractions: ['Red Fort', 'Qutub Minar', 'Humayun Tomb', 'Chandni Chowk', 'Lotus Temple']
  },
  {
    id: 'dest-udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1000&q=80',
    tagline: 'City of Lakes, Romantic Haveli Sunset Views & Artisan Culture',
    popularCount: 1180,
    description: 'Glide on Lake Pichola, tour Lake Palace, and experience royal Marwar hospitality with local guides who know every hidden alley.',
    topAttractions: ['City Palace Udaipur', 'Lake Pichola', 'Jag Mandir', 'Saheliyon-ki-Bari', 'Bagore Ki Haveli']
  },
  {
    id: 'dest-agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Home of the Taj Mahal & Mughal Artisan Guilds',
    popularCount: 1890,
    description: 'Discover sunrise at the Taj Mahal, Agra Fort history, and marble inlay craftsmen with certified local experts.',
    topAttractions: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh', 'Sadari Bazaar']
  },
  {
    id: 'dest-varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
    tagline: 'The Spiritual Soul of India — Ancient Ghats & Evening Aarti',
    popularCount: 1640,
    description: 'Navigate narrow alleys, experience sunrise boat rides on the Ganges, and observe Ganga Aarti with deeply respectful local hosts.',
    topAttractions: ['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Assi Ghat', 'Sarnath', 'Manikarnika Ghat']
  },
  {
    id: 'dest-jodhpur',
    name: 'Jodhpur',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
    tagline: 'The Sun City — Blue Houses beneath Mehrangarh Fort',
    popularCount: 980,
    description: 'Walk through the blue city lanes, admire Mehrangarh Fort towering above, and savor Makhaniya Lassi with local storytellers.',
    topAttractions: ['Mehrangarh Fort', 'Jaswant Thada', 'Umaid Bhawan Palace', 'Clock Tower Market', 'Mandore Gardens']
  },
  {
    id: 'dest-manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Himalayan Paradise — Pine Forests, Snow Peaks & Solang Valley',
    popularCount: 1310,
    description: 'Treks, mountain passes, local Himachali cuisine, and authentic village walks guided by mountain locals.',
    topAttractions: ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple', 'Old Manali', 'Jogini Waterfall']
  },
  {
    id: 'dest-amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    image: 'https://images.unsplash.com/photo-1588097281266-310cead47879?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Golden Temple, Wagah Border & Legendary Punjabi Hospitality',
    popularCount: 1520,
    description: 'Experience spiritual tranquility at Harmandir Sahib, patriotic fervor at Wagah Border, and world-class Amritsari Kulcha.',
    topAttractions: ['Golden Temple', 'Wagah Border', 'Jallianwala Bagh', 'Partition Museum', 'Kesar Da Dhaba']
  }
];

export const SEED_GUIDES: GuideProfile[] = [
  {
    id: 'guide-rahul',
    userId: 'user-rahul',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    reviewCount: 128,
    experienceYears: 6,
    languages: ['Hindi', 'English'],
    serviceAreas: ['Jaipur', 'Amber Fort', 'Old City Bazaars'],
    startingPrice: 2500,
    completedTours: 184,
    availability: 'Available Today',
    bio: 'Licensed heritage storyteller and Jaipur local born & raised in Johari Bazaar. Passionate about royal architecture, Marwari history, and secret street food gems.',
    verificationStatus: 'VERIFIED',
    verificationBadges: ['Identity Verified', 'Local Expert', 'Top Rated'],
    expectedPricing: '₹2,500 / 6 Hours',
    emergencyContact: '+91 98290 12345',
    cancellationPolicy: 'Free cancellation up to 24 hours before tour start time.',
    responseRate: '98% (within 15 mins)'
  },
  {
    id: 'guide-priya',
    userId: 'user-priya',
    name: 'Priya Verma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    rating: 4.95,
    reviewCount: 94,
    experienceYears: 4,
    languages: ['English', 'Hindi', 'French'],
    serviceAreas: ['Delhi', 'Old Delhi', 'Humayun Tomb', 'Mehrauli'],
    startingPrice: 2700,
    completedTours: 112,
    availability: 'Available Tomorrow',
    bio: 'Archaeology graduate & Old Delhi food enthusiast. I help travelers navigate Delhi safely while bringing Mughal history to life through interactive storytelling.',
    verificationStatus: 'VERIFIED',
    verificationBadges: ['Identity Verified', 'Local Expert', 'Language Specialist'],
    expectedPricing: '₹2,700 / 6 Hours',
    emergencyContact: '+91 98110 54321',
    cancellationPolicy: 'Free cancellation up to 12 hours before start.',
    responseRate: '100% (within 10 mins)'
  },
  {
    id: 'guide-vikram',
    userId: 'user-vikram',
    name: 'Vikram Singh Mewar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    rating: 4.88,
    reviewCount: 76,
    experienceYears: 8,
    languages: ['Hindi', 'English', 'Gujarati'],
    serviceAreas: ['Udaipur', 'City Palace', 'Lake Pichola', 'Kumbhalgarh'],
    startingPrice: 3000,
    completedTours: 145,
    availability: 'Available Today',
    bio: 'Deeply rooted Mewari local with 8 years guiding international & domestic tourists across Udaipur lakes, royal havelis, and artisan workshops.',
    verificationStatus: 'VERIFIED',
    verificationBadges: ['Identity Verified', 'Master Guide'],
    expectedPricing: '₹3,000 / Day',
    emergencyContact: '+91 94140 98765',
    cancellationPolicy: 'Flexible 24-hr refund policy.',
    responseRate: '95% (within 30 mins)'
  },
  {
    id: 'guide-amit',
    userId: 'user-amit',
    name: 'Amit Kumar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    rating: 4.92,
    reviewCount: 165,
    experienceYears: 7,
    languages: ['Hindi', 'English', 'Spanish'],
    serviceAreas: ['Agra', 'Taj Mahal', 'Fatehpur Sikri'],
    startingPrice: 2200,
    completedTours: 240,
    availability: 'Available Today',
    bio: 'Official Ministry certified Agra guide. I specialize in Taj Mahal photography walks, early sunrise access, and authentic Petha tasting.',
    verificationStatus: 'VERIFIED',
    verificationBadges: ['Identity Verified', 'Top Rated', 'Official Guide'],
    expectedPricing: '₹2,200 / 5 Hours',
    emergencyContact: '+91 97190 22334',
    cancellationPolicy: 'Free cancellation anytime prior to 6 hrs before event.',
    responseRate: '99% (within 5 mins)'
  },
  {
    id: 'guide-sunita',
    userId: 'user-sunita',
    name: 'Sunita Devi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    rating: 4.98,
    reviewCount: 210,
    experienceYears: 9,
    languages: ['Hindi', 'English', 'Bengali'],
    serviceAreas: ['Varanasi', 'Ghats', 'Kashi Vishwanath', 'Sarnath'],
    startingPrice: 2800,
    completedTours: 310,
    availability: 'Available Today',
    bio: 'Born near Manikarnika Ghat, Sunita offers respectful, culturally enriching spiritual walks through Banaras lanes, silk weaving clusters, and evening Aarti.',
    verificationStatus: 'VERIFIED',
    verificationBadges: ['Identity Verified', 'Spiritual Expert', 'Local Legend'],
    expectedPricing: '₹2,800 / Full Day',
    emergencyContact: '+91 94500 88990',
    cancellationPolicy: 'Full refund if cancelled 24 hours prior.',
    responseRate: '100% (within 5 mins)'
  }
];

export const SEED_TOURS: Tour[] = [
  {
    id: 'tour-jaipur-heritage',
    guideId: 'guide-rahul',
    guideName: 'Rahul Sharma',
    guideAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    guideRating: 4.9,
    title: 'Jaipur Royal Heritage & Secret Food Walking Tour',
    destination: 'Jaipur',
    description: 'Immerse yourself in Jaipur’s pink sandstone architecture, historic bazaars, authentic Pyaz Kachori, and royal tales of Rajput kings.',
    durationHours: 6,
    isMultiDay: false,
    maxTravelers: 6,
    pricePerPerson: 2500,
    meetingPoint: 'Hawa Mahal Main Gate, Jaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    cancellationPolicy: 'Free cancellation up to 24 hours before tour start time.',
    includes: ['Private Verified Local Guide', 'Heritage Walk Entry Access', 'Traditional Food Tasting & Chai', 'Mineral Water & Refreshments', 'High-res Digital Photos'],
    excludes: ['Monument Entry Tickets', 'Personal Souvenir Shopping', 'Hotel Pick up & Drop'],
    itinerary: [
      { id: 'i1', time: '09:00 AM', title: 'Hawa Mahal Meetup & Architecture Walk', description: 'Deep dive into the 953 jharokhas of Hawa Mahal and royal women history.', location: 'Hawa Mahal' },
      { id: 'i2', time: '11:00 AM', title: 'Johari Bazaar & Spice Artisan Alley', description: 'Visit 150-year-old jewelers and traditional Bandhani dye workshops.', location: 'Johari Bazaar' },
      { id: 'i3', time: '01:00 PM', title: 'Royal Feast at Rawat Sweets', description: 'Taste authentic Dal Baati Churma and crispy Pyaz Kachori.', location: 'Rawat Sweets' },
      { id: 'i4', time: '02:30 PM', title: 'City Palace Guided Access', description: 'Explore Chandra Mahal, royal armory, and Peacock Gate.', location: 'City Palace' },
      { id: 'i5', time: '03:30 PM', title: 'Jantar Mantar Astronomical Marvels', description: 'Discover world largest stone sundial and ancient astrology tools.', location: 'Jantar Mantar' }
    ]
  },
  {
    id: 'tour-vaishno-devi-multiday',
    guideId: 'guide-rahul',
    guideName: 'Rahul Sharma (Partnered)',
    guideAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    guideRating: 4.9,
    title: 'Vaishno Devi Sacred Yatra — 2 Days / 1 Night Package',
    destination: 'Katra / Vaishno Devi',
    description: 'Complete hassle-free pilgrimage assistance including Katra hotel stay, battery car bookings, helicopter pass guidance, and verified trek coordinator.',
    durationHours: 36,
    durationDays: 2,
    isMultiDay: true,
    maxTravelers: 4,
    pricePerPerson: 3999,
    meetingPoint: 'Jammu Railway Station / Katra Base Camp',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    cancellationPolicy: 'Full refund 48 hours prior to start date.',
    costBreakdown: {
      transport: 1500,
      hotel: 1000,
      food: 600,
      guide: 500,
      other: 300,
      estimatedTotal: 3900
    },
    includes: ['AC Transport Jammu to Katra Return', '1 Night Deluxe Hotel Stay in Katra', 'All Pure Veg Meals (Breakfast & Dinner)', 'Verified Local Yatra Companion', 'Parchha Yatra Card Registration'],
    excludes: ['Helicopter tickets (Optional extra)', 'Personal Pony/Palki charges'],
    itinerary: [
      { id: 'v1', time: 'Day 1 - 08:00 AM', title: 'Jammu Pick-up & Scenic Drive to Katra', description: 'AC Vehicle transfer to Katra hotel check-in & Yatra pass collection.' },
      { id: 'v2', time: 'Day 1 - 04:00 PM', title: 'Katra Base Camp Trek Commencement', description: 'Escorted trek up to Banganga, Charan Paduka, and Ardhkuwari.' },
      { id: 'v3', time: 'Day 2 - 02:00 AM', title: 'Bhavan Holy Darshan & Bhairon Ghati', description: 'Priority Queue guidance for Maa Vaishno Devi Shrine darshan.' },
      { id: 'v4', time: 'Day 2 - 02:00 PM', title: 'Return Trek & Drop back to Jammu', description: 'Descend to Katra base, lunch, and return transfer.' }
    ]
  },
  {
    id: 'tour-delhi-spice-odyssey',
    guideId: 'guide-priya',
    guideName: 'Priya Verma',
    guideAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    guideRating: 4.95,
    title: 'Old Delhi Heritage Rickshaw & Spice Bazaar Walk',
    destination: 'Delhi',
    description: 'Ride through Chandni Chowk in traditional rickshaws, explore Khari Baoli (Asia largest spice market), and sample legendary paranthas.',
    durationHours: 5,
    isMultiDay: false,
    maxTravelers: 5,
    pricePerPerson: 2700,
    meetingPoint: 'Jama Masjid Gate 3, Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    cancellationPolicy: 'Free cancellation up to 12 hours before tour start time.',
    includes: ['Private Female Verified Guide', 'Traditional Rickshaw Fare', 'Food & Chai Tastings at 4 Heritage Shops', 'Rooftop View Point Ticket'],
    excludes: ['Camera fees at Jama Masjid', 'Personal shopping'],
    itinerary: [
      { id: 'd1', time: '10:00 AM', title: 'Jama Masjid Grand Courtyard Walk', description: 'Explore Shah Jahan Mughal congregational mosque.' },
      { id: 'd2', time: '11:15 AM', title: 'Rickshaw Safari through Paranthe Wali Gali', description: 'Taste 100-year-old stuffed paranthas served with mint chutney.' },
      { id: 'd3', time: '12:30 PM', title: 'Khari Baoli Spice Rooftop & Wholesale Market', description: 'Ascend secret rooftop overlooking thousands of spice sacks.' },
      { id: 'd4', time: '02:00 PM', title: 'Gurudwara Bangla Sahib Kitchen Visit', description: 'Witness community Mega Kitchen (Langar) preparing food for 50,000.' }
    ]
  }
];

export const SEED_FAIR_PRICE_RULES: FairPriceRule[] = [
  {
    id: 'fp-1',
    destination: 'Jaipur',
    category: 'AUTO_TAXI',
    routeOrItem: 'Railway Station → Hawa Mahal / Pink City',
    priceRangeMin: 150,
    priceRangeMax: 250,
    unit: 'Per Auto (Up to 3 pax)',
    trustedSource: 'Jaipur Traffic Prepaid Auto Union Tariff',
    lastUpdated: '2026-08-01'
  },
  {
    id: 'fp-2',
    destination: 'Jaipur',
    category: 'GUIDE_HERITAGE',
    routeOrItem: 'Certified Local Guide (6 Hours Heritage Walk)',
    priceRangeMin: 2000,
    priceRangeMax: 3000,
    unit: 'Per Group (1-4 pax)',
    trustedSource: 'STHANIQ Verified Marketplace Benchmark',
    lastUpdated: '2026-08-10'
  },
  {
    id: 'fp-3',
    destination: 'Jaipur',
    category: 'STREET_FOOD',
    routeOrItem: 'Authentic Pyaz Kachori + Special Masala Chai',
    priceRangeMin: 40,
    priceRangeMax: 70,
    unit: 'Per Plate at Rawat/LMB',
    trustedSource: 'Local Culinary Survey',
    lastUpdated: '2026-08-05'
  },
  {
    id: 'fp-4',
    destination: 'Delhi',
    category: 'AUTO_TAXI',
    routeOrItem: 'New Delhi Railway Station → Chandni Chowk / Jama Masjid',
    priceRangeMin: 100,
    priceRangeMax: 180,
    unit: 'Metered Auto / e-Rickshaw',
    trustedSource: 'Delhi Auto Meter Rate Standard',
    lastUpdated: '2026-07-28'
  },
  {
    id: 'fp-5',
    destination: 'Delhi',
    category: 'GUIDE_HERITAGE',
    routeOrItem: 'Old Delhi Heritage & Culinary Specialist Guide',
    priceRangeMin: 2200,
    priceRangeMax: 3200,
    unit: '5 Hours Half-Day Walk',
    trustedSource: 'Delhi Tourism Verified Guide Guild',
    lastUpdated: '2026-08-08'
  },
  {
    id: 'fp-6',
    destination: 'Udaipur',
    category: 'AUTO_TAXI',
    routeOrItem: 'Auto Ride: Bus Stand → City Palace / Lake Pichola Ghats',
    priceRangeMin: 120,
    priceRangeMax: 200,
    unit: 'Per Ride',
    trustedSource: 'Udaipur Local Transport Board',
    lastUpdated: '2026-08-02'
  },
  {
    id: 'fp-7',
    destination: 'Agra',
    category: 'AUTO_TAXI',
    routeOrItem: 'Agra Cantt Railway Station → Taj Mahal East Gate',
    priceRangeMin: 180,
    priceRangeMax: 280,
    unit: 'Auto / E-Rickshaw',
    trustedSource: 'Agra Tourist Helpdesk Rate Chart',
    lastUpdated: '2026-08-01'
  }
];

export const SEED_PLACES: Place[] = [
  {
    id: 'place-amber-fort',
    destinationId: 'dest-jaipur',
    destinationName: 'Jaipur',
    name: 'Amber Fort & Palace',
    category: 'Heritage',
    rating: 4.8,
    priceLevel: 'Moderate',
    address: 'Devisinghpura, Amer, Jaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    description: 'Hilltop fortress featuring Sheesh Mahal (Mirror Palace), Diwan-e-Aam, and breathtaking Maota Lake reflections.',
    estimatedFairCost: 'Ticket ₹100 Indian / ₹550 Foreigner'
  },
  {
    id: 'place-hawa-mahal',
    destinationId: 'dest-jaipur',
    destinationName: 'Jaipur',
    name: 'Hawa Mahal (Palace of Winds)',
    category: 'Heritage',
    rating: 4.7,
    priceLevel: 'Budget',
    address: 'Hawa Mahal Rd, Badi Choupad, Pink City, Jaipur',
    image: 'https://images.unsplash.com/photo-1603201236596-eb1a63eb0f51?auto=format&fit=crop&w=600&q=80',
    description: 'Iconic five-story pink honeycomb facade designed for royal ladies to observe street festivals unseen.',
    estimatedFairCost: 'Ticket ₹50 Indian / ₹200 Foreigner'
  },
  {
    id: 'place-rawat-sweets',
    destinationId: 'dest-jaipur',
    destinationName: 'Jaipur',
    name: 'Rawat Mishthan Bhandar',
    category: 'Food',
    rating: 4.9,
    priceLevel: 'Budget',
    address: 'Station Rd, Opp Bus Stand, Jaipur',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    description: 'The legendary birthplace of Jaipur famous Pyaz Kachori, Ghewar, and Kesar Lassi.',
    estimatedFairCost: '₹50 - ₹150 per person'
  },
  {
    id: 'place-chandni-chowk',
    destinationId: 'dest-delhi',
    destinationName: 'Delhi',
    name: 'Chandni Chowk Market & Bazaars',
    category: 'Shopping',
    rating: 4.6,
    priceLevel: 'Budget',
    address: 'Old Delhi, Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    description: 'One of Asia oldest and busiest markets, famous for textiles, silver jewelry, and street food streetscapes.',
    estimatedFairCost: 'Free entry / E-Rickshaw ₹30-₹50'
  }
];

export const SEED_GUIDE_REQUESTS: GuideRequest[] = [
  {
    id: 'req-jaipur-demo',
    touristId: 'user-tourist-demo',
    touristName: 'Aarav Patel',
    touristAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    destination: 'Jaipur',
    date: '2026-08-22',
    travelersCount: 2,
    durationHours: 6,
    interests: ['Heritage', 'Food', 'Local Bazaars'],
    language: 'Hindi + English',
    budget: 3000,
    specialRequirements: 'We want to visit Amber Fort and sample authentic street food. Need photography tips!',
    status: 'BIDDED',
    createdAt: '2026-08-17T10:00:00Z'
  }
];

export const SEED_OFFERS: TourOffer[] = [
  {
    id: 'offer-1',
    requestId: 'req-jaipur-demo',
    guideId: 'guide-rahul',
    guideName: 'Rahul Sharma',
    guideAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    guideRating: 4.9,
    guideExperience: 6,
    price: 2500,
    durationHours: 6,
    includedServices: ['Private 6-hr Heritage Walk', 'Amber Fort Guided Entry', 'Street Food Tasting at Rawat Sweets', 'Free Digital Photos'],
    excludedServices: ['Monument tickets', 'Personal shopping'],
    tourTitle: 'Jaipur Heritage & Food Walking Experience',
    pitch: 'Hi Aarav! Born in Jaipur, I will give you a personalized 6-hour walk covering Amber Fort, Hawa Mahal, and authentic Pyaz Kachori.',
    highlights: ['Licensed local historian', 'Includes food tasting', '100% Verified'],
    badgeLabel: 'Best Match',
    cancellationPolicy: 'Free cancellation up to 24 hours before tour.',
    status: 'PENDING',
    createdAt: '2026-08-17T10:15:00Z'
  },
  {
    id: 'offer-2',
    requestId: 'req-jaipur-demo',
    guideId: 'guide-priya',
    guideName: 'Priya Verma',
    guideAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    guideRating: 4.95,
    guideExperience: 4,
    price: 2700,
    durationHours: 6,
    includedServices: ['6-hr Heritage + Culinary Walk', 'Old Bazaar Rickshaw ride', 'Artisan Textile Studio Visit', 'Hydration Pack & Snacks'],
    excludedServices: ['Monument tickets'],
    tourTitle: 'Royal Pink City & Artisan Heritage Explorer',
    pitch: 'Hello! I offer an interactive cultural walk with private rickshaw rides through hidden jewelry and textile alleys.',
    highlights: ['Includes Rickshaw Ride', 'Top Rated Female Guide', 'Textile Studio Access'],
    badgeLabel: 'Best Value',
    cancellationPolicy: 'Free cancellation 12h prior.',
    status: 'PENDING',
    createdAt: '2026-08-17T10:30:00Z'
  },
  {
    id: 'offer-3',
    requestId: 'req-jaipur-demo',
    guideId: 'guide-vikram',
    guideName: 'Vikram Singh Mewar',
    guideAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    guideRating: 4.88,
    guideExperience: 8,
    price: 3000,
    durationHours: 6,
    includedServices: ['Master Storytelling 6 hrs', 'Private AC Car Transfer between forts', 'Chokhi Dhani Dinner Coupon Discount', 'Professional DSLR Photography'],
    excludedServices: ['Monument entry fees'],
    tourTitle: 'VVIP Royal Rajputana Forts & Photography Special',
    pitch: 'Namaste! With 8 years guiding experience, I provide seamless private car transfers and high-quality DSLR photos.',
    highlights: ['Includes Private AC Car', 'DSLR Photography Included', '8 Yrs Experience'],
    badgeLabel: undefined,
    cancellationPolicy: 'Flexible 24-hr refund.',
    status: 'PENDING',
    createdAt: '2026-08-17T10:45:00Z'
  }
];

export const SEED_QUESTIONS: LocalQuestion[] = [
  {
    id: 'q-1',
    touristName: 'Meera Kapoor',
    touristAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    destination: 'Jaipur',
    question: 'Where can I find authentic Dal Baati Churma in Jaipur that is clean, hygienic and truly local?',
    createdAt: '2 hours ago',
    likes: 18,
    answersCount: 3
  },
  {
    id: 'q-2',
    touristName: 'David Miller',
    touristAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    destination: 'Delhi',
    question: 'What is the reasonable price for an auto ride from New Delhi station to Chandni Chowk market?',
    createdAt: '5 hours ago',
    likes: 24,
    answersCount: 4
  }
];

export const SEED_ANSWERS: LocalAnswer[] = [
  {
    id: 'ans-1',
    questionId: 'q-1',
    responderName: 'Rahul Sharma',
    responderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isVerifiedLocal: true,
    answer: 'As a born Jaipur local, skip the crowded tourist traps! Head to Laxmi Mishthan Bhandar (LMB) in Johari Bazaar or Thali House near Sindhi Camp for authentic ghee-loaded Dal Baati at fair prices (approx ₹300-₹450 per thali).',
    helpfulVotes: 32,
    createdAt: '1 hour ago'
  },
  {
    id: 'ans-2',
    questionId: 'q-2',
    responderName: 'Priya Verma',
    responderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    isVerifiedLocal: true,
    answer: 'The official metered auto fare is between ₹100 to ₹150 max. Do not pay ₹300+ which auto drivers outside the station sometimes demand! Use the prepaid auto booth outside Platform 16 or Uber Auto.',
    helpfulVotes: 45,
    createdAt: '4 hours ago'
  }
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'STH-98421',
    touristId: 'user-tourist-demo',
    touristName: 'Aarav Patel',
    guideId: 'guide-rahul',
    guideName: 'Rahul Sharma',
    guideAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tourId: 'tour-jaipur-heritage',
    title: 'Jaipur Royal Heritage & Secret Food Walking Tour',
    destination: 'Jaipur',
    date: '2026-08-25',
    time: '09:00 AM',
    travelersCount: 2,
    totalPrice: 2500,
    platformFee: 250,
    guideEarnings: 2250,
    paymentStatus: 'PAID',
    bookingStatus: 'UPCOMING',
    meetingPoint: 'Hawa Mahal Main Gate, Jaipur',
    createdAt: '2026-08-16T14:30:00Z',
    isReviewed: false
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookingId: 'STH-88210',
    touristId: 'user-sarah',
    touristName: 'Sarah Jenkins',
    touristAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    guideId: 'guide-rahul',
    overallRating: 5.0,
    knowledgeRating: 5,
    behaviourRating: 5,
    punctualityRating: 5,
    communicationRating: 5,
    valueRating: 5,
    comment: 'Rahul was incredible! He brought the history of Amber Fort to life and took us to a secret local sweets shop that was out of this world. Highly recommend STHANIQ!',
    wouldRecommend: true,
    createdAt: '2026-08-12'
  },
  {
    id: 'rev-2',
    bookingId: 'STH-77419',
    touristId: 'user-rohan',
    touristName: 'Rohan Mehta',
    touristAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    guideId: 'guide-priya',
    overallRating: 5.0,
    knowledgeRating: 5,
    behaviourRating: 5,
    punctualityRating: 5,
    communicationRating: 5,
    valueRating: 5,
    comment: 'Priya made our Old Delhi trip so safe and stress-free. The spice market rooftop view was unforgettable.',
    wouldRecommend: true,
    createdAt: '2026-08-10'
  }
];

export const SEED_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'user-tourist-demo',
    reporterName: 'Aarav Patel',
    guideId: 'guide-unverified-1',
    guideName: 'Unverified Third-Party Tour Seller',
    reason: 'Misleading price',
    description: 'Claimed ₹500 tour but demanded ₹2,500 at destination before entering fort.',
    status: 'PENDING',
    createdAt: '2026-08-15T09:20:00Z'
  }
];
