const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  city:        { type: String },
  createdAt:   { type: Date, default: Date.now }
});

// Hash password before saving
employerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Employer', employerSchema);