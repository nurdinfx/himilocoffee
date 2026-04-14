require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const path = require('path');

// Connect to database
connectDB().then(() => {
  const initializeAdmin = require('./utils/initAdmin');
  initializeAdmin();
});

const app = express();
const server = http.createServer(app);

// Middleware
// Enforce Production-Ready CORS Policy
const allowedOrigins = [
  'http://localhost:5173', // Local Vite
  'http://localhost:3000', // Local Admin/Mobile Dev
  'https://himilocoffee-pzan.vercel.app', // Production Frontend
  process.env.FRONTEND_URL // Dynamic Fallback
];

// FIXED CORS Middleware - No next() issues
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow requests with no origin
  if (!origin) {
    return next();
  }

  // Check if origin is allowed
  const isAllowed = allowedOrigins.includes(origin) ||
    (origin && origin.endsWith('.vercel.app'));

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return next();
  }

  // Reject unauthorized origins
  console.warn(`CORS blocked origin: ${origin}`);
  return res.status(403).json({
    message: 'CORS policy does not allow access from this origin'
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - FIX for localhost images
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// ALSO serve images from root /uploads if needed
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.io integration
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a specific order room
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(orderId);
    console.log(`User joined room: ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Make io accessible in our routes
app.set('io', io);

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Global error handler - MUST BE LAST
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Allowed origins:`, allowedOrigins.filter(Boolean));
});