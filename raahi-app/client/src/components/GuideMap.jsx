import React from 'react';
import { MapPin, Navigation, ShieldCheck, Star, Radio } from 'lucide-react';

export const GuideMap = ({ guides = [], selectedGuide, onSelectGuide }) => {
  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 relative overflow-hidden">
      {/* Visual Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400" /> Live Local Guide Radar (Jaipur Heritage Zone)
          </h4>
        </div>
        <span className="text-xs text-slate-400 font-mono">{guides.length} Verified Hosts Active</span>
      </div>

      {/* Radar Map Canvas Simulation */}
      <div className="relative w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Grid Background Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40" />

        {/* Pulse Radar Target Circles */}
        <div className="absolute w-72 h-72 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none" />
        <div className="absolute w-48 h-48 rounded-full border border-emerald-500/30 pointer-events-none" />
        <div className="absolute w-24 h-24 rounded-full border border-emerald-500/40 pointer-events-none" />

        {/* User Location Marker (Center) */}
        <div className="relative z-10 flex flex-col items-center group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/30 animate-bounce">
            <Navigation className="w-5 h-5 fill-amber-400/30" />
          </div>
          <span className="bg-slate-900/90 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30 mt-1">
            YOU ARE HERE
          </span>
        </div>

        {/* Guide Markers scatter simulation */}
        {guides.map((guide, idx) => {
          // Calculate spread offsets for visual map nodes
          const offsets = [
            { top: '25%', left: '30%' },
            { top: '20%', left: '70%' },
            { top: '70%', left: '25%' },
            { top: '65%', left: '75%' },
            { top: '35%', left: '55%' }
          ];
          const pos = offsets[idx % offsets.length];
          const isSelected = selectedGuide && selectedGuide._id === guide._id;

          return (
            <div
              key={guide._id || idx}
              onClick={() => onSelectGuide && onSelectGuide(guide)}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute z-20 flex flex-col items-center cursor-pointer transition-all transform hover:scale-110 ${
                isSelected ? 'scale-110 z-30' : ''
              }`}
            >
              <div className={`relative p-1 rounded-full border-2 transition ${
                isSelected ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/50' : 'border-emerald-400 bg-slate-900'
              }`}>
                <img
                  src={guide.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={guide.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                  <ShieldCheck className="w-2.5 h-2.5 text-white" />
                </span>
              </div>

              <div className="bg-slate-900/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-slate-700 mt-1 whitespace-nowrap flex items-center gap-1">
                <span>{guide.name.split(' ')[0]}</span>
                <span className="text-amber-400 font-normal">₹{guide.hourlyRate}/h</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Guide Details Strip */}
      {selectedGuide && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <img
              src={selectedGuide.avatar}
              alt={selectedGuide.name}
              className="w-12 h-12 rounded-xl object-cover border border-amber-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h5 className="font-extrabold text-white text-sm">{selectedGuide.name}</h5>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> KYC Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" /> {selectedGuide.rating} ({selectedGuide.totalReviews} reviews)
                </span>
                • <span>{selectedGuide.city}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Rate</span>
            <span className="text-lg font-black text-amber-400">₹{selectedGuide.hourlyRate} / hr</span>
          </div>
        </div>
      )}
    </div>
  );
};
