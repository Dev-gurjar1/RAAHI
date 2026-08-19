"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const fare_engine_js_1 = require("./common/fare-engine.js");
const mock_data_js_1 = require("./common/mock-data.js");
const shared_types_1 = require("@raahi/shared-types");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// In-Memory Database Stores for API
let activeBookings = [];
let scamReports = [];
let localPackages = [...mock_data_js_1.BACKEND_PACKAGES];
/* ==========================================================================
   REST API ENDPOINTS (/api/v1)
   ========================================================================== */
// Auth Simulation
app.post('/api/v1/auth/send-otp', (req, res) => {
    const { phone } = req.body;
    return res.json({ success: true, message: 'Demo OTP sent successfully', demoCode: '123456', phone });
});
app.post('/api/v1/auth/verify-otp', (req, res) => {
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
app.get('/api/v1/guides', (req, res) => {
    const { search, specialty, radius } = req.query;
    let list = [...mock_data_js_1.BACKEND_GUIDES];
    if (search) {
        const q = String(search).toLowerCase();
        list = list.filter(g => g.name.toLowerCase().includes(q) || g.specialties.some(s => s.toLowerCase().includes(q)));
    }
    if (specialty && specialty !== 'all') {
        list = list.filter(g => g.specialties.includes(String(specialty)));
    }
    return res.json({ success: true, data: list });
});
app.get('/api/v1/guides/:id', (req, res) => {
    const guide = mock_data_js_1.BACKEND_GUIDES.find(g => g.id === req.params.id);
    if (!guide)
        return res.status(404).json({ success: false, message: 'Guide not found' });
    return res.json({ success: true, data: guide });
});
// Fair Price Shield Engine
app.post('/api/v1/fair-price/calculate', (req, res) => {
    const { mode, distanceKm, waitingMinutes, isNightRate, askingPrice } = req.body;
    const estimate = fare_engine_js_1.FareEngineService.calculateFare({
        mode: mode || 'auto',
        distanceKm: parseFloat(distanceKm) || 5,
        waitingMinutes: parseFloat(waitingMinutes) || 0,
        isNightRate: Boolean(isNightRate),
        askingPrice: askingPrice ? parseFloat(askingPrice) : undefined
    });
    return res.json({ success: true, data: estimate });
});
// Tour Packages
app.get('/api/v1/tours', (req, res) => {
    return res.json({ success: true, data: localPackages });
});
app.post('/api/v1/tours', (req, res) => {
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
app.post('/api/v1/reports/scam', (req, res) => {
    const report = {
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
app.post('/api/v1/planner/generate', (req, res) => {
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
    socket.on(shared_types_1.SocketEvents.BOOKING_SEARCHING, (data) => {
        io.emit(shared_types_1.SocketEvents.BOOKING_SEARCHING, { status: 'SEARCHING', message: 'Finding nearby guides...' });
        // Simulate real-time matching after 2.5s
        setTimeout(() => {
            const guide = mock_data_js_1.BACKEND_GUIDES[0];
            const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
            io.emit(shared_types_1.SocketEvents.BOOKING_MATCHED, {
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
//# sourceMappingURL=server.js.map