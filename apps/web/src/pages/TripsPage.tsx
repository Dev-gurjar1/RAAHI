import React, { useState } from 'react';
import { useToastStore } from '../store/useToastStore';

interface TripItem {
  id: string;
  guideName: string;
  avatar: string;
  date: string;
  service: string;
  fare: number;
  status: 'Active' | 'Upcoming' | 'Completed' | 'Cancelled';
}

const INITIAL_TRIPS: TripItem[] = [
  {
    id: "TRIP-8821",
    guideName: "Vikram Singh Rathore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    date: "Yesterday, 3:30 PM",
    service: "Amer Fort Heritage Walk",
    fare: 450,
    status: "Completed"
  },
  {
    id: "TRIP-8822",
    guideName: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    date: "3 Days Ago",
    service: "Old City Street Food Crawl",
    fare: 850,
    status: "Completed"
  }
];

export const TripsPage: React.FC = () => {
  const [tab, setTab] = useState<'active' | 'upcoming' | 'completed' | 'cancelled'>('completed');
  const [trips, setTrips] = useState<TripItem[]>(INITIAL_TRIPS);
  const showToast = useToastStore((state) => state.showToast);

  const filteredTrips = trips.filter(
    (t) => t.status.toLowerCase() === tab.toLowerCase()
  );

  const handleRate = (id: string, name: string) => {
    showToast({
      type: 'success',
      title: 'Review Submitted',
      message: `Thank you for rating your trip with ${name}!`
    });
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">
            TRAVELER ITINERARIES
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            My Trips & Bookings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Track active tours, upcoming bookings, and completed itineraries.
          </p>
        </div>

        <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold">
          {['active', 'upcoming', 'completed', 'cancelled'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-2 rounded-full transition capitalize ${
                tab === t
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-suitcase"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">No {tab} trips found</h3>
            <p className="text-slate-500 text-xs">Browse our verified guides or tour packages to start exploring.</p>
          </div>
        ) : (
          filteredTrips.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card"
            >
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.guideName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 uppercase">
                      {t.status}
                    </span>
                    <span className="text-xs text-slate-400">{t.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">
                    {t.service} with {t.guideName}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Jaipur Region • Final Fare Paid: <span className="font-bold text-slate-900 dark:text-white">₹{t.fare}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleRate(t.id, t.guideName)}
                  className="px-5 py-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-orange-500 hover:text-white text-orange-600 dark:text-orange-400 font-bold rounded-full text-xs transition border border-slate-200 dark:border-slate-600 flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-star text-amber-500 text-xs"></i> Rate Guide
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
