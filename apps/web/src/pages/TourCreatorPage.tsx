import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTourStore, PublishedTour, TourItineraryDay } from '../store/useTourStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

const PRESET_COVERS = [
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80"
];

export const TourCreatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addTour } = useTourStore();
  const showToast = useToastStore((state) => state.showToast);

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Stage 1 State: Basic Info
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('Jaipur');
  const [category, setCategory] = useState<'Heritage' | 'Food' | 'Culture' | 'Shopping' | 'Photography'>('Heritage');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0]);
  const [meetingPoint, setMeetingPoint] = useState('Amer Fort Sun Gate Entrance');

  // Stage 2 State: Day-by-Day Itinerary Builder
  const [itineraryDays, setItineraryDays] = useState<TourItineraryDay[]>([
    {
      day: 1,
      title: 'Heritage Walk & Hidden Courtyards',
      places: ['Suraj Pol', 'Jaleb Chowk'],
      activities: ['Explore royal entrance hall', 'Walk through secret passages'],
      durationHours: 3.5
    }
  ]);
  const [newPlace, setNewPlace] = useState('');
  const [newActivity, setNewActivity] = useState('');

  // Stage 3 State: Pricing, Group Capacity & Dates
  const [pricePerPerson, setPricePerPerson] = useState(899);
  const [maxCapacity, setMaxCapacity] = useState(8);
  const [availableDates, setAvailableDates] = useState<string[]>([
    '2026-08-27',
    '2026-08-28',
    '2026-08-29',
    '2026-08-30'
  ]);
  const [dateInput, setDateInput] = useState('');

  // Helper Functions for Itinerary Builder
  const addDay = () => {
    const nextDayNum = itineraryDays.length + 1;
    setItineraryDays([
      ...itineraryDays,
      {
        day: nextDayNum,
        title: `Day ${nextDayNum} Highlights`,
        places: ['Local Landmark'],
        activities: ['Guided Walk'],
        durationHours: 3.0
      }
    ]);
  };

  const removeDay = (index: number) => {
    if (itineraryDays.length <= 1) return;
    const updated = itineraryDays.filter((_, i) => i !== index).map((day, idx) => ({ ...day, day: idx + 1 }));
    setItineraryDays(updated);
  };

  const updateDayTitle = (index: number, val: string) => {
    const updated = [...itineraryDays];
    updated[index].title = val;
    setItineraryDays(updated);
  };

  const updateDayDuration = (index: number, val: number) => {
    const updated = [...itineraryDays];
    updated[index].durationHours = val;
    setItineraryDays(updated);
  };

  const addPlaceToDay = (dayIndex: number) => {
    if (!newPlace.trim()) return;
    const updated = [...itineraryDays];
    updated[dayIndex].places.push(newPlace.trim());
    setItineraryDays(updated);
    setNewPlace('');
  };

  const addActivityToDay = (dayIndex: number) => {
    if (!newActivity.trim()) return;
    const updated = [...itineraryDays];
    updated[dayIndex].activities.push(newActivity.trim());
    setItineraryDays(updated);
    setNewActivity('');
  };

  const toggleDate = (dateStr: string) => {
    if (availableDates.includes(dateStr)) {
      setAvailableDates(availableDates.filter((d) => d !== dateStr));
    } else {
      setAvailableDates([...availableDates, dateStr]);
    }
  };

  const handleAddCustomDate = () => {
    if (!dateInput || availableDates.includes(dateInput)) return;
    setAvailableDates([...availableDates, dateInput]);
    setDateInput('');
  };

  // Stage 4: Preview & Publish Action
  const handlePublish = () => {
    if (!title.trim() || !summary.trim()) {
      showToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please complete basic trip details before publishing.'
      });
      return;
    }

    const totalHours = itineraryDays.reduce((sum, d) => sum + d.durationHours, 0);

    const newTour: PublishedTour = {
      id: `tp_${Date.now()}`,
      guideId: user?.id || 'g1',
      guideName: user?.name || 'Priya Sharma',
      guideAvatar: user?.avatar || PRESET_COVERS[0],
      title,
      category,
      destination,
      summary,
      coverImage,
      pricePerPerson,
      maxCapacity,
      availableDates,
      itinerary: itineraryDays,
      highlights: itineraryDays.flatMap((d) => d.activities).slice(0, 3),
      included: ['Certified Local Host', 'Customized Itinerary Walk', 'Mineral Water'],
      meetingPoint,
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
      publishedAt: new Date().toISOString()
    };

    addTour(newTour);

    showToast({
      type: 'success',
      title: 'Experience Package Published! 🎉',
      message: `${title} is now live on the RAAHI marketplace.`
    });

    navigate('/tours');
  };

  return (
    <div className="space-y-8 text-left font-sans pb-16 max-w-4xl mx-auto">
      
      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">
              LOCAL HOST WORKSPACE
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Create New Tour & Experience Package
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Craft a custom heritage walk, food crawl, or cultural experience for RAAHI travelers.
            </p>
          </div>
        </div>

        {/* 4 STAGE PROGRESS STEPPER */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          {[
            { step: 1, label: '1. Basic Info' },
            { step: 2, label: '2. Itinerary Builder' },
            { step: 3, label: '3. Pricing & Capacity' },
            { step: 4, label: '4. Preview & Publish' }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step as any)}
              className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold transition text-center ${
                activeStep === s.step
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : activeStep > s.step
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* STAGE 1: BASIC INFO FORM */}
      {activeStep === 1 && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
            Stage 1: Basic Trip Information
          </h2>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tour Package Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Amer Fort Secret Passages & Royal Heritage Walk"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Destination City *</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Jaipur"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Experience Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
                >
                  <option value="Heritage">Heritage & Forts</option>
                  <option value="Food">Food Crawl</option>
                  <option value="Culture">Culture & Arts</option>
                  <option value="Shopping">Artisan Crafts & Shopping</option>
                  <option value="Photography">Photography Walk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Meeting Point Location *</label>
              <input
                type="text"
                required
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                placeholder="e.g. Amer Fort Sun Gate Entrance"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Experience Summary *</label>
              <textarea
                rows={3}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly describe what travelers will experience, see, and learn on this tour..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs"
              ></textarea>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Select Cover Photo</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_COVERS.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Cover ${idx}`}
                    onClick={() => setCoverImage(imgUrl)}
                    className={`h-24 w-full rounded-2xl object-cover cursor-pointer transition border-4 ${
                      coverImage === imgUrl ? 'border-orange-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition shadow-md shadow-orange-500/20"
              >
                Next: Day-by-Day Itinerary &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: DAY-BY-DAY ITINERARY BUILDER */}
      {activeStep === 2 && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                Stage 2: Day-by-Day Itinerary Builder
              </h2>
              <p className="text-xs text-slate-500">Define the places to visit, activities, and duration per day.</p>
            </div>
            <button
              onClick={addDay}
              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold rounded-xl text-xs border border-emerald-200"
            >
              + Add Day
            </button>
          </div>

          <div className="space-y-6">
            {itineraryDays.map((dayItem, dIdx) => (
              <div key={dIdx} className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-orange-600 dark:text-orange-400 text-sm font-heading">
                    Day {dayItem.day} Itinerary
                  </span>
                  {itineraryDays.length > 1 && (
                    <button onClick={() => removeDay(dIdx)} className="text-xs text-rose-500 hover:text-rose-700 font-bold">
                      Remove Day
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Day Theme / Title</label>
                    <input
                      type="text"
                      value={dayItem.title}
                      onChange={(e) => updateDayTitle(dIdx, e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Duration (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={dayItem.durationHours}
                      onChange={(e) => updateDayDuration(dIdx, parseFloat(e.target.value) || 1)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-extrabold"
                    />
                  </div>
                </div>

                {/* Places List */}
                <div className="space-y-2 text-xs">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Places to Visit</label>
                  <div className="flex flex-wrap gap-2">
                    {dayItem.places.map((p, pIdx) => (
                      <span key={pIdx} className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-[11px]">
                        📍 {p}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newPlace}
                      onChange={(e) => setNewPlace(e.target.value)}
                      placeholder="Add place e.g. Sheesh Mahal"
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => addPlaceToDay(dIdx)}
                      className="px-3 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-xl text-xs"
                    >
                      Add Place
                    </button>
                  </div>
                </div>

                {/* Activities List */}
                <div className="space-y-2 text-xs">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Key Activities</label>
                  <ul className="space-y-1">
                    {dayItem.activities.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      placeholder="Add activity e.g. Secret underground escape tunnel walk"
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => addActivityToDay(dIdx)}
                      className="px-3 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-xl text-xs"
                    >
                      Add Activity
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition shadow-md shadow-orange-500/20"
            >
              Next: Pricing & Capacity &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: PRICING, CAPACITY & DATES */}
      {activeStep === 3 && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
            Stage 3: Pricing, Capacity & Available Dates
          </h2>

          <div className="space-y-5 text-xs font-sans">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Price Per Traveler (₹) *</label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <span className="px-3.5 text-xs font-extrabold text-slate-500 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700">₹</span>
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(parseInt(e.target.value) || 899)}
                    className="w-full bg-transparent p-3 text-slate-900 dark:text-white font-extrabold text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Max Group Capacity (Guests) *</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 8)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white font-extrabold text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Available Dates Selection */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">Available Hosting Dates</label>
              <div className="flex flex-wrap gap-2">
                {availableDates.map((dateStr) => (
                  <span
                    key={dateStr}
                    className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold px-3.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2"
                  >
                    <span>📅 {dateStr}</span>
                    <button onClick={() => toggleDate(dateStr)} className="text-rose-500 hover:text-rose-700 text-xs">✕</button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomDate}
                  className="px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold rounded-xl text-xs"
                >
                  + Add Date
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs"
              >
                &larr; Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition shadow-md shadow-orange-500/20"
              >
                Next: Preview & Publish &rarr;
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STAGE 4: LIVE PREVIEW & PUBLISH */}
      {activeStep === 4 && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
            Stage 4: Live Experience Preview & Publish
          </h2>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-orange-500">TRAVELER CARD PREVIEW</span>
            <p className="text-xs text-slate-500">This is how your published tour experience will appear to tourists on the RAAHI marketplace.</p>
          </div>

          {/* TOURIST CARD PREVIEW */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl max-w-md mx-auto space-y-4">
            <div className="h-56 relative overflow-hidden">
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
              <span className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/90 text-orange-600 font-bold text-[10px] px-3 py-1 rounded-full">
                {category}
              </span>
              <span className="absolute bottom-3.5 right-3.5 bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                Host: {user?.name || 'Priya Sharma'}
              </span>
            </div>

            <div className="p-5 space-y-3 text-left">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg font-heading">{title || 'Untitled Tour Experience'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">{summary || 'No summary provided.'}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div><strong>Duration:</strong> {itineraryDays.reduce((sum, d) => sum + d.durationHours, 0)} Hours ({itineraryDays.length} Days)</div>
                <div><strong>Max Guests:</strong> {maxCapacity} Travelers</div>
                <div><strong>Meeting Point:</strong> {meetingPoint}</div>
                <div><strong>Price:</strong> <span className="text-emerald-600 font-extrabold">₹{pricePerPerson}/person</span></div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <i className="fa-solid fa-paper-plane"></i>
              <span>Publish Experience Package Now</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
