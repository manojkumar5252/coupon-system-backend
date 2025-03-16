const express = require('express');
const router = express.Router();

const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const adminAuth = require('../middleware/authMiddleware');

const Coupon = require('../models/Coupon');
const ClaimHistory = require('../models/ClaimHistory');

// ✅ Admin auth routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

//////////////////////////////////////////////////
// ✅ CRUD Routes for Coupons (Admin Only)
//////////////////////////////////////////////////

// ✅ Create a new coupon
router.post('/coupon', adminAuth, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code: code.trim() });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'Coupon already exists' });
    }

    const newCoupon = new Coupon({
      code: code.trim(),
      claimed: false,
      available: true
    });

    await newCoupon.save();

    res.status(201).json({
      success: true,
      message: '✅ Coupon created successfully',
      data: newCoupon
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ success: false, message: '❌ Server error', error: error.message });
  }
});

// ✅ Read all coupons
router.get('/coupons', adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ success: false, message: '❌ Error fetching coupons', error: error.message });
  }
});

// ✅ Update a coupon by ID
router.put('/coupon/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, claimed, available } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, claimed, available },
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ success: false, message: '❌ Coupon not found' });
    }

    res.status(200).json({
      success: true,
      message: '✅ Coupon updated successfully',
      data: updatedCoupon
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ success: false, message: '❌ Error updating coupon', error: error.message });
  }
});

// ✅ Delete a coupon by ID
router.delete('/coupon/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ success: false, message: '❌ Coupon not found' });
    }

    res.status(200).json({
      success: true,
      message: '✅ Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ success: false, message: '❌ Error deleting coupon', error: error.message });
  }
});

//////////////////////////////////////////////////
// ✅ Claim History Route (Admin Only)
//////////////////////////////////////////////////
router.get('/history', adminAuth, async (req, res) => {
  try {
    const history = await ClaimHistory.find()
      .populate('couponId', 'code')
      .sort({ claimedAt: -1 });

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching claim history:', error);
    res.status(500).json({ success: false, message: '❌ Error fetching claim history', error: error.message });
  }
});

//////////////////////////////////////////////////
// ✅ Export router
//////////////////////////////////////////////////
module.exports = router;
