const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();

const Job            = require('../models/Job');
const employerGuard  = require('../middleware/employerGuard');
const studentGuard   = require('../middleware/studentGuard');
const Student        = require('../models/Student');
const { matchCandidates, matchJobs } = require('../services/matching');

// Phase 2: replace block below with:
// const { getCachedCandidates, setCachedCandidates } = require('../services/cache');
let getCachedCandidates = async () => null;
let setCachedCandidates = async () => {};
let getCachedJobs = async () => null;
let setCachedJobs = async () => {};
try {
  const cache = require('../services/cache');
  getCachedCandidates = cache.getCachedCandidates;
  setCachedCandidates = cache.setCachedCandidates;
  getCachedJobs = cache.getCachedJobs;
  setCachedJobs = cache.setCachedJobs;
  invalidateStudentMatches = cache.invalidateStudentMatches;
} catch (_) {}

router.use((req, res, next) => {
  console.log(`Job Router: ${req.method} ${req.url}`);
  next();
});

// POST /api/jobs — employer creates a job (protected)
router.post('/', employerGuard, async (req, res) => {
  try {
    const { title, trade, country, state, district, certRequired, description } = req.body;
    const job = await Job.create({
      title,
      trade,
      country: country || 'India',
      state: state || '',
      district: district || '',
      certRequired: certRequired || [],
      description,
      employerId: req.employer.id,
    });
    
    // Invalidate student-side match cache so new job appears immediately
    if (invalidateStudentMatches) await invalidateStudentMatches();

    return res.status(201).json({
      job: {
        _id: job._id,
        title: job.title,
        trade: job.trade,
        country: job.country || 'India',
        state: job.state || '',
        district: job.district || '',
      },
    });
  } catch (err) {
    console.error('POST /api/jobs error:', err);
    return res.status(500).json({ message: 'Failed to create job', error: err.message });
  }
});

// GET /api/jobs — public paginated job list
// Query params: page (default 1), limit (default 10)
router.get('/', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip  = (page - 1) * limit;
    const filter = {};

    if (req.query.trade) filter.trade = req.query.trade;
    if (req.query.country) filter.country = { $regex: new RegExp(`^${req.query.country}$`, 'i') };
    if (req.query.state) filter.$or = [{ state: { $regex: new RegExp(`^${req.query.state}$`, 'i') } }, { district: { $regex: new RegExp(`^${req.query.state}$`, 'i') } }];
    if (req.query.district) filter.district = { $regex: new RegExp(`^${req.query.district}$`, 'i') };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('employerId', 'companyName isVerified')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments(filter),
    ]);

    return res.json({ jobs, total, hasMore: page * limit < total });
  } catch (err) {
    console.error('GET /api/jobs error:', err);
    return res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
});

// GET /api/jobs/my-jobs — employer fetches their own jobs (protected)
router.get('/my-jobs', employerGuard, async (req, res) => {
  try {
    const employerId = req.employer.id;
    // Explicitly use the key from the model and ensure the ID is castable
    const jobs = await Job.find({ employerId: new mongoose.Types.ObjectId(employerId) }).sort({ createdAt: -1 }).lean();
    return res.json({ jobs });
  } catch (err) {
    console.error('GET /api/jobs/my-jobs error:', err);
    return res.status(500).json({ message: 'Failed to fetch your jobs', error: err.message });
  }
});

// GET /api/jobs/:id/candidates — matched candidates for a job (protected)
// Query params: tradeW, districtW, certW (default 40/30/30)
// Custom weight queries always bypass cache
router.get('/:id/candidates', employerGuard, async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).lean();
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const weights = {
      trade:    req.query.tradeW    !== undefined ? Number(req.query.tradeW)    : 40,
      district: req.query.districtW !== undefined ? Number(req.query.districtW) : 30,
      cert:     req.query.certW     !== undefined ? Number(req.query.certW)     : 30,
    };

    const usingDefaultWeights = (weights.trade === 40 && weights.district === 30 && weights.cert === 30);

    if (usingDefaultWeights) {
      const cached = await getCachedCandidates(jobId, job.trade);
      if (cached) return res.json({ candidates: cached, cached: true });
    }

    const candidates = await matchCandidates(job, weights);

    // Increment profile views for returned candidates to show real activity on student dashboard
    if (candidates.length > 0) {
      const candidateIds = candidates.map(c => c._id);
      await Student.updateMany({ _id: { $in: candidateIds } }, { $inc: { profileViews: 1 } });
    }

    if (usingDefaultWeights) await setCachedCandidates(jobId, job.trade, candidates);

    return res.json({ candidates, cached: false });
  } catch (err) {
    console.error('GET /api/jobs/:id/candidates error:', err);
    return res.status(500).json({ message: 'Failed to fetch candidates', error: err.message });
  }
});

