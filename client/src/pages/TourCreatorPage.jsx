import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTourStore } from '../store/useTourStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

const PRESET_COVERS = [
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80"
];

const CATEGORIES = [
  'Heritage', 'Food', 'Culture', 'Photography', 'Adventure',
  'Nature', 'Night Tours', 'Markets', 'Spiritual', 'Hidden Gems',
  'Family', 'Budget Tours', 'Shopping'
];

export const TourCreatorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');

  const { user } = useAuthStore();
  const { tours = [], addTour, updateTour } = useTourStore();
  const showToast = useToastStore((state) => state.showToast);

  const [activeStep, setActiveStep] = useState(1);

  // STEP 1 — BASIC INFORMATION
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('Jaipur');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [category, setCategory] = useState('Heritage');

  // STEP 2 — TOUR DETAILS
  const [durationType, setDurationType] = useState('HOURS'); // 'HOURS' | 'DAYS' | 'BOTH'
  const [durationHours, setDurationHours] = useState(3);
  const [durationDays, setDurationDays] = useState(1);
  const [maxParticipants, setMaxParticipants] = useState(6);
  const [minParticipants, setMinParticipants] = useState(1);
  const [selectedLanguages, setSelectedLanguages] = useState(['English', 'Hindi']);
  const [ageSuitability, setAgeSuitability] = useState('All ages welcome');
  const [difficultyLevel, setDifficultyLevel] = useState('Easy');

  // STEP 3 — PRICING
  const [pricingType, setPricingType] = useState('PER_PERSON'); // PER_PERSON, PER_GROUP, FIXED_PRICE
  const [priceAmount, setPriceAmount] = useState(699);

  // STEP 4 — ITINERARY (Stops)
  const [itineraryStops, setItineraryStops] = useState([
    {
      stopNumber: 1,
      time: '09:00 AM',
      title: 'Hawa Mahal Plaza Meeting',
      durationMinutes: 30,
      description: 'Orientation, history briefing, and morning facade photos.',
      location: 'Hawa Mahal'
    },
    {
      stopNumber: 2,
      time: '09:45 AM',
      title: 'Old City Medieval Alleys',
      durationMinutes: 45,
      description: 'Walking through ancient wooden doorways and quiet residential quarters.',
      location: 'Sireh Deori Bazaar'
    }
  ]);

  // STEP 5 — WHAT'S INCLUDED / NOT INCLUDED
  const [includedItems, setIncludedItems] = useState(['Local Guide', 'Water Bottle', 'Heritage Route Access']);
  const [excludedItems, setExcludedItems] = useState(['Entry Tickets', 'Personal Transport', 'Meals']);
  const [newIncludedInput, setNewIncludedInput] = useState('');
  const [newExcludedInput, setNewExcludedInput] = useState('');

  // STEP 6 — AVAILABILITY
  const [availableDays, setAvailableDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [timeSlots, setTimeSlots] = useState(['09:00 AM', '02:30 PM']);
  const [newTimeSlotInput, setNewTimeSlotInput] = useState('');
  const [availableDates, setAvailableDates] = useState(['2026-09-28', '2026-09-29', '2026-09-30']);
  const [newDateInput, setNewDateInput] = useState('');

  // STEP 7 — IMAGES
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Prepopulate if editing existing tour
  useEffect(() => {
    if (editId) {
      const existing = tours.find((t) => t.id === editId || t.tourId === editId);
      if (existing) {
        setTitle(existing.title || '');
        setDescription(existing.description || existing.summary || '');
        setDestination(existing.destination || 'Jaipur');
        setMeetingPoint(existing.meetingPoint || '');
        setCategory(existing.category || 'Heritage');
        setDurationType(existing.durationUnit || (existing.durationDays > 1 ? 'DAYS' : 'HOURS'));
        setDurationHours(existing.durationHours || 3);
        setDurationDays(existing.durationDays || 1);
        setMaxParticipants(existing.maxParticipants || existing.maxCapacity || 6);
        setMinParticipants(existing.minParticipants || 1);
        setSelectedLanguages(existing.languages || ['English', 'Hindi']);
        setAgeSuitability(existing.ageSuitability || 'All ages welcome');
        setDifficultyLevel(existing.difficultyLevel || 'Easy');
        setPricingType(existing.pricingType || 'PER_PERSON');
        setPriceAmount(existing.price || existing.pricePerPerson || 699);
        if (existing.itinerary && existing.itinerary.length > 0) {
          setItineraryStops(existing.itinerary);
        }
        if (existing.included) setIncludedItems(existing.included);
        if (existing.excluded) setExcludedItems(existing.excluded);
        if (existing.availability?.days) setAvailableDays(existing.availability.days);
        if (existing.availability?.timeSlots) setTimeSlots(existing.availability.timeSlots);
        if (existing.availableDates) setAvailableDates(existing.availableDates);
        if (existing.coverImage) setCoverImage(existing.coverImage);
      }
    }
  }, [editId, tours]);

  // Itinerary helper actions
  const addStop = () => {
    const nextNum = itineraryStops.length + 1;
    setItineraryStops([
      ...itineraryStops,
      {
        stopNumber: nextNum,
        time: '11:00 AM',
        title: `Stop ${nextNum}: Local Landmark`,
        durationMinutes: 30,
        description: 'Describe what visitors will explore here...',
        location: destination
      }
    ]);
  };

  const removeStop = (idx) => {
    if (itineraryStops.length <= 1) return;
    const updated = itineraryStops.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stopNumber: i + 1 }));
    setItineraryStops(updated);
  };

  const updateStopField = (idx, field, value) => {
    const updated = [...itineraryStops];
    updated[idx][field] = value;
    setItineraryStops(updated);
  };

  const moveStop = (idx, direction) => {
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === itineraryStops.length - 1)) return;
    const updated = [...itineraryStops];
    const targetIdx = idx + direction;
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setItineraryStops(updated.map((s, i) => ({ ...s, stopNumber: i + 1 })));
  };

  // Tag helper actions
  const addIncludedItem = () => {
    if (newIncludedInput.trim() && !includedItems.includes(newIncludedInput.trim())) {
      setIncludedItems([...includedItems, newIncludedInput.trim()]);
      setNewIncludedInput('');
    }
  };

  const removeIncludedItem = (item) => {
    setIncludedItems(includedItems.filter((i) => i !== item));
  };

  const addExcludedItem = () => {
    if (newExcludedInput.trim() && !excludedItems.includes(newExcludedInput.trim())) {
      setExcludedItems([...excludedItems, newExcludedInput.trim()]);
      setNewExcludedInput('');
    }
  };

  const removeExcludedItem = (item) => {
    setExcludedItems(excludedItems.filter((i) => i !== item));
  };

  const toggleDay = (day) => {
    if (availableDays.includes(day)) {
      if (availableDays.length > 1) setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const addTimeSlot = () => {
    if (newTimeSlotInput.trim() && !timeSlots.includes(newTimeSlotInput.trim())) {
      setTimeSlots([...timeSlots, newTimeSlotInput.trim()]);
      setNewTimeSlotInput('');
    }
  };

  const removeTimeSlot = (slot) => {
    if (timeSlots.length > 1) setTimeSlots(timeSlots.filter((s) => s !== slot));
  };

  const addAvailableDate = () => {
    if (newDateInput && !availableDates.includes(newDateInput)) {
      setAvailableDates([...availableDates, newDateInput]);
      setNewDateInput('');
    }
  };

  const removeAvailableDate = (d) => {
    setAvailableDates(availableDates.filter((date) => date !== d));
  };

  // Final Action Handlers
  const handleSave = async (statusToSet = 'PUBLISHED') => {
    if (!title.trim()) {
      showToast({ type: 'warning', title: 'Tour Title Required', message: 'Please provide a title in Step 1.' });
      setActiveStep(1);
      return;
    }

    let durationText = `${durationHours} Hours`;
    if (durationType === 'DAYS') {
      durationText = durationDays === 1 ? '1 Full Day' : `${durationDays} Days`;
    } else if (durationType === 'BOTH') {
      durationText = `${durationDays} ${durationDays === 1 ? 'Day' : 'Days'} (${durationHours} Hours)`;
    } else {
      durationText = `${durationHours} ${durationHours === 1 ? 'Hour' : 'Hours'}`;
    }

    const tourPayload = {
      tourId: editId || `tp_${Date.now()}`,
      guideId: user?.id || 'g1',
      guideName: user?.name || 'Vikram Singh Rathore',
      guideAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      guideType: user?.guideType || 'PROFESSIONAL_GUIDE',
      guideVerified: true,
      title: title.trim(),
      category,
      destination: destination.trim(),
      summary: description.slice(0, 160),
      description: description.trim(),
      duration: durationText,
      durationUnit: durationType,
      durationDays: Number(durationDays),
      durationHours: Number(durationHours),
      pricingType,
      price: Number(priceAmount),
      pricePerPerson: pricingType === 'PER_PERSON' ? Number(priceAmount) : undefined,
      pricePerGroup: pricingType === 'PER_GROUP' ? Number(priceAmount) : undefined,
      fixedPrice: pricingType === 'FIXED_PRICE' ? Number(priceAmount) : undefined,
      minParticipants: Number(minParticipants),
      maxParticipants: Number(maxParticipants),
      maxCapacity: Number(maxParticipants),
      languages: selectedLanguages,
      ageSuitability,
      difficultyLevel,
      meetingPoint: meetingPoint.trim() || `${destination} Central Landmark`,
      highlights: itineraryStops.map((s) => s.title),
      included: includedItems,
      excluded: excludedItems,
      cancellationPolicy: 'Free cancellation up to 24 hours before tour start time.',
      safetyInfo: 'Verified local host, anti-scam certified route.',
      availability: {
        days: availableDays,
        timeSlots,
        availableDates,
        blockedDates: []
      },
      availableDates,
      itinerary: itineraryStops,
      coverImage: coverImage || PRESET_COVERS[0],
      image: coverImage || PRESET_COVERS[0],
      images: [coverImage || PRESET_COVERS[0]],
      status: statusToSet
    };

    if (editId) {
      await updateTour(editId, tourPayload);
      showToast({
        type: 'success',
        title: statusToSet === 'DRAFT' ? 'Draft Saved' : 'Tour Updated! ✓',
        message: `"${title}" has been updated.`
      });
    } else {
      await addTour(tourPayload);
      showToast({
        type: 'success',
        title: statusToSet === 'DRAFT' ? 'Draft Saved' : 'Tour Published! 🎉',
        message: statusToSet === 'DRAFT'
          ? 'Your tour draft is saved. You can publish it anytime.'
          : 'Your new tour is now live on the RAAHI marketplace!'
      });
    }

    navigate('/guide?tab=tours');
  };

  const stepsList = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Pricing' },
    { num: 4, label: 'Itinerary' },
    { num: 5, label: 'Inclusions' },
    { num: 6, label: 'Availability' },
    { num: 7, label: 'Images' },
    { num: 8, label: 'Preview' }
  ];

  return (
    <div className="bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen text-[#152238] dark:text-[#E8F0EC] pb-24 text-left">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#0B9B6E] tracking-wider">
              <i className="fa-solid fa-map-location-dot"></i>
              <span>GUIDE PARTNER PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">
              {editId ? 'Edit Tour Package' : 'Create New Bookable Tour'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave('DRAFT')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F8F7F3] dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border border-[#E0E8E4] dark:border-[#243028] hover:text-[#152238] dark:hover:text-white transition cursor-pointer"
            >
              Save Draft
            </button>
            <button
              onClick={() => navigate('/guide?tab=tours')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* 8-Step Navigation Stepper Bar */}
      <div className="bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] sticky top-16 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-none py-3 gap-2">
            {stepsList.map((s) => (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeStep === s.num
                    ? 'bg-[#07543F] text-white shadow-xs'
                    : activeStep > s.num
                    ? 'text-[#0B9B6E] bg-[#E8F7F1] dark:bg-[#07543F]/25'
                    : 'text-[#8A9BAD] hover:text-[#152238] dark:hover:text-white'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  activeStep === s.num ? 'bg-white text-[#07543F]' : 'bg-black/10 dark:bg-white/10'
                }`}>
                  {s.num}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Step Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white dark:bg-[#162019] p-6 sm:p-10 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-6">

          {/* ══════════════════════════════════════════════════
              STEP 1: BASIC INFORMATION
              ══════════════════════════════════════════════════ */}
          {activeStep === 1 && (
            <div className="space-y-5 animate-scale-in">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">STEP 1 OF 8</span>
                <h2 className="text-xl font-extrabold text-[#152238] dark:text-white font-heading">
                  Basic Tour Information
                </h2>
                <p className="text-xs text-[#8A9BAD]">
                  Name your tour clearly and explain what makes your route special.
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                  Tour Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Jaipur Old City Heritage Walk & Secret Passages"
                  className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-sm font-bold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                    Destination City *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Jaipur, Varanasi, Agra..."
                    className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-sm font-bold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-sm font-bold text-[#152238] dark:text-white focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                  Meeting Point Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  placeholder="e.g. Hawa Mahal Front Plaza, Badi Choupad"
                  className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-sm font-bold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the unique stories, hidden courtyards, historical insights, and architectural details travelers will experience..."
                  className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-medium text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 2: TOUR DETAILS
              ══════════════════════════════════════════════════ */}
          {activeStep === 2 && (
            <div className="space-y-5 animate-scale-in">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">STEP 2 OF 8</span>
                <h2 className="text-xl font-extrabold text-[#152238] dark:text-white font-heading">
                  Tour Duration & Capacity
                </h2>
                <p className="text-xs text-[#8A9BAD]">
                  Set realistic time requirements and group limits to ensure safety and quality.
                </p>
              </div>

              {/* Duration Type Selector */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-2">
                  Duration Format *
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F8F7F3] dark:bg-[#111C15] rounded-2xl border border-[#E0E8E4] dark:border-[#243028]">
                  {[
                    { id: 'HOURLY', unit: 'HOURS', label: '🕒 Hours Only', desc: '1–12 Hours' },
                    { id: 'DAILY', unit: 'DAYS', label: '📅 Days Only', desc: '1–30 Days' },
                    { id: 'BOTH', unit: 'BOTH', label: '⚡ Days + Hours', desc: 'Multi-Day / Detailed' }
                  ].map((dt) => (
                    <button
                      key={dt.unit}
                      type="button"
                      onClick={() => setDurationType(dt.unit)}
                      className={`p-2.5 rounded-xl text-left transition cursor-pointer flex flex-col justify-center ${
                        durationType === dt.unit
                          ? 'bg-[#0B9B6E] text-white shadow-sm'
                          : 'text-[#4A5C6E] dark:text-[#9AB0A4] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xs font-extrabold">{dt.label}</span>
                      <span className={`text-[10px] ${durationType === dt.unit ? 'text-white/80' : 'text-[#8A9BAD]'}`}>
                        {dt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Duration Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(durationType === 'HOURS' || durationType === 'BOTH') && (
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                      {durationType === 'BOTH' ? 'Total Active Hours' : 'Duration (Hours)'}
                    </label>
                    <input
                      type="number"
                      min={0.5}
                      max={72}
                      step={0.5}
                      value={durationHours}
                      onChange={(e) => setDurationHours(parseFloat(e.target.value) || 3)}
                      className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-sm font-bold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                    />
                  </div>
                )}

                {(durationType === 'DAYS' || durationType === 'BOTH') && (
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      step={1}
                      value={durationDays}
                      onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                      className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-sm font-bold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 6)}
                    className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-sm font-bold text-[#152238] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                    Min Participants
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={maxParticipants}
                    value={minParticipants}
                    onChange={(e) => setMinParticipants(parseInt(e.target.value) || 1)}
                    className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-sm font-bold text-[#152238] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-sm font-bold text-[#152238] dark:text-white focus:outline-none"
                  >
                    <option value="Easy">Easy (Flat terrain, light walking)</option>
                    <option value="Moderate">Moderate (Stairs, fort ramparts)</option>
                    <option value="Challenging">Challenging (Steep fort hikes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                    Age Suitability
                  </label>
                  <input
                    type="text"
                    value={ageSuitability}
                    onChange={(e) => setAgeSuitability(e.target.value)}
                    placeholder="e.g. All ages welcome, 10+ years..."
                    className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-sm font-bold text-[#152238] dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 3: PRICING (NO UNIVERSAL 500/HR)
              ══════════════════════════════════════════════════ */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-scale-in">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">STEP 3 OF 8</span>
                <h2 className="text-xl font-extrabold text-[#152238] dark:text-white font-heading">
                  Tour Pricing Model
                </h2>
                <p className="text-xs text-[#8A9BAD]">
                  Choose your pricing structure. You have full control over what you charge.
                </p>
              </div>

              {/* Pricing Model Radio Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    type: 'PER_PERSON',
                    title: 'Per Person',
                    desc: 'Charge individual travelers',
                    example: 'e.g. ₹699 / person'
                  },
                  {
                    type: 'PER_GROUP',
                    title: 'Per Group',
                    desc: 'Flat rate up to max capacity',
                    example: 'e.g. ₹1,999 / group'
                  },
                  {
                    type: 'FIXED_PRICE',
                    title: 'Fixed Package',
                    desc: 'Total inclusive trip tariff',
                    example: 'e.g. ₹1,500 total'
                  }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setPricingType(item.type)}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                      pricingType === item.type
                        ? 'bg-[#E8F7F1] dark:bg-[#07543F]/25 border-[#0B9B6E] shadow-sm'
                        : 'bg-[#F8F7F3] dark:bg-[#111C15] border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-[#152238] dark:text-white">{item.title}</span>
                      {pricingType === item.type && (
                        <i className="fa-solid fa-circle-check text-[#0B9B6E] text-xs"></i>
                      )}
                    </div>
                    <div className="text-[11px] text-[#4A5C6E] dark:text-[#9AB0A4]">{item.desc}</div>
                    <div className="text-[10px] font-bold text-[#0B9B6E] mt-2">{item.example}</div>
                  </button>
                ))}
              </div>

              {/* Price Entry Field */}
              <div className="p-5 bg-[#F8F7F3] dark:bg-[#111C15] rounded-2xl border border-[#E0E8E4] dark:border-[#243028] space-y-3">
                <label className="block text-xs font-extrabold uppercase text-[#152238] dark:text-white">
                  Enter Your {pricingType === 'PER_PERSON' ? 'Per Person' : pricingType === 'PER_GROUP' ? 'Per Group' : 'Fixed'} Price (₹) *
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-[#0B9B6E]">₹</span>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(parseInt(e.target.value) || 0)}
                    className="flex-1 p-3 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-lg font-black text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                  <span className="text-xs font-bold text-[#8A9BAD]">
                    {pricingType === 'PER_PERSON' ? '/ person' : pricingType === 'PER_GROUP' ? '/ group' : 'total'}
                  </span>
                </div>
                <div className="text-[11px] text-[#8A9BAD]">
                  Transparent traveler display: <span className="font-bold text-[#152238] dark:text-white">₹{priceAmount.toLocaleString('en-IN')}{pricingType === 'PER_PERSON' ? '/person' : pricingType === 'PER_GROUP' ? '/group' : ' total'}</span> for {durationHours} hours.
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 4: ITINERARY STOPS (Timeline Builder)
              ══════════════════════════════════════════════════ */}
          {activeStep === 4 && (
            <div className="space-y-5 animate-scale-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">STEP 4 OF 8</span>
                  <h2 className="text-xl font-extrabold text-[#152238] dark:text-white font-heading">
                    Timeline Itinerary Stops
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addStop}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0B9B6E] hover:bg-[#07543F] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  <span>Add Stop</span>
                </button>
              </div>

              <div className="space-y-4">
                {itineraryStops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#F8F7F3] dark:bg-[#111C15] rounded-2xl border border-[#E0E8E4] dark:border-[#243028] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#07543F] text-white text-xs font-black flex items-center justify-center">
                          {stop.stopNumber || idx + 1}
                        </span>
                        <span className="font-extrabold text-sm text-[#152238] dark:text-white">
                          Stop #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveStop(idx, -1)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] disabled:opacity-30 hover:text-[#0B9B6E] text-xs cursor-pointer"
                        >
                          <i className="fa-solid fa-arrow-up"></i>
                        </button>
                        <button
                          type="button"
                          disabled={idx === itineraryStops.length - 1}
                          onClick={() => moveStop(idx, 1)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] disabled:opacity-30 hover:text-[#0B9B6E] text-xs cursor-pointer"
                        >
                          <i className="fa-solid fa-arrow-down"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStop(idx)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-[#162019] text-rose-500 hover:bg-rose-50 text-xs cursor-pointer"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-[#8A9BAD] mb-1">Stop Title</label>
                        <input
                          type="text"
                          value={stop.title}
                          onChange={(e) => updateStopField(idx, 'title', e.target.value)}
                          placeholder="e.g. Hawa Mahal Architectural Briefing"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#8A9BAD] mb-1">Time</label>
                        <input
                          type="text"
                          value={stop.time}
                          onChange={(e) => updateStopField(idx, 'time', e.target.value)}
                          placeholder="e.g. 10:00 AM"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-[#8A9BAD] mb-1">Description</label>
                        <input
                          type="text"
                          value={stop.description}
                          onChange={(e) => updateStopField(idx, 'description', e.target.value)}
                          placeholder="What will travelers discover here?"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-xs font-medium focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#8A9BAD] mb-1">Duration (Mins)</label>
                        <input
                          type="number"
                          step={5}
                          value={stop.durationMinutes}
                          onChange={(e) => updateStopField(idx, 'durationMinutes', parseInt(e.target.value) || 30)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 5: WHAT'S INCLUDED / WHAT'S NOT INCLUDED
              ══════════════════════════════════════════════════ */}
          {activeStep === 5 && (
            <div className="space-y-6 animate-scale-in">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">STEP 5 OF 8</span>
                <h2 className="text-xl font-extrabold text-[#152238] dark:text-white font-heading">
                  Inclusions & Exclusions
                </h2>
                <p className="text-xs text-[#8A9BAD]">
                  Be completely transparent so travelers have zero unexpected surprises.
                </p>
              </div>

              {/* What's Included */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase text-[#0B9B6E] tracking-wider">
                  What's Included
                </label>
                <div className="flex flex-wrap gap-2">
                  {includedItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] border border-[#0B9B6E]/30"
                    >
                      <i className="fa-solid fa-check text-[10px]"></i>
                      <span>{item}</span>
                      <button type="button" onClick={() => removeIncludedItem(item)} className="ml-1 text-slate-400 hover:text-rose-500 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newIncludedInput}
                    onChange={(e) => setNewIncludedInput(e.target.value)}
                    placeholder="Add item (e.g. Saffron Chai, Audio Receiver...)"
                    className="flex-1 p-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addIncludedItem}
                    className="px-4 py-2.5 rounded-xl bg-[#0B9B6E] text-white text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* What's NOT Included */}
              <div className="space-y-2 pt-4 border-t border-[#F1F5F3] dark:border-[#243028]">
                <label className="block text-xs font-extrabold uppercase text-rose-500 tracking-wider">
                  What's NOT Included
                </label>
                <div className="flex flex-wrap gap-2">
                  {excludedItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                    >
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                      <span>{item}</span>
                      <button type="button" onClick={() => removeExcludedItem(item)} className="ml-1 text-slate-400 hover:text-rose-500 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newExcludedInput}
                    onChange={(e) => setNewExcludedInput(e.target.value)}
                    placeholder="Add item (e.g. Monument Entrance Tickets, Hotel Cab...)"
                    className="flex-1 p-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addExcludedItem}
                    className="px-4 py-2.5 rounded-xl bg-slate-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 6: AVAILABILITY
              ══════════════════════════════════════════════════ */}
          {activeStep === 6 && (
            <div className="space-y-6 animate-scale-in">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">STEP 6 OF 8</span>
                <h2 className="text-xl font-extrabold text-[#152238] dark:text-white font-heading">
                  Available Days & Departure Slots
                </h2>
                <p className="text-xs text-[#8A9BAD]">
                  Define when travelers can book and attend this tour.
                </p>
              </div>

              {/* Operating Days */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4]">
                  Active Days of the Week
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`w-12 h-12 rounded-2xl font-black text-xs transition border cursor-pointer ${
                        availableDays.includes(day)
                          ? 'bg-[#07543F] text-white border-[#07543F]'
                          : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#8A9BAD] border-[#E0E8E4] dark:border-[#243028]'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Departure Time Slots */}
              <div className="space-y-2 pt-3 border-t border-[#F1F5F3] dark:border-[#243028]">
                <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4]">
                  Departure Time Slots
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => (
                    <span
                      key={slot}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-extrabold text-[#152238] dark:text-white"
                    >
                      <i className="fa-regular fa-clock text-[#0B9B6E]"></i>
                      <span>{slot}</span>
                      <button type="button" onClick={() => removeTimeSlot(slot)} className="text-slate-400 hover:text-rose-500 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newTimeSlotInput}
                    onChange={(e) => setNewTimeSlotInput(e.target.value)}
                    placeholder="e.g. 09:30 AM or 04:00 PM"
                    className="flex-1 p-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="px-4 py-2.5 rounded-xl bg-[#0B9B6E] text-white text-xs font-bold cursor-pointer"
                  >
                    Add Slot
                  </button>
                </div>
              </div>

              {/* Specific Available Dates */}
              <div className="space-y-2 pt-3 border-t border-[#F1F5F3] dark:border-[#243028]">
                <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4]">
                  Scheduled Dates
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableDates.map((date) => (
                    <span
                      key={date}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold"
                    >
                      <span>{date}</span>
                      <button type="button" onClick={() => removeAvailableDate(date)} className="text-slate-400 hover:text-rose-500 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="date"
                    value={newDateInput}
                    onChange={(e) => setNewDateInput(e.target.value)}
                    className="p-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addAvailableDate}
                    className="px-4 py-2.5 rounded-xl bg-[#0B9B6E] text-white text-xs font-bold cursor-pointer"
                  >
                    Add Date
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 7: IMAGES
              ══════════════════════════════════════════════════ */}
          {activeStep === 7 && (
            <div className="space-y-5 animate-scale-in">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">STEP 7 OF 8</span>
                <h2 className="text-xl font-extrabold text-[#152238] dark:text-white font-heading">
                  Tour Cover & Gallery
                </h2>
                <p className="text-xs text-[#8A9BAD]">
                  Select high-resolution imagery showcasing the authentic atmosphere.
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-2">
                  Select from Preset Heritage Galleries:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRESET_COVERS.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setCoverImage(img)}
                      className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                        coverImage === img ? 'border-[#0B9B6E] ring-2 ring-[#0B9B6E]/30' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      {coverImage === img && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0B9B6E] text-white flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F5F3] dark:border-[#243028] space-y-2">
                <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4]">
                  Or Provide Custom High-Res Image URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 p-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customImageUrl.trim()) {
                        setCoverImage(customImageUrl.trim());
                        showToast({ type: 'success', title: 'Image Set', message: 'Cover image updated.' });
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#0B9B6E] text-white text-xs font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              STEP 8: SHOW TOUR PREVIEW & PUBLISH
              ══════════════════════════════════════════════════ */}
          {activeStep === 8 && (
            <div className="space-y-6 animate-scale-in">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">STEP 8 OF 8</span>
                <h2 className="text-xl font-extrabold text-[#152238] dark:text-white font-heading">
                  Live Traveler Preview & Publish
                </h2>
                <p className="text-xs text-[#8A9BAD]">
                  This is exactly how tourists will see and book your tour on RAAHI.
                </p>
              </div>

              {/* Live Card Preview */}
              <div className="bg-[#F8F7F3] dark:bg-[#111C15] p-5 sm:p-6 rounded-3xl border border-[#0B9B6E]/30 space-y-4">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-sm">
                  <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-white text-[#07543F]">
                    {category}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1.5 drop-shadow">
                    <i className="fa-solid fa-location-dot text-[#4ADE80]"></i>
                    <span>{destination}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-[#152238] dark:text-white font-heading">
                    {title || 'Untitled Tour Experience'}
                  </h3>
                  <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] line-clamp-2">
                    {description || 'Comprehensive tour with verified local host.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E0E8E4] dark:border-[#243028]">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD]">Tariff</div>
                    <div className="text-lg font-black text-[#07543F] dark:text-[#4ADE80]">
                      ₹{priceAmount.toLocaleString('en-IN')}{pricingType === 'PER_PERSON' ? '/person' : pricingType === 'PER_GROUP' ? '/group' : ' total'}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#8A9BAD]">
                    ⏱ {durationType === 'DAYS' ? (durationDays === 1 ? '1 Full Day' : `${durationDays} Days`) : durationType === 'BOTH' ? `${durationDays} Days (${durationHours} hrs)` : `${durationHours} Hours`} • 👥 Up to {maxParticipants} people
                  </div>
                </div>
              </div>

              {/* Publish Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSave('PUBLISHED')}
                  className="w-full sm:flex-1 btn-primary py-3.5 text-xs justify-center shadow-lg font-black tracking-wider uppercase cursor-pointer"
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                  <span>Publish Tour to Marketplace</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave('DRAFT')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold text-[#152238] dark:text-white hover:border-[#0B9B6E] transition cursor-pointer"
                >
                  Save as Draft
                </button>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons (Next / Prev) */}
          <div className="flex items-center justify-between pt-6 border-t border-[#F1F5F3] dark:border-[#243028]">
            <button
              type="button"
              disabled={activeStep === 1}
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              className="px-5 py-2.5 rounded-xl border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold text-[#4A5C6E] dark:text-[#9AB0A4] disabled:opacity-30 hover:text-[#152238] dark:hover:text-white cursor-pointer"
            >
              Previous
            </button>

            {activeStep < 8 ? (
              <button
                type="button"
                onClick={() => setActiveStep(Math.min(8, activeStep + 1))}
                className="btn-primary text-xs px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-2"
              >
                <span>Continue to Step {activeStep + 1}</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
};
