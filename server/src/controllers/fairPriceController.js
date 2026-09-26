import { FareEngineService } from '../services/fareEngineService.js';
import { PriceBenchmark } from '../models/PriceBenchmark.js';
import { INITIAL_BENCHMARKS } from '../services/seedService.js';

export const calculateFairPrice = async (req, res) => {
  try {
    const {
      destination = 'Jaipur',
      category = 'guide',
      serviceType, // 'guide', 'tour', 'transport', 'experience'
      pricingModel, // 'TOTAL_TRIP', 'HOURLY', 'PER_PERSON', 'PER_GROUP', 'METERED'
      duration,
      durationHours,
      travelers = 1,
      groupSize = 1,
      quotedPrice,
      askingPrice,
      mode = 'auto',
      distanceKm = 5,
      waitingMinutes = 0,
      isNightRate = false
    } = req.body;

    const askPrice = quotedPrice !== undefined ? parseFloat(quotedPrice) : (askingPrice !== undefined ? parseFloat(askingPrice) : undefined);
    const durHours = parseFloat(durationHours) || parseFloat(duration) || 3;
    const travCount = parseInt(travelers) || parseInt(groupSize) || 1;
    const resolvedCategory = (category || serviceType || 'guide').toLowerCase();

    // Check if this is a Transport inquiry (Auto, Taxi, E-Rickshaw)
    if (resolvedCategory === 'transport' || resolvedCategory === 'auto' || resolvedCategory === 'taxi' || resolvedCategory === 'erickshaw') {
      const estimate = FareEngineService.calculateFare({
        mode: mode || resolvedCategory || 'auto',
        distanceKm: parseFloat(distanceKm) || 5,
        waitingMinutes: parseFloat(waitingMinutes) || 0,
        isNightRate: Boolean(isNightRate),
        askingPrice: askPrice
      });

      estimate.quotedPrice = askPrice;
      estimate.destination = destination;
      estimate.category = 'Transport';
      estimate.expectedRange = `₹${estimate.breakdown?.minFairFare || Math.round(estimate.estimatedBaseFare * 0.9)} – ₹${estimate.breakdown?.maxFairFare || Math.round(estimate.estimatedBaseFare * 1.15)}`;
      estimate.fairPriceStatus = estimate.status || 'FAIR';
      estimate.benchmark = `Rajasthan Govt Motor Vehicles Department (RTO) Statutory Tariff (${destination})`;
      estimate.explanation = estimate.riskMessage || `Official metered tariff for ${estimate.mode} covering ${estimate.distanceKm} km.`;

      return res.status(200).json({
        success: true,
        data: estimate
      });
    }

    // Otherwise, evaluate Guide, Tour, or Experience Service
    const isTour = resolvedCategory.includes('tour') || resolvedCategory.includes('experience') || (pricingModel && pricingModel.includes('PERSON'));
    const model = pricingModel ? pricingModel.toUpperCase() : (isTour ? 'PER_PERSON' : 'TOTAL_TRIP');

    let baseMin = 0;
    let baseMax = 0;
    let unitLabel = '';

    if (model === 'HOURLY') {
      // Benchmark hourly guide tariff (typically ₹250 – ₹450 / hour in major tourist cities)
      baseMin = 250;
      baseMax = 450;
      unitLabel = '/hour';
    } else if (model === 'PER_PERSON') {
      // Tour per-person rate benchmark based on duration: ~₹180 - ₹300 per hour per person
      // e.g., 3-hour tour: ₹500 – ₹900/person
      const minRatePerHour = 170;
      const maxRatePerHour = 300;
      baseMin = Math.round(durHours * minRatePerHour);
      baseMax = Math.round(durHours * maxRatePerHour);
      unitLabel = '/person';
    } else if (model === 'PER_GROUP') {
      // Tour per group: e.g. up to 4-6 people, ₹1,200 – ₹2,400 depending on duration
      baseMin = Math.round(durHours * 350 + Math.min(travCount, 6) * 100);
      baseMax = Math.round(durHours * 550 + Math.min(travCount, 6) * 150);
      unitLabel = '/group';
    } else {
      // TOTAL_TRIP / FIXED_TRIP guide hiring
      // Example: 4 hours guide: ~₹900 – ₹1,400 total
      const minPerHour = 225;
      const maxPerHour = 350;
      baseMin = Math.round(durHours * minPerHour);
      baseMax = Math.round(durHours * maxPerHour);
      unitLabel = ' total';
    }

    const expectedRange = `₹${baseMin.toLocaleString('en-IN')} – ₹${baseMax.toLocaleString('en-IN')}${unitLabel}`;

    let fairPriceStatus = 'FAIR';
    let statusLabel = 'Within expected range';
    let explanation = `The price of ₹${askPrice || baseMin}${unitLabel} is within the recommended market standard for ${durHours} hours in ${destination}.`;

    if (askPrice !== undefined && !isNaN(askPrice)) {
      if (askPrice > baseMax * 1.4) {
        fairPriceStatus = 'EXORBITANT_SCAM';
        statusLabel = 'Significantly Inflated';
        const percentAbove = Math.round(((askPrice - baseMax) / baseMax) * 100);
        explanation = `Warning: ₹${askPrice.toLocaleString('en-IN')} is +${percentAbove}% above standard tariffs. Fair market benchmark is ${expectedRange}.`;
      } else if (askPrice > baseMax) {
        fairPriceStatus = 'ELEVATED';
        statusLabel = 'Slightly Above Average';
        explanation = `Tariff is slightly above standard benchmark (${expectedRange}). You may counter-offer around ₹${Math.round((baseMin + baseMax) / 2)}${unitLabel}.`;
      } else if (askPrice < baseMin * 0.6) {
        fairPriceStatus = 'SUSPICIOUS_LOW';
        statusLabel = 'Suspiciously Cheap';
        explanation = `Unusually low tariff. Ensure no unauthorized shopping commission traps or hidden fees are tied to this service.`;
      } else {
        fairPriceStatus = 'FAIR';
        statusLabel = 'Fair · Within expected range';
        explanation = `₹${askPrice.toLocaleString('en-IN')}${unitLabel} is a fair price adhering to transparent certified rates in ${destination}.`;
      }
    }

    const result = {
      destination,
      category: isTour ? 'Curated Tour' : 'Guide Service',
      serviceType: isTour ? 'TOUR' : 'GUIDE',
      pricingModel: model,
      durationHours: durHours,
      durationText: `${durHours} hours`,
      travelersCount: travCount,
      quotedPrice: askPrice,
      askingPrice: askPrice,
      expectedMin: baseMin,
      expectedMax: baseMax,
      expectedRange,
      unitLabel,
      fairPriceStatus,
      status: statusLabel,
      benchmark: `RAAHI Certified Rate Index for ${destination} (${model.replace('_', ' ')})`,
      explanation
    };

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBenchmarks = async (req, res) => {
  try {
    let benchmarks = [];
    try {
      benchmarks = await PriceBenchmark.find().lean();
      if (!benchmarks || benchmarks.length === 0) {
        benchmarks = INITIAL_BENCHMARKS;
      }
    } catch (err) {
      benchmarks = INITIAL_BENCHMARKS;
    }

    return res.status(200).json({
      success: true,
      count: benchmarks.length,
      data: benchmarks
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
