const express = require('express');
const router = express.Router();
const studentGuard = require('../middleware/studentGuard');
const Student = require('../models/Student');
const { invalidateByTrade } = require('../services/cache');

// GET /api/student/profile (protected by studentGuard)
router.get('/profile', studentGuard, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select('-password').lean();
    if (!student) return res.status(404).json({ message: 'Student not found' });
    return res.json({ student });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// PUT /api/student/profile  (protected by studentGuard)
router.put('/profile', studentGuard, async (req, res) => {
  try {
    const { name, phone, trade, country, state, district, certifications, availability } = req.body;

    // Get current student to check if trade changed
    const existing = await Student.findById(req.student.id);
    if (!existing) return res.status(404).json({ message: 'Student not found' });
    const oldTrade = existing.trade;

    // Update only the allowed fields
    const updated = await Student.findByIdAndUpdate(
      req.student.id,
      {
        $set: {
          name,
          phone,
          trade,
          country: country || existing.country || 'India',
          state: state || existing.state || '',
          district: district || existing.district || '',
          certifications,
          availability,
        },
      },
      { new: true }
    );

    // Invalidate the cache for the student's current trade to reflect new scores
    invalidateByTrade(updated.trade);
    if (oldTrade && oldTrade !== updated.trade) {
      invalidateByTrade(oldTrade);
    }

    res.json({ student: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;