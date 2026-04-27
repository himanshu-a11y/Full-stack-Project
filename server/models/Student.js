const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
<<<<<<< Updated upstream
const constants = require('../../shared/constants.cjs');
const { TRADES } = constants;
=======
const { TRADES } = require('../../shared/constants');
>>>>>>> Stashed changes

const studentSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  phone:          { type: String },
  email:          { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  trade:          { type: String, enum: TRADES },
  district:       { type: String },
  certifications: [{ type: String }],
  availability:   { type: Boolean, default: true },
  status:         { type: String, default: 'active' },
  tradeHistory:   [{ type: String }],
  createdAt:      { type: Date, default: Date.now }
});

// Covered query index — CRITICAL for Task 1.5
studentSchema.index({ trade: 1, status: 1 });

// Hash password before saving
studentSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('Student', studentSchema);
