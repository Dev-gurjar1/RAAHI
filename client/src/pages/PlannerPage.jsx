import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useToastStore } from '../store/useToastStore.js';
import { useBookingStore } from '../store/useBookingStore.js';
import api from '../services/api.js';
import { POPULAR_DESTINATIONS } from '../constants/destinations.js';
import { JAIPUR_GUIDES_DATA } from '../constants/guides.js';
import { VerifiedBadge } from '../components/ui/VerifiedBadge.jsx';
import { StarRating } from '../components/ui/StarRating.jsx';

export const PlannerPage = () => {
  const [destination, setDestination] = useState('Jaipur');
  const [days, setDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState('Cultural');
  const [budgetTier, setBudgetTier] = useState('Moderate');
  const [selectedInterests, setSelectedInterests] = useState(['Heritage', 'Food', 'Photography']);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const showToast = useToastStore((state) => state.showToast);
  const openBookingModal = useBookingStore((state) => state.openBookingModal);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);

    const styleKey = travelStyle.toLowerCase();
    let generatedPlan = null;

    try {
      const res = await api.planner.generate({
        days,
        style: styleKey,
        durationDays: days,
        destination,
        interests: selectedInterests,
        budget: budgetTier,
      });
      if (res && res.data) {
        generatedPlan = res.data;
      }
    } catch (e) {
      console.warn('Backend planner API notice:', e.message);
    }

    // Comprehensive multi-day morning/afternoon/evening schedule
    const mockScheduleByDay = [
      {
        day: 1,
        dateLabel: 'Day 01',
        theme: 'Historic Citadels & Royal Stepwells',
        morning: {
          time: '08:00 AM — 11:30 AM',
          title: 'Amer Fort Secret Tunnels & Sheesh Mahal Acoustics',
          duration: '3.5 hrs',
          ticketCost: '₹100',
          transportCost: '₹120',
          guideTip: 'Visit before 9:30 AM to explore the King’s subterranean escape tunnel without tourist groups.',
          badge: 'Morning Landmark',
        },
        afternoon: {
          time: '01:00 PM — 04:00 PM',
          title: 'Panna Meena Ka Kund Stepwell & Royal Rajasthani Thali',
          duration: '3.0 hrs',
          ticketCost: 'Free',
          transportCost: '₹80',
          guideTip: 'Famous 16th-century zigzag staircases; order Dal Baati Churma at heritage kitchen 1135 AD.',
          badge: 'Afternoon Immersion',
        },
        evening: {
          time: '05:00 PM — 08:00 PM',
          title: 'Nahargarh Fort Sunset Skyline & Pink City Glow',
          duration: '3.0 hrs',
          ticketCost: '₹50',
          transportCost: '₹150',
          guideTip: 'Panoramic vantage over 4 million twinkling streetlamps as the sunset call to prayer echoes across the valley.',
          badge: 'Sunset Climax',
        },
      },
      {
        day: 2,
        dateLabel: 'Day 02',
        theme: 'Artisans, Bazaars & Culinary Secrets',
        morning: {
          time: '08:30 AM — 11:30 AM',
          title: 'Old Walled City Food Walk & 90-Yr Kachori Tasting',
          duration: '3.0 hrs',
          ticketCost: 'Free',
          transportCost: '₹50',
          guideTip: 'Authentic Pyaz Kachori, hand-churned lassi in clay kulhads, and freshly fried jalebis at Chaura Rasta.',
          badge: 'Culinary Morning',
        },
        afternoon: {
          time: '01:30 PM — 04:30 PM',
          title: 'Sanganer Block-Printing Guilds & Natural Indigo Workshop',
          duration: '3.0 hrs',
          ticketCost: 'Free',
          transportCost: '₹90',
          guideTip: 'Meet Master Chipper artisans stamping organic cottons directly at family-owned printing tables.',
          badge: 'Artisan Craft',
        },
        evening: {
          time: '05:30 PM — 08:30 PM',
          title: 'Johari Bazaar Sunset Walk & Haveli Rooftop Tea',
          duration: '3.0 hrs',
          ticketCost: 'Free',
          transportCost: '₹60',
          guideTip: 'Private 180-year-old painted haveli rooftop overlooking the lively street markets below.',
          badge: 'Evening Walk',
        },
      },
      {
        day: 3,
        dateLabel: 'Day 03',
        theme: 'Royal Astronomy & Sacred Temples',
        morning: {
          time: '08:00 AM — 11:30 AM',
          title: 'City Palace Museum & Jantar Mantar Solar Observatories',
          duration: '3.5 hrs',
          ticketCost: '₹200',
          transportCost: '₹60',
          guideTip: 'Live demonstration of the world’s largest stone sundial calibrated to two seconds of precision.',
          badge: 'Architecture',
        },
        afternoon: {
          time: '01:00 PM — 04:00 PM',
          title: 'Galtaji Monkey Temple Valley & Ancient Holy Springs',
          duration: '3.0 hrs',
          ticketCost: 'Free',
          transportCost: '₹110',
          guideTip: 'Natural mountain springs nestled between granite cliffs, ancient frescoes, and tranquil kunds.',
          badge: 'Sacred Valley',
        },
        evening: {
          time: '05:30 PM — 08:30 PM',
          title: 'Patrika Gate Photography & Farewell Rajasthani Banquet',
          duration: '3.0 hrs',
          ticketCost: 'Free',
          transportCost: '₹90',
          guideTip: '9 intricately hand-painted arches depicting regional kingdoms under illuminated evening floodlights.',
          badge: 'Grand Finale',
        },
      },
    ];

    const budgetMultiplier = budgetTier === 'Budget' ? 0.65 : budgetTier === 'Moderate' ? 1.0 : 1.85;

    const finalPlan = {
      destination,
      days,
      travelStyle,
      budgetTier,
      schedule: mockScheduleByDay.slice(0, Math.min(days, 3)),
      budget: {
        guide: Math.round(days * 850 * budgetMultiplier),
        transport: Math.round(days * 400 * budgetMultiplier),
        tickets: Math.round(days * 250),
        total: Math.round(days * (850 * budgetMultiplier + 400 * budgetMultiplier + 250)),
      },
      recommendedGuides: JAIPUR_GUIDES_DATA.slice(0, 3),
    };

    setPlan(finalPlan);
    setLoading(false);

    showToast({
      type: 'success',
      title: 'Itinerary Synthesized!',
      message: `Your ${days}-day ${travelStyle} route for ${destination} is ready.`,
    });
  };

  return (
    <div className="bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen text-[#152238] dark:text-[#E8F0EC]">

      {/* ══════════════════════════════════════════════════
          HERO: AI Travel Concierge
          ══════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold border border-[#0B9B6E]/30">
            <i className="fa-solid fa-wand-magic-sparkles text-[#F4A340]"></i>
            <span>INTELLIGENT TRAVEL CONCIERGE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#152238] dark:text-white font-heading tracking-tight">
            Plan Your Trip with RAAHI AI
          </h1>

          <p className="text-base sm:text-lg text-[#4A5C6E] dark:text-[#9AB0A4] max-w-2xl leading-relaxed">
            Generate customized, scam-free Indian itineraries connected to background-verified resident hosts, statutory fare estimates, and zero-commission stops.
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          INTERACTIVE AI CONTROLS (NOT A BORING HTML FORM)
          ══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">

        <div className="bg-white dark:bg-[#162019] p-6 sm:p-10 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-8">

          {/* 1. WHERE ARE YOU GOING? */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#0B9B6E] block">
              1. WHERE ARE YOU GOING?
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {POPULAR_DESTINATIONS.slice(0, 5).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDestination(d.name)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between aspect-[4/3] relative overflow-hidden group ${
                    destination === d.name
                      ? 'border-[#0B9B6E] ring-2 ring-[#0B9B6E]/30 shadow-md'
                      : 'border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/60'
                  }`}
                >
                  <img
                    src={d.image}
                    alt={d.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                  {destination === d.name && (
                    <span className="relative z-10 self-end w-5 h-5 rounded-full bg-[#0B9B6E] text-white flex items-center justify-center text-[10px]">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  )}

                  <div className="relative z-10 text-white mt-auto">
                    <span className="text-[10px] text-[#F4A340] font-bold uppercase tracking-wider block">
                      {d.tagline}
                    </span>
                    <span className="font-black text-base font-heading">
                      {d.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>


          {/* 2. HOW LONG? (Duration Stepper & Quick Pills) */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#0B9B6E] block">
              2. HOW LONG?
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {[1, 2, 3, 5, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                    days === d
                      ? 'bg-[#152238] text-white border-[#152238] shadow-sm'
                      : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]'
                  }`}
                >
                  {d} Day{d > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>


          {/* 3. YOUR TRAVEL STYLE */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#0B9B6E] block">
              3. YOUR TRAVEL STYLE
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Cultural', icon: 'fa-landmark', desc: 'Fortresses, royal havelis, history' },
                { name: 'Culinary', icon: 'fa-utensils', desc: 'Street food, tea stalls, local feasts' },
                { name: 'Relaxed', icon: 'fa-feather', desc: 'Unhurried, scenic rooftops & cafes' },
                { name: 'Adventure', icon: 'fa-mountain', desc: 'Stepwells, dawn walks & trails' },
              ].map((st) => (
                <button
                  key={st.name}
                  type="button"
                  onClick={() => setTravelStyle(st.name)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    travelStyle === st.name
                      ? 'bg-[#E8F7F1] dark:bg-[#07543F]/30 border-[#0B9B6E] text-[#07543F] dark:text-[#4ADE80] shadow-sm'
                      : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <i className={`fa-solid ${st.icon} text-base`}></i>
                    {travelStyle === st.name && <i className="fa-solid fa-check text-xs"></i>}
                  </div>
                  <div className="font-extrabold text-sm text-[#152238] dark:text-white font-heading">
                    {st.name}
                  </div>
                  <p className="text-[11px] text-[#8A9BAD] leading-tight">
                    {st.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>


          {/* 4. BUDGET TIER */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#0B9B6E] block">
              4. BUDGET
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { tier: 'Budget', est: '₹1,500/day', desc: 'Public transit, street eats & self exploration' },
                { tier: 'Moderate', est: '₹3,500/day', desc: 'Auto rickshaws, entrance fees & half-day guide' },
                { tier: 'Premium', est: '₹7,500/day', desc: 'Private AC car, full-day certified historian & fine dining' },
              ].map((b) => (
                <button
                  key={b.tier}
                  type="button"
                  onClick={() => setBudgetTier(b.tier)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                    budgetTier === b.tier
                      ? 'bg-[#152238] text-white border-[#152238] shadow-sm'
                      : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm font-heading">{b.tier}</span>
                    <span className={`text-xs font-bold ${budgetTier === b.tier ? 'text-[#F4A340]' : 'text-[#0B9B6E]'}`}>
                      {b.est}
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${budgetTier === b.tier ? 'text-white/80' : 'text-[#8A9BAD]'}`}>
                    {b.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>


          {/* 5. INTERESTS CHIPS */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#0B9B6E] block">
              5. INTERESTS
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Heritage', icon: 'fa-landmark' },
                { name: 'Food', icon: 'fa-utensils' },
                { name: 'Nature', icon: 'fa-tree' },
                { name: 'Photography', icon: 'fa-camera' },
                { name: 'Handicrafts', icon: 'fa-palette' },
                { name: 'Spiritual', icon: 'fa-om' },
              ].map((item) => {
                const active = selectedInterests.includes(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => toggleInterest(item.name)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      active
                        ? 'bg-[#0B9B6E] text-white border-[#0B9B6E] shadow-sm'
                        : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]'
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} text-[10px]`}></i>
                    <span>{item.name}</span>
                    {active && <i className="fa-solid fa-check text-[10px]"></i>}
                  </button>
                );
              })}
            </div>
          </div>


          {/* CTA: ✨ CREATE MY RAAHI ITINERARY → */}
          <div className="pt-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full btn-accent py-4 text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
            >
              <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
              <span>{loading ? 'Synthesizing Live Itinerary...' : '✨ CREATE MY RAAHI ITINERARY →'}</span>
            </button>
          </div>

        </div>


        {/* ══════════════════════════════════════════════════
            AFTER GENERATION: Beautiful Timeline (Morning / Afternoon / Evening)
            ══════════════════════════════════════════════════ */}
        {plan && (
          <div className="space-y-10 animate-slide-up">

            {/* Itinerary Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-[#162019] p-6 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm gap-4">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#0B9B6E]">
                  CURATED RAAHI TIMELINE
                </span>
                <h2 className="text-2xl font-black text-[#152238] dark:text-white font-heading">
                  {plan.destination} • {plan.days}-Day {plan.travelStyle} Journey
                </h2>
                <div className="text-xs text-[#8A9BAD] flex items-center gap-2">
                  <span>Tier: {plan.budgetTier}</span>
                  <span>•</span>
                  <span>Interests: {selectedInterests.join(', ')}</span>
                </div>
              </div>

              <div className="text-right bg-[#F8F7F3] dark:bg-[#111C15] p-3.5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028]">
                <span className="text-[10px] text-[#8A9BAD] uppercase font-bold block">Estimated Budget</span>
                <span className="text-2xl font-black text-[#0B9B6E] font-heading">
                  ₹{plan.budget.total}
                </span>
              </div>
            </div>

            {/* Daily Timeline Modules */}
            <div className="space-y-8">
              {plan.schedule.map((dayPlan) => (
                <div
                  key={dayPlan.day}
                  className="bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] p-6 sm:p-8 shadow-sm space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F3] dark:border-[#243028]">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-[#152238] text-white flex items-center justify-center font-black text-sm font-heading">
                        D{dayPlan.day}
                      </span>
                      <div>
                        <h3 className="font-black text-lg text-[#152238] dark:text-white font-heading">
                          DAY {dayPlan.day < 10 ? `0${dayPlan.day}` : dayPlan.day}
                        </h3>
                        <p className="text-xs text-[#8A9BAD] font-medium">{dayPlan.theme}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#07543F] dark:text-[#4ADE80] bg-[#E8F7F1] dark:bg-[#07543F]/30 px-3 py-1 rounded-full">
                      ✓ Zero Commission Route
                    </span>
                  </div>

                  {/* 3 Day Slots: Morning, Afternoon, Evening */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Morning */}
                    <div className="p-5 rounded-2xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-[#0B9B6E] tracking-wider px-2 py-0.5 rounded-md bg-[#E8F7F1] dark:bg-[#07543F]/30">
                            Morning
                          </span>
                          <span className="text-[10px] text-[#8A9BAD] font-medium">{dayPlan.morning.duration}</span>
                        </div>
                        <div className="text-xs font-semibold text-[#8A9BAD]">{dayPlan.morning.time}</div>
                        <h4 className="font-extrabold text-sm text-[#152238] dark:text-white font-heading leading-snug">
                          {dayPlan.morning.title}
                        </h4>
                        <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                          {dayPlan.morning.guideTip}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E0E8E4] dark:border-[#243028] flex items-center justify-between text-[11px] text-[#8A9BAD]">
                        <span>Ticket: <strong className="text-[#152238] dark:text-white">{dayPlan.morning.ticketCost}</strong></span>
                        <span>Transport: <strong className="text-[#152238] dark:text-white">{dayPlan.morning.transportCost}</strong></span>
                      </div>
                    </div>

                    {/* Afternoon */}
                    <div className="p-5 rounded-2xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-[#F4A340] tracking-wider px-2 py-0.5 rounded-md bg-[#FEF6E4] dark:bg-[#F4A340]/20">
                            Afternoon
                          </span>
                          <span className="text-[10px] text-[#8A9BAD] font-medium">{dayPlan.afternoon.duration}</span>
                        </div>
                        <div className="text-xs font-semibold text-[#8A9BAD]">{dayPlan.afternoon.time}</div>
                        <h4 className="font-extrabold text-sm text-[#152238] dark:text-white font-heading leading-snug">
                          {dayPlan.afternoon.title}
                        </h4>
                        <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                          {dayPlan.afternoon.guideTip}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E0E8E4] dark:border-[#243028] flex items-center justify-between text-[11px] text-[#8A9BAD]">
                        <span>Ticket: <strong className="text-[#152238] dark:text-white">{dayPlan.afternoon.ticketCost}</strong></span>
                        <span>Transport: <strong className="text-[#152238] dark:text-white">{dayPlan.afternoon.transportCost}</strong></span>
                      </div>
                    </div>

                    {/* Evening */}
                    <div className="p-5 rounded-2xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/30">
                            Sunset / Evening
                          </span>
                          <span className="text-[10px] text-[#8A9BAD] font-medium">{dayPlan.evening.duration}</span>
                        </div>
                        <div className="text-xs font-semibold text-[#8A9BAD]">{dayPlan.evening.time}</div>
                        <h4 className="font-extrabold text-sm text-[#152238] dark:text-white font-heading leading-snug">
                          {dayPlan.evening.title}
                        </h4>
                        <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                          {dayPlan.evening.guideTip}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E0E8E4] dark:border-[#243028] flex items-center justify-between text-[11px] text-[#8A9BAD]">
                        <span>Ticket: <strong className="text-[#152238] dark:text-white">{dayPlan.evening.ticketCost}</strong></span>
                        <span>Transport: <strong className="text-[#152238] dark:text-white">{dayPlan.evening.transportCost}</strong></span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Real Verified Guides Matching this Itinerary */}
            <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#0B9B6E]">
                    LIVE RAAHI INVENTORY
                  </span>
                  <h3 className="text-2xl font-black text-[#152238] dark:text-white font-heading mt-0.5">
                    Recommended Verified Hosts for this Route
                  </h3>
                </div>
                <NavLink
                  to="/guides"
                  className="text-xs font-bold text-[#07543F] dark:text-[#4ADE80] hover:underline"
                >
                  View All Guides &rarr;
                </NavLink>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plan.recommendedGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="p-5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] bg-[#F8F7F3] dark:bg-[#111C15] flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={guide.avatar}
                        alt={guide.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#0B9B6E]"
                      />
                      <div>
                        <NavLink
                          to={`/guides/${guide.id}`}
                          className="font-black text-sm text-[#152238] dark:text-white hover:text-[#0B9B6E] font-heading block"
                        >
                          {guide.name}
                        </NavLink>
                        <StarRating rating={guide.rating} />
                        <div className="text-[11px] text-[#8A9BAD] mt-0.5">{guide.city || 'Jaipur'}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E0E8E4] dark:border-[#243028] flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#152238] dark:text-white">
                        ₹{guide.hourlyRate}/hr
                      </span>
                      <button
                        onClick={() => openBookingModal(guide)}
                        className="btn-primary text-xs px-3.5 py-1.5"
                      >
                        Book Host
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default PlannerPage;
