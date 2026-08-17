import { FairPriceRule } from '../types';
import { marketplaceStore } from './store';

export interface FairPriceEstimate {
  destination: string;
  category: string;
  itemOrRoute: string;
  priceRangeMin: number;
  priceRangeMax: number;
  formattedRange: string;
  unit: string;
  trustedSource: string;
  lastUpdated: string;
  isVerifiedData: boolean;
}

export const getFairPriceEstimates = (destinationName?: string): FairPriceEstimate[] => {
  const rules = marketplaceStore.getState().fairPriceRules;
  
  let filtered = rules;
  if (destinationName && destinationName.trim() !== '') {
    filtered = rules.filter(r => r.destination.toLowerCase().includes(destinationName.toLowerCase()));
  }

  return filtered.map(r => ({
    destination: r.destination,
    category: r.category,
    itemOrRoute: r.routeOrItem,
    priceRangeMin: r.priceRangeMin,
    priceRangeMax: r.priceRangeMax,
    formattedRange: `₹${r.priceRangeMin.toLocaleString('en-IN')} – ₹${r.priceRangeMax.toLocaleString('en-IN')}`,
    unit: r.unit,
    trustedSource: r.trustedSource,
    lastUpdated: r.lastUpdated,
    isVerifiedData: true
  }));
};

export const getGuideFairPriceRange = (destinationName: string): { min: number; max: number; label: string } => {
  const rules = marketplaceStore.getState().fairPriceRules;
  const guideRule = rules.find(
    r => r.destination.toLowerCase().includes(destinationName.toLowerCase()) && r.category === 'GUIDE_HERITAGE'
  );

  if (guideRule) {
    return {
      min: guideRule.priceRangeMin,
      max: guideRule.priceRangeMax,
      label: `Estimated Fair Range: ₹${guideRule.priceRangeMin.toLocaleString('en-IN')} – ₹${guideRule.priceRangeMax.toLocaleString('en-IN')} / Day`
    };
  }

  // Generic market baseline if city specific rule isn't logged yet
  return {
    min: 2000,
    max: 3200,
    label: `Estimated Fair Range: ₹2,000 – ₹3,200 / Day`
  };
};
