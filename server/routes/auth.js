const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Employer = require('../models/Employer');

// POST /api/student/register
router.post('/student/register', async (req, res) => {
  try {
    const { name, email, password, phone, trade, district, certifications } = req.body;
    const student = new Student({ name, email, password, phone, trade, district, certifications });
    await student.save();
    const token = jwt.sign(
      { id: student._id, role: 'student', trade: student.trade, district: student.district },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, student: { _id: student._id, name, trade, district } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/employer/register
router.post('/employer/register', async (req, res) => {
  try {
    const { companyName, email, password, city } = req.body;
    const employer = new Employer({ companyName, email, password, city });
    await employer.save();
    const token = jwt.sign(
      { id: employer._id, role: 'employer', companyName: employer.companyName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, employer: { _id: employer._id, companyName } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Model = role === 'student' ? Student : Employer;
    const user = await Model.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    let payload, profile;
    if (role === 'student') {
      payload = { id: user._id, role: 'student', trade: user.trade, district: user.district };
      profile = { _id: user._id, name: user.name, trade: user.trade, district: user.district };
    } else {
      payload = { id: user._id, role: 'employer', companyName: user.companyName };
      profile = { _id: user._id, companyName: user.companyName };
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;