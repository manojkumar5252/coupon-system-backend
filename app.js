
const express = require('express');
const cors = require('cors');
const app = express();
const authMiddleware = require('./authMiddleware');  // Importing the authentication middleware

// Middleware setup
app.use(cors());  // Allow cross-origin requests (frontend can make requests to backend)
app.use(express.json());  // Parse incoming JSON requests

// API Route Example
app.get('/api/data', authMiddleware, (req, res) => {
  // In a real-world app, you would fetch this data from a database
  const data = [
    { id: 1, name: 'Coupon 1' },
    { id: 2, name: 'Coupon 2' },
  ];
  res.json(data);  // Send the data back to the client
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
