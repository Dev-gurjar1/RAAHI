import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { GuideProfile } from '@raahi/shared-types';
import { useBookingStore } from '../store/useBookingStore';
import { calculateDistance } from '../utils/geo';
import { useToastStore } from '../store/useToastStore';

interface LeafletRadarMapProps {
  guides: GuideProfile[];
  center?: [number, number];
}

export const LeafletRadarMap: React.FC<LeafletRadarMapProps> = ({
  guides,
  center: initialCenter = [26.9124, 75.7873]
}) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const touristMarkerRef = useRef<L.Marker | null>(null);

  const openBookingModal = useBookingStore((state) => state.openBookingModal);
  const showToast = useToastStore((state) => state.showToast);

  // Map Filter States
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(initialCenter);
  const [maxDistance, setMaxDistance] = useState<number>(25); // km
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(800);
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [expertise, setExpertise] = useState<string>('all');
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

  // Calculate live distance from center
  const guidesWithDistance = guides.map((g) => ({
    ...g,
    distanceKm: calculateDistance(currentCenter[0], currentCenter[1], g.lat, g.lng)
  }));

  // Filter guides according to filter states
  const filteredGuides = guidesWithDistance.filter((g) => {
    const matchesDistance = g.distanceKm <= maxDistance;
    const matchesRating = g.rating >= minRating;
    const matchesPrice = g.hourlyRate <= maxPrice;
    const matchesOnline = !onlyOnline || g.online;
    const matchesExpertise = expertise === 'all' || g.specialties.includes(expertise);
    return matchesDistance && matchesRating && matchesPrice && matchesOnline && matchesExpertise;
  });

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: currentCenter,
      zoom: 13,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Carto Voyager Warm Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    // Initial Tourist Pulse Marker
    const touristIcon = L.divIcon({
      className: 'radar-pulse-icon',
      html: `<div class="w-7 h-7 bg-amber-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-slate-950 text-[11px] font-extrabold animate-pulse"><i class="fa-solid fa-location-crosshairs"></i></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    const tMarker = L.marker(currentCenter, { icon: touristIcon }).addTo(map);
    tMarker.bindPopup(`<div class="p-1 text-xs font-bold text-amber-700">📍 Your Live GPS Location</div>`);
    touristMarkerRef.current = tMarker;

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Guide Markers dynamically when filteredGuides or map updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Add updated markers
    filteredGuides.forEach((g) => {
      const guideIcon = L.divIcon({
        className: 'custom-guide-marker-pin',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-10 h-10 rounded-full border-2 ${g.online ? 'border-emerald-500' : 'border-slate-300'} bg-white dark:bg-slate-900 overflow-hidden shadow-xl transform group-hover:scale-110 transition duration-300">
              <img src="${g.avatar}" class="w-full h-full object-cover" />
            </div>
            <span class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold border border-white shadow-xs">
              ✓
            </span>
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white/20">
              ₹${g.hourlyRate}/hr
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([g.lat, g.lng], { icon: guideIcon }).addTo(map);

      // Compact Guide Preview Card Popup
      const popupHtml = `
        <div className="p-1 font-sans text-left space-y-3 max-w-[220px]">
          <div class="flex items-center gap-3">
            <div class="relative">
              <img src="${g.avatar}" class="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-md" />
              <span class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold border border-white">✓</span>
            </div>
            <div>
              <div class="font-extrabold text-slate-900 text-sm font-heading leading-snug">${g.name}</div>
              <div class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-emerald-200">
                ✓ Verified Local Host
              </div>
            </div>
          </div>

          <div class="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div class="flex items-center justify-between">
              <span class="text-amber-500 font-extrabold">★ ${g.rating} (${g.reviewCount})</span>
              <span class="font-extrabold text-orange-600">₹${g.hourlyRate}/hr</span>
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
              <span>📍 ${g.distanceKm} km away</span>
              <span class="font-bold text-emerald-600">${g.online ? '● Available Now' : '○ Active Today'}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <button id="view-profile-${g.id}" class="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-center text-[11px] transition">
              Profile
            </button>
            <button id="book-guide-${g.id}" class="py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-center text-[11px] transition shadow-xs">
              Book Guide
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { minWidth: 230, maxWidth: 250 });

      marker.on('popupopen', () => {
        const viewBtn = document.getElementById(`view-profile-${g.id}`);
        const bookBtn = document.getElementById(`book-guide-${g.id}`);

        if (viewBtn) {
          viewBtn.onclick = () => {
            map.closePopup();
            navigate(`/guides/${g.id}`);
          };
        }

        if (bookBtn) {
          bookBtn.onclick = () => {
            map.closePopup();
            openBookingModal(g);
          };
        }
      });

      markersRef.current.push(marker);
    });
  }, [filteredGuides, navigate, openBookingModal]);

  // "Use My Location" GPS Trigger
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      showToast({
        type: 'warning',
        title: 'Geolocation Unavailable',
        message: 'Browser location access is not supported. Centered on Jaipur hub.'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        const newCoords: [number, number] = [userLat, userLng];

        setCurrentCenter(newCoords);

        if (mapRef.current) {
          mapRef.current.flyTo(newCoords, 14, { duration: 1.5 });
        }

        if (touristMarkerRef.current) {
          touristMarkerRef.current.setLatLng(newCoords);
        }

        showToast({
          type: 'success',
          title: 'GPS Location Centered 📍',
          message: 'Found nearby verified hosts relative to your current location.'
        });
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        showToast({
          type: 'info',
          title: 'Using Jaipur Hub',
          message: 'Centered on Jaipur city center (Amer Road & Hawa Mahal).'
        });
      }
    );
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] rounded-3xl overflow-hidden shadow-floating border border-slate-200 dark:border-slate-800 font-sans">
      
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* MAP TOP FILTER BAR OVERLAY */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
        
        {/* Quick Filter Buttons (Pointer Events Active) */}
        <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-wrap items-center gap-2 text-xs font-bold">
          
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="px-3 py-1.5 bg-orange-500 text-white rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Filters ({filteredGuides.length} Guides)</span>
          </button>

          <button
            onClick={() => setOnlyOnline(!onlyOnline)}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 border ${
              onlyOnline
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyOnline ? 'bg-white' : 'bg-emerald-500'}`}></span>
            <span>Online Only</span>
          </button>

          <select
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">All Specialties</option>
            <option value="Heritage">Heritage & Forts</option>
            <option value="Food">Food & Bazaars</option>
            <option value="Secret Passages">Secret Passages</option>
            <option value="Photography">Photography</option>
          </select>
        </div>

        {/* GPS "Use My Location" Button (Pointer Events Active) */}
        <button
          onClick={handleUseMyLocation}
          className="pointer-events-auto px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition"
        >
          <i className="fa-solid fa-location-crosshairs text-orange-400"></i>
          <span>Use My Location</span>
        </button>

      </div>

      {/* EXPANDABLE MAP FILTERS DRAWER PANEL */}
      {isFilterExpanded && (
        <div className="absolute top-16 left-4 right-4 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 text-xs font-sans text-left max-w-xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-extrabold text-slate-900 dark:text-white font-heading">
              Map Filter Parameters
            </span>
            <button onClick={() => setIsFilterExpanded(false)} className="text-slate-400 hover:text-slate-700">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Max Distance Slider */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Distance</span>
                <span className="text-orange-500 font-extrabold">&lt; {maxDistance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Min Rating Selector */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Min Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={0}>All Ratings</option>
                <option value={4.8}>4.8+ ★ Rating</option>
                <option value={4.9}>4.9+ ★ Rating</option>
              </select>
            </div>

            {/* Max Hourly Rate Slider */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Max Tariff</span>
                <span className="text-emerald-600 font-extrabold">₹{maxPrice}/hr</span>
              </div>
              <input
                type="range"
                min="300"
                max="800"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

          </div>
        </div>
      )}

      {/* BOTTOM RADAR STATUS BAR OVERLAY */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-3 shadow-md">
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span>{filteredGuides.filter((g) => g.online).length} Hosts Available Now</span>
        </span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="text-slate-600 dark:text-slate-300 font-medium">
          <i className="fa-solid fa-location-dot text-orange-500 mr-1"></i> Amer Fort • Old City Bazaars
        </span>
      </div>

    </div>
  );
};
