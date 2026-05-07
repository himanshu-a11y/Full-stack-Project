const Student = require('../models/Student');
const Job = require('../models/Job');

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
        trade:        { $regex: new RegExp(`^${job.trade}$`, 'i') },
      },
    },

    // Stage 2: compute score — trade + state/district + cert overlap
    {
      $addFields: {
        score: {
          $add: [
            {
              $cond: {
                if:   { $regexMatch: { input: "$trade", regex: `^${job.trade}$`, options: "i" } },
                then: w.trade,
                else: 0,
              },
            },
            {
              $cond: {
                if: {
                  $eq: [
                    { $ifNull: ['$state', '$district'] },
                    (job.state || job.district),
                  ],
                },
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
                        $setIntersection: [
                          { $map: { input: { $ifNull: ["$certifications", []] }, as: "c", in: { $toLower: { $trim: { input: "$$c" } } } } },
                          { $map: { input: { $ifNull: [job.certRequired, []] }, as: "cr", in: { $toLower: { $trim: { input: "$$cr" } } } } }
                        ]
                      }
                    },
                    0
                  ]
                },
                then: w.cert,
                else: 0
              }
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
        country:        1,
        state:          { $ifNull: ['$state', '$district'] },
        district:       1,
        certifications: 1,
        phone:          1,
        score:          1,
        isVerified:     1,
      },
    },
  ];

  return Student.aggregate(pipeline);
}

// matchJobs(student, weights)
// Scores jobs against a student using aggregation pipeline
async function matchJobs(student, weights = {}) {
  const w = {
    trade:    weights.trade    !== undefined ? Number(weights.trade)    : 40,
    district: weights.district !== undefined ? Number(weights.district) : 30,
    cert:     weights.cert     !== undefined ? Number(weights.cert)     : 30,
  };

  const studentStateOrDistrict = student.state || student.district || '';

  const pipeline = [
    // Stage 1: Active jobs
    // In this app, we might not have a job 'status', but we can filter out past jobs if needed.
    // Assuming all jobs are active. We'll just do a basic match if there are required base filters.
    // For now, match all.
    { $match: {} },

    // Stage 2: compute score
    {
      $addFields: {
        score: {
          $add: [
            {
              $cond: {
                if:   { $eq: ['$trade', student.trade] },
                then: w.trade,
                else: 0,
              },
            },
            {
              $cond: {
                if: {
                  $eq: [
                    { $ifNull: ['$state', '$district'] },
                    studentStateOrDistrict,
                  ],
                },
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
                        $setIntersection: [
                          { $map: { input: { $ifNull: ["$certRequired", []] }, as: "cr", in: { $toLower: { $trim: { input: "$$cr" } } } } },
                          { $map: { input: { $ifNull: [student.certifications, []] }, as: "sc", in: { $toLower: { $trim: { input: "$$sc" } } } } }
                        ]
                      }
                    },
                    0
                  ]
                },
                then: w.cert,
                else: 0
              }
            },
          ],
        },
      },
    },

    // Stage 3: highest score first
    { $sort: { score: -1 } },

    // Stage 4: Lookup employer details
    {
      $lookup: {
        from: 'employers',
        localField: 'employerId',
        foreignField: '_id',
        as: 'employerDetails'
      }
    },

    // Stage 5: Unwind employerDetails
    {
      $unwind: {
        path: '$employerDetails',
        preserveNullAndEmptyArrays: true
      }
    },

    // Stage 6: Project final fields
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        trade: 1,
        country: 1,
        state: 1,
        district: 1,
        certRequired: 1,
        score: 1,
        employerId: {
          _id: '$employerDetails._id',
          companyName: '$employerDetails.companyName',
          isVerified: '$employerDetails.isVerified'
        }
      }
    }
  ];

  return Job.aggregate(pipeline);
}

module.exports = { matchCandidates, matchJobs };