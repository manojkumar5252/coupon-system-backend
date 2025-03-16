const mongoose = require('mongoose');

const claimHistorySchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  couponCode: String, // Optional, to easily view the code
  claimedByIP: String,
  claimedAt: {
    type: Date,
    default: Date.now
  },
  userAgent: String, // Optional: store browser info
  sessionId: String, // Optional: track via cookie/session ID
});

module.exports = mongoose.model('ClaimHistory', claimHistorySchema);
