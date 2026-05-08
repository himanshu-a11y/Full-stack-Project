const express = require('express');
const router = express.Router();
const Employer = require('../models/Employer');
const employerGuard = require('../middleware/employerGuard');

// GET /api/employer/profile
router.get('/profile', employerGuard, async (req, res) => {
  try {
    const employer = await Employer.findById(req.employer.id).select('-password');
    if (!employer) return res.status(404).json({ message: 'Employer not found' });
    res.json({ employer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/employer/profile
router.put('/profile', employerGuard, async (req, res) => {
  try {
    const employer = await Employer.findByIdAndUpdate(
      req.employer.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ employer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
