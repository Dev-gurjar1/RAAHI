import React, { useState, useEffect } from 'react';
import { useToastStore } from '../../store/useToastStore.js';
import api from '../../services/api.js';

export const ScamReportModal = ({
  isOpen,
  onClose,
  initialQuotedPrice = '220',
  initialExpectedFare = '107',
  initialService = 'auto'
}) => {
  const [category, setCategory] = useState('Overcharging');
  const [expectedFare, setExpectedFare] = useState(initialExpectedFare);
  const [chargedFare, setChargedFare] = useState(initialQuotedPrice);
  const [serviceType, setServiceType] = useState(initialService);
  const [location, setLocation] = useState('Hawa Mahal Main Entrance, Jaipur');
  const [desc, setDesc] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    if (isOpen) {
      setChargedFare(initialQuotedPrice || '220');
      setExpectedFare(initialExpectedFare || '107');
      if (initialService) setServiceType(initialService);
    }
  }, [isOpen, initialQuotedPrice, initialExpectedFare, initialService]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
      id: `REPORT-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      serviceType,
      expectedFare: parseFloat(expectedFare) || 0,
      chargedFare: parseFloat(chargedFare) || 0,
      overchargeAmount: Math.max(0, (parseFloat(chargedFare) || 0) - (parseFloat(expectedFare) || 0)),
      location,
      description: desc,
      hasScreenshot: !!uploadedFile,
      screenshotName: uploadedFile ? uploadedFile.name : null,
      status: 'UNDER_REVIEW',
      createdAt: new Date().toISOString()
    };

    // Store in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('raahi_scam_reports') || '[]');
      existing.unshift(reportData);
      localStorage.setItem('raahi_scam_reports', JSON.stringify(existing));
    } catch (err) {
      console.error('Error saving scam report:', err);
    }

    // Sync to backend API
    try {
      await api.reports.createScamReport({
        category,
        expectedFare: parseFloat(expectedFare) || 0,
        chargedFare: parseFloat(chargedFare) || 0,
        locationDetails: location,
        description: desc || `Reported ${serviceType} tariff overcharge`
      });
    } catch (err) {
      console.warn('Backend scam report sync notice:', err.message);
    }

    showToast({
      type: 'warning',
      title: 'Incident Report Logged 🚨',
      message: `Report #${reportData.id} saved for Jaipur RTO & RAAHI Dispatch.`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="text-[10px] font-extrabold uppercase text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/20">
            SAFETY & TARIFF SHIELD
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2 pt-1">
            <i className="fa-solid fa-triangle-exclamation text-rose-500"></i> Report Overcharging / Scam
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Log an instant tariff incident to report excessive prices to RAAHI Safety Dispatch.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Service / Vehicle Type</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-rose-500"
            >
              <option value="auto">Auto-Rickshaw</option>
              <option value="eRickshaw">E-Rickshaw</option>
              <option value="guide">Local Guide</option>
              <option value="taxi">Private Taxi / Cab</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Issue Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-rose-500"
            >
              <option value="Overcharging">Demanded Excessive Fare (Overcharging)</option>
              <option value="Fake Guide">Unverified / Fake Guide Claim</option>
              <option value="Unsafe Behavior">Unsafe / Harassing Conduct</option>
              <option value="Refused Meter">Refused Benchmark Meter Rate</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Quoted Price (₹)</label>
              <input
                type="number"
                value={chargedFare}
                onChange={(e) => setChargedFare(e.target.value)}
                placeholder="220"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white font-extrabold focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Benchmark Target (₹)</label>
              <input
                type="number"
                value={expectedFare}
                onChange={(e) => setExpectedFare(e.target.value)}
                placeholder="107"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white font-extrabold focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Incident Location / Landmark</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Amer Fort Entrance Gate, Jaipur"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe the incident e.g. Driver demanded ₹220 for 5.5km and refused the meter..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            ></textarea>
          </div>

          {/* Optional Screenshot Upload */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Screenshot / Photo Evidence (Optional)</label>
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-1">
                <i className="fa-solid fa-cloud-arrow-up text-xl text-rose-500"></i>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {uploadedFile ? uploadedFile.name : 'Click or Drag photo / QR payment receipt screenshot'}
                </div>
                <div className="text-[10px] text-slate-400">PNG, JPG up to 5MB</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 rounded-2xl transition shadow-lg shadow-rose-600/25 uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-shield-exclamation"></i>
            <span>Submit Tariff Incident Report</span>
          </button>
        </form>
      </div>
    </div>
  );
};
