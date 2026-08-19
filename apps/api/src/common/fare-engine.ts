import { FairPriceQuery, FairPriceEstimate } from '@raahi/shared-types';

export class FareEngineService {
  public static calculateFare(query: FairPriceQuery): FairPriceEstimate {
    const { mode, distanceKm, waitingMinutes, isNightRate, askingPrice } = query;

    let baseFare = 0;
    let perKmRate = 0;
    let waitingRate = 0;

    switch (mode) {
      case 'auto':
        baseFare = 30;
        perKmRate = 14;
        waitingRate = 1; // per minute
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

    let calculated = baseFare + (distanceKm * perKmRate) + (waitingMinutes * waitingRate);
    if (isNightRate) {
      calculated *= 1.25; // 25% night charge multiplier
    }

    const minFare = Math.round(calculated * 0.9);
    const recommendedFare = Math.round(calculated);
    const maxFare = Math.round(calculated * 1.15);

    let potentialOvercharge = 0;
    let percentageOvercharge = 0;
    let warningLevel: 'none' | 'moderate' | 'severe' = 'none';

    if (askingPrice && askingPrice > maxFare) {
      potentialOvercharge = Math.round(askingPrice - recommendedFare);
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
      askingPrice,
      potentialOvercharge,
      percentageOvercharge,
      warningLevel,
      currency: '₹'
    };
  }
}
