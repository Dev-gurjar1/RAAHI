import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { connectDB } from './config/db.js';
import { seedDatabase } from './services/seedService.js';
import { SocketEvents } from './utils/constants.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import guideRoutes from './routes/guideRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import fairPriceRoutes from './routes/fairPriceRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import plannerRoutes from './routes/plannerRoutes.js';
import campusAmbassadorRoutes from './routes/campusAmbassadorRoutes.js';

// Middleware
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Socket.IO Setup
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Express Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'RAAHI Backend API (MERN Stack)'
  });
});

// API Routes Mounting (supporting both /api/v1 and /api for maximum compatibility)
const registerRoutes = (prefix) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/guides`, guideRoutes);
  app.use(`${prefix}/tours`, tourRoutes);
  app.use(`${prefix}/bookings`, bookingRoutes);
  app.use(`${prefix}/fair-price`, fairPriceRoutes);
  app.use(`${prefix}/reports`, reportRoutes);
  app.use(`${prefix}/planner`, plannerRoutes);
  app.use(`${prefix}/campus-ambassador`, campusAmbassadorRoutes);
};

registerRoutes('/api/v1');
registerRoutes('/api');

// Socket.IO Realtime Events Gateway
io.on('connection', (socket) => {
  console.log(`⚡ Socket client connected: ${socket.id}`);

  socket.on(SocketEvents.BOOKING_SEARCHING, (data) => {
    io.emit(SocketEvents.BOOKING_SEARCHING, {
      status: 'SEARCHING',
      message: 'Broadcasting request to nearby verified guides in Jaipur...'
    });

    // Simulate real-time matching
    setTimeout(() => {
      const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
      io.emit(SocketEvents.BOOKING_MATCHED, {
        status: 'MATCHED',
        startOtp,
        etaMinutes: 4
      });
    }, 2000);
  });

  socket.on(SocketEvents.GUIDE_LOCATION, (location) => {
    socket.broadcast.emit(SocketEvents.GUIDE_LOCATION, location);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  const dbConn = await connectDB();
  if (dbConn) {
    await seedDatabase();
  }

  server.listen(PORT, () => {
    console.log(`🚀 RAAHI Backend Server running on port ${PORT} [http://localhost:${PORT}]`);
  });
};

startServer();

export { app, server, io };
