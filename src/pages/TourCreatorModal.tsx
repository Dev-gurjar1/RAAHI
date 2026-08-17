import React, { useState } from 'react';
import { X, Plus, Trash2, Compass, Tag, Clock, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { ItineraryStep, CostBreakdown } from '../types';

interface TourCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideId: string;
  guideName: string;
  guideAvatar: string;
}

export const TourCreatorModal: React.FC<TourCreatorModalProps> = ({
  isOpen,
  onClose,
  guideId,
  guideName,
  guideAvatar
}) => {
  const [title, setTitle] = useState('Jaipur Heritage & Secret Food Walk');
  const [destination, setDestination] = useState('Jaipur');
  const [description, setDescription] = useState('Explore royal Pink City architecture, historic bazaars, and local street food delicacies with a certified local host.');
  const [durationHours, setDurationHours] = useState(6);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [durationDays, setDurationDays] = useState(2);
  const [maxTravelers, setMaxTravelers] = useState(6);
  const [pricePerPerson, setPricePerPerson] = useState(2500);
  const [meetingPoint, setMeetingPoint] = useState('Hawa Mahal Main Gate, Jaipur');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80');

  const [includesText, setIncludesText] = useState('Private Verified Local Guide, Heritage Walk Entry, Street Food Tasting, Chai & Mineral Water');
  const [excludesText, setExcludesText] = useState('Monument Entry Tickets, Personal Souvenir Shopping');

  // Cost breakdown for multi-day tours
  const [transportCost, setTransportCost] = useState(1500);
  const [hotelCost, setHotelCost] = useState(1000);
  const [foodCost, setFoodCost] = useState(600);
  const [guideCost, setGuideCost] = useState(500);
  const [otherCost, setOtherCost] = useState(300);

  // Itinerary items
  const [itinerary, setItinerary] = useState<ItineraryStep[]>([
    { id: '1', time: '10:00 AM', title: 'Hawa Mahal Architecture Walk', description: 'Deep dive into 953 jharokhas of Hawa Mahal and royal women history.' },
    { id: '2', time: '01:00 PM', title: 'Authentic Street Food Lunch', description: 'Sample Pyaz Kachori and Kesar Lassi at famous local sweet shops.' }
  ]);

  if (!isOpen) return null;

  const addItineraryStep = () => {
    setItinerary([
      ...itinerary,
      {
        id: String(Date.now()),
        time: '03:00 PM',
        title: 'New Sight / Activity',
        description: 'Guided tour details...'
      }
    ]);
  };

  const removeItineraryStep = (id: string) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  const updateItineraryStep = (id: string, field: keyof ItineraryStep, val: string) => {
    setItinerary(itinerary.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const calculatedTotalEstimate = transportCost + hotelCost + foodCost + guideCost + otherCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const costBreakdown: CostBreakdown | undefined = isMultiDay
      ? {
          transport: transportCost,
          hotel: hotelCost,
          food: foodCost,
          guide: guideCost,
          other: otherCost,
          estimatedTotal: calculatedTotalEstimate
        }
      : undefined;

    marketplaceStore.createTourPackage({
      guideId,
      guideName,
      guideAvatar,
      title,
      destination,
      description,
      durationHours: isMultiDay ? durationDays * 24 : durationHours,
      durationDays: isMultiDay ? durationDays : undefined,
      isMultiDay,
      maxTravelers,
      pricePerPerson,
      meetingPoint,
      itinerary,
      includes: includesText.split(',').map(s => s.trim()),
      excludes: excludesText.split(',').map(s => s.trim()),
      costBreakdown,
      image,
      cancellationPolicy: 'Free cancellation up to 24 hours before tour start time.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-emerald-600" /> Guide Package Creator
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Create New Tour Package</h2>
          <p className="text-xs text-slate-500">
            Publish single-day or multi-day tour packages with transparent itinerary steps and cost breakdowns.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tour Name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination City</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tour Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Multi-day Toggle */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <input
              type="checkbox"
              id="multi-day-toggle"
              checked={isMultiDay}
              onChange={(e) => setIsMultiDay(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="multi-day-toggle" className="text-xs font-bold text-slate-800 cursor-pointer">
              This is a Multi-Day Tour (e.g. Vaishno Devi 2D/1N)
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {isMultiDay ? (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Days</label>
                <input
                  type="number"
                  min="2"
                  max="14"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Duration (Hrs)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Max Travelers</label>
              <input
                type="number"
                min="1"
                max="30"
                value={maxTravelers}
                onChange={(e) => setMaxTravelers(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Price / Person (₹)</label>
              <input
                type="number"
                step="100"
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-emerald-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Multi-Day Cost Breakdown Calculator (Requirement #13) */}
          {isMultiDay && (
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Multi-Day Transparent Cost Breakdown (₹)</span>
                <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-md text-emerald-800">
                  Est. Total: ₹{calculatedTotalEstimate.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Transport</span>
                  <input
                    type="number"
                    value={transportCost}
                    onChange={(e) => setTransportCost(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-1 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Hotel</span>
                  <input
                    type="number"
                    value={hotelCost}
                    onChange={(e) => setHotelCost(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-1 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Food</span>
                  <input
                    type="number"
                    value={foodCost}
                    onChange={(e) => setFoodCost(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-1 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Guide Fee</span>
                  <input
                    type="number"
                    value={guideCost}
                    onChange={(e) => setGuideCost(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-1 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Misc</span>
                  <input
                    type="number"
                    value={otherCost}
                    onChange={(e) => setOtherCost(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-1 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Point</label>
            <input
              type="text"
              required
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Itinerary Timeline Builder */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Itinerary Timeline Items</label>
              <button
                type="button"
                onClick={addItineraryStep}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
              {itinerary.map((step) => (
                <div key={step.id} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={step.time}
                    onChange={(e) => updateItineraryStep(step.id, 'time', e.target.value)}
                    className="w-20 bg-white border border-slate-200 rounded-lg p-1 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={step.title}
                    onChange={(e) => updateItineraryStep(step.id, 'title', e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg p-1 text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => removeItineraryStep(step.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Publish Tour Package</span>
          </button>
        </form>
      </div>
    </div>
  );
};
