const express = require('express');
const router = express.Router();
const EventEmitter = require('events');
const studentGuard = require('../middleware/studentGuard');
const Student = require('../models/Student');

// Local event emitter — M2 (Bobby) uses this for Redis cache invalidation
const tradeEvents = new EventEmitter();

// PUT /api/student/profile  (protected by studentGuard)
router.put('/profile', studentGuard, async (req, res) => {
  try {
    const { trade, district, certifications, availability } = req.body;

    // Get current student to check if trade changed
    const existing = await Student.findById(req.student.id);
    const oldTrade = existing.trade;

    // Update only the allowed fields
    const updated = await Student.findByIdAndUpdate(
      req.student.id,
      { $set: { trade, district, certifications, availability } },
      { new: true }
    );

    // Emit event if trade changed — Bobby's cache.js listens for this
    if (trade && trade !== oldTrade) {
      tradeEvents.emit('trade:updated', { oldTrade, newTrade: trade });
    }

    res.json({ student: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
module.exports.tradeEvents = tradeEvents;