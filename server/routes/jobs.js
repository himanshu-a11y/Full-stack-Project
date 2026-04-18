const express  = require('express');
const router   = express.Router();

const Job            = require('../models/Job');
const employerGuard  = require('../middleware/employerGuard');
const { matchCandidates } = require('../services/matching');

// Phase 2: replace block below with:
// const { getCachedCandidates, setCachedCandidates } = require('../services/cache');
let getCachedCandidates = async () => null;
let setCachedCandidates = async () => {};
try {
  const cache = require('../services/cache');
  getCachedCandidates = cache.getCachedCandidates;
  setCachedCandidates = cache.setCachedCandidates;
} catch (_) {}

// POST /api/jobs — employer creates a job (protected)
router.post('/', employerGuard, async (req, res) => {
  try {
    const { title, trade, district, certRequired, description } = req.body;
    const job = await Job.create({
      title,
      trade,
      district,
      certRequired: certRequired || [],
      description,
      employerId: req.employer.id,
    });
    return res.status(201).json({
      job: { _id: job._id, title: job.title, trade: job.trade, district: job.district },
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

    const [jobs, total] = await Promise.all([
      Job.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Job.countDocuments({}),
    ]);

    return res.json({ jobs, total, hasMore: page * limit < total });
  } catch (err) {
    console.error('GET /api/jobs error:', err);
    return res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
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
      const cached = await getCachedCandidates(jobId);
      if (cached) return res.json({ candidates: cached, cached: true });
    }

    const candidates = await matchCandidates(job, weights);

    if (usingDefaultWeights) await setCachedCandidates(jobId, candidates);

    return res.json({ candidates, cached: false });
  } catch (err) {
    console.error('GET /api/jobs/:id/candidates error:', err);
    return res.status(500).json({ message: 'Failed to fetch candidates', error: err.message });
  }
});

module.exports = router;