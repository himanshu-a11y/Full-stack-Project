const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const Student = require('../models/Student');

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/admin/import
// No auth guard — this is an institute admin route
router.post('/import', upload.single('file'), async (req, res) => {
  const errors = [];
  try {
    const csvText = req.file.buffer.toString('utf-8');
    const rows = parse(csvText, { columns: true, skip_empty_lines: true });

    // Pre-fetch existing students to detect trade changes
    const emails = rows.map(r => r.email);
    const existing = await Student.find({ email: { $in: emails } }).lean();
    const existingMap = {};
    existing.forEach(s => { existingMap[s.email] = s; });

    const ops = [];
    for (const row of rows) {
      try {
        const certifications = row.certifications
          ? row.certifications.split(',').map(c => c.trim())
          : [];

        const updateOp = {
          $set: {
            name:           row.name,
            phone:          row.phone,
            trade:          row.trade,
            country:        row.country || 'India',
            state:          row.state || row.district,
            district:       row.state || row.district,
            certifications: certifications,
            status:         row.status || 'active'
          }
        };

        // If student exists and trade changed — push old trade to history
        if (existingMap[row.email] && existingMap[row.email].trade !== row.trade) {
          updateOp.$push = { tradeHistory: existingMap[row.email].trade };
        }

        ops.push({
          updateOne: {
            filter: { email: row.email },
            update: updateOp,
            upsert: true
          }
        });
      } catch (rowErr) {
        errors.push({ email: row.email, reason: rowErr.message });
      }
    }

    const result = await Student.bulkWrite(ops, { ordered: false });
    res.json({
      inserted: result.upsertedCount,
      updated:  result.modifiedCount,
      errors:   errors
    });
  } catch (err) {
    res.status(500).json({ message: err.message, errors });
  }
});

module.exports = router;