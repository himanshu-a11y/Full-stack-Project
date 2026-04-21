# SkillBridge — ITI Student Job Matching Portal

**Group 1** | Bobby Sharma · Himanshu Gurjar · Pratham Bansal · Vedika Agrawal

## Overview
SkillBridge is a MERN stack web application connecting ITI students with employers.
Students create skill profiles. Employers post jobs. The system matches students 
to jobs using a scored aggregation pipeline (trade + district + certifications).

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Node.js + Express 5 |
| Database | MongoDB 6 (Mongoose) |
| Cache | Redis 7 (ioredis) |
| Auth | JWT (dual token — student + employer) |
| DevOps | Docker Compose |

## Setup Instructions
1. Clone the repo
2. Copy `.env.example` to `.env` and set `JWT_SECRET`
3. Run `docker-compose up --build`
4. Seed data: `node seed/seed.js`
5. Open `http://localhost:5173`

## Team Contributions
| Member | Branch | Responsibility |
|---|---|---|
| Vedika Agrawal | Vedika | MongoDB models, JWT auth, CSV import, covered query |
| Bobby Sharma | Bobby | Matching aggregation pipeline, Redis cache, seed data |
| Himanshu Gurjar | Himanshu | Student UI pages, infinite scroll, job listings |
| Pratham Bansal | Pratham | Employer UI, routing, DevOps, component library, home page |

## 6 Technical Concepts Implemented
1. **Aggregation Pipeline** — `server/services/matching.js`
2. **Bulk CSV Import with Upsert** — `server/routes/admin.js`
3. **Redis Cache with Selective Invalidation** — `server/services/cache.js`
4. **Dual JWT Token Types** — `server/middleware/studentGuard.js` + `employerGuard.js`
5. **Infinite Scroll with useCallback** — `client/src/pages/JobList.jsx`
6. **Covered Query Optimization** — `server/models/Student.js` + `docs/query-proof.md`

## API Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/student/register | None | Student registration |
| POST | /api/employer/register | None | Employer registration |
| POST | /api/auth/login | None | Login for both roles |
| PUT | /api/student/profile | Student | Update profile |
| POST | /api/jobs | Employer | Post a job |
| GET | /api/jobs | None | Paginated job list |
| GET | /api/jobs/:id/candidates | Employer | Matched candidates with scores |
| POST | /api/admin/import | None | Bulk CSV student import |
>>>>>>> pratham
