import { Guide } from '../models/Guide.js';
import { INITIAL_GUIDES } from '../services/seedService.js';
import { isDbConnected } from '../config/db.js';

let memoryGuides = [...INITIAL_GUIDES];

export const getGuides = async (req, res) => {
  try {
    const { search, specialty, radius, guideType, pricingType } = req.query;

    let guides;
    if (isDbConnected()) {
      try {
        guides = await Guide.find().lean();
        if (!guides || guides.length === 0) {
          guides = memoryGuides;
        }
      } catch (err) {
        console.warn('MongoDB guide fetch fallback:', err.message);
        guides = memoryGuides;
      }
    } else {
      guides = memoryGuides;
    }

    let list = [...guides];

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(g =>
        g.name.toLowerCase().includes(q) ||
        (g.specialties && g.specialties.some(s => s.toLowerCase().includes(q))) ||
        (g.languages && g.languages.some(l => l.toLowerCase().includes(q))) ||
        (g.bio && g.bio.toLowerCase().includes(q))
      );
    }

    if (specialty && specialty !== 'all') {
      list = list.filter(g => g.specialties && g.specialties.includes(String(specialty)));
    }

    if (guideType && guideType !== 'all') {
      list = list.filter(g => (g.guideType || 'PROFESSIONAL_GUIDE').toLowerCase() === guideType.toLowerCase());
    }

    if (pricingType && pricingType !== 'all') {
      list = list.filter(g => (g.pricingType || 'HOURLY').toLowerCase() === pricingType.toLowerCase());
    }

    if (radius && radius !== 'all') {
      const maxKm = parseFloat(radius);
      if (!isNaN(maxKm)) {
        list = list.filter(g => (g.distanceKm || 0) <= maxKm);
      }
    }

    // Format id for frontend
    const formatted = list.map(g => ({
      ...g,
      id: g.guideId || (g._id ? g._id.toString() : g.id)
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

export const getGuideById = async (req, res) => {
  try {
    const { id } = req.params;

    let guide;
    if (isDbConnected()) {
      try {
        guide = await Guide.findOne({ $or: [{ guideId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] }).lean();
      } catch (err) {
        console.warn('MongoDB single guide fallback:', err.message);
      }
    }

    if (!guide) {
      guide = memoryGuides.find(g => g.guideId === id || g.id === id);
    }

    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    const formatted = {
      ...guide,
      id: guide.guideId || (guide._id ? guide._id.toString() : guide.id)
    };

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGuideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { online } = req.body;

    let guide;
    if (isDbConnected()) {
      try {
        guide = await Guide.findOneAndUpdate(
          { $or: [{ guideId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
          { online },
          { new: true }
        );
      } catch (err) {
        console.warn('MongoDB guide update fallback:', err.message);
      }
    }

    const index = memoryGuides.findIndex(g => g.guideId === id || g.id === id);
    if (index !== -1) {
      memoryGuides[index].online = online;
      guide = memoryGuides[index];
    }

    return res.status(200).json({
      success: true,
      message: 'Guide status updated',
      data: guide || { id, online }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGuidePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      pricingType,
      startingPrice,
      hourlyRate,
      pricePerPerson,
      pricePerGroup,
      fixedTripPrice,
      fixedTripDuration,
      customPricingDescription,
      guideType
    } = req.body;

    const updates = {};
    if (pricingType) updates.pricingType = pricingType;
    if (startingPrice !== undefined) updates.startingPrice = Number(startingPrice);
    if (hourlyRate !== undefined) updates.hourlyRate = Number(hourlyRate);
    if (pricePerPerson !== undefined) updates.pricePerPerson = Number(pricePerPerson);
    if (pricePerGroup !== undefined) updates.pricePerGroup = Number(pricePerGroup);
    if (fixedTripPrice !== undefined) updates.fixedTripPrice = Number(fixedTripPrice);
    if (fixedTripDuration !== undefined) updates.fixedTripDuration = Number(fixedTripDuration);
    if (customPricingDescription !== undefined) updates.customPricingDescription = customPricingDescription;
    if (guideType) updates.guideType = guideType;

    let guide;
    if (isDbConnected()) {
      try {
        guide = await Guide.findOneAndUpdate(
          { $or: [{ guideId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
          updates,
          { new: true }
        );
      } catch (err) {
        console.warn('MongoDB guide pricing update fallback:', err.message);
      }
    }

    const index = memoryGuides.findIndex(g => g.guideId === id || g.id === id);
    if (index !== -1) {
      memoryGuides[index] = { ...memoryGuides[index], ...updates };
      guide = memoryGuides[index];
    }

    return res.status(200).json({
      success: true,
      message: 'Guide pricing model updated successfully',
      data: guide || { id, ...updates }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
