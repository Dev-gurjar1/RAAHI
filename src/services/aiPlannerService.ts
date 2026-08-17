import { GeneratedItineraryPlan, GuideProfile, Tour, Place } from '../types';
import { marketplaceStore } from './store';
import { getGuideFairPriceRange } from './fairPriceService';

export interface AiPlannerParams {
  destination: string;
  durationDays: number;
  travelersCount: number;
  budget: number;
  interests: string[];
  language?: string;
  enforceBudget: boolean;
}

export const generateBudgetAwareItinerary = (params: AiPlannerParams): GeneratedItineraryPlan => {
  const { destination, durationDays = 2, travelersCount = 2, budget = 5000, enforceBudget = true } = params;

  const state = marketplaceStore.getState();

  // 1. Fetch real destination marketplace guides
  const availableGuides = state.guides.filter(
    g => g.verificationStatus === 'VERIFIED' && g.serviceAreas.some(a => a.toLowerCase().includes(destination.toLowerCase()))
  );

  // If no guide found in destination, fallback to all verified guides
  const matchedGuides = availableGuides.length > 0 ? availableGuides : state.guides.filter(g => g.verificationStatus === 'VERIFIED');

  // 2. Fetch real destination tours
  const matchedTours = state.tours.filter(
    t => t.destination.toLowerCase().includes(destination.toLowerCase())
  );

  // 3. Fetch real destination places
  const matchedPlaces = state.places.filter(
    p => p.destinationName.toLowerCase().includes(destination.toLowerCase())
  );

  const fallbackPlaces: Place[] = matchedPlaces.length > 0 ? matchedPlaces : [
    {
      id: 'p-default-1',
      destinationId: 'dest-jaipur',
      destinationName: destination,
      name: `${destination} Heritage Fort & Old Bazaar Walk`,
      category: 'Heritage',
      rating: 4.8,
      priceLevel: 'Moderate',
      address: `Historic Centre, ${destination}`,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
      description: 'Iconic architecture, cultural market, and photo vantage points.',
      estimatedFairCost: 'Entry ₹100'
    },
    {
      id: 'p-default-2',
      destinationId: 'dest-jaipur',
      destinationName: destination,
      name: `${destination} Culinary Heritage Street Food Walk`,
      category: 'Food',
      rating: 4.9,
      priceLevel: 'Budget',
      address: `Bazaar St, ${destination}`,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      description: 'Sample local culinary specialties and tea stalls.',
      estimatedFairCost: '₹150 per person'
    }
  ];

  // 4. Select initial guide (lowest price or best fit)
  let selectedGuide: GuideProfile = matchedGuides[0];
  let guideCostPerDay = selectedGuide ? selectedGuide.startingPrice : 2500;

  // 5. Initial cost estimates
  let transportCostPerDay = 300 * travelersCount; // e.g. Auto fare
  let foodCostPerDay = 400 * travelersCount;
  let activityCostPerDay = 250 * travelersCount;
  let stayCostPerNight = durationDays > 1 ? 1200 : 0;

  let totalGuideCost = guideCostPerDay * Math.min(durationDays, 2);
  let totalTransportCost = transportCostPerDay * durationDays;
  let totalFoodCost = foodCostPerDay * durationDays;
  let totalActivityCost = activityCostPerDay * durationDays;
  let totalStayCost = stayCostPerNight * (durationDays - 1);

  let initialTotal = totalGuideCost + totalTransportCost + totalFoodCost + totalActivityCost + totalStayCost;

  const warnings: string[] = [];

  // 6. BUDGET OPTIMIZATION ALGORITHM (Rule 8)
  if (enforceBudget && initialTotal > budget) {
    warnings.push(`Initial estimate (₹${initialTotal.toLocaleString('en-IN')}) exceeded your ₹${budget.toLocaleString('en-IN')} budget. STHANIQ Budget Optimizer adjusted costs.`);

    // Step A: Switch to cheaper verified guide if available
    const cheaperGuide = matchedGuides.find(g => (g.startingPrice * Math.min(durationDays, 2)) < totalGuideCost);
    if (cheaperGuide) {
      selectedGuide = cheaperGuide;
      guideCostPerDay = cheaperGuide.startingPrice;
      totalGuideCost = guideCostPerDay * Math.min(durationDays, 2);
    }

    // Step B: Reduce transport cost by using public/metered autos
    if ((totalGuideCost + totalTransportCost + totalFoodCost + totalActivityCost + totalStayCost) > budget) {
      transportCostPerDay = 150 * travelersCount;
      totalTransportCost = transportCostPerDay * durationDays;
    }

    // Step C: Reduce paid activities, prioritize free heritage sights
    if ((totalGuideCost + totalTransportCost + totalFoodCost + totalActivityCost + totalStayCost) > budget) {
      activityCostPerDay = 100 * travelersCount;
      totalActivityCost = activityCostPerDay * durationDays;
    }

    // Step D: Optimize food options to local dhabas
    if ((totalGuideCost + totalTransportCost + totalFoodCost + totalActivityCost + totalStayCost) > budget) {
      foodCostPerDay = 250 * travelersCount;
      totalFoodCost = foodCostPerDay * durationDays;
    }

    // Step E: If still over budget, adjust guide hiring to half-day or 1-day highlight
    if ((totalGuideCost + totalTransportCost + totalFoodCost + totalActivityCost + totalStayCost) > budget && durationDays > 1) {
      totalGuideCost = guideCostPerDay; // 1-day guide instead of multi-day
    }
  }

  const finalTotal = totalGuideCost + totalTransportCost + totalFoodCost + totalActivityCost + totalStayCost;
  const budgetRemaining = Math.max(0, budget - finalTotal);

  // 7. Generate Day-by-Day Itinerary referencing real places & selected guide
  const days = [];
  for (let i = 1; i <= durationDays; i++) {
    const dayPlaces = fallbackPlaces.length >= i ? [fallbackPlaces[i - 1]] : [fallbackPlaces[0]];
    const mainPlace = dayPlaces[0];

    days.push({
      dayNumber: i,
      title: i === 1 ? `Arrival & Classic ${destination} Heritage` : `Cultural Immersion & Hidden Local Gems`,
      activities: [
        {
          time: '09:00 AM',
          title: `Meet Verified Guide ${selectedGuide ? selectedGuide.name : 'Local Host'}`,
          description: `Guided orientation at ${mainPlace.name}. Learn architectural history and local safety tips.`,
          placeName: mainPlace.name,
          cost: Math.round(totalGuideCost / durationDays),
          category: 'Guide' as const
        },
        {
          time: '01:00 PM',
          title: `Authentic Local Lunch & Refreshments`,
          description: `Sample signature local cuisine at verified dhaba/restaurant. Estimated fair price.`,
          cost: Math.round(totalFoodCost / durationDays),
          category: 'Food' as const
        },
        {
          time: '03:30 PM',
          title: `Bazaar & Craftsmanship Walk`,
          description: `Explore traditional artisan workshops, spice markets, and local souvenirs without price gouging.`,
          cost: Math.round(totalActivityCost / durationDays),
          category: 'Activity' as const
        },
        {
          time: '06:00 PM',
          title: `Evening Sunset Viewpoint & Transport Back`,
          description: `Travel back using verified local transport (estimated fare applied).`,
          cost: Math.round(totalTransportCost / durationDays),
          category: 'Transport' as const
        }
      ]
    });
  }

  return {
    destination,
    durationDays,
    travelersCount,
    budgetAllocated: budget,
    totalEstimatedCost: finalTotal,
    budgetRemaining,
    recommendedGuides: selectedGuide ? [selectedGuide] : matchedGuides.slice(0, 2),
    recommendedTours: matchedTours.slice(0, 2),
    days,
    costBreakdown: {
      transport: totalTransportCost,
      guide: totalGuideCost,
      food: totalFoodCost,
      activities: totalActivityCost,
      stay: totalStayCost
    },
    warnings
  };
};
