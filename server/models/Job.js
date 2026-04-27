const mongoose = require('mongoose');
<<<<<<< Updated upstream
const constants = require('../../shared/constants.cjs');
const { TRADES, DISTRICTS, CERTIFICATIONS } = constants;
=======
const { TRADES, DISTRICTS, CERTIFICATIONS } = require('../../shared/constants');
>>>>>>> Stashed changes

const JobSchema = new mongoose.Schema({
  title:        { type: String },
  trade:        { type: String, enum: TRADES },
  district:     { type: String, enum: DISTRICTS },
  certRequired: [{ type: String, enum: CERTIFICATIONS }],
  description:  { type: String },
  employerId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Employer' },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
