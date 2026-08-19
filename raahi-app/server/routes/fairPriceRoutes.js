const express = require('express');
const router = express.Router();

// Benchmark Rate Constants (Per Km / Per Hour Standards)
const TARIFF_STANDARDS = {
  AUTO: { baseRate: 30, perKm: 15, baseDistanceKm: 1.5, name: 'Prepaid Auto / E-Rickshaw' },
  CAB: { baseRate: 100, perKm: 22, baseDistanceKm: 4.0, name: 'Sedan AC Intercity Cab' },
  GUIDE_HOURLY: { baseRate: 400, perHour: 300, name: 'Certified Heritage Guide' },
  STREET_FOOD: { basePrice: 40, maxFairPrice: 80, name: 'Local Heritage Food Combo' }
};

// POST /api/fair-price/estimate
router.post('/estimate', (req, res) => {
  try {
    const { category = 'AUTO', distanceKm = 5, durationHours = 2, quotedPrice = 250 } = req.body;

    let minFairPrice = 0;
    let maxFairPrice = 0;
    let categoryName = 'Local Transit';
    let trustedBenchmarkSource = 'Rajasthan Regional Transport Authority (RTO) Standard';

    const dist = Math.max(0.5, Number(distanceKm));
    const hours = Math.max(1, Number(durationHours));
    const priceQuoted = Number(quotedPrice);

    if (category === 'AUTO') {
      categoryName = TARIFF_STANDARDS.AUTO.name;
      const calculated = TARIFF_STANDARDS.AUTO.baseRate + (dist > TARIFF_STANDARDS.AUTO.baseDistanceKm ? (dist - TARIFF_STANDARDS.AUTO.baseDistanceKm) * TARIFF_STANDARDS.AUTO.perKm : 0);
      minFairPrice = Math.round(calculated * 0.9);
      maxFairPrice = Math.round(calculated * 1.15);
    } else if (category === 'CAB') {
      categoryName = TARIFF_STANDARDS.CAB.name;
      const calculated = TARIFF_STANDARDS.CAB.baseRate + (dist > TARIFF_STANDARDS.CAB.baseDistanceKm ? (dist - TARIFF_STANDARDS.CAB.baseDistanceKm) * TARIFF_STANDARDS.CAB.perKm : 0);
      minFairPrice = Math.round(calculated * 0.95);
      maxFairPrice = Math.round(calculated * 1.2);
    } else if (category === 'GUIDE') {
      categoryName = TARIFF_STANDARDS.GUIDE_HOURLY.name;
      trustedBenchmarkSource = 'RAAHI Verified Local Guide Guild Benchmark';
      const calculated = TARIFF_STANDARDS.GUIDE_HOURLY.baseRate + (hours - 1) * TARIFF_STANDARDS.GUIDE_HOURLY.perHour;
      minFairPrice = Math.round(calculated * 0.9);
      maxFairPrice = Math.round(calculated * 1.25);
    } else {
      categoryName = TARIFF_STANDARDS.STREET_FOOD.name;
      trustedBenchmarkSource = 'Pink City Heritage Food Council Market Rate';
      minFairPrice = 40;
      maxFairPrice = 80;
    }

    const isOvercharged = priceQuoted > maxFairPrice;
    const overchargePercent = isOvercharged && maxFairPrice > 0 ? Math.round(((priceQuoted - maxFairPrice) / maxFairPrice) * 100) : 0;
    const savingsAmount = isOvercharged ? priceQuoted - maxFairPrice : 0;

    res.status(200).json({
      success: true,
      category,
      categoryName,
      distanceKm: dist,
      durationHours: hours,
      quotedPrice: priceQuoted,
      estimatedRange: {
        min: minFairPrice,
        max: maxFairPrice
      },
      isOvercharged,
      overchargePercent,
      savingsAmount,
      trustedBenchmarkSource,
      receiptId: `RAAHI-AUDIT-${Math.floor(100000 + Math.random() * 900000)}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
