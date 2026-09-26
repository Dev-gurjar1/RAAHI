import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useBookingStore } from '../store/useBookingStore.js';
import { useToastStore } from '../store/useToastStore.js';
import { calculateDistance } from '../utils/geo.js';
import { PAN_INDIA_GUIDES_DATA } from '../constants/guides.js';

// Pre-configured major hubs across India for Uber Guide Mode
export const CITIES_CONFIG = {
  Jaipur: {
    name: 'Jaipur',
    state: 'Rajasthan',
    center: [26.9855, 75.8513],
    landmarks: [
      { name: 'Amer Fort Sun Gate', coords: [26.9855, 75.8513] },
      { name: 'Hawa Mahal Plaza', coords: [26.9239, 75.8267] },
      { name: 'City Palace North Gate', coords: [26.9258, 75.8237] },
      { name: 'Nahargarh Fort Ramparts', coords: [26.9534, 75.8462] },
      { name: 'Jal Mahal Promenade', coords: [26.9656, 75.8456] },
    ]
  },
  Delhi: {
    name: 'Delhi',
    state: 'Delhi NCR',
    center: [28.6507, 77.2334],
    landmarks: [
      { name: 'Red Fort Lahori Gate', coords: [28.6562, 77.2410] },
      { name: 'Chandni Chowk Town Hall', coords: [28.6507, 77.2334] },
      { name: 'India Gate Central Plaza', coords: [28.6129, 77.2295] },
      { name: 'Humayun Tomb Garden Gate', coords: [28.5933, 77.2507] },
      { name: 'Qutub Minar Complex', coords: [28.5244, 77.1855] },
    ]
  },
  Varanasi: {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    center: [25.3000, 83.0080],
    landmarks: [
      { name: 'Assi Ghat Main Steps', coords: [25.2905, 83.0054] },
      { name: 'Dashashwamedh Ghat Aarti Stage', coords: [25.3082, 83.0107] },
      { name: 'Manikarnika Ghat Cremation Trail', coords: [25.3108, 83.0139] },
      { name: 'Kashi Vishwanath Corridor Gate 4', coords: [25.3109, 83.0107] },
      { name: 'Sarnath Dhamek Stupa', coords: [25.3811, 83.0242] },
    ]
  },
  Agra: {
    name: 'Agra',
    state: 'Uttar Pradesh',
    center: [27.1751, 78.0421],
    landmarks: [
      { name: 'Taj Mahal East Gate', coords: [27.1751, 78.0421] },
      { name: 'Mehtab Bagh River Viewpoint', coords: [27.1800, 78.0440] },
      { name: 'Agra Fort Amar Singh Gate', coords: [27.1795, 78.0211] },
      { name: 'Kinari Bazaar Clock Tower', coords: [27.1865, 78.0155] },
    ]
  },
  Udaipur: {
    name: 'Udaipur',
    state: 'Rajasthan',
    center: [24.5764, 73.6835],
    landmarks: [
      { name: 'City Palace Badi Pol', coords: [24.5764, 73.6835] },
      { name: 'Lake Pichola Ghat (Ambrai)', coords: [24.5796, 73.6800] },
      { name: 'Jagdish Temple Steps', coords: [24.5792, 73.6844] },
      { name: 'Saheliyon Ki Bari Gate', coords: [24.6041, 73.6872] },
    ]
  },
  Goa: {
    name: 'Goa',
    state: 'Goa',
    center: [15.4989, 73.8278],
    landmarks: [
      { name: 'Fontainhas Latin Quarter', coords: [15.4989, 73.8278] },
      { name: 'Basilica of Bom Jesus, Old Goa', coords: [15.5009, 73.9116] },
      { name: 'Our Lady of the Immaculate Conception Church', coords: [15.4980, 73.8315] },
      { name: 'Fort Aguada Lighthouse', coords: [15.4923, 73.7735] },
    ]
  },
  Mumbai: {
    name: 'Mumbai',
    state: 'Maharashtra',
    center: [18.9220, 72.8347],
    landmarks: [
      { name: 'Gateway of India Seafront', coords: [18.9220, 72.8347] },
      { name: 'Colaba Causeway Cafe Leopold', coords: [18.9242, 72.8319] },
      { name: 'Chhatrapati Shivaji Maharaj Terminus (CST)', coords: [18.9402, 72.8356] },
      { name: 'Marine Drive Nariman Point', coords: [18.9260, 72.8228] },
    ]
  },
  Amritsar: {
    name: 'Amritsar',
    state: 'Punjab',
    center: [31.6200, 74.8765],
    landmarks: [
      { name: 'Golden Temple Clock Tower Gate', coords: [31.6200, 74.8765] },
      { name: 'Jallianwala Bagh Memorial', coords: [31.6206, 74.8801] },
      { name: 'Partition Museum Town Hall', coords: [31.6234, 74.8770] },
    ]
  },
  Kochi: {
    name: 'Kochi',
    state: 'Kerala',
    center: [9.9656, 76.2421],
    landmarks: [
      { name: 'Chinese Fishing Nets Fort Kochi', coords: [9.9678, 76.2415] },
      { name: 'Jew Town Synagogue Plaza', coords: [9.9579, 76.2594] },
      { name: 'Mattancherry Palace', coords: [9.9583, 76.2588] },
    ]
  }
};

