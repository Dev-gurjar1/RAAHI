const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { router: authRoutes } = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const fairPriceRoutes = require('./routes/fairPriceRoutes');
const setupDispatchHandler = require('./socket/dispatchHandler');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Connect Database
connectDB();

// Global Express Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[RAAHI API] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/fair-price', fairPriceRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'RAAHI On-Demand Tourist-Guide Backend Platform',
    timestamp: new Date().toISOString()
  });
});

// Socket.io Real-Time Dispatch Setup
setupDispatchHandler(io);

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route endpoint not found on RAAHI Server' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[RAAHI Server Error]', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 RAAHI Backend Server Running Live on Port ${PORT}`);
  console.log(`📡 REST API Base: http://localhost:${PORT}/api`);
  console.log(`⚡ Socket.io Engine Live: ws://localhost:${PORT}`);
  console.log(`================================================================`);
});
