const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  country:     { type: String, default: 'India' },
  state:       { type: String },
  district:    { type: String },
  phone:       { type: String },
  description: { type: String },
  website:     { type: String },
  isVerified:  { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

// Hash password before saving
employerSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('Employer', employerSchema);