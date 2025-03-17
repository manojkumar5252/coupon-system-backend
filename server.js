// Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// App initialization
const app = express();

// Middlewares
app.use(cors({
  origin: 'https://coupon-system-frontend-4.onrender.com', // 👈 Replace with your frontend URL in production
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ ROUTES IMPORT
const guestRoutes = require('./routes/guestRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ✅ ROUTES USE
app.use('/api/guest', guestRoutes);
app.use('/api/admin', adminRoutes);

// ✅ ROOT ROUTE FOR TESTING (Add this 👇)
app.get('/', (req, res) => {
  res.send('🎉 Coupon System Backend API is Running!');
});

// ✅ MongoDB Connection and Server Listener
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000; // 👈 Use dynamic port for deployment
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