// Uber-style Guide Service Tiers
export const SERVICE_TIERS = [
  {
    id: 'STUDENT_LOCAL',
    title: 'Local Explorer',
    badge: 'Budget Friendly',
    icon: 'fa-solid fa-graduation-cap',
    avatarEmoji: '🎓',
    hourlyRate: 220,
    etaMinutes: 3,
    description: 'Energetic local student • Hidden lanes, street food, youth spots & zero shopping push',
    color: '#0B9B6E'
  },
  {
    id: 'PROFESSIONAL_GUIDE',
    title: 'Heritage Pro',
    badge: 'Most Popular',
    isPopular: true,
    icon: 'fa-solid fa-landmark',
    avatarEmoji: '🏛️',
    hourlyRate: 400,
    etaMinutes: 5,
    description: 'Government-certified ASI historian • Royal architecture, palace secrets & priority museum routing',
    color: '#0B9B6E'
  },
  {
    id: 'VIP_ESCORT',
    title: 'Royal Connoisseur',
    badge: 'VIP Private',
    icon: 'fa-solid fa-crown',
    avatarEmoji: '👑',
    hourlyRate: 850,
    etaMinutes: 7,
    description: 'Private haveli access, pro photo coaching & luxury personalized pacing',
    color: '#F4A340'
  }
];

