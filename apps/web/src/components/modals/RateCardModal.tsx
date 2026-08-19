import React, { useState } from 'react';

interface RateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RateCardModal: React.FC<RateCardModalProps> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              {lang === 'en' ? 'Official Tariff Guidelines' : 'आधिकारिक किराया दरें'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Jaipur City Transportation Standards (DEMO)</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-lg font-bold transition ${lang === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-300'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2 py-1 rounded-lg font-bold transition ${lang === 'hi' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-300'}`}
            >
              हिंदी
            </button>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {lang === 'en' ? (
            <>
              <div className="p-3 bg-amber-50 dark:bg-slate-800/60 rounded-xl border border-amber-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-amber-800 dark:text-amber-400">Auto Rickshaw Fare</div>
                <p className="text-slate-600 dark:text-slate-300">Base Fare: ₹30 (First 1.5 km) + ₹14 / additional km.</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-slate-800/60 rounded-xl border border-emerald-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-400">E-Rickshaw Short Trips</div>
                <p className="text-slate-600 dark:text-slate-300">Base Fare: ₹20 + ₹10 / additional km.</p>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200">Local Guide Hourly Benchmark</div>
                <p className="text-slate-600 dark:text-slate-300">Standard Heritage Guide: ₹350 – ₹550 / hour.</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-amber-50 dark:bg-slate-800/60 rounded-xl border border-amber-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-amber-800 dark:text-amber-400">ऑटो रिक्शा किराया</div>
                <p className="text-slate-600 dark:text-slate-300">न्यूनतम किराया: ₹30 (पहला 1.5 किमी) + ₹14 / अतिरिक्त किमी।</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-slate-800/60 rounded-xl border border-emerald-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-400">ई-रिक्शा कम दूरी का किराया</div>
                <p className="text-slate-600 dark:text-slate-300">न्यूनतम किराया: ₹20 + ₹10 / अतिरिक्त किमी।</p>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200">लोकल गाइड प्रति घंटा दर</div>
                <p className="text-slate-600 dark:text-slate-300">मानक हेरिटेज गाइड: ₹350 – ₹550 / घंटा।</p>
              </div>
            </>
          )}

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[11px]">
            <i className="fa-solid fa-handshake-angle text-amber-500 mr-1"></i> Please show this transparent fare card before initiating travel negotiations.
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => alert("Tariff card link copied to clipboard!")}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs"
          >
            <i className="fa-solid fa-share-nodes mr-1"></i> Share Tariff
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
