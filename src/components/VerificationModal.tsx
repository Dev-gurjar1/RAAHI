import React from 'react';
import { ShieldCheck, CheckCircle2, X, Award, MapPin } from 'lucide-react';
import { GuideProfile } from '../types';

interface VerificationModalProps {
  guide: GuideProfile | null;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ guide, onClose }) => {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
              Verified by STHANIQ Safety
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{guide.name}</h3>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Government Identity Submitted & Verified</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Local Area Expertise Checked ({guide.serviceAreas[0]})</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Multilingual Competency Verified ({guide.languages.join(', ')})</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>STHANIQ Safety Policy Accepted</span>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-center space-y-0.5">
          <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Official Status</span>
          <span className="text-sm font-extrabold text-emerald-700">Verified Local Guide</span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs transition"
        >
          Close Verification Info
        </button>
      </div>
    </div>
  );
};
