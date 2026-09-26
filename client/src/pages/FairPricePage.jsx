import React, { useState } from 'react';
import { RateCardModal } from '../components/modals/RateCardModal.jsx';
import { ScamReportModal } from '../components/modals/ScamReportModal.jsx';
import { CustomSelect } from '../components/ui/CustomSelect.jsx';
import { Stepper } from '../components/ui/Stepper.jsx';
import { PriceGauge } from '../components/ui/PriceGauge.jsx';

export const FairPricePage = () => {
  const [serviceCategory, setServiceCategory] = useState('GUIDE'); // 'TRANSIT', 'GUIDE', 'TOUR'
  const [destination, setDestination] = useState('Jaipur');
  
  // Transit parameters
  const [mode, setMode] = useState('auto');
  const [dist, setDist] = useState(5.5);
  const [wait, setWait] = useState(15);
  const [travelers, setTravelers] = useState(2);
  const [night, setNight] = useState(false);
  
  // Guide / Tour parameters
  const [guidePricingModel, setGuidePricingModel] = useState('TOTAL_TRIP'); // 'TOTAL_TRIP', 'HOURLY'
  const [tourPricingModel, setTourPricingModel] = useState('PER_PERSON'); // 'PER_PERSON', 'PER_GROUP'
  const [guideType, setGuideType] = useState('PROFESSIONAL_GUIDE');
  const [durationHours, setDurationHours] = useState(4);
  const [tourDurationHours, setTourDurationHours] = useState(3);

  // Quoted asking price
  const [askingPrice, setAskingPrice] = useState('1200');

  const [isWhyExpanded, setIsWhyExpanded] = useState(true);
  const [isRateCardOpen, setIsRateCardOpen] = useState(false);
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);

  // Dynamic Fare / Benchmark Evaluation Function
  const computeFare = () => {
    const ask = parseFloat(askingPrice) || 0;

    if (serviceCategory === 'GUIDE') {
      const hours = durationHours || 4;
      let minFare = 0;
      let maxFare = 0;
      let recommendedFare = 0;
      let unitLabel = '';

      if (guidePricingModel === 'TOTAL_TRIP') {
        const minRate = guideType === 'STUDENT_LOCAL' ? 150 : guideType === 'LOCAL_HOST' ? 200 : 225;
        const maxRate = guideType === 'STUDENT_LOCAL' ? 250 : guideType === 'LOCAL_HOST' ? 320 : 350;
        minFare = Math.round(hours * minRate);
        maxFare = Math.round(hours * maxRate);
        recommendedFare = Math.round(hours * ((minRate + maxRate) / 2));
        unitLabel = ' total';
      } else {
        // HOURLY
        minFare = guideType === 'STUDENT_LOCAL' ? 150 : guideType === 'LOCAL_HOST' ? 200 : 250;
        maxFare = guideType === 'STUDENT_LOCAL' ? 250 : guideType === 'LOCAL_HOST' ? 320 : 450;
        recommendedFare = guideType === 'STUDENT_LOCAL' ? 200 : guideType === 'LOCAL_HOST' ? 250 : 300;
        unitLabel = '/hour';
      }

      let riskLevel = 'FAIR';
      let statusLabel = 'Fair · Within expected range';
      let potentialOvercharge = 0;
      let percentageOvercharge = 0;

      if (ask > maxFare) {
        potentialOvercharge = Math.round(ask - recommendedFare);
        percentageOvercharge = Math.round((potentialOvercharge / recommendedFare) * 100);
        if (ask <= maxFare * 1.25) {
          riskLevel = 'SLIGHTLY_HIGH';
          statusLabel = 'Slightly Above Average';
        } else if (ask <= maxFare * 1.5) {
          riskLevel = 'OVERPRICED';
          statusLabel = 'Overpriced Quote';
        } else {
          riskLevel = 'HIGH_OVERCHARGE_RISK';
          statusLabel = 'High Overcharge Risk';
        }
      } else {
        riskLevel = 'FAIR';
        statusLabel = 'Fair · Within expected range';
      }

      return {
        serviceCategory: 'GUIDE',
        pricingModel: guidePricingModel,
        durationHours: hours,
        minFare,
        maxFare,
        recommendedFare,
        unitLabel,
        askingPrice: ask,
        potentialOvercharge,
        percentageOvercharge,
        riskLevel,
        statusLabel
      };
    }

    if (serviceCategory === 'TOUR') {
      const hours = tourDurationHours || 3;
      let minFare = 0;
      let maxFare = 0;
      let recommendedFare = 0;
      let unitLabel = '';

      if (tourPricingModel === 'PER_PERSON') {
        minFare = Math.round(hours * 170); // 3 hrs -> 510
        maxFare = Math.round(hours * 300); // 3 hrs -> 900
        recommendedFare = Math.round(hours * 230); // ~690
        unitLabel = '/person';
      } else {
        // PER_GROUP (up to 4-6 people)
        minFare = Math.round(hours * 350 + 300); // ~1,350
        maxFare = Math.round(hours * 600 + 400); // ~2,200
        recommendedFare = Math.round(hours * 450 + 350);
        unitLabel = '/group';
      }

      let riskLevel = 'FAIR';
      let statusLabel = 'Fair · Within expected range';
      let potentialOvercharge = 0;
      let percentageOvercharge = 0;

      if (ask > maxFare) {
        potentialOvercharge = Math.round(ask - recommendedFare);
        percentageOvercharge = Math.round((potentialOvercharge / recommendedFare) * 100);
        if (ask <= maxFare * 1.25) {
          riskLevel = 'SLIGHTLY_HIGH';
          statusLabel = 'Slightly Above Average';
        } else {
          riskLevel = 'OVERPRICED';
          statusLabel = 'Overpriced Quote';
        }
      } else {
        riskLevel = 'FAIR';
        statusLabel = 'Fair · Within expected range';
      }

      return {
        serviceCategory: 'TOUR',
        pricingModel: tourPricingModel,
        durationHours: hours,
        minFare,
        maxFare,
        recommendedFare,
        unitLabel,
        askingPrice: ask,
        potentialOvercharge,
        percentageOvercharge,
        riskLevel,
        statusLabel
      };
    }

    // Default: TRANSIT
    let baseFare = 35;
    let perKmRate = 14;
    let perMinRate = 1;

    if (mode === 'eRickshaw') {
      baseFare = 25;
      perKmRate = 10;
      perMinRate = 0.5;
    } else if (mode === 'taxi') {
      baseFare = 90;
      perKmRate = 24;
      perMinRate = 1.5;
    }

    const distanceFee = Math.round(dist * perKmRate);
    const durationFee = Math.round(wait * perMinRate);

    let extraTravelersFee = 0;
    if (travelers > 2) {
      extraTravelersFee = (travelers - 2) * 40;
    }

    const unadjustedTotal = baseFare + distanceFee + durationFee + extraTravelersFee;
    const nightSurchargeFee = night ? Math.round(unadjustedTotal * 0.25) : 0;
    const calculated = unadjustedTotal + nightSurchargeFee;

    const minFare = Math.round(calculated * 0.90);
    const recommendedFare = Math.round(calculated);
    const maxFare = Math.round(calculated * 1.18);

    let potentialOvercharge = 0;
    let percentageOvercharge = 0;
    let riskLevel = 'FAIR';
    let statusLabel = 'Fair · Within expected range';

    if (ask > maxFare) {
      potentialOvercharge = Math.round(ask - recommendedFare);
      percentageOvercharge = Math.round((potentialOvercharge / recommendedFare) * 100);
      const maxDifferenceRatio = ask / maxFare;
      if (maxDifferenceRatio <= 1.25) {
        riskLevel = 'SLIGHTLY_HIGH';
        statusLabel = 'Slightly High';
      } else if (maxDifferenceRatio <= 1.60) {
        riskLevel = 'OVERPRICED';
        statusLabel = 'Overpriced Quote';
      } else {
        riskLevel = 'HIGH_OVERCHARGE_RISK';
        statusLabel = 'High Overcharge Risk';
      }
    } else {
      riskLevel = 'FAIR';
      statusLabel = 'Fair · Within expected range';
    }

    return {
      serviceCategory: 'TRANSIT',
      mode,
      baseFare,
      perKmRate,
      distanceKm: dist,
      distanceFee,
      waitingMinutes: wait,
      perMinRate,
      durationFee,
      travelersCount: travelers,
      extraTravelersFee,
      isNightRate: night,
      nightSurchargeFee,
      estimatedBaseSubtotal: unadjustedTotal,
      recommendedFare,
      minFare,
      maxFare,
      unitLabel: '',
      askingPrice: ask,
      potentialOvercharge,
      percentageOvercharge,
      riskLevel,
      statusLabel
    };
  };

  const fare = computeFare();

  return (
    <div className="bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen text-[#152238] dark:text-[#E8F0EC]">

      {/* ══════════════════════════════════════════════════
          HERO BANNER
          ══════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold border border-[#0B9B6E]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B9B6E] animate-pulse"></span>
            <i className="fa-solid fa-shield-halved text-[11px] text-[#0B9B6E]"></i>
            <span>FLAGSHIP ANTI-EXTORTION ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#152238] dark:text-white font-heading tracking-tight">
            Fair Price Checker
          </h1>

          <p className="text-base sm:text-lg text-[#4A5C6E] dark:text-[#9AB0A4] max-w-2xl leading-relaxed">
            Transparently verify standard regional tariffs for auto-rickshaws, e-rickshaws, private cabs, and certified guides across India before you pay.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MAIN PRODUCT LAYOUT (LEFT: EXPLAINER / RIGHT: CHECKER)
          ══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ══════════════════════════════════════════════
              LEFT SIDE: "Is this price actually fair?"
              ══════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#0B9B6E]">
                  PRICE TRANSPARENCY
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading leading-tight">
                  Is this price actually fair?
                </h2>
                <p className="text-sm text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed pt-1">
                  Know what locals typically charge before you book. Bypassing unmetered tourist markups protects both your budget and local fair market wages.
                </p>
              </div>

              {/* Three Value Pillars */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F7F1] dark:bg-[#07543F]/30 flex items-center justify-center text-[#0B9B6E] flex-shrink-0">
                    <i className="fa-solid fa-scale-balanced text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#152238] dark:text-white">
                      Statutory RTO Benchmarking
                    </h3>
                    <p className="text-xs text-[#8A9BAD] mt-0.5 leading-relaxed">
                      Calibrated against state regional transport authority published gazettes and local resident rate standards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FEF6E4] dark:bg-[#F4A340]/20 flex items-center justify-center text-[#F4A340] flex-shrink-0">
                    <i className="fa-solid fa-handshake-simple text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#152238] dark:text-white">
                      Pre-written Counter Dialogue
                    </h3>
                    <p className="text-xs text-[#8A9BAD] mt-0.5 leading-relaxed">
                      Instant polite negotiation scripts in spoken Hindi and English to settle the rate respectfully.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 flex-shrink-0">
                    <i className="fa-solid fa-shield-halved text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#152238] dark:text-white">
                      Scam & Extortion Reporting
                    </h3>
                    <p className="text-xs text-[#8A9BAD] mt-0.5 leading-relaxed">
                      Flag repeat offenders directly to local tourist police desks with GPS location tags.
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Rate Card CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsRateCardOpen(true)}
                  className="w-full py-3 bg-[#F8F7F3] dark:bg-[#111C15] hover:bg-[#E8F7F1] text-[#07543F] dark:text-[#4ADE80] font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 border border-[#E0E8E4] dark:border-[#243028] transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-file-invoice"></i>
                  <span>View Official State Rate Card</span>
                </button>
              </div>
            </div>

            {/* "How is this calculated?" Accordion Box */}
            <div className="bg-white dark:bg-[#162019] p-6 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-4">
              <button
                type="button"
                onClick={() => setIsWhyExpanded(!isWhyExpanded)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-circle-question text-[#0B9B6E]"></i>
                  <span className="font-extrabold text-sm text-[#152238] dark:text-white font-heading">
                    How is this calculated?
                  </span>
                </div>
                <i className={`fa-solid fa-chevron-down text-xs text-[#8A9BAD] transition-transform ${isWhyExpanded ? 'rotate-180' : ''}`}></i>
              </button>

              {isWhyExpanded && (
                <div className="space-y-3 pt-2 text-xs border-t border-[#F1F5F3] dark:border-[#243028] text-[#4A5C6E] dark:text-[#9AB0A4]">
                  {fare.serviceCategory === 'GUIDE' ? (
                    <>
                      <div className="flex justify-between py-1">
                        <span>Service Evaluated:</span>
                        <span className="font-bold text-[#152238] dark:text-white">
                          Guide Hire ({guideType === 'STUDENT_LOCAL' ? 'Student Local' : guideType === 'LOCAL_HOST' ? 'Local Host' : 'Professional Guide'})
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Pricing Structure:</span>
                        <span className="font-bold text-[#152238] dark:text-white">
                          {fare.pricingModel === 'TOTAL_TRIP' ? 'Total Trip Price' : 'Hourly Tariff'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Duration Allocated:</span>
                        <span className="font-bold text-[#152238] dark:text-white">{fare.durationHours} Hours</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Anti-Exploitation Policy:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">0% Commission Traps Guaranteed</span>
                      </div>
                      <div className="border-t border-[#E0E8E4] dark:border-[#243028] pt-2 flex justify-between font-extrabold text-sm text-[#152238] dark:text-white font-heading">
                        <span>Expected Market Standard:</span>
                        <span className="text-[#0B9B6E]">₹{fare.minFare} – ₹{fare.maxFare}{fare.unitLabel}</span>
                      </div>
                    </>
                  ) : fare.serviceCategory === 'TOUR' ? (
                    <>
                      <div className="flex justify-between py-1">
                        <span>Service Evaluated:</span>
                        <span className="font-bold text-[#152238] dark:text-white">Curated Tour Package ({destination})</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Pricing Structure:</span>
                        <span className="font-bold text-[#152238] dark:text-white">
                          {fare.pricingModel === 'PER_PERSON' ? 'Per Person' : 'Per Group Rate'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Tour Duration:</span>
                        <span className="font-bold text-[#152238] dark:text-white">{fare.durationHours} Hours</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Inclusions Covered:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Verified Guide + Itinerary</span>
                      </div>
                      <div className="border-t border-[#E0E8E4] dark:border-[#243028] pt-2 flex justify-between font-extrabold text-sm text-[#152238] dark:text-white font-heading">
                        <span>Expected Fair Range:</span>
                        <span className="text-[#0B9B6E]">₹{fare.minFare} – ₹{fare.maxFare}{fare.unitLabel}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between py-1">
                        <span>Base Flagfall Tariff ({fare.mode}):</span>
                        <span className="font-bold text-[#152238] dark:text-white">₹{fare.baseFare}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Distance Fee ({dist} km @ ₹{fare.perKmRate}/km):</span>
                        <span className="font-bold text-[#152238] dark:text-white">₹{fare.distanceFee}</span>
                      </div>
                      {fare.waitingMinutes > 0 && (
                        <div className="flex justify-between py-1">
                          <span>Waiting / Duration ({fare.waitingMinutes} min):</span>
                          <span className="font-bold text-[#152238] dark:text-white">₹{fare.durationFee}</span>
                        </div>
                      )}
                      {fare.extraTravelersFee > 0 && (
                        <div className="flex justify-between py-1">
                          <span>Extra Guests Surcharge:</span>
                          <span className="font-bold text-[#152238] dark:text-white">₹{fare.extraTravelersFee}</span>
                        </div>
                      )}
                      {night && (
                        <div className="flex justify-between py-1 text-purple-600 dark:text-purple-400 font-semibold">
                          <span>Late Night +25% Multiplier:</span>
                          <span>+₹{fare.nightSurchargeFee}</span>
                        </div>
                      )}
                      <div className="border-t border-[#E0E8E4] dark:border-[#243028] pt-2 flex justify-between font-extrabold text-sm text-[#152238] dark:text-white font-heading">
                        <span>Calculated Fair Benchmark:</span>
                        <span className="text-[#0B9B6E]">₹{fare.recommendedFare}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>


          {/* ══════════════════════════════════════════════
              RIGHT SIDE: Interactive Price Checker & Results
              ══════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">

            {/* Inputs Card */}
            <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F3] dark:border-[#243028]">
                <h3 className="font-extrabold text-lg text-[#152238] dark:text-white font-heading flex items-center gap-2">
                  <i className="fa-solid fa-sliders text-[#0B9B6E]"></i>
                  <span>Select Service & Parameters</span>
                </h3>
                <span className="text-xs text-[#8A9BAD] font-bold">Model Adaptive</span>
              </div>

              {/* Service Category Switcher Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F8F7F3] dark:bg-[#111C15] rounded-2xl border border-[#E0E8E4] dark:border-[#243028]">
                {[
                  { id: 'GUIDE', label: '🎖️ Guide Hire', defaultAsk: '1200' },
                  { id: 'TOUR', label: '🗺️ Tour Package', defaultAsk: '699' },
                  { id: 'TRANSIT', label: '🚗 Local Transit', defaultAsk: '220' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setServiceCategory(cat.id);
                      setAskingPrice(cat.defaultAsk);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                      serviceCategory === cat.id
                        ? 'bg-[#0B9B6E] text-white shadow-sm'
                        : 'text-[#4A5C6E] dark:text-[#9AB0A4] hover:text-[#152238] dark:hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Destination Selector for all */}
              <CustomSelect
                label="Destination"
                icon="fa-solid fa-location-dot"
                value={destination}
                onChange={setDestination}
                options={[
                  { value: 'Jaipur', label: 'Jaipur, Rajasthan' },
                  { value: 'Varanasi', label: 'Varanasi, Uttar Pradesh' },
                  { value: 'Udaipur', label: 'Udaipur, Rajasthan' },
                  { value: 'Goa', label: 'Goa Coastal Region' },
                  { value: 'Delhi', label: 'Delhi NCR Region' },
                ]}
              />

              {/* DYNAMIC PARAMETERS BASED ON CATEGORY */}
              {serviceCategory === 'GUIDE' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelect
                      label="Guide Category"
                      icon="fa-solid fa-user-tag"
                      value={guideType}
                      onChange={setGuideType}
                      options={[
                        { value: 'PROFESSIONAL_GUIDE', label: '🎖️ Professional Guide' },
                        { value: 'LOCAL_HOST', label: '🏡 Local Host' },
                        { value: 'STUDENT_LOCAL', label: '🎓 Student Local' },
                      ]}
                    />

                    <div>
                      <label className="block text-xs font-bold text-[#152238] dark:text-[#E8F0EC] uppercase tracking-wider mb-1.5">
                        Pricing Model
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setGuidePricingModel('TOTAL_TRIP');
                            setAskingPrice('1200');
                          }}
                          className={`py-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            guidePricingModel === 'TOTAL_TRIP'
                              ? 'bg-[#152238] text-white dark:bg-white dark:text-[#152238] border-transparent'
                              : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028]'
                          }`}
                        >
                          Total Trip Price
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGuidePricingModel('HOURLY');
                            setAskingPrice('300');
                          }}
                          className={`py-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            guidePricingModel === 'HOURLY'
                              ? 'bg-[#152238] text-white dark:bg-white dark:text-[#152238] border-transparent'
                              : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028]'
                          }`}
                        >
                          Hourly Tariff
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Duration Selector */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#152238] dark:text-[#E8F0EC]">Service Duration</span>
                      <span className="text-[#0B9B6E] font-black text-sm">{durationHours} Hours</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[2, 3, 4, 6, 8].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setDurationHours(h)}
                          className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            durationHours === h
                              ? 'bg-[#0B9B6E] text-white shadow-xs'
                              : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border border-[#E0E8E4] dark:border-[#243028]'
                          }`}
                        >
                          {h} hrs
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {serviceCategory === 'TOUR' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#152238] dark:text-[#E8F0EC] uppercase tracking-wider mb-1.5">
                        Pricing Model
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTourPricingModel('PER_PERSON');
                            setAskingPrice('699');
                          }}
                          className={`py-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            tourPricingModel === 'PER_PERSON'
                              ? 'bg-[#152238] text-white dark:bg-white dark:text-[#152238] border-transparent'
                              : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028]'
                          }`}
                        >
                          Per Person
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTourPricingModel('PER_GROUP');
                            setAskingPrice('1800');
                          }}
                          className={`py-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            tourPricingModel === 'PER_GROUP'
                              ? 'bg-[#152238] text-white dark:bg-white dark:text-[#152238] border-transparent'
                              : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028]'
                          }`}
                        >
                          Per Group
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#152238] dark:text-[#E8F0EC]">Tour Duration</span>
                        <span className="text-[#0B9B6E] font-black text-sm">{tourDurationHours} Hours</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[2, 3, 4, 6].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setTourDurationHours(h)}
                            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                              tourDurationHours === h
                                ? 'bg-[#0B9B6E] text-white shadow-xs'
                                : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border border-[#E0E8E4] dark:border-[#243028]'
                            }`}
                          >
                            {h} hrs
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {serviceCategory === 'TRANSIT' && (
                <div className="space-y-4">
                  <CustomSelect
                    label="Vehicle Transit Type"
                    icon="fa-solid fa-taxi"
                    value={mode}
                    onChange={setMode}
                    options={[
                      { value: 'auto', label: 'Auto Rickshaw (3-Wheeler)' },
                      { value: 'eRickshaw', label: 'E-Rickshaw (Green Transit)' },
                      { value: 'taxi', label: 'Private AC Cab / Sedan' },
                    ]}
                  />

                  {/* Distance Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#152238] dark:text-[#E8F0EC]">Travel Distance</span>
                      <span className="text-[#0B9B6E] font-black text-sm">{dist} km</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="35"
                      step="0.5"
                      value={dist}
                      onChange={(e) => setDist(parseFloat(e.target.value))}
                      className="w-full accent-[#0B9B6E] cursor-pointer"
                    />
                  </div>

                  {/* Duration / Waiting Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#152238] dark:text-[#E8F0EC]">
                        Monument Waiting Time
                      </span>
                      <span className="text-[#0B9B6E] font-black text-sm">{wait} minutes</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="120"
                      step="15"
                      value={wait}
                      onChange={(e) => setWait(parseFloat(e.target.value))}
                      className="w-full accent-[#0B9B6E] cursor-pointer"
                    />
                  </div>

                  {/* Travelers & Night toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Stepper
                      label="Travelers"
                      value={travelers}
                      onChange={setTravelers}
                      min={1}
                      max={8}
                      unit="Guests"
                    />
                    <div className="flex items-center justify-between p-3.5 bg-[#F8F7F3] dark:bg-[#111C15] rounded-xl border border-[#E0E8E4] dark:border-[#243028]">
                      <div>
                        <div className="text-xs font-bold text-[#152238] dark:text-white">Late Night (+25%)</div>
                        <div className="text-[10px] text-[#8A9BAD]">10 PM – 5 AM</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={night}
                        onChange={(e) => setNight(e.target.checked)}
                        className="w-5 h-5 accent-[#0B9B6E] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Asking Price Input for all categories */}
              <div className="space-y-1.5 pt-2 border-t border-[#F1F5F3] dark:border-[#243028]">
                <label className="block text-xs font-bold text-[#152238] dark:text-[#E8F0EC] uppercase tracking-wider">
                  Quoted Price Offer (₹{fare.unitLabel})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-[#8A9BAD]">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    placeholder="Enter quoted amount"
                    className="w-full pl-8 pr-4 py-3 bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl font-black text-sm text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>
              </div>
            </div>

            {/* RESULTS CARD WITH PRICE GAUGE */}
            <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-lg space-y-6">

              {/* Top Result Banner */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#F1F5F3] dark:border-[#243028]">
                <div>
                  <span className="text-[10px] text-[#8A9BAD] uppercase font-bold tracking-wider block">
                    QUOTED PRICE
                  </span>
                  <div className="text-3xl font-black text-[#152238] dark:text-white font-heading mt-0.5">
                    ₹{fare.askingPrice}{fare.unitLabel}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#07543F] dark:text-[#4ADE80] uppercase font-bold tracking-wider block">
                    EXPECTED FAIR RANGE
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0B9B6E] font-heading mt-0.5">
                    ₹{fare.minFare} — ₹{fare.maxFare}{fare.unitLabel}
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8A9BAD] uppercase tracking-wider">
                  STATUS:
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase ${
                    fare.riskLevel === 'FAIR'
                      ? 'bg-[#E8F7F1] dark:bg-[#07543F]/40 text-[#07543F] dark:text-[#4ADE80] border border-[#0B9B6E]/30'
                      : fare.riskLevel === 'SLIGHTLY_HIGH'
                      ? 'bg-amber-50 text-[#D45D0E] border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <i className={`fa-solid ${fare.riskLevel === 'FAIR' ? 'fa-circle-check text-[#0B9B6E]' : 'fa-triangle-exclamation'}`}></i>
                  <span>{fare.statusLabel}</span>
                </span>
              </div>

              {/* Visual Price Gauge Component */}
              <PriceGauge
                minPrice={fare.minFare}
                typicalMin={fare.minFare}
                typicalMax={fare.maxFare}
                userQuote={fare.askingPrice}
                maxCeiling={Math.max(fare.maxFare * 1.5, fare.askingPrice + 100)}
              />

              {/* Dynamic Polite Counter-Offer Dialogue Script */}
              <div className="p-4 rounded-2xl bg-[#FEF6E4] dark:bg-[#F4A340]/10 border border-[#F4A340]/30 space-y-2">
                <span className="text-[10px] font-black uppercase text-[#D45D0E] tracking-wider block">
                  Polite Counter-Offer Dialogue
                </span>
                <p className="text-xs font-semibold text-[#152238] dark:text-white leading-relaxed">
                  {serviceCategory === 'GUIDE'
                    ? `"Namaste! The standard RAAHI benchmark for a ${fare.durationHours}-hour verified tour is ₹${fare.recommendedFare}${fare.unitLabel}. I am ready to confirm at this fair rate."`
                    : serviceCategory === 'TOUR'
                    ? `"Hello! Based on the RAAHI verified catalog, the fair rate for this ${fare.durationHours}-hour tour package in ${destination} is ₹${fare.recommendedFare}${fare.unitLabel}. Can we proceed with this?"`
                    : `"Bhaiya, RAAHI standard government app shows ₹${fare.recommendedFare} is the fair meter tariff for this route. I can offer ₹${fare.recommendedFare} right now."`}
                </p>
                <div className="text-[11px] text-[#8A9BAD] italic">
                  {serviceCategory === 'GUIDE'
                    ? `(नमस्ते, RAAHI ऐप के अनुसार ${fare.durationHours} घंटे का उचित शुल्क ₹${fare.recommendedFare} है, हम इसी दर पर बुक करना चाहते हैं।)`
                    : serviceCategory === 'TOUR'
                    ? `(नमस्ते, RAAHI पर इस टूर का उचित मूल्य ₹${fare.recommendedFare} है।)`
                    : `(भैया, सरकारी ऐप पर इस दूरी का उचित किराया ₹${fare.recommendedFare} आ रहा है, हम ₹${fare.recommendedFare} दे सकते हैं।)`}
                </div>
              </div>

              {/* Report Scam Button */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#8A9BAD]">Encountered pushy commissions or 3x+ extortion?</span>
                <button
                  type="button"
                  onClick={() => setIsScamModalOpen(true)}
                  className="font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Report Overcharge Incident
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* MODALS */}
      {isRateCardOpen && <RateCardModal onClose={() => setIsRateCardOpen(false)} />}
      {isScamModalOpen && <ScamReportModal onClose={() => setIsScamModalOpen(false)} />}

    </div>
  );
};
