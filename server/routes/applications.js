const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const employerGuard = require('../middleware/employerGuard');
const studentGuard = require('../middleware/studentGuard');

// GET /api/applications/employer — List all applications for employer's jobs
router.get('/employer', employerGuard, async (req, res) => {
  try {
    const employerId = req.employer.id;
    const applications = await JobApplication.find({ employerId })
      .populate('studentId', 'name email phone trade')
      .populate('jobId', 'title trade district')
      .populate('employerId', 'companyName isVerified')
      .sort({ appliedAt: -1 });
    
    return res.json({ applications });
  } catch (err) {
    console.error('GET /api/applications/employer error:', err);
    return res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// GET /api/applications/student — List student's own applications
router.get('/student', studentGuard, async (req, res) => {
  try {
    const studentId = req.student.id;
    const applications = await JobApplication.find({ studentId })
      .populate('jobId', 'title trade district')
      .populate('employerId', 'companyName email phone isVerified')
      .sort({ appliedAt: -1 });
    
    return res.json({ applications });
  } catch (err) {
    console.error('GET /api/applications/student error:', err);
    return res.status(500).json({ message: 'Failed to fetch your applications' });
  }
});

// PATCH /api/applications/:id/status — Update application status (Accept/Reject)
router.patch('/:id/status', employerGuard, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await JobApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Verify ownership
    if (application.employerId.toString() !== req.employer.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    return res.json({ message: `Application ${status} successfully`, application });
  } catch (err) {
    console.error('PATCH /api/applications/:id/status error:', err);
    return res.status(500).json({ message: 'Failed to update application status' });
  }
});

module.exports = router;
