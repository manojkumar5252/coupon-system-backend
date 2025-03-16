const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  claimed: { type: Boolean, default: false },
  claimedByIP: { type: String },
  claimedAt: { type: Date },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', couponSchema); // No need to specify 'coupons'
