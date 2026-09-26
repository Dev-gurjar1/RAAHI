import React, { useState } from 'react';
import { useToastStore } from '../../store/useToastStore.js';
import api from '../../services/api.js';

export const ReportGuideModal = ({
  isOpen,
  onClose,
  guideName = 'Vikram Singh Rathore',
  bookingId
}) => {
  const [reason, setReason] = useState('Unsafe / Harassing Conduct');
  const [description, setDescription] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [submittedReportId, setSubmittedReportId] = useState(null);

  const showToast = useToastStore((state) => state.showToast);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const incidentId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;

    const reportPayload = {
      id: incidentId,
      guideName,
      bookingId: bookingId || 'RAAHI-BK-9482',
      reason,
      description,
      hasEvidence: !!evidenceFile,
      evidenceFileName: evidenceFile ? evidenceFile.name : null,
      status: 'INVESTIGATING',
      createdAt: new Date().toISOString()
    };

    // Store report in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('raahi_guide_reports') || '[]');
      existing.unshift(reportPayload);
      localStorage.setItem('raahi_guide_reports', JSON.stringify(existing));
    } catch (err) {
      console.error('Error saving guide report:', err);
    }

    try {
      await api.reports.createScamReport({
        category: 'Unsafe Behavior',
        description: `[${reason}] Report on ${guideName}: ${description}`,
        locationDetails: 'Jaipur',
        expectedFare: 500,
        chargedFare: 1000
      });
    } catch (err) {
      console.warn('Backend report sync notice:', err.message);
    }

    setSubmittedReportId(incidentId);

    showToast({
      type: 'warning',
      title: 'Incident Report Logged 🚨',
      message: `Report ${incidentId} dispatched to RAAHI Trust & Safety Team.`
    });
  };

  const handleClose = () => {
    setSubmittedReportId(null);
    setDescription('');
    setEvidenceFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {submittedReportId ? (
          /* Confirmation Screen */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto text-3xl">
              <i className="fa-solid fa-shield-check"></i>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/20">
                REPORT SUBMITTED
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                Incident #{submittedReportId}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your report against <span className="font-bold text-slate-900 dark:text-white">{guideName}</span> has been logged and assigned to RAAHI Incident Response.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1 text-left">
              <div><strong>Status:</strong> <span className="text-rose-600 font-extrabold">Active Investigation</span></div>
              <div><strong>Guaranteed Response:</strong> &lt; 15 Minutes</div>
              <div><strong>Support Helpline:</strong> 1800-RAAHI-SAFE</div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold rounded-2xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Done / Return
            </button>
          </div>
        ) : (
          /* Form Screen */
          <>
            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[10px] font-extrabold uppercase text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/20">
                RAAHI SAFETY SHIELD
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2 pt-1">
                <i className="fa-solid fa-user-shield text-rose-500"></i> Report Guide / Host
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log an urgent incident report against <span className="font-bold text-slate-900 dark:text-white">{guideName}</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Reason for Report *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-rose-500"
                >
                  <option value="Unsafe / Harassing Conduct">Unsafe / Harassing Conduct</option>
                  <option value="Excessive Tariff Demand / Extortion">Excessive Tariff Demand / Extortion</option>
                  <option value="Unverified / Substitute Person Showed Up">Unverified / Substitute Person Showed Up</option>
                  <option value="Refused Meter / Agreed Route">Refused Meter / Agreed Route</option>
                  <option value="Other Concern">Other Safety Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the incident e.g. Guide insisted on taking us to an unapproved shopping store and demanded extra cash..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              {/* Photo Evidence Upload Placeholder */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Photo Evidence / Screenshot (Optional)</label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 transition">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files && setEvidenceFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-1">
                    <i className="fa-solid fa-camera text-xl text-rose-500"></i>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {evidenceFile ? evidenceFile.name : 'Click to Upload Screenshot or Photo Evidence'}
                    </div>
                    <div className="text-[10px] text-slate-400">PNG, JPG or PDF up to 5MB</div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 rounded-2xl transition shadow-lg shadow-rose-600/25 uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-paper-plane"></i>
                <span>Submit Safety Report to RAAHI Trust</span>
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
