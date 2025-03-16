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
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => {
      console.log('✅ Server running on http://localhost:5000');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

// ✅ ROUTES IMPORT
const guestRoutes = require('./routes/guestRoutes'); // This is the important line
const adminRoutes = require('./routes/adminRoutes'); // Optional if you have this file

// ✅ ROUTES USE
app.use('/api/guest', guestRoutes); // This works if guestRoutes is "module.exports = router"
app.use('/api/admin', adminRoutes); // Optional: same logic
