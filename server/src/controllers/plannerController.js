import { INITIAL_GUIDES, INITIAL_TOURS } from '../services/seedService.js';
import { Guide } from '../models/Guide.js';
import { TourPackage } from '../models/TourPackage.js';
import { isDbConnected } from '../config/db.js';

export const generatePlan = async (req, res) => {
  try {
    const { days = 1, style = 'heritage', destination = 'Jaipur', durationDays, interests } = req.body;
    const daysNum = parseInt(durationDays || days, 10) || 1;
    const selectedStyle = style || (interests && interests[0]) || 'heritage';

    const baseActivities = [
      {
        time: '09:00 AM',
        location: 'Amer Fort & Sheesh Mahal',
        duration: '3 hrs',
        ticketCost: '₹100',
        transportCost: '₹120',
        guideTip: 'Guided underground passage trail'
      },
      {
        time: '01:00 PM',
        location: 'Jal Mahal Lake View & Lunch',
        duration: '1.5 hrs',
        ticketCost: 'Free',
        transportCost: '₹60',
        guideTip: 'Royal Lakefront Photography'
      },
      {
        time: '03:00 PM',
        location: 'City Palace & Jantar Mantar',
        duration: '2.5 hrs',
        ticketCost: '₹200',
        transportCost: '₹80',
        guideTip: 'Astronomical Instrument Deep-dive'
      },
      {
        time: '06:00 PM',
        location: 'Hawa Mahal & Johari Bazaar Street Food',
        duration: '2 hrs',
        ticketCost: '₹50',
        transportCost: '₹50',
        guideTip: 'Pyaaz Kachori & Rabri Lassi Food Crawl'
      }
    ];

    const activities = baseActivities.slice(0, Math.min(daysNum * 3, baseActivities.length));

    // Get recommended guides and tours from real listings
    let guides = INITIAL_GUIDES;
    let tours = INITIAL_TOURS;
    if (isDbConnected()) {
      try {
        const dbGuides = await Guide.find().limit(3).lean();
        if (dbGuides && dbGuides.length > 0) guides = dbGuides;
        const dbTours = await TourPackage.find().limit(2).lean();
        if (dbTours && dbTours.length > 0) tours = dbTours;
      } catch (err) {
        // Fall back gracefully to initial listings
      }
    }

    const recommendedGuides = guides.slice(0, 3).map(g => ({
      id: g.guideId || g._id || g.id,
      name: g.name,
      rating: g.rating,
      pricePerHour: g.pricePerHour,
      specialties: g.specialties,
      avatar: g.avatar
    }));

    const recommendedTours = tours.slice(0, 2).map(t => ({
      id: t.tourId || t._id || t.id,
      title: t.title,
      price: t.price || t.pricePerPerson,
      duration: t.duration,
      coverImage: t.coverImage || t.image
    }));

    const plan = {
      destination,
      days: daysNum,
      style: selectedStyle,
      activities,
      budget: {
        guide: daysNum * 800,
        transport: daysNum * 350,
        tickets: daysNum * 300,
        total: (daysNum * 800) + (daysNum * 350) + (daysNum * 300)
      },
      recommendedGuides,
      recommendedTours
    };

    return res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