export const UberGuideBooking = ({ defaultCity = 'Jaipur' }) => {
  const showToast = useToastStore((state) => state.showToast);
  const { createBooking } = useBookingStore();

  // Selected Location States
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const cityConfig = CITIES_CONFIG[selectedCity] || CITIES_CONFIG.Jaipur;
  const [pickupLandmark, setPickupLandmark] = useState(cityConfig.landmarks[0].name);
  const [pickupCoords, setPickupCoords] = useState(cityConfig.landmarks[0].coords);

  // Booking Parameters
  const [selectedTier, setSelectedTier] = useState(SERVICE_TIERS[1]); // Default: Heritage Pro
  const [durationOption, setDurationOption] = useState(2); // 2, 4, 8, or multi-day
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [multiDaysCount, setMultiDaysCount] = useState(2);
  const [guestCount, setGuestCount] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('UPI / Cash on Arrival');

  // Matching & Trip Lifecycle States: 'IDLE' | 'SEARCHING' | 'MATCHED' | 'ACTIVE_TOUR'
  const [bookingState, setBookingState] = useState('IDLE');
  const [matchedGuideData, setMatchedGuideData] = useState(null);
  const [activeOtp, setActiveOtp] = useState(null);
  const [etaRemainingSeconds, setEtaRemainingSeconds] = useState(180);
  const [searchProgress, setSearchProgress] = useState(0);

  // Map DOM Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const touristMarkerRef = useRef(null);
  const guideMarkersRef = useRef([]);

  // Compute live nearby guides for this city
  const cityGuides = PAN_INDIA_GUIDES_DATA.filter(
    (g) => g.city.toLowerCase() === selectedCity.toLowerCase()
  );
  const availableGuides = cityGuides.length > 0 ? cityGuides : PAN_INDIA_GUIDES_DATA.slice(0, 4);

  // Handle City Change
  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    const cfg = CITIES_CONFIG[newCity];
    if (cfg && cfg.landmarks.length > 0) {
      setPickupLandmark(cfg.landmarks[0].name);
      setPickupCoords(cfg.landmarks[0].coords);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(cfg.landmarks[0].coords, 14, { duration: 1.2 });
      }
    }
  };

  // Handle Landmark Change
  const handleLandmarkChange = (landmarkName) => {
    setPickupLandmark(landmarkName);
    const found = cityConfig.landmarks.find((l) => l.name === landmarkName);
    if (found) {
      setPickupCoords(found.coords);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(found.coords, 15, { duration: 0.8 });
      }
    }
  };

  // Live GPS geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast({ type: 'warning', title: 'Location Error', message: 'Geolocation is not supported by your browser.' });
      return;
    }
    showToast({ type: 'info', title: 'Detecting GPS...', message: 'Acquiring high accuracy coordinates...' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPickupCoords(coords);
        setPickupLandmark('Your Live GPS Location 📍');
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(coords, 16, { duration: 1 });
        }
        showToast({ type: 'success', title: 'GPS Located', message: 'Set pickup to your exact current position.' });
      },
      (err) => {
        showToast({ type: 'warning', title: 'GPS Signal Weak', message: 'Using default monument landmark coordinates.' });
      },
      { timeout: 8000 }
    );
  };

  // Fare calculations
  const calculatedHours = isMultiDay ? multiDaysCount * 6 : durationOption;
  const baseTariff = selectedTier.hourlyRate * calculatedHours;
  const platformFee = 0; // Zero surprise fees
  const totalFare = baseTariff;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: pickupCoords,
      zoom: 14,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Warm high-contrast tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    // Pickup Location Marker
    const pickupIcon = L.divIcon({
      className: 'uber-pickup-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-slate-950 border-3 border-white shadow-2xl flex items-center justify-center text-white text-xs font-black animate-bounce">
            ●
          </div>
          <span class="absolute -bottom-6 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md border border-white/20">
            Pickup Point
          </span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const pMarker = L.marker(pickupCoords, { icon: pickupIcon }).addTo(map);
    touristMarkerRef.current = pMarker;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update pickup marker & guide radar markers on coords change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (touristMarkerRef.current) {
      touristMarkerRef.current.setLatLng(pickupCoords);
    }

    // Clear old guide markers
    guideMarkersRef.current.forEach((m) => map.removeLayer(m));
    guideMarkersRef.current = [];

    // Add nearby pulsing guide cars/avatars around pickup
    availableGuides.slice(0, 4).forEach((g, idx) => {
      // Slight simulated jitter around pickup for realistic radar
      const jitterLat = pickupCoords[0] + (idx === 0 ? 0.005 : idx === 1 ? -0.006 : idx === 2 ? 0.004 : -0.003);
      const jitterLng = pickupCoords[1] + (idx === 0 ? 0.004 : idx === 1 ? 0.005 : idx === 2 ? -0.007 : -0.004);
      const dist = calculateDistance(pickupCoords[0], pickupCoords[1], jitterLat, jitterLng).toFixed(1);
      const estMins = Math.max(2, Math.round(dist * 3));

      const guideIcon = L.divIcon({
        className: 'uber-guide-car-pin',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-10 h-10 rounded-full border-2 border-[#0B9B6E] bg-white dark:bg-slate-900 overflow-hidden shadow-xl hover:scale-110 transition duration-200">
              <img src="${g.avatar}" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-2 -right-1 w-4 h-4 bg-[#0B9B6E] text-white rounded-full flex items-center justify-center text-[9px] font-bold border border-white">
              ✓
            </div>
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white/20">
              ${estMins}m away
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const gMarker = L.marker([jitterLat, jitterLng], { icon: guideIcon }).addTo(map);
      gMarker.bindPopup(`
        <div class="text-left font-sans p-1">
          <div class="font-extrabold text-xs text-slate-900">${g.name}</div>
          <div class="text-[10px] text-emerald-600 font-bold">${g.guideType} • ★ ${g.rating}</div>
          <div class="text-[10px] text-slate-500 mt-1">₹${g.hourlyRate}/hr • ~${estMins} mins to pickup</div>
        </div>
      `);
      guideMarkersRef.current.push(gMarker);
    });
  }, [pickupCoords, availableGuides]);

  // Request Guide / Matching Sequence
  const handleRequestGuide = () => {
    setBookingState('SEARCHING');
    setSearchProgress(15);

    const step1 = setTimeout(() => setSearchProgress(45), 800);
    const step2 = setTimeout(() => setSearchProgress(80), 1600);

    const step3 = setTimeout(() => {
      setSearchProgress(100);

      // Select closest matching guide
      const matched = availableGuides[0] || {
        name: 'Vikram Singh Rathore',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        rating: 4.96,
        reviewCount: 260,
        guideType: selectedTier.title,
        hourlyRate: selectedTier.hourlyRate,
        languages: ['Hindi', 'English']
      };

      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const bookingId = `UBER-GD-${Math.floor(10000 + Math.random() * 90000)}`;

      setMatchedGuideData(matched);
      setActiveOtp(otp);
      setEtaRemainingSeconds(selectedTier.etaMinutes * 60);
      setBookingState('MATCHED');

      // Create permanent booking in store
      const bookingRecord = {
        bookingId,
        id: bookingId,
        bookingType: 'UBER_INSTANT_GUIDE',
        guideId: matched.id || 'g1',
        guideName: matched.name,
        guideAvatar: matched.avatar,
        serviceTier: selectedTier.title,
        city: selectedCity,
        pickupLocation: pickupLandmark,
        duration: isMultiDay ? `${multiDaysCount} Days` : `${durationOption} Hours`,
        totalAmount: totalFare,
        startOtp: otp,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      createBooking(bookingRecord);

      showToast({
        type: 'success',
        title: 'Guide En Route! 🚀',
        message: `${matched.name} has accepted your request. Start OTP: ${otp}`
      });
    }, 2400);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  // ETA Countdown simulation when matched
  useEffect(() => {
    if (bookingState !== 'MATCHED' || etaRemainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setEtaRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [bookingState, etaRemainingSeconds]);

  const etaMinutesDisplay = Math.floor(etaRemainingSeconds / 60);
  const etaSecondsDisplay = etaRemainingSeconds % 60;

  const handleCancelBooking = () => {
    setBookingState('IDLE');
    setMatchedGuideData(null);
    setActiveOtp(null);
    showToast({ type: 'info', title: 'Request Cancelled', message: 'You have cancelled the guide request. Zero fee charged.' });
  };

  return (
    <div className="bg-white dark:bg-[#111C15] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-xl overflow-hidden text-[#152238] dark:text-[#E8F0EC]">
      
      {/* ══════════════════════════════════════════════════
          UBER HEADER: PAN-INDIA CITY & PICKUP SELECTOR
          ══════════════════════════════════════════════════ */}
      <div className="p-4 sm:p-6 border-b border-[#E0E8E4] dark:border-[#243028] bg-[#F8F7F3] dark:bg-[#162019]">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-[11px] font-extrabold uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#0B9B6E] animate-ping"></span>
              <span>⚡ ON-DEMAND INSTANT GUIDE HIRE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white font-heading">
              Book a Guide Near You — Like Calling a Ride
            </h2>
            <p className="text-xs text-[#8A9BAD]">
              Select monument pickup anywhere in India. Transparent upfront pricing, zero haggling, verified start OTP.
            </p>
          </div>

          {/* Quick City Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8A9BAD] uppercase whitespace-nowrap">Destination:</span>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="bg-white dark:bg-[#111C15] border border-[#0B9B6E] text-xs font-black px-3.5 py-2 rounded-xl text-[#07543F] dark:text-[#4ADE80] focus:outline-none shadow-xs cursor-pointer"
            >
              {Object.keys(CITIES_CONFIG).map((city) => (
                <option key={city} value={city}>
                  📍 {city} ({CITIES_CONFIG[city].state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pickup Landmark Bar */}
        <div className="mt-4 pt-4 border-t border-[#E0E8E4] dark:border-[#243028] grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 flex items-center gap-3 bg-white dark:bg-[#111C15] p-2.5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028]">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs flex-shrink-0">
              <i className="fa-solid fa-location-dot text-[#4ADE80]"></i>
            </div>
            <div className="flex-1 text-left">
              <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD]">Meeting / Pickup Spot</div>
              <select
                value={pickupLandmark}
                onChange={(e) => handleLandmarkChange(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-black text-[#152238] dark:text-white focus:outline-none cursor-pointer"
              >
                {cityConfig.landmarks.map((l) => (
                  <option key={l.name} value={l.name} className="dark:bg-[#111C15]">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="flex-1 py-3 px-3 rounded-2xl bg-white dark:bg-[#111C15] hover:bg-slate-50 dark:hover:bg-[#1f2d24] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold text-[#152238] dark:text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <i className="fa-solid fa-crosshairs text-[#0B9B6E]"></i>
              <span>Use My GPS</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SPLIT VIEW: MAP RADAR (LEFT/TOP) + UBER BOOKING CONSOLE (RIGHT)
          ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* MAP CONTAINER (7 COLS) */}
        <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[560px] bg-slate-100 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-[#E0E8E4] dark:border-[#243028]">
          <div ref={mapContainerRef} className="w-full h-full min-h-[380px] lg:min-h-[560px] z-10" />

          {/* Floating Radar Status Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-[#111C15]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-md flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B9B6E] animate-ping"></span>
            <div className="text-left">
              <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD]">Live Radar</div>
              <div className="text-xs font-black text-[#152238] dark:text-white">
                {availableGuides.length} Active Guides in {selectedCity}
              </div>
            </div>
          </div>

          {/* Live Searching Animation Overlay on Map */}
          {bookingState === 'SEARCHING' && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-scale-in">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#0B9B6E] border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  🧭
                </div>
              </div>
              <div className="space-y-1 text-white">
                <h3 className="text-lg font-black font-heading">
                  Connecting to Closest {selectedTier.title}...
                </h3>
                <p className="text-xs text-white/80 max-w-sm">
                  Scanning verified hosts within 3 km of {pickupLandmark}. Negotiating best verified fare...
                </p>
              </div>
              <div className="w-48 bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0B9B6E] h-full transition-all duration-300"
                  style={{ width: `${searchProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* UBER CONSOLE (5 COLS) */}
        <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-5 text-left bg-white dark:bg-[#111C15]">

          {/* ══════════════════════════════════════════════════
              STATE 1: IDLE — TIER SELECTION & FARE REVIEW
              ══════════════════════════════════════════════════ */}
          {bookingState === 'IDLE' && (
            <div className="space-y-5 animate-scale-in">
              
              {/* Service Tier Cards */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD] tracking-wider">
                  Select Guide Service Tier
                </div>
                
                <div className="space-y-2">
                  {SERVICE_TIERS.map((tier) => {
                    const isSelected = selectedTier.id === tier.id;
                    const tierFare = tier.hourlyRate * calculatedHours;

                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-[#0B9B6E] bg-[#E8F7F1]/30 dark:bg-[#07543F]/15 shadow-sm'
                            : 'border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/40 bg-[#F8F7F3] dark:bg-[#162019]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl p-2 rounded-xl bg-white dark:bg-[#111C15] shadow-xs">
                            {tier.avatarEmoji}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-[#152238] dark:text-white">
                                {tier.title}
                              </span>
                              {tier.badge && (
                                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                  tier.isPopular
                                    ? 'bg-[#0B9B6E] text-white'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}>
                                  {tier.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#8A9BAD] flex items-center gap-2 mt-0.5">
                              <span>⏱ ~{tier.etaMinutes} mins away</span>
                              <span>•</span>
                              <span>₹{tier.hourlyRate}/hr</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-[#07543F] dark:text-[#4ADE80]">
                            ₹{tierFare.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-[#8A9BAD]">Total Est.</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tour Duration Selector (Hours vs Days) */}
              <div className="space-y-2 pt-2 border-t border-[#F1F5F3] dark:border-[#243028]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-[#8A9BAD] tracking-wider">
                    Tour Duration
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMultiDay(!isMultiDay)}
                    className="text-xs font-bold text-[#0B9B6E] hover:underline cursor-pointer"
                  >
                    {isMultiDay ? 'Switch to Hourly Walk' : 'Need Multi-Day Package?'}
                  </button>
                </div>

                {!isMultiDay ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { hours: 2, label: '2 Hours', note: 'Highlights' },
                      { hours: 4, label: '4 Hours', note: 'Half Day' },
                      { hours: 8, label: '1 Full Day', note: '8 Hours' },
                    ].map((opt) => (
                      <button
                        key={opt.hours}
                        type="button"
                        onClick={() => setDurationOption(opt.hours)}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          durationOption === opt.hours
                            ? 'border-[#0B9B6E] bg-[#0B9B6E] text-white font-black shadow-xs'
                            : 'border-[#E0E8E4] dark:border-[#243028] bg-[#F8F7F3] dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4]'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{opt.label}</div>
                        <div className={`text-[10px] ${durationOption === opt.hours ? 'text-white/80' : 'text-[#8A9BAD]'}`}>
                          {opt.note}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-[#F8F7F3] dark:bg-[#162019] rounded-2xl border border-[#E0E8E4] dark:border-[#243028]">
                    <span className="text-xs font-bold text-[#152238] dark:text-white">Days Count:</span>
                    {[2, 3, 5].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setMultiDaysCount(d)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          multiDaysCount === d
                            ? 'bg-[#0B9B6E] text-white'
                            : 'bg-white dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4]'
                        }`}
                      >
                        {d} Days ({d * 6} hrs)
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Transparent Price Breakdown */}
              <div className="p-4 rounded-2xl bg-[#F8F7F3] dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#4A5C6E] dark:text-[#9AB0A4]">
                  <span>{selectedTier.title} Tariff ({calculatedHours} hrs)</span>
                  <span className="font-bold text-[#152238] dark:text-white">₹{baseTariff}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#0B9B6E] font-bold">
                  <span>RAAHI Fair Price Guarantee</span>
                  <span>Zero Commission Markups</span>
                </div>
                <div className="pt-2 border-t border-[#E0E8E4] dark:border-[#243028] flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#152238] dark:text-white uppercase">Total Fare</span>
                  <span className="text-lg font-black text-[#07543F] dark:text-[#4ADE80]">
                    ₹{totalFare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* 1-Tap Request CTA */}
              <button
                type="button"
                onClick={handleRequestGuide}
                className="w-full py-4 rounded-2xl bg-[#0B9B6E] hover:bg-[#07543F] text-white font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.99]"
              >
                <i className="fa-solid fa-bolt text-amber-300"></i>
                <span>Request Guide Now • ₹{totalFare}</span>
              </button>

              <p className="text-[10px] text-center text-[#8A9BAD]">
                🔒 4-digit start OTP provided immediately. No upfront debit required.
              </p>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STATE 2: SEARCHING RADAR ACTIVE
              ══════════════════════════════════════════════════ */}
          {bookingState === 'SEARCHING' && (
            <div className="py-12 text-center space-y-4 animate-scale-in">
              <div className="w-16 h-16 border-4 border-[#0B9B6E] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h3 className="text-lg font-black text-[#152238] dark:text-white font-heading">
                Contacting Nearby Guides...
              </h3>
              <p className="text-xs text-[#8A9BAD] max-w-xs mx-auto">
                Finding the closest verified {selectedTier.title} near {pickupLandmark}.
              </p>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STATE 3: MATCHED & EN ROUTE (THE UBER RIDE SCREEN)
              ══════════════════════════════════════════════════ */}
          {bookingState === 'MATCHED' && matchedGuideData && (
            <div className="space-y-5 animate-scale-in">
              
              {/* Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F3] dark:border-[#243028]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B9B6E] animate-ping"></span>
                  <span className="text-xs font-extrabold text-[#0B9B6E] uppercase">Guide En Route</span>
                </div>
                <div className="text-xs font-black text-[#152238] dark:text-white">
                  ETA: <span className="text-[#0B9B6E]">{etaMinutesDisplay}:{etaSecondsDisplay < 10 ? `0${etaSecondsDisplay}` : etaSecondsDisplay} mins</span>
                </div>
              </div>

              {/* Matched Guide Card */}
              <div className="p-4 rounded-3xl bg-[#F8F7F3] dark:bg-[#162019] border border-[#0B9B6E]/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={matchedGuideData.avatar}
                      alt={matchedGuideData.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#0B9B6E] shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0B9B6E] text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#152238] dark:text-white font-heading">
                      {matchedGuideData.name}
                    </h4>
                    <div className="text-xs text-[#8A9BAD] flex items-center gap-1.5 mt-0.5">
                      <span className="text-amber-500 font-bold">★ {matchedGuideData.rating}</span>
                      <span>•</span>
                      <span>{selectedTier.title}</span>
                    </div>
                    <div className="text-[10px] text-[#07543F] dark:text-[#4ADE80] font-bold mt-1">
                      🗣 {matchedGuideData.languages?.join(', ') || 'English, Hindi'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-[#8A9BAD] uppercase font-bold">Fare</div>
                  <div className="text-base font-black text-[#07543F] dark:text-[#4ADE80]">
                    ₹{totalFare}
                  </div>
                </div>
              </div>

              {/* 4-DIGIT SECURITY START OTP */}
              <div className="p-4 rounded-2xl bg-[#E8F7F1] dark:bg-[#07543F]/20 border border-[#0B9B6E]/40 text-center space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-[#07543F] dark:text-[#4ADE80] tracking-wider">
                  START OTP CODE
                </div>
                <div className="text-3xl font-black font-mono tracking-widest text-[#07543F] dark:text-[#4ADE80]">
                  {activeOtp}
                </div>
                <p className="text-[10px] text-[#4A5C6E] dark:text-[#9AB0A4]">
                  Share this 4-digit code with {matchedGuideData.name} when you meet at {pickupLandmark}.
                </p>
              </div>

              {/* Live Pickup Details */}
              <div className="text-xs space-y-1 p-3 bg-white dark:bg-[#111C15] rounded-xl border border-[#E0E8E4] dark:border-[#243028]">
                <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD]">Meeting Point</div>
                <div className="font-bold text-[#152238] dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-[#0B9B6E]"></i>
                  <span>{pickupLandmark}</span>
                </div>
              </div>

              {/* Action Buttons: Call, Chat & Cancel */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => showToast({ type: 'info', title: 'Connecting Call', message: `Calling ${matchedGuideData.name} on masked tourist line...` })}
                  className="py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition cursor-pointer"
                >
                  <i className="fa-solid fa-phone"></i>
                  <span>Call Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast({ type: 'info', title: 'Chat Opened', message: `Chat session active with ${matchedGuideData.name}.` })}
                  className="py-3 px-4 rounded-xl bg-[#0B9B6E] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#07543F] transition cursor-pointer"
                >
                  <i className="fa-solid fa-comment-dots"></i>
                  <span>Message</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCancelBooking}
                className="w-full py-2.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
              >
                Cancel Request
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
