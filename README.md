# SkillBridge — Member 2 Contributions

## Files Added
| File | Description |
|------|-------------|
| `seed/seed.js` | Inserts 30 students and 5 jobs into MongoDB for development |
| `server/models/Job.js` | Mongoose schema for job listings |
| `server/routes/jobs.js` | POST /api/jobs, GET /api/jobs, GET /api/jobs/:id/candidates |
| `server/index.js` | Wired job routes to Express app |

## Phase 1 Work (Apr 11–18)
- **Seed Script** — 30 students with varied trades, districts, certifications. 5 targeted job postings.
- **Jobs Route** — Paginated public job listing + employer-protected job creation
- **Candidate Matching** — Aggregation pipeline scoring candidates by trade (40pts), district (30pts), certifications (30pts)

## Phase 2 Work (Apr 19–25) — Coming Soon
- `server/services/cache.js` — Redis 30-min cache with selective trade-based invalidation
- `seed/testWeights.js` — Weight tuning demo script
- `docs/matching-demo.md` — Matching scenarios documentation

## How to Run Seed
```bash
MONGO_URI="your_atlas_uri" node seed/seed.js
```

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/jobs` | Employer JWT | Create a job |
| GET | `/api/jobs` | None | Paginated job list |
| GET | `/api/jobs/:id/candidates` | Employer JWT | Matched candidates with scores |