import { TRADES, DISTRICTS, CERTIFICATIONS } from '../shared/constants.js';

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// local mongoose schemaaa
const StudentSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  phone:         { type: String },
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  trade:         { type: String, enum: TRADES },
  district:      { type: String, enum: DISTRICTS },
  certifications:[{ type: String }],
  availability:  { type: Boolean, default: true },
  status:        { type: String, default: 'active' },
  tradeHistory:  [{ type: String }],
  createdAt:     { type: Date, default: Date.now }
});
StudentSchema.index({ trade: 1, status: 1 });
const Student = mongoose.model('Student', StudentSchema);

const JobSchema = new mongoose.Schema({
  title:        { type: String },
  trade:        { type: String, enum: TRADES },
  district:     { type: String, enum: DISTRICTS },
  certRequired: [{ type: String }],
  description:  { type: String },
  employerId:   { type: mongoose.Schema.Types.ObjectId },
  createdAt:    { type: Date, default: Date.now }
});
const Job = mongoose.model('Job', JobSchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillbridge';


//  Pick a random subset of arr with length between min and max (inclusive). 
function randomSubset(arr, min, max) {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}


async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');

  await Student.deleteMany({});
  await Job.deleteMany({});
  console.log('Cleared existing Student and Job documents');

  const hashedPassword = await bcrypt.hash('test123', 10);

  const students = [];
  for (let i = 0; i < 30; i++) {
    const trade      = TRADES[i % TRADES.length];
    const district   = DISTRICTS[i % DISTRICTS.length];
    const certs      = randomSubset(CERTIFICATIONS, 1, 3);
    const status     = i < 25 ? 'active' : 'inactive';

    students.push({
      name:           `Student ${i + 1}`,
      email:          `student${i + 1}@skillbridge.test`,
      phone:          `98${String(i).padStart(8, '0')}`,
      password:       hashedPassword,
      trade,
      district,
      certifications: certs,
      availability:   true,
      status,
      tradeHistory:   [],
    });
  }

  const insertedStudents = await Student.insertMany(students);
  console.log(`Seeded ${insertedStudents.length} students`);

  // Placeholder employer ObjectId (M1 will provide real employers via auth routes)
  const placeholderEmployerId = new mongoose.Types.ObjectId();

  // Build 5 Job documents — each targets a specific trade + district
  const jobTemplates = [
    { title: 'Electrician Required – Site Work',   trade: 'Electrician', district: 'Ahmedabad', certRequired: ['NCVT', 'SCVT'] },
    { title: 'Fitter Needed – Manufacturing Unit', trade: 'Fitter',       district: 'Surat',     certRequired: ['NCVT'] },
    { title: 'Welder Vacancy – Steel Plant',       trade: 'Welder',       district: 'Vadodara',  certRequired: ['SCVT', 'NAC'] },
    { title: 'Mechanic Opening – Auto Workshop',   trade: 'Mechanic',     district: 'Rajkot',    certRequired: ['NCVT'] },
    { title: 'COPA Operator – Data Entry Firm',    trade: 'COPA',         district: 'Gandhinagar', certRequired: ['CITS', 'NIMI'] },
  ];

  const jobs = jobTemplates.map(t => ({
    ...t,
    description: `We are looking for a skilled ${t.trade} in the ${t.district} region.`,
    employerId:  placeholderEmployerId,
  }));

  const insertedJobs = await Job.insertMany(jobs);
  console.log(`Seeded ${insertedJobs.length} jobs`);

  console.log('\nSeeded ' + insertedStudents.length + ' students and ' + insertedJobs.length + ' jobs');
  await mongoose.disconnect();
  console.log('Done. MongoDB disconnected.');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});