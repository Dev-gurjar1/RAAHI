/**
 * FareEngineService — Anti-Scam Tariff & Fair Price Shield Algorithm
 */
export class FareEngineService {
  static calculateFare(query) {
    const { mode = 'auto', distanceKm = 5, waitingMinutes = 0, isNightRate = false, askingPrice } = query;

    let baseFare = 0;
    let perKmRate = 0;
    let waitingRate = 0;

    switch (mode) {
      case 'auto':
        baseFare = 30;
        perKmRate = 14;
        waitingRate = 1;
        break;
      case 'eRickshaw':
        baseFare = 20;
        perKmRate = 10;
        waitingRate = 0.5;
        break;
      case 'guide':
        baseFare = 150;
        perKmRate = 40;
        waitingRate = 2;
        break;
      default:
        baseFare = 30;
        perKmRate = 14;
        waitingRate = 1;
    }

    let calculated = baseFare + (Number(distanceKm) * perKmRate) + (Number(waitingMinutes) * waitingRate);
    if (isNightRate) {
      calculated *= 1.25; // 25% night charge multiplier
    }

    const minFare = Math.round(calculated * 0.9);
    const recommendedFare = Math.round(calculated);
    const maxFare = Math.round(calculated * 1.15);

    let potentialOvercharge = 0;
    let percentageOvercharge = 0;
    let warningLevel = 'none';

    if (askingPrice && Number(askingPrice) > maxFare) {
      potentialOvercharge = Math.round(Number(askingPrice) - recommendedFare);
      percentageOvercharge = Math.round((potentialOvercharge / recommendedFare) * 100);

      if (percentageOvercharge > 50) {
        warningLevel = 'severe';
      } else {
        warningLevel = 'moderate';
      }
    }

    return {
      minFare,
      recommendedFare,
      maxFare,
      askingPrice: askingPrice ? Number(askingPrice) : undefined,
      potentialOvercharge,
      percentageOvercharge,
      warningLevel,
      currency: '₹'
    };
  }
}
