const express = require('express');
const router = express.Router();
const EventEmitter = require('events');
const studentGuard = require('../middleware/studentGuard');
const Student = require('../models/Student');

// Local event emitter — M2 (Bobby) uses this for Redis cache invalidation
const tradeEvents = new EventEmitter();

// GET /api/student/profile (protected by studentGuard)
router.get('/profile', studentGuard, async (req, res) => {
  try {
    console.log('Fetching profile for student ID:', req.student.id);
    const student = await Student.findById(req.student.id).select('-password');
    console.log('Fetched student:', student);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ student });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/student/profile  (protected by studentGuard)
router.put('/profile', studentGuard, async (req, res) => {
  try {
    const { name, email, phone, trade, district, certifications, availability } = req.body;

    // Get current student to check if trade changed
    const existing = await Student.findById(req.student.id);
    const oldTrade = existing.trade;

    // Update the profile fields
    const updated = await Student.findByIdAndUpdate(
      req.student.id,
      { $set: { name, email, phone, trade, district, certifications, availability } },
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