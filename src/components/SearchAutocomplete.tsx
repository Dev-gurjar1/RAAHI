import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Compass, Tag } from 'lucide-react';
import { marketplaceStore } from '../services/store';

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  placeholder = 'e.g. Jaipur',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    guides: string[];
    tours: string[];
    places: string[];
    experiences: string[];
  }>({ guides: [], tours: [], places: [], experiences: [] });

  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search suggestion calculation
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions({ guides: [], tours: [], places: [], experiences: [] });
      setIsOpen(false);
      return;
    }

    const state = marketplaceStore.getState();
    const q = query.toLowerCase();

    const matchedDestinations = state.destinations.filter(d => d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q));
    const destNames = matchedDestinations.map(d => d.name);

    if (destNames.length === 0) destNames.push(query);

    const primaryDest = destNames[0] || 'Jaipur';

    setSuggestions({
      guides: [`${primaryDest} Verified Local Guides`, `${primaryDest} Heritage Historians`],
      tours: [`${primaryDest} Royal Heritage Walk`, `${primaryDest} Street Food Odyssey`],
      places: [`${primaryDest} Forts & Palaces`, `${primaryDest} Old Bazaars`],
      experiences: [`${primaryDest} Culinary Tastings`, `${primaryDest} Artisan Craft Tours`]
    });

    setIsOpen(true);
  }, [query]);

  const handleSelectSuggestion = (dest: string, type: string) => {
    setIsOpen(false);
    if (type === 'guide') {
      navigate(`/guides?destination=${encodeURIComponent(dest)}`);
    } else if (type === 'tour') {
      navigate(`/tours`);
    } else {
      navigate(`/guides?destination=${encodeURIComponent(dest)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (query.trim()) {
      navigate(`/guides?destination=${encodeURIComponent(query)}`);
    } else {
      navigate('/guides?destination=Jaipur');
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border-2 border-amber-500/40 flex flex-col sm:flex-row items-center gap-3 transition-all focus-within:ring-4 focus-within:ring-amber-500/20"
      >
        <div className="flex-1 flex items-center gap-3 px-3 w-full">
          <MapPin className="w-6 h-6 text-brand-500 flex-shrink-0" />
          <div className="w-full text-left">
            <label htmlFor="search-autocomplete-input" className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Where are you going?
            </label>
            <input
              id="search-autocomplete-input"
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setIsOpen(true)}
              className="w-full bg-transparent text-slate-900 font-extrabold text-lg focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-extrabold px-9 py-4 rounded-2xl shadow-xl shadow-amber-500/30 transition transform active:scale-95 flex items-center justify-center gap-2 text-base whitespace-nowrap"
        >
          <Search className="w-5 h-5 stroke-[2.5]" />
          <span>Find Guides</span>
        </button>
      </form>

      {/* Autocomplete Dropdown Suggestions */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 text-left space-y-3 animate-fade-in max-h-96 overflow-y-auto">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2">
            Search Suggestions for "{query}"
          </div>

          {/* Guides Section */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 px-2">
              <Users className="w-3.5 h-3.5 text-brand-600" />
              <span>Verified Guides</span>
            </div>
            {suggestions.guides.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(query, 'guide')}
                className="px-3 py-2 rounded-xl text-xs text-slate-800 hover:bg-amber-50 hover:text-brand-700 font-semibold cursor-pointer transition flex items-center justify-between"
              >
                <span>{item}</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">Verified Host</span>
              </div>
            ))}
          </div>

          {/* Tours Section */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 px-2">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Local Tours</span>
            </div>
            {suggestions.tours.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(query, 'tour')}
                className="px-3 py-2 rounded-xl text-xs text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 font-semibold cursor-pointer transition flex items-center justify-between"
              >
                <span>{item}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">Package</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
