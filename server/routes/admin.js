const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const cache = require('../services/cache');

const upload = multer({ storage: multer.memoryStorage() });

// --- UTILS ---
const invalidateCache = async (trade) => {
  try {
    if (cache && cache.invalidateByTrade) {
      await cache.invalidateByTrade(trade);
    }
  } catch (err) {
    console.warn("Cache invalidation failed", err.message);
  }
};

// --- ROUTES ---

// 1. Vetting Queues (GET) - Move to top to avoid 404 shadowing
router.get('/unverified-students', async (req, res) => {
  try {
    const students = await Student.find({ isVerified: { $ne: true } }).select('-password').sort({ createdAt: -1 });
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/unverified-employers', async (req, res) => {
  try {
    const employers = await Employer.find({ isVerified: { $ne: true } }).select('-password').sort({ createdAt: -1 });
    res.json({ employers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. User Directory
router.get('/all-users', async (req, res) => {
  try {
    const [students, employers] = await Promise.all([
      Student.find().select('-password').sort({ createdAt: -1 }).lean(),
      Employer.find().select('-password').sort({ createdAt: -1 }).lean()
    ]);
    
    const users = [
      ...students.map(s => ({ ...s, role: 'student' })),
      ...employers.map(e => ({ ...e, role: 'employer', name: e.companyName }))
    ];
    
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Stats
router.get('/stats', async (req, res) => {
  try {
    const [totalStudents, unverifiedCount, totalJobs] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ isVerified: { $ne: true } }),
      Job.countDocuments()
    ]);
    res.json({ totalStudents, unverifiedCount, totalJobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Verification (POST)
router.post('/verify-student/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await invalidateCache(student.trade);
    res.json({ message: 'Student verified successfully', user: student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/verify-employer/:id', async (req, res) => {
  try {
    const employer = await Employer.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!employer) return res.status(404).json({ message: 'Employer not found' });
    res.json({ message: 'Employer verified successfully', user: employer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Status Management
router.patch('/user-status/:role/:id', async (req, res) => {
  try {
    const { role, id } = req.params;
    const { status } = req.body;
    let user;
    if (role === 'student') {
      user = await Student.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      user = await Employer.findByIdAndUpdate(id, { status }, { new: true });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. Bulk Import
router.post('/import', upload.single('file'), async (req, res) => {
  const errors = [];
  try {
    const csvText = req.file.buffer.toString('utf-8');
    const rows = parse(csvText, { columns: true, skip_empty_lines: true });

    const emails = rows.map(r => r.email);
    const existing = await Student.find({ email: { $in: emails } }).select('+password').lean();
    const existingMap = {};
    existing.forEach(s => { existingMap[s.email] = s; });

    const ops = [];
    const defaultPassHash = await bcrypt.hash('SkillBridge@123', 10);

    for (const row of rows) {
      try {
        const updateOp = {
          $set: {
            name:           row.name,
            phone:          row.phone,
            trade:          row.trade,
            country:        row.country || 'India',
            state:          row.state || row.district,
            district:       row.state || row.district,
            certifications: row.certifications ? row.certifications.split(',').map(c => c.trim()) : [],
            status:         row.status || 'active',
            isVerified:     true 
          },
          $setOnInsert: { password: defaultPassHash }
        };

        if (existingMap[row.email]) {
          if (existingMap[row.email].trade !== row.trade) {
            updateOp.$push = { tradeHistory: existingMap[row.email].trade };
          }
          if (!existingMap[row.email].password) {
            updateOp.$set.password = defaultPassHash;
          }
        }

        ops.push({ updateOne: { filter: { email: row.email }, update: updateOp, upsert: true } });
      } catch (rowErr) {
        errors.push({ email: row.email, reason: rowErr.message });
      }
    }
    const result = await Student.bulkWrite(ops, { ordered: false });

    // Invalidate caches for all affected trades
    const affectedTrades = [...new Set(rows.map(r => r.trade))];
    for (const trade of affectedTrades) {
      await invalidateCache(trade);
    }

    res.json({ inserted: result.upsertedCount, updated: result.modifiedCount, errors });
  } catch (err) {
    res.status(500).json({ message: err.message, errors });
  }
});

router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

module.exports = router;