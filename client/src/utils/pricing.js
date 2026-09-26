/**
 * RAAHI Transparent Pricing Utilities
 *
 * Requirements:
 * 1. Remove the universal ₹500/hour assumption.
 * 2. Prioritize TOTAL TRIP PRICE first instead of aggressive hourly pricing.
 * 3. Support flexible guide & tour pricing models:
 *    - HOURLY (e.g. ₹300/hr, with total computed as ₹1,200 for 4 hrs)
 *    - PER_PERSON (e.g. ₹450/person)
 *    - PER_GROUP (e.g. ₹1,200/group)
 *    - FIXED_TRIP (e.g. ₹1,500 total for 4-hr trip)
 *    - CUSTOM (e.g. Starting from ₹200)
 */

export const getGuideDisplayPricing = (guide, defaultDurationHours = 4, travelersCount = 1) => {
  if (!guide) {
    return {
      primaryPrice: '₹1,200 total',
      primaryAmount: 1200,
      subtext: '4 hours · ₹300/hr equivalent',
      hourlyEquivalent: '₹300/hr',
      model: 'HOURLY',
      startingFrom: 'Starting from ₹300/hr'
    };
  }

  const model = (guide.pricingType || 'HOURLY').toUpperCase();
  const hourly = guide.hourlyRate || guide.pricePerHour || 350;
  const starting = guide.startingPrice || Math.round(hourly * 0.85);
  const fixedTrip = guide.fixedTripPrice || (hourly * (guide.fixedTripDuration || defaultDurationHours));
  const fixedDuration = guide.fixedTripDuration || defaultDurationHours;

  if (model === 'FIXED_TRIP') {
    const equivalentPerHour = Math.round(fixedTrip / fixedDuration);
    return {
      primaryPrice: `₹${fixedTrip.toLocaleString('en-IN')} total`,
      primaryAmount: fixedTrip,
      durationText: `${fixedDuration} hours`,
      subtext: `${fixedDuration} hours · ₹${equivalentPerHour}/hr equivalent`,
      hourlyEquivalent: `₹${equivalentPerHour}/hr`,
      model: 'FIXED_TRIP',
      startingFrom: `Fixed Trip: ₹${fixedTrip.toLocaleString('en-IN')}`,
      badge: 'Fixed Trip'
    };
  }

  if (model === 'PER_PERSON') {
    const perPerson = guide.pricePerPerson || Math.round(hourly * 1.1);
    const total = perPerson * travelersCount;
    return {
      primaryPrice: `₹${total.toLocaleString('en-IN')} total`,
      primaryAmount: total,
      durationText: `${defaultDurationHours} hours`,
      subtext: `₹${perPerson}/person (${travelersCount} traveler${travelersCount > 1 ? 's' : ''})`,
      hourlyEquivalent: `₹${perPerson}/person`,
      model: 'PER_PERSON',
      startingFrom: `Starting from ₹${perPerson}/person`,
      badge: 'Per Person'
    };
  }

  if (model === 'PER_GROUP') {
    const groupPrice = guide.pricePerGroup || (hourly * 3.5);
    return {
      primaryPrice: `₹${groupPrice.toLocaleString('en-IN')} total`,
      primaryAmount: groupPrice,
      durationText: `${defaultDurationHours} hours`,
      subtext: `Group rate (up to 4–6 people)`,
      hourlyEquivalent: `₹${Math.round(groupPrice / defaultDurationHours)}/hr equivalent`,
      model: 'PER_GROUP',
      startingFrom: `₹${groupPrice.toLocaleString('en-IN')}/group`,
      badge: 'Group Rate'
    };
  }

  // Default: HOURLY (Prioritize Total Trip Price for standard 4 hours)
  const total = hourly * defaultDurationHours;
  return {
    primaryPrice: `₹${total.toLocaleString('en-IN')} total`,
    primaryAmount: total,
    durationText: `${defaultDurationHours} hours`,
    subtext: `${defaultDurationHours} hours · ₹${hourly}/hr equivalent`,
    hourlyEquivalent: `₹${hourly}/hr`,
    model: 'HOURLY',
    startingFrom: `Starting from ₹${starting}/hr`,
    badge: 'Hourly'
  };
};

export const getTourDisplayPricing = (tour, travelersCount = 1) => {
  if (!tour) {
    return {
      primaryPrice: '₹699/person',
      totalPrice: '₹699 total',
      durationText: '3 hours',
      model: 'PER_PERSON'
    };
  }

  const model = (tour.pricingType || 'PER_PERSON').toUpperCase();
  const durationText = tour.duration || `${tour.durationHours || 3} hours`;

  if (model === 'PER_GROUP') {
    const price = tour.pricePerGroup || tour.price || 1999;
    return {
      primaryPrice: `₹${price.toLocaleString('en-IN')}/group`,
      totalPrice: `₹${price.toLocaleString('en-IN')} total`,
      subtext: `up to ${tour.maxParticipants || tour.maxCapacity || 4} people · ${durationText}`,
      durationText,
      model: 'PER_GROUP',
      badge: 'Group Tour'
    };
  }

  if (model === 'FIXED_PRICE') {
    const price = tour.fixedPrice || tour.price || 999;
    return {
      primaryPrice: `₹${price.toLocaleString('en-IN')} total`,
      totalPrice: `₹${price.toLocaleString('en-IN')} total`,
      subtext: `Fixed package · ${durationText}`,
      durationText,
      model: 'FIXED_PRICE',
      badge: 'Fixed Package'
    };
  }

  // Default: PER_PERSON
  const perPerson = tour.pricePerPerson || tour.price || 699;
  const total = perPerson * (travelersCount || 1);
  return {
    primaryPrice: `₹${perPerson.toLocaleString('en-IN')}/person`,
    totalPrice: `₹${total.toLocaleString('en-IN')} total`,
    subtext: `${durationText} · ₹${perPerson.toLocaleString('en-IN')}/person`,
    durationText,
    model: 'PER_PERSON',
    badge: 'Per Person'
  };
};
