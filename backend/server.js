const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patients');
const appointmentsRoutes = require('./routes/appointments');
const treatmentRoutes = require('./routes/treatments');
const invoiceRoutes = require('./routes/invoiceRoutes');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const financialRoutes = require('./routes/financialRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after an hour',
    retryAfter: Math.ceil(60 * 60 * 1000 / 1000) // retry after 1 hour in seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests against the limit
  keyGenerator: (req) => {
    // Use both IP and user ID if available for more granular rate limiting
    return req.user ? `${req.ip}-${req.user._id}` : req.ip;
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../project/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../project/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 