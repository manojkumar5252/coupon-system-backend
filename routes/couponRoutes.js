const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const { createCoupon } = require('../controllers/adminController'); // or couponController

// ✅ Create Coupon (Protected Route)
router.post('/coupon', adminAuth, createCoupon);

module.exports = router;
