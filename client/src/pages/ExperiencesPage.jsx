import React, { useState, useEffect } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore.js';
import { useToastStore } from '../store/useToastStore.js';
import { VerifiedBadge } from '../components/ui/VerifiedBadge.jsx';
import { StarRating } from '../components/ui/StarRating.jsx';

export const EXPERIENCES_DATA = [
  {
    id: 'exp-1',
    title: 'Royal Haveli Textile Archive & Teakwood Block Printing',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'Artisan Crafts',
    price: 850,
    pricePerPerson: 850,
    duration: '3 Hours',
    rating: 4.96,
    reviewCount: 74,
    hostName: 'Rajesh Saini',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    hostType: 'Artisan Family Host',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    highlights: ['Teakwood block carving demo', 'Stamp your own cotton scarf to take home', 'Clay cup saffron chai & local sweets'],
    description: 'Enter a private 150-year-old courtyard atelier in Johari Bazaar. Learn direct from 4th-generation printers with natural mineral dyes.'
  },
  {
    id: 'exp-2',
    title: 'Sunrise Rowboat & Sacred Ghats Classical Raag Awakening',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'Spiritual',
    price: 750,
    pricePerPerson: 750,
    duration: '3 Hours',
    rating: 4.98,
    reviewCount: 112,
    hostName: 'Pandit Anand Shastri',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    hostType: 'Vedic Scholar Host',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    highlights: ['Private wooden rowboat past 84 ghats', 'Morning Aarti live chanting & sitar', 'Kulhad hot Malaiyo tasting'],
    description: 'Drift past Manikarnika and Dashashwamedh Ghats as the sun illuminates ancient river temples. Vedic philosophy discussions over clay-pot tea.'
  },
  {
    id: 'exp-3',
    title: 'Fontainhas Portuguese Latin Quarter & Spice Cooking Masterclass',
    city: 'Goa',
    state: 'Goa',
    category: 'Culinary',
    price: 1450,
    pricePerPerson: 1450,
    duration: '4 Hours',
    rating: 4.94,
    reviewCount: 68,
    hostName: 'Natasha Fernandes',
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    hostType: 'Heritage Culinary Host',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    highlights: ['Pastel colonial street photo trail', 'Cook authentic Goan prawn/veg curry from scratch', 'Heritage home tavern wine tasting'],
    description: 'Walk colorful 18th-century lanes lined with azulejo tiles before entering a private Portuguese ancestral kitchen to cook with fresh ground spices.'
  },
  {
    id: 'exp-4',
    title: 'Old Delhi Khari Baoli Spice Rooftops & Century-Old Food Crawl',
    city: 'Delhi',
    state: 'Delhi NCR',
    category: 'Culinary',
    price: 650,
    pricePerPerson: 650,
    duration: '3.5 Hours',
    rating: 4.97,
    reviewCount: 145,
    hostName: 'Sameer Ahmed Khan',
    hostAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    hostType: 'Authorized Mughal Historian',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    highlights: ['5 historic culinary tastings included', 'Climb Asia largest wholesale spice rooftop', 'Mughal Shahjahanabad secret passages'],
    description: 'Sample 100-year-old jalebis, piping hot stuffed parathas, and fragrant biryani while overlooking the domes of Jama Masjid from private roofs.'
  },
  {
    id: 'exp-5',
    title: 'Taj Mahal Riverbank Sunset & Ancient Pietra Dura Marble Inlay',
    city: 'Agra',
    state: 'Uttar Pradesh',
    category: 'Artisan Crafts',
    price: 800,
    pricePerPerson: 800,
    duration: '3.5 Hours',
    rating: 4.93,
    reviewCount: 52,
    hostName: 'Farhan Mirza',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    hostType: 'ASI Archaeological Guide',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    highlights: ['Mehtab Bagh crowd-free river reflection point', 'Try your own hands at marble faceting', 'Authentic Agra Dalmoth & Petha tasting'],
    description: 'Avoid tourist scams and learn how semiprecious lapis lazuli and malachite are inlaid into pure Makrana marble by master artisan families.'
  },
  {
    id: 'exp-6',
    title: 'Mewar Miniature Painting & Lake Pichola Sunset Bastion',
    city: 'Udaipur',
    state: 'Rajasthan',
    category: 'Heritage',
    price: 900,
    pricePerPerson: 900,
    duration: '3 Hours',
    rating: 4.95,
    reviewCount: 47,
    hostName: 'Devendra Rathore',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    hostType: 'Mewar Heritage Host',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    highlights: ['Single squirrel-hair brush painting demo', 'Sunset tea overlooking Lake Palace', 'Secret courtyards of City Palace'],
    description: 'Learn the delicate brush techniques of Mewari miniature art before savoring royal chai atop an elevated bastion with views of the shimmering lake.'
  }
];

