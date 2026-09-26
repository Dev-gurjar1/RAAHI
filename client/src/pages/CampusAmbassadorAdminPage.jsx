import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { useToastStore } from '../store/useToastStore.js';
import { RaahiLogo } from '../components/RaahiLogo.jsx';
import api from '../services/api.js';

export const CampusAmbassadorAdminPage = () => {
  const { user } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [ambassadors, setAmbassadors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED'
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const fetchAmbassadors = async () => {
    setLoading(true);
    try {
      const res = await api.campusAmbassador.getAdminAmbassadors();
      if (res && res.success && res.data) {
        setAmbassadors(res.data);
      }
    } catch (err) {
      console.warn('Admin fetch error:', err.message);
      // Fallback preview ambassadors for administration testing
      setAmbassadors([
        {
          _id: 'amb_demo_1',
          name: 'Arjun Sharma',
          email: 'arjun@poornima.edu.in',
          phone: '+91 9876543210',
          studentProfile: {
            college: 'Poornima University',
            campus: 'Jaipur',
            course: 'B.Tech CSE',
            yearOfStudy: '2nd Year'
          },
          studentVerification: {
            status: 'UNDER_REVIEW',
            method: 'student_id',
            documentName: 'Poornima_Student_ID_Arjun.pdf',
            submittedAt: new Date().toISOString()
          },
          campusAmbassadorProfile: {
            referralCode: 'RAAHI-ARJUN26',
            campusReach: 14,
            ambassadorStatus: 'ACTIVE'
          }
        },
        {
          _id: 'amb_demo_2',
          name: 'Pooja Verma',
          email: 'pooja.v@rajasthan.edu',
          phone: '+91 9812345678',
          studentProfile: {
            college: 'Rajasthan University',
            campus: 'Jaipur',
            course: 'BBA',
            yearOfStudy: '3rd Year'
          },
          studentVerification: {
            status: 'VERIFIED',
            method: 'college_email',
            submittedAt: new Date(Date.now() - 86400000).toISOString()
          },
          campusAmbassadorProfile: {
            referralCode: 'RAAHI-POOJA12',
            campusReach: 42,
            ambassadorStatus: 'ACTIVE'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId, verificationStatus, ambassadorStatus = null) => {
    setActionLoading(userId);
    try {
      await api.campusAmbassador.adminVerify(userId, {
        verificationStatus,
        ambassadorStatus
      });
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Ambassador status updated to ${verificationStatus || ambassadorStatus}`
      });
      // Update local state
      setAmbassadors((prev) =>
        prev.map((amb) => {
          if (amb._id === userId) {
            return {
              ...amb,
              studentVerification: {
                ...amb.studentVerification,
                ...(verificationStatus ? { status: verificationStatus } : {})
              },
              campusAmbassadorProfile: {
                ...amb.campusAmbassadorProfile,
                ...(ambassadorStatus ? { ambassadorStatus } : {})
              }
            };
          }
          return amb;
        })
      );
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = ambassadors.filter((amb) => {
    if (filter === 'ALL') return true;
    return amb.studentVerification?.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#F8F7F3] dark:bg-[#0D1710] py-8 px-4 sm:px-6 lg:px-8 text-left font-sans text-[#152238] dark:text-[#E8F0EC]">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0E8E4] dark:border-[#243028]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800/30">
              <i className="fa-solid fa-shield-halved"></i>
              <span>RAAHI Campus Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">
              Campus Ambassador Review Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5C6E] dark:text-[#9AB0A4]">
              Review student verification documents, approve legitimate campus leaders, and audit referral metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <NavLink
              to="/campus-ambassador/dashboard"
              className="btn-secondary text-xs px-4 py-2"
            >
              Ambassador View
            </NavLink>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
          {['ALL', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REQUIRES_UPDATE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                filter === f
                  ? 'bg-[#0B9B6E] text-white border-[#0B9B6E] shadow-2xs'
                  : 'bg-white dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Applications Table */}
        <div className="bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#F1F5F3] dark:border-[#243028] flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#152238] dark:text-white uppercase tracking-wider">
              Student Ambassador Applications ({filtered.length})
            </span>
            <button
              onClick={fetchAmbassadors}
              className="text-xs text-[#0B9B6E] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <i className="fa-solid fa-arrows-rotate"></i>
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-[#8A9BAD] space-y-2">
              <i className="fa-solid fa-spinner fa-spin text-xl text-[#0B9B6E]"></i>
              <p>Loading campus ambassador applications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#8A9BAD]">
              No applications matching current filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E0E8E4] dark:border-[#243028] text-[11px] uppercase tracking-wider text-[#8A9BAD] bg-[#F8F7F3]/50 dark:bg-[#111C15]/50">
                    <th className="py-3 px-4">Ambassador / Student</th>
                    <th className="py-3 px-4">College & Campus</th>
                    <th className="py-3 px-4">Course & Year</th>
                    <th className="py-3 px-4">Referral Code</th>
                    <th className="py-3 px-4">Verification Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F3] dark:divide-[#243028]">
                  {filtered.map((amb) => (
                    <tr key={amb._id} className="hover:bg-[#F8F7F3] dark:hover:bg-[#111C15]/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-[#152238] dark:text-white text-sm">
                          {amb.name}
                        </div>
                        <div className="text-[11px] text-[#8A9BAD]">
                          {amb.email} • {amb.phone}
                        </div>
                        {amb.studentVerification?.documentName && (
                          <div className="text-[10px] text-[#0B9B6E] font-mono mt-0.5 flex items-center gap-1">
                            <i className="fa-solid fa-paperclip"></i>
                            <span>{amb.studentVerification.documentName}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-[#152238] dark:text-white">
                          {amb.studentProfile?.college || 'N/A'}
                        </div>
                        <div className="text-[11px] text-[#8A9BAD]">
                          Campus: {amb.studentProfile?.campus || 'Main'}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-[#4A5C6E] dark:text-[#9AB0A4]">
                        <span className="font-bold text-[#152238] dark:text-white">
                          {amb.studentProfile?.course || 'Undergraduate'}
                        </span>
                        <div>{amb.studentProfile?.yearOfStudy || '1st Year'}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-xs text-[#0B9B6E] bg-[#E8F7F1] dark:bg-[#07543F]/30 px-2 py-0.5 rounded">
                          {amb.campusAmbassadorProfile?.referralCode || amb.referralCode || 'N/A'}
                        </span>
                        <div className="text-[10px] text-[#8A9BAD] mt-0.5">
                          Reach: {amb.campusAmbassadorProfile?.campusReach || 0} clicks
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            amb.studentVerification?.status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : amb.studentVerification?.status === 'UNDER_REVIEW'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                          }`}
                        >
                          {amb.studentVerification?.status || 'NOT_STARTED'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={actionLoading === amb._id}
                            onClick={() => handleUpdateStatus(amb._id, 'VERIFIED')}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0B9B6E] hover:bg-[#07543F] text-white font-bold text-[11px] transition cursor-pointer"
                            title="Approve student verification"
                          >
                            Approve
                          </button>
                          <button
                            disabled={actionLoading === amb._id}
                            onClick={() => handleUpdateStatus(amb._id, 'REJECTED')}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] transition cursor-pointer"
                            title="Reject application"
                          >
                            Reject
                          </button>
                          <button
                            disabled={actionLoading === amb._id}
                            onClick={() => handleUpdateStatus(amb._id, 'REQUIRES_UPDATE')}
                            className="px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-bold text-[11px] transition cursor-pointer"
                            title="Request update from student"
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CampusAmbassadorAdminPage;
