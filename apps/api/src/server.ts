import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { FareEngineService } from './common/fare-engine.js';
import { BACKEND_GUIDES, BACKEND_PACKAGES } from './common/mock-data.js';
import { BookingStatus, ScamReport, SocketEvents } from '@raahi/shared-types';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-Memory Database Stores for API
let activeBookings: any[] = [];
let scamReports: ScamReport[] = [];
let localPackages = [...BACKEND_PACKAGES];

/* ==========================================================================
   REST API ENDPOINTS (/api/v1)
   ========================================================================== */

// Auth Simulation
app.post('/api/v1/auth/send-otp', (req: Request, res: Response) => {
  const { phone } = req.body;
  return res.json({ success: true, message: 'Demo OTP sent successfully', demoCode: '123456', phone });
});

app.post('/api/v1/auth/verify-otp', (req: Request, res: Response) => {
  const { phone, code, role } = req.body;
  if (code !== '123456') {
    return res.status(400).json({ success: false, message: 'Invalid OTP code. Use demo code 123456' });
  }

  const user = {
    id: `usr_${Date.now()}`,
    phone: phone || '+91 9876543210',
    name: role === 'guide' ? 'Vikram Singh Rathore' : 'Smart Traveler',
    role: role || 'tourist',
    verified: true,
    createdAt: new Date().toISOString()
  };

  return res.json({
    success: true,
    data: { user, token: 'demo_jwt_token_raahi_2026' }
  });
});

// Guides Endpoints
app.get('/api/v1/guides', (req: Request, res: Response) => {
  const { search, specialty, radius } = req.query;
  let list = [...BACKEND_GUIDES];

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(g => g.name.toLowerCase().includes(q) || g.specialties.some(s => s.toLowerCase().includes(q)));
  }

  if (specialty && specialty !== 'all') {
    list = list.filter(g => g.specialties.includes(String(specialty)));
  }

  return res.json({ success: true, data: list });
});

app.get('/api/v1/guides/:id', (req: Request, res: Response) => {
  const guide = BACKEND_GUIDES.find(g => g.id === req.params.id);
  if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
  return res.json({ success: true, data: guide });
});

// Fair Price Shield Engine
app.post('/api/v1/fair-price/calculate', (req: Request, res: Response) => {
  const { mode, distanceKm, waitingMinutes, isNightRate, askingPrice } = req.body;
  const estimate = FareEngineService.calculateFare({
    mode: mode || 'auto',
    distanceKm: parseFloat(distanceKm) || 5,
    waitingMinutes: parseFloat(waitingMinutes) || 0,
    isNightRate: Boolean(isNightRate),
    askingPrice: askingPrice ? parseFloat(askingPrice) : undefined
  });

  return res.json({ success: true, data: estimate });
});

// Tour Packages
app.get('/api/v1/tours', (req: Request, res: Response) => {
  return res.json({ success: true, data: localPackages });
});

app.post('/api/v1/tours', (req: Request, res: Response) => {
  const newPkg = {
    id: `tp_${Date.now()}`,
    guideId: 'g1',
    guideName: 'Vikram Singh Rathore',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80',
    highlights: ['Custom Tour Highlight'],
    included: ['Local Guide', 'Heritage Assistance'],
    meetingPoint: req.body.meetingPoint || 'Amer Fort Entrance',
    ...req.body
  };
  localPackages.unshift(newPkg);
  return res.json({ success: true, data: newPkg });
});

// Scam Reporting Endpoint
app.post('/api/v1/reports/scam', (req: Request, res: Response) => {
  const report: ScamReport = {
    id: `rep_${Date.now()}`,
    userId: req.body.userId || 'usr_demo',
    category: req.body.category || 'Overcharging',
    expectedFare: req.body.expectedFare || 100,
    chargedFare: req.body.chargedFare || 200,
    description: req.body.description || 'Driver overcharged beyond benchmark fare.',
    locationDetails: req.body.locationDetails || 'Hawa Mahal, Jaipur',
    status: 'submitted',
    createdAt: new Date().toISOString()
  };
  scamReports.unshift(report);
  return res.json({ success: true, message: 'Scam report logged. Demo safety team dispatched.', data: report });
});

// AI Planner Algorithm Endpoint
app.post('/api/v1/planner/generate', (req: Request, res: Response) => {
  const { days = 1, style = 'heritage' } = req.body;
  const daysNum = parseInt(days);

  const activities = [
    { time: '09:00 AM', location: 'Amer Fort & Sheesh Mahal', duration: '3 hrs', ticketCost: '₹100', transportCost: '₹120', guideTip: 'Guided underground passage trail' },
    { time: '01:00 PM', location: 'Jal Mahal Lake View & Lunch', duration: '1.5 hrs', ticketCost: 'Free', transportCost: '₹60', guideTip: 'Royal Lakefront Photography' },
    { time: '03:00 PM', location: 'City Palace & Jantar Mantar', duration: '2.5 hrs', ticketCost: '₹200', transportCost: '₹80', guideTip: 'Astronomical Instrument Deep-dive' }
  ];

  const plan = {
    days: daysNum,
    style,
    activities,
    budget: {
      guide: daysNum * 800,
      transport: daysNum * 350,
      tickets: daysNum * 300,
      total: (daysNum * 800) + (daysNum * 350) + (daysNum * 300)
    }
  };

  return res.json({ success: true, data: plan });
});

/* ==========================================================================
   SOCKET.IO REALTIME GATEWAY
   ========================================================================== */

io.on('connection', (socket) => {
  console.log(`⚡ Socket client connected: ${socket.id}`);

  socket.on(SocketEvents.BOOKING_SEARCHING, (data) => {
    io.emit(SocketEvents.BOOKING_SEARCHING, { status: 'SEARCHING', message: 'Finding nearby guides...' });
    
    // Simulate real-time matching after 2.5s
    setTimeout(() => {
      const guide = BACKEND_GUIDES[0];
      const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
      io.emit(SocketEvents.BOOKING_MATCHED, {
        status: 'MATCHED',
        guide,
        startOtp,
        etaMinutes: 4
      });
    }, 2500);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 RAAHI API Backend running on http://localhost:${PORT}`);
});
