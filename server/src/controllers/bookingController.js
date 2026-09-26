import { Booking } from '../models/Booking.js';
import { isDbConnected } from '../config/db.js';

export const INITIAL_DEMO_BOOKINGS = [
  {
    bookingId: "RAAHI-BK-8821",
    bookingType: "GUIDE_HIRE",
    touristId: "usr_demo",
    touristName: "Arjun Mehta",
    guideId: "g1",
    guideName: "Vikram Singh Rathore",
    guideAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    pricingType: "HOURLY",
    guideHourlyRate: 350,
    guideSpecialties: ["Amer Fort", "Royal Architecture"],
    serviceTier: "Heritage Host",
    date: "Yesterday",
    startTime: "03:30 PM",
    durationHours: 4,
    travelersCount: 2,
    meetingPoint: "Amer Fort Main Gate",
    hourlySubtotal: 1400,
    serviceFee: 50,
    totalAmount: 1450,
    startOtp: "8821",
    status: "Completed",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    bookingId: "RAAHI-BK-8822",
    bookingType: "TOUR_BOOKING",
    tourId: "tp_2",
    tourTitle: "Jaipur Street Food Trail & Century-Old Recipes",
    tourHostId: "g2",
    touristId: "usr_demo",
    touristName: "Elena Rostova",
    guideId: "g2",
    guideName: "Priya Sharma",
    guideAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    pricingType: "PER_PERSON",
    guideHourlyRate: 499,
    guideSpecialties: ["Street Food Crawl", "Bazaars"],
    serviceTier: "Curated Tour",
    date: "3 Days Ago",
    startTime: "04:30 PM",
    durationHours: 2.5,
    travelersCount: 2,
    meetingPoint: "Front of Lassiwala, M.I. Road",
    hourlySubtotal: 998,
    serviceFee: 50,
    totalAmount: 1048,
    startOtp: "4192",
    status: "Completed",
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

let memoryBookings = [...INITIAL_DEMO_BOOKINGS];

export const getBookings = async (req, res) => {
  try {
    let bookings = [];
    if (isDbConnected()) {
      try {
        bookings = await Booking.find().sort({ createdAt: -1 }).lean();
        if (!bookings || bookings.length === 0) {
          bookings = memoryBookings;
        }
      } catch (err) {
        console.warn('MongoDB booking fetch fallback:', err.message);
        bookings = memoryBookings;
      }
    } else {
      bookings = memoryBookings;
    }

    const formatted = bookings.map(b => ({
      ...b,
      id: b.bookingId || (b._id ? b._id.toString() : b.id)
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

export const createBooking = async (req, res) => {
  try {
    const data = req.body;
    const bookingId = data.id || data.bookingId || `RAAHI-BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const startOtp = data.startOtp || Math.floor(1000 + Math.random() * 9000).toString();

    const newBooking = {
      bookingId,
      bookingType: data.bookingType || (data.tourId ? 'TOUR_BOOKING' : 'GUIDE_HIRE'),
      tourId: data.tourId || '',
      tourTitle: data.tourTitle || '',
      tourHostId: data.tourHostId || data.guideId,
      pricingType: data.pricingType || (data.tourId ? 'PER_PERSON' : 'HOURLY'),
      touristId: data.touristId || 'usr_tourist',
      touristName: data.touristName || 'Smart Traveler',
      touristPhone: data.touristPhone || '+91 9876543210',
      guideId: data.guideId || data.tourHostId || 'g1',
      guideName: data.guideName || 'Vikram Singh Rathore',
      guideAvatar: data.guideAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      guideHourlyRate: Number(data.guideHourlyRate) || 350,
      guideSpecialties: data.guideSpecialties || [],
      serviceTier: data.serviceTier || (data.tourId ? 'Curated Tour' : 'Express Walk'),
      date: data.date || 'Tomorrow',
      startTime: data.startTime || '10:00 AM',
      durationHours: Number(data.durationHours) || 3,
      travelersCount: Number(data.travelersCount) || 1,
      specialRequirements: data.specialRequirements || data.notes || '',
      meetingPoint: data.meetingPoint || 'City Landmark Entrance',
      hourlySubtotal: Number(data.hourlySubtotal || data.subtotal) || (Number(data.guideHourlyRate || 350) * Number(data.durationHours || 3)),
      serviceFee: Number(data.serviceFee) || 50,
      totalAmount: Number(data.totalAmount) || 1200,
      startOtp,
      status: data.status || 'Confirmed',
      etaMinutes: 4,
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        await Booking.create(newBooking);
      } catch (err) {
        console.warn('MongoDB create booking fallback:', err.message);
      }
    }

    memoryBookings.unshift(newBooking);

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        ...newBooking,
        id: bookingId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let booking;
    if (isDbConnected()) {
      try {
        booking = await Booking.findOneAndUpdate(
          { $or: [{ bookingId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
          { status },
          { new: true }
        );
      } catch (err) {
        console.warn('MongoDB update booking fallback:', err.message);
      }
    }

    const index = memoryBookings.findIndex(b => b.bookingId === id || b.id === id);
    if (index !== -1) {
      memoryBookings[index].status = status;
      booking = memoryBookings[index];
    }

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking || { id, status }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
