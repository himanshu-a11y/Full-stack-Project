const Student = require('../models/Student');

// matchCandidates(job, weights)
// Scores students against a job using aggregation pipeline
// Default weights: trade=40, district=30, cert=30
async function matchCandidates(job, weights = {}) {
  const w = {
    trade:    weights.trade    !== undefined ? Number(weights.trade)    : 40,
    district: weights.district !== undefined ? Number(weights.district) : 30,
    cert:     weights.cert     !== undefined ? Number(weights.cert)     : 30,
  };

  const pipeline = [
    // Stage 1: active and available students only
    {
      $match: {
        status:       'active',
        availability: true,
      },
    },

    // Stage 2: compute score — trade + district + cert overlap
    {
      $addFields: {
        score: {
          $add: [
            {
              $cond: {
                if:   { $eq: ['$trade', job.trade] },
                then: w.trade,
                else: 0,
              },
            },
            {
              $cond: {
                if:   { $eq: ['$district', job.district] },
                then: w.district,
                else: 0,
              },
            },
            {
              $cond: {
                if: {
                  $gt: [
                    {
                      $size: {
                        $ifNull: [
                          { $setIntersection: ['$certifications', job.certRequired || []] },
                          [],
                        ],
                      },
                    },
                    0,
                  ],
                },
                then: w.cert,
                else: 0,
              },
            },
          ],
        },
      },
    },

    // Stage 3: exclude zero-score students
    { $match: { score: { $gt: 0 } } },

    // Stage 4: highest score first
    { $sort: { score: -1 } },

    // Stage 5: return only fields employer needs
    {
      $project: {
        _id:            1,
        name:           1,
        trade:          1,
        district:       1,
        certifications: 1,
        phone:          1,
        score:          1,
      },
    },
  ];

  return Student.aggregate(pipeline);
}

module.exports = { matchCandidates };