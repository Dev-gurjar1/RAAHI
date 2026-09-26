import { TourPackage } from '../models/TourPackage.js';
import { INITIAL_TOURS } from '../services/seedService.js';
import { isDbConnected } from '../config/db.js';

// In-memory fallback cache to ensure real-time responsiveness even in offline DB mode
let memoryTours = [...INITIAL_TOURS];

export const getTours = async (req, res) => {
  try {
    const {
      destination,
      category,
      search,
      duration,
      minPrice,
      maxPrice,
      language,
      guideType,
      groupSize,
      rating,
      date,
      sort = 'relevance',
      status = 'PUBLISHED'
    } = req.query;

    let tours = [];

    if (isDbConnected()) {
      try {
        const query = {};
        if (status && status !== 'ALL') {
          query.status = status;
        }
        if (destination && destination !== 'All') {
          query.destination = new RegExp(destination.trim(), 'i');
        }
        if (category && category !== 'All') {
          query.category = new RegExp(category.trim(), 'i');
        }

        tours = await TourPackage.find(query).sort({ publishedAt: -1 }).lean();
        if (!tours || tours.length === 0) {
          tours = memoryTours;
        }
      } catch (err) {
        console.warn('MongoDB tours query fallback:', err.message);
        tours = memoryTours;
      }
    } else {
      tours = memoryTours;
    }

    let list = [...tours];

    // Status filter
    if (status && status !== 'ALL') {
      list = list.filter(t => (t.status || 'PUBLISHED').toUpperCase() === status.toUpperCase());
    }

    // Destination filter
    if (destination && destination !== 'All' && destination.trim()) {
      const d = destination.toLowerCase().trim();
      list = list.filter(t => t.destination && t.destination.toLowerCase().includes(d));
    }

    // Category filter
    if (category && category !== 'All' && category.trim()) {
      const c = category.toLowerCase().trim();
      list = list.filter(t => t.category && t.category.toLowerCase().includes(c));
    }

    // Search query
    if (search && search.trim()) {
      const q = String(search).toLowerCase().trim();
      list = list.filter(t =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.summary && t.summary.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.destination && t.destination.toLowerCase().includes(q)) ||
        (t.guideName && t.guideName.toLowerCase().includes(q)) ||
        (t.meetingPoint && t.meetingPoint.toLowerCase().includes(q))
      );
    }

    // Date filter
    if (date) {
      list = list.filter(t => t.availableDates && t.availableDates.includes(date));
    }

    // Price range filter
    if (minPrice) {
      list = list.filter(t => (t.price || t.pricePerPerson || 0) >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter(t => (t.price || t.pricePerPerson || 0) <= Number(maxPrice));
    }

    // Duration filter
    if (duration && duration !== 'All') {
      const maxHours = parseFloat(duration);
      if (!isNaN(maxHours)) {
        list = list.filter(t => (t.durationHours || parseFloat(t.duration) || 3) <= maxHours);
      }
    }

    // Language filter
    if (language && language !== 'All') {
      const lang = language.toLowerCase();
      list = list.filter(t =>
        t.languages && t.languages.some(l => l.toLowerCase().includes(lang))
      );
    }

    // Guide Type filter
    if (guideType && guideType !== 'All') {
      list = list.filter(t =>
        (t.guideType || 'PROFESSIONAL_GUIDE').toLowerCase() === guideType.toLowerCase()
      );
    }

    // Group size filter
    if (groupSize) {
      const size = Number(groupSize);
      list = list.filter(t => (t.maxCapacity || t.maxParticipants || 8) >= size);
    }

    // Rating filter
    if (rating) {
      const minR = Number(rating);
      list = list.filter(t => (t.rating || 4.5) >= minR);
    }

    // Sorting
    if (sort === 'price-low') {
      list.sort((a, b) => (a.price || a.pricePerPerson || 0) - (b.price || b.pricePerPerson || 0));
    } else if (sort === 'price-high') {
      list.sort((a, b) => (b.price || b.pricePerPerson || 0) - (a.price || a.pricePerPerson || 0));
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'duration') {
      list.sort((a, b) => (a.durationHours || 0) - (b.durationHours || 0));
    } else {
      // Default: relevance (booking count and rating)
      list.sort((a, b) => ((b.bookingCount || 0) * 0.4 + (b.rating || 0) * 10) - ((a.bookingCount || 0) * 0.4 + (a.rating || 0) * 10));
    }

    const formatted = list.map(t => ({
      ...t,
      id: t.tourId || (t._id ? t._id.toString() : t.id)
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTourById = async (req, res) => {
  try {
    const { id } = req.params;

    let tour;
    if (isDbConnected()) {
      try {
        tour = await TourPackage.findOne({
          $or: [
            { tourId: id },
            { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
          ]
        }).lean();
      } catch (err) {
        console.warn('MongoDB single tour lookup fallback:', err.message);
      }
    }

    if (!tour) {
      tour = memoryTours.find(t => t.tourId === id || t.id === id);
    }

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour experience not found' });
    }

    const formatted = {
      ...tour,
      id: tour.tourId || (tour._id ? tour._id.toString() : tour.id)
    };

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createTour = async (req, res) => {
  try {
    const tourData = req.body;
    const tourId = tourData.tourId || tourData.id || `tp_${Date.now()}`;

    const durationText = tourData.duration || `${tourData.durationHours || 3} Hours`;
    const durHours = tourData.durationHours || parseFloat(tourData.duration) || 3;
    const priceAmount = Number(tourData.price || tourData.pricePerPerson || tourData.fixedPrice || 699);

    const newTour = {
      tourId,
      guideId: tourData.guideId || 'g1',
      guideName: tourData.guideName || 'Vikram Singh Rathore',
      guideAvatar: tourData.guideAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      guideType: tourData.guideType || 'PROFESSIONAL_GUIDE',
      guideVerified: true,
      guideRating: 4.95,
      guideCompletedTrips: 150,
      guideLanguages: tourData.languages || ['Hindi', 'English'],
      title: tourData.title || 'Untitled Tour Experience',
      category: tourData.category || 'Heritage',
      destination: tourData.destination || 'Jaipur',
      summary: tourData.summary || tourData.description || '',
      description: tourData.description || tourData.summary || '',
      duration: durationText,
      durationHours: durHours,
      pricingType: tourData.pricingType || 'PER_PERSON',
      price: priceAmount,
      pricePerPerson: tourData.pricePerPerson || (tourData.pricingType === 'PER_PERSON' ? priceAmount : undefined),
      pricePerGroup: tourData.pricePerGroup || (tourData.pricingType === 'PER_GROUP' ? priceAmount : undefined),
      fixedPrice: tourData.fixedPrice || (tourData.pricingType === 'FIXED_PRICE' ? priceAmount : undefined),
      minParticipants: Number(tourData.minParticipants) || 1,
      maxCapacity: Number(tourData.maxCapacity || tourData.maxParticipants) || 8,
      maxParticipants: Number(tourData.maxCapacity || tourData.maxParticipants) || 8,
      languages: tourData.languages || ['English', 'Hindi'],
      ageSuitability: tourData.ageSuitability || 'All ages welcome',
      difficultyLevel: tourData.difficultyLevel || 'Easy',
      meetingPoint: tourData.meetingPoint || 'Central City Landmark',
      highlights: tourData.highlights || ['Verified local storytelling', 'Authentic heritage route'],
      included: tourData.included || ['Licensed Local Guide', 'Heritage Route Access'],
      excluded: tourData.excluded || ['Personal Transport', 'Monument Entry Tickets'],
      cancellationPolicy: tourData.cancellationPolicy || 'Free cancellation up to 24 hours before tour start for 100% refund.',
      safetyInfo: tourData.safetyInfo || 'Background-cleared host, anti-scam route guarantee.',
      availability: tourData.availability || {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        timeSlots: ['09:00 AM', '02:30 PM'],
        availableDates: tourData.availableDates || [],
        blockedDates: []
      },
      availableDates: tourData.availableDates || [],
      itinerary: tourData.itinerary || [],
      coverImage: tourData.coverImage || tourData.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      image: tourData.coverImage || tourData.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      images: tourData.images || [tourData.coverImage || tourData.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80'],
      status: tourData.status || 'PUBLISHED',
      moderationNotes: '',
      bookingCount: 0,
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };

    if (isDbConnected()) {
      try {
        await TourPackage.create(newTour);
      } catch (err) {
        console.warn('MongoDB tour creation fallback:', err.message);
      }
    }

    memoryTours.unshift(newTour);

    return res.status(201).json({
      success: true,
      message: 'Tour package published successfully',
      data: {
        ...newTour,
        id: tourId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let updatedTour;
    if (isDbConnected()) {
      try {
        updatedTour = await TourPackage.findOneAndUpdate(
          { $or: [{ tourId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
          updates,
          { new: true }
        ).lean();
      } catch (err) {
        console.warn('MongoDB update tour fallback:', err.message);
      }
    }

    const index = memoryTours.findIndex(t => t.tourId === id || t.id === id);
    if (index !== -1) {
      memoryTours[index] = { ...memoryTours[index], ...updates };
      updatedTour = memoryTours[index];
    }

    return res.status(200).json({
      success: true,
      message: 'Tour package updated successfully',
      data: updatedTour || { id, ...updates }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTourStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, moderationNotes } = req.body;

    let updatedTour;
    if (isDbConnected()) {
      try {
        updatedTour = await TourPackage.findOneAndUpdate(
          { $or: [{ tourId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
          { status, ...(moderationNotes ? { moderationNotes } : {}) },
          { new: true }
        ).lean();
      } catch (err) {
        console.warn('MongoDB status update tour fallback:', err.message);
      }
    }

    const index = memoryTours.findIndex(t => t.tourId === id || t.id === id);
    if (index !== -1) {
      memoryTours[index].status = status;
      if (moderationNotes) memoryTours[index].moderationNotes = moderationNotes;
      updatedTour = memoryTours[index];
    }

    return res.status(200).json({
      success: true,
      message: `Tour status updated to ${status}`,
      data: updatedTour || { id, status, moderationNotes }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateTour = async (req, res) => {
  try {
    const { id } = req.params;
    let sourceTour = memoryTours.find(t => t.tourId === id || t.id === id);

    if (!sourceTour && isDbConnected()) {
      sourceTour = await TourPackage.findOne({
        $or: [{ tourId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      }).lean();
    }

    if (!sourceTour) {
      return res.status(404).json({ success: false, message: 'Source tour not found' });
    }

    const newTourId = `tp_${Date.now()}`;
    const duplicatedTour = {
      ...sourceTour,
      _id: undefined,
      tourId: newTourId,
      id: newTourId,
      title: `${sourceTour.title} (Copy)`,
      status: 'DRAFT',
      bookingCount: 0,
      reviewCount: 0,
      reviews: []
    };

    if (isDbConnected()) {
      try {
        await TourPackage.create(duplicatedTour);
      } catch (err) {
        console.warn('MongoDB duplicate tour fallback:', err.message);
      }
    }

    memoryTours.unshift(duplicatedTour);

    return res.status(201).json({
      success: true,
      message: 'Tour duplicated as draft successfully',
      data: duplicatedTour
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        await TourPackage.findOneAndDelete({
          $or: [{ tourId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
        });
      } catch (err) {
        console.warn('MongoDB delete tour fallback:', err.message);
      }
    }

    memoryTours = memoryTours.filter(t => t.tourId !== id && t.id !== id);

    return res.status(200).json({
      success: true,
      message: 'Tour removed or archived successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getGuideTours = async (req, res) => {
  try {
    const { guideId } = req.params;

    let tours = [];
    if (isDbConnected()) {
      try {
        tours = await TourPackage.find({ guideId }).lean();
      } catch (err) {
        console.warn('MongoDB guide tours fallback:', err.message);
      }
    }

    if (!tours || tours.length === 0) {
      tours = memoryTours.filter(t => t.guideId === guideId || guideId === 'all');
    }

    const formatted = tours.map(t => ({
      ...t,
      id: t.tourId || (t._id ? t._id.toString() : t.id)
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addTourReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewer, rating, comment } = req.body;

    const review = {
      reviewer: reviewer || 'Traveler',
      rating: Number(rating) || 5,
      comment: comment || 'Wonderful experience!',
      date: new Date().toISOString().split('T')[0]
    };

    if (isDbConnected()) {
      try {
        const tour = await TourPackage.findOne({ $or: [{ tourId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
        if (tour) {
          tour.reviews.push(review);
          tour.reviewCount = tour.reviews.length;
          const totalRating = tour.reviews.reduce((sum, r) => sum + r.rating, 0);
          tour.rating = parseFloat((totalRating / tour.reviewCount).toFixed(2));
          await tour.save();
        }
      } catch (err) {
        console.warn('MongoDB add review fallback:', err.message);
      }
    }

    const t = memoryTours.find(x => x.tourId === id || x.id === id);
    if (t) {
      t.reviews = t.reviews || [];
      t.reviews.push(review);
      t.reviewCount = t.reviews.length;
      const totalRating = t.reviews.reduce((sum, r) => sum + r.rating, 0);
      t.rating = parseFloat((totalRating / t.reviewCount).toFixed(2));
    }

    return res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
