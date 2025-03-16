const Coupon = require('../models/Coupon');

exports.claimCoupon = async (req, res) => {
  const ip = req.ip;  // You can also use req.headers['x-forwarded-for']

  try {
    // Find the next available coupon (Round Robin)
    const coupon = await Coupon.findOne({ claimed: false, available: true }).sort({ createdAt: 1 });

    if (!coupon) {
      return res.status(400).json({ message: 'No coupons left!' });
    }

    // Mark coupon as claimed
    coupon.claimed = true;
    coupon.claimedByIP = ip;
    coupon.claimedAt = new Date();
    await coupon.save();

    res.status(200).json({ message: 'Coupon claimed successfully!', coupon: coupon.code });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
