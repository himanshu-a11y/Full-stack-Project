const express = require('express');
const router = express.Router();
const studentGuard = require('../middleware/studentGuard');
const Student = require('../models/Student');
const authGuard = require('../middleware/authGuard');
const { invalidateByTrade, invalidateStudentMatch } = require('../services/cache');

// PATCH /api/student/:id/view (increment profile views)
router.patch('/:id/view', authGuard, async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, { $inc: { profileViews: 1 } });
    return res.json({ message: 'View incremented' });
  } catch (err) {
    console.error('PATCH /api/student/:id/view error:', err);
    return res.status(500).json({ message: 'Failed to increment view' });
  }
});

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
  console.log(`[STUDENT_API] Received profile update request for ID: ${req.student.id}`);
  try {
    const { name, phone, trade, country, state, district, certifications, availability } = req.body;

    // Get current student to check if trade changed
    const existing = await Student.findById(req.student.id);
    if (!existing) return res.status(404).json({ message: 'Student not found' });
    const oldTrade = existing.trade;

    // Protection: Verified students cannot change trade/certifications
    const updateData = {
      name,
      phone,
      country: country || existing.country || 'India',
      state: state || existing.state || '',
      district: district || existing.district || '',
      availability,
    };

    if (!existing.isVerified) {
      updateData.trade = trade;
      updateData.certifications = certifications;
    }

    const updated = await Student.findByIdAndUpdate(
      req.student.id,
      { $set: updateData },
      { new: true }
    );

    // Invalidate the cache for the student's current trade to reflect new scores
    console.log(`[AUTH] Student profile updated. Invalidating cache for trade: ${updated.trade}`);
    await invalidateByTrade(updated.trade);
    if (oldTrade && oldTrade !== updated.trade) {
      console.log(`[AUTH] Trade changed. Also invalidating old trade cache: ${oldTrade}`);
      await invalidateByTrade(oldTrade);
    }

    // Also invalidate the student's own job match cache
    await invalidateStudentMatch(req.student.id);

    res.json({ student: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;