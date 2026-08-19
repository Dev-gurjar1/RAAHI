import React, { useState } from 'react';
import { ScamCategory } from '@raahi/shared-types';

interface ScamReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScamReportModal: React.FC<ScamReportModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<ScamCategory>('Overcharging');
  const [expectedFare, setExpectedFare] = useState('');
  const [chargedFare, setChargedFare] = useState('');
  const [desc, setDesc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✓ Incident Report Logged! Demo Safety Team Dispatched.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-rose-500"></i> Report Overcharging / Scam
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Log an incident for instant demo safety team review.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Issue Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ScamCategory)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Overcharging">Demanded Excessive Fare (Overcharging)</option>
              <option value="Fake Guide">Unverified / Fake Guide Claim</option>
              <option value="Unsafe Behavior">Unsafe / Rude Conduct</option>
              <option value="Refused Meter">Refused Benchmark Meter Rate</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Expected Fare (₹)</label>
              <input
                type="number"
                value={expectedFare}
                onChange={(e) => setExpectedFare(e.target.value)}
                placeholder="100"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Charged Fare (₹)</label>
              <input
                type="number"
                value={chargedFare}
                onChange={(e) => setChargedFare(e.target.value)}
                placeholder="250"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Vehicle / Badge / Location Details</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Auto RJ-14-AB-1234 near Hawa Mahal entrance..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-rose-600/20"
          >
            Submit Incident Report (DEMO DISPATCH)
          </button>
        </form>
      </div>
    </div>
  );
};
