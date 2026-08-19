import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GuideProfile } from '@raahi/shared-types';
import { useBookingStore } from '../store/useBookingStore';

interface LeafletRadarMapProps {
  guides: GuideProfile[];
  center?: [number, number];
}

export const LeafletRadarMap: React.FC<LeafletRadarMapProps> = ({
  guides,
  center = [26.9124, 75.7873]
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const openBookingModal = useBookingStore((state) => state.openBookingModal);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 13,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Default Tile Layer (Standard / Warm Map)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    // Add Tourist Live Pulse Marker
    const touristIcon = L.divIcon({
      className: 'radar-pulse-icon',
      html: `<div class="w-6 h-6 bg-amber-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-slate-950 text-[10px] font-bold"><i class="fa-solid fa-user"></i></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    L.marker(center, { icon: touristIcon }).addTo(map).bindPopup(`<b style="color:#D97706">Your Live Location</b><br/>Amer Road, Jaipur`);

    // Add Guide Markers
    guides.forEach((g) => {
      const guideIcon = L.divIcon({
        className: 'custom-guide-icon',
        html: `<div class="w-9 h-9 rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-900 overflow-hidden shadow-lg transform hover:scale-125 transition">
                <img src="${g.avatar}" class="w-full h-full object-cover" />
              </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([g.lat, g.lng], { icon: guideIcon }).addTo(map);
      marker.bindPopup(`
        <div class="p-1 space-y-2 text-xs">
          <div class="flex items-center gap-2">
            <img src="${g.avatar}" class="w-8 h-8 rounded-full object-cover border border-amber-500" />
            <div>
              <div class="font-bold text-slate-900">${g.name}</div>
              <div class="text-[10px] text-emerald-600 font-semibold">✓ Verified Local Host</div>
            </div>
          </div>
          <div class="flex justify-between text-[11px] text-slate-600">
            <span>⭐ ${g.rating} (${g.reviewCount})</span>
            <span class="font-bold text-amber-600">₹${g.hourlyRate}/hr</span>
          </div>
          <button id="book-btn-${g.id}" class="w-full py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-center hover:bg-amber-400">
            Book Guide Now
          </button>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`book-btn-${g.id}`);
        if (btn) {
          btn.onclick = () => openBookingModal(g);
        }
      });
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, guides, openBookingModal]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-3 shadow-md">
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span> Live Guides Online
        </span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="text-slate-600 dark:text-slate-300">
          <i className="fa-solid fa-location-dot text-amber-500 mr-1"></i> Amer Fort • Hawa Mahal
        </span>
      </div>
    </div>
  );
};
