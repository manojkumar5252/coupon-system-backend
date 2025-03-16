const express = require('express');
const router = express.Router();

const Coupon = require('../models/Coupon');
const ClaimHistory = require('../models/ClaimHistory');
const crypto = require('crypto');

// ✅ Middleware to assign sessionId cookie if not present
router.use((req, res, next) => {
  if (!req.cookies.sessionId) {
    const sessionId = crypto.randomBytes(16).toString('hex');
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  }
  next();
});

// ✅ Guest Claim Route
router.get('/claim', async (req, res) => {
  try {
    const userIP = req.ip || req.connection.remoteAddress;
    const sessionId = req.cookies['sessionId'];

    console.log('User IP:', userIP);
    console.log('Session ID:', sessionId);

    // ✅ STEP 1: Check if the IP has already claimed any coupon
    const claimedBySession = await Coupon.findOne({
      claimedByIP: userIP,
      claimed: true,
    });

    // ✅ STEP 2: Cooldown Logic (Optional but recommended)
    const cooldownPeriod = 60 * 60 * 1000; // 1 hour in milliseconds

    if (
      claimedBySession &&
      claimedBySession.claimedAt && // make sure there is a timestamp
      new Date() - claimedBySession.claimedAt < cooldownPeriod
    ) {
      return res.status(429).json({
        message: 'You can only claim one coupon every hour from this IP.',
      });
    }

    // ✅ STEP 3: Find next available coupon
    const coupon = await Coupon.findOne({ claimed: false, available: true });

    if (!coupon) {
      return res.status(200).json({ message: 'No coupons left!' });
    }

    // ✅ STEP 4: Mark coupon as claimed
    coupon.claimed = true;
    coupon.claimedByIP = userIP;
    coupon.claimedAt = new Date();
    await coupon.save();

    // ✅ STEP 5: Track history
    const userAgent = req.headers['user-agent'];
    const history = new ClaimHistory({
      couponId: coupon._id,
      couponCode: coupon.code,
      claimedByIP: userIP,
      userAgent: userAgent,
      sessionId: sessionId,
    });

    await history.save();

    // ✅ STEP 6: Respond
    res.status(200).json({
      message: 'Coupon claimed successfully!',
      coupon: coupon.code,
    });
  } catch (error) {
    console.error('Error claiming coupon:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
