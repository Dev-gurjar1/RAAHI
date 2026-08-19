const express = require('express');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');
const { protect } = require('./authRoutes');

const router = express.Router();

// Helper: Generate 4-digit OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

// POST /api/bookings/create - Create On-Demand or Tour Booking
router.post('/create', protect, async (req, res) => {
  try {
    const { guideId, tourId, hoursCount = 3, travelersCount = 2, meetingPoint } = req.body;

    const guide = await User.findById(guideId);
    if (!guide || guide.role !== 'guide') {
      return res.status(404).json({ success: false, message: 'Verified guide not found' });
    }

    let bookingType = 'ON_DEMAND_HOURLY';
    let title = `On-Demand Guide: ${guide.name}`;
    let rate = guide.hourlyRate * hoursCount;

    if (tourId) {
      const tour = await Tour.findById(tourId);
      if (tour) {
        bookingType = 'CUSTOM_TOUR_PACKAGE';
        title = tour.title;
        rate = tour.pricePerPerson * travelersCount;
      }
    }

    const platformFee = Math.round(rate * 0.1); // 10% platform fee
    const totalAmount = rate + platformFee;
    const guideEarnings = rate;

    const startOtp = generateOtp();
    const endOtp = generateOtp();

    const booking = await Booking.create({
      touristId: req.user._id,
      guideId: guide._id,
      tourId: tourId || null,
      bookingType,
      title,
      city: guide.city || 'Jaipur',
      meetingPoint: meetingPoint || 'Hawa Mahal Main Entrance, Old City',
      hoursCount,
      travelersCount,
      totalAmount,
      platformFee,
      guideEarnings,
      status: 'ACCEPTED', // Instant auto-confirmation for demo
      startOtp,
      endOtp,
      paymentStatus: 'HELD_ESCROW'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('touristId', 'name email phone avatar')
      .populate('guideId', 'name email phone avatar rating hourlyRate bio city')
      .populate('tourId');

    res.status(201).json({
      success: true,
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/bookings/my-bookings - Get user bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'guide' ? { guideId: req.user._id } : { touristId: req.user._id };

    const bookings = await Booking.find(filter)
      .populate('touristId', 'name email phone avatar')
      .populate('guideId', 'name email phone avatar rating hourlyRate bio city')
      .populate('tourId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/bookings/:id/verify-otp - Verify OTP for trip start/end
router.put('/:id/verify-otp', protect, async (req, res) => {
  try {
    const { otp, type } = req.body; // type: 'START' or 'END'
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (type === 'START') {
      if (booking.startOtp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid Start OTP code' });
      }
      booking.status = 'IN_PROGRESS';
      booking.startedAt = new Date();
    } else if (type === 'END') {
      if (booking.endOtp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid End OTP code' });
      }
      booking.status = 'COMPLETED';
      booking.paymentStatus = 'RELEASED_TO_GUIDE';
      booking.completedAt = new Date();
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('touristId', 'name email phone avatar')
      .populate('guideId', 'name email phone avatar rating hourlyRate bio city');

    res.status(200).json({
      success: true,
      booking: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/tours - Fetch all published marketplace tours
router.get('/tours', async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true }).populate('guideId', 'name avatar rating totalReviews city');
    res.status(200).json({ success: true, count: tours.length, tours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/tours - Guide creates tour itinerary
router.post('/tours', protect, async (req, res) => {
  try {
    if (req.user.role !== 'guide') {
      return res.status(403).json({ success: false, message: 'Only verified local guides can publish tours' });
    }

    const { title, description, city, category, durationDays, pricePerPerson, itinerary, includedServices, coverImage } = req.body;

    const tour = await Tour.create({
      guideId: req.user._id,
      title,
      description,
      city: city || req.user.city || 'Jaipur',
      category: category || 'Heritage',
      durationDays: durationDays || 1,
      pricePerPerson: pricePerPerson || 1500,
      itinerary: itinerary || [],
      includedServices: includedServices || ['Certified Local Host', 'Heritage Walk'],
      coverImage: coverImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    });

    res.status(201).json({ success: true, tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