export const ExperiencesPage = () => {
  const [searchParams] = useSearchParams();
  const urlCity = searchParams.get('city');
  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');

  const showToast = useToastStore((state) => state.showToast);
  const openBookingModal = useBookingStore((state) => state.openBookingModal);
  const createBooking = useBookingStore((state) => state.createBooking);

  const [selectedCity, setSelectedCity] = useState(urlCity || 'All');
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All');
  const [searchQuery, setSearchQuery] = useState(urlSearch || '');

  useEffect(() => {
    if (urlCity) setSelectedCity(urlCity);
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlSearch) setSearchQuery(urlSearch);
  }, [urlCity, urlCategory, urlSearch]);

  const cities = ['All', 'Jaipur', 'Varanasi', 'Goa', 'Delhi', 'Agra', 'Udaipur'];
  const categories = ['All', 'Artisan Crafts', 'Culinary', 'Spiritual', 'Heritage'];

  const filteredExperiences = EXPERIENCES_DATA.filter((exp) => {
    const matchesCity = selectedCity === 'All' || exp.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || exp.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesCategory && matchesSearch;
  });

  const handleBookExperience = (exp) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `EXP-BK-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking = {
      bookingId,
      id: bookingId,
      bookingType: 'EXPERIENCE_BOOKING',
      experienceId: exp.id,
      tourTitle: exp.title,
      guideName: exp.hostName,
      guideAvatar: exp.hostAvatar,
      city: exp.city,
      duration: exp.duration,
      totalAmount: exp.price,
      startOtp: otp,
      status: 'Confirmed',
      meetingPoint: `${exp.city} Central Landmark`,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    createBooking(newBooking);

    showToast({
      type: 'success',
      title: 'Experience Booked! 🎉',
      message: `Your spot for "${exp.title}" is confirmed. Start OTP: ${otp}`
    });
  };

  return (
    <div className="bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen text-[#152238] dark:text-[#E8F0EC]">

      {/* ══════════════════════════════════════════════════
          HERO SECTION: LOCAL EXPERIENCES ACROSS INDIA
          ══════════════════════════════════════════════════ */}
      <section className="relative bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] py-16 sm:py-20 overflow-hidden text-center space-y-6">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0B9B6E]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F4A340]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold border border-[#0B9B6E]/30">
            <i className="fa-solid fa-palette text-[#0B9B6E]"></i>
            <span>HANDS-ON CULTURAL IMMERSIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#152238] dark:text-white font-heading tracking-tight">
            Authentic Local Experiences <span className="text-[#0B9B6E]">Across India</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[#4A5C6E] dark:text-[#9AB0A4] max-w-2xl mx-auto leading-relaxed">
            Step into living ateliers, ancestral kitchens, rooftop sunrise vantage points, and sacred rituals guided by verified local masters.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto pt-3">
            <div className="flex items-center gap-3 bg-[#F8F7F3] dark:bg-[#162019] px-4 py-3 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm">
              <i className="fa-solid fa-magnifying-glass text-[#0B9B6E]"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search block printing, food crawls, sunrise boats..."
                className="bg-transparent text-xs sm:text-sm font-bold text-[#152238] dark:text-white placeholder-[#8A9BAD] focus:outline-none w-full"
              />
            </div>
          </div>

          {/* City Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  selectedCity === city
                    ? 'bg-[#0B9B6E] text-white border-[#0B9B6E] shadow-sm'
                    : 'bg-[#F8F7F3] dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]'
                }`}
              >
                {city === 'All' ? 'All Cities' : `📍 ${city}`}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#152238] text-white dark:bg-white dark:text-[#152238]'
                    : 'bg-transparent text-[#8A9BAD] hover:text-[#152238] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          EXPERIENCES GRID
          ══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex items-center justify-between pb-6 border-b border-[#E0E8E4] dark:border-[#243028]">
          <h2 className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white font-heading">
            {selectedCity === 'All' ? 'All Curated Experiences' : `Experiences in ${selectedCity}`}
          </h2>
          <span className="text-xs font-bold text-[#8A9BAD]">
            {filteredExperiences.length} verified workshops & tours
          </span>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="my-12 p-12 text-center bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#0B9B6E] flex items-center justify-center text-2xl mx-auto">
              <i className="fa-solid fa-palette"></i>
            </div>
            <h3 className="text-xl font-bold text-[#152238] dark:text-white font-heading">
              No experiences found matching this filter
            </h3>
            <button
              type="button"
              onClick={() => { setSelectedCity('All'); setSelectedCategory('All'); setSearchQuery(''); }}
              className="btn-primary text-xs px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {filteredExperiences.map((exp) => (
              <div
                key={exp.id}
                className="group bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  {/* Image & Top Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-white/95 dark:bg-[#111C15]/95 text-[#07543F] dark:text-[#4ADE80] shadow-sm">
                        {exp.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                        <i className="fa-solid fa-star text-amber-400 text-[10px]"></i>
                        <span>{exp.rating}</span>
                        <span className="text-white/60">({exp.reviewCount})</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold text-white drop-shadow">
                      <i className="fa-solid fa-location-dot text-[#4ADE80]"></i>
                      <span>{exp.city}, {exp.state}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3.5">
                    <h3 className="font-extrabold text-[#152238] dark:text-white text-base sm:text-lg font-heading leading-snug group-hover:text-[#0B9B6E] transition-colors">
                      {exp.title}
                    </h3>

                    <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] line-clamp-2 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 pt-1">
                      {exp.highlights.slice(0, 2).map((hl, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#152238] dark:text-[#E8F0EC]">
                          <i className="fa-solid fa-circle-check text-[#0B9B6E] text-[10px]"></i>
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Host Avatar & Name */}
                    <div className="flex items-center gap-2.5 pt-3 border-t border-[#F1F5F3] dark:border-[#243028]">
                      <img
                        src={exp.hostAvatar}
                        alt={exp.hostName}
                        className="w-8 h-8 rounded-full object-cover border border-[#0B9B6E]"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#152238] dark:text-white leading-tight">
                          {exp.hostName}
                        </div>
                        <div className="text-[10px] text-[#8A9BAD]">{exp.hostType}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-5 sm:p-6 pt-3 border-t border-[#F1F5F3] dark:border-[#243028] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD]">Tariff</div>
                    <div className="text-lg font-black text-[#07543F] dark:text-[#4ADE80]">
                      ₹{exp.price.toLocaleString('en-IN')}<span className="text-xs font-bold text-[#8A9BAD]">/person</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookExperience(exp)}
                    className="btn-primary text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    <i className="fa-solid fa-bolt text-amber-300"></i>
                    <span>Book Experience</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