// GET /api/jobs/match — matched jobs for a student (protected)
// Query params: tradeW, districtW, certW
router.get('/match', studentGuard, async (req, res) => {
  try {
    const studentId = req.student.id;
    const student = await Student.findById(studentId).lean();
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const weights = {
      trade:    req.query.tradeW    !== undefined ? Number(req.query.tradeW)    : 40,
      district: req.query.districtW !== undefined ? Number(req.query.districtW) : 30,
      cert:     req.query.certW     !== undefined ? Number(req.query.certW)     : 30,
    };

    const usingDefaultWeights = (weights.trade === 40 && weights.district === 30 && weights.cert === 30);

    if (usingDefaultWeights) {
      const cached = await getCachedJobs(studentId);
      if (cached) return res.json({ jobs: cached, cached: true });
    }

    const jobs = await matchJobs(student, weights);

    if (usingDefaultWeights) await setCachedJobs(studentId, jobs);

    return res.json({ jobs, cached: false });
  } catch (err) {
    console.error('GET /api/jobs/match error:', err);
    return res.status(500).json({ message: 'Failed to fetch matched jobs', error: err.message });
  }
});

const JobApplication = require('../models/JobApplication');

// POST /api/jobs/:id/apply — student applies for a job (protected)
router.post('/:id/apply', studentGuard, async (req, res) => {
  try {
    const jobId = req.params.id;
    const studentId = req.student.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check if already applied
    const existing = await JobApplication.findOne({ studentId, jobId });
    if (existing) return res.status(400).json({ message: 'You have already applied for this job' });

    await JobApplication.create({
      studentId,
      jobId,
      employerId: job.employerId,
      status: 'pending'
    });

    return res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('POST /api/jobs/:id/apply error:', err);
    return res.status(500).json({ message: 'Failed to submit application', error: err.message });
  }
});

// GET /api/jobs/:id — public single job details
router.get('/:id', async (req, res) => {
  try {
    console.log(`Fetching job details for ID: ${req.params.id}`);
    const job = await Job.findById(req.params.id).populate('employerId', 'companyName isVerified phone email description');
    if (!job) {
      console.log(`Job not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Job not found' });
    }
    return res.json({ job });
  } catch (err) {
    console.error(`Error fetching job ${req.params.id}:`, err);
    return res.status(500).json({ message: 'Error fetching job', error: err.message });
  }
});

// PUT /api/jobs/:id — employer updates their own job (protected)
router.put('/:id', employerGuard, async (req, res) => {
  try {
    const { title, trade, country, state, district, certRequired, description } = req.body;
    const job = await Job.findById(req.params.id);
    
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employerId.toString() !== req.employer.id) {
      return res.status(403).json({ message: 'Unauthorized: You do not own this job' });
    }

    job.title = title || job.title;
    job.trade = trade || job.trade;
    job.country = country || job.country;
    job.state = state || job.state;
    job.district = district || job.district;
    job.certRequired = certRequired || job.certRequired;
    job.description = description || job.description;

    await job.save();

    // Invalidate caches
    if (invalidateStudentMatches) await invalidateStudentMatches();

    return res.json({ job });
  } catch (err) {
    console.error('PUT /api/jobs/:id error:', err);
    return res.status(500).json({ message: 'Failed to update job', error: err.message });
  }
});

// DELETE /api/jobs/:id — employer deletes their own job (protected)
router.delete('/:id', employerGuard, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employerId.toString() !== req.employer.id) {
      return res.status(403).json({ message: 'Unauthorized: You do not own this job' });
    }

    await Job.findByIdAndDelete(req.params.id);

    // Delete all associated applications
    await JobApplication.deleteMany({ jobId: req.params.id });

    // Invalidate caches
    if (invalidateStudentMatches) await invalidateStudentMatches();

    return res.json({ message: 'Job and associated applications deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/jobs/:id error:', err);
    return res.status(500).json({ message: 'Failed to delete job', error: err.message });
  }
});

module.exports = router;