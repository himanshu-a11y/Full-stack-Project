import { TRADES, DISTRICTS, CERTIFICATIONS } from '../shared/constants.js';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This repo installs backend deps under `server/node_modules`.
// When running `node seed/seed.js` from repo root, Node won't find them,
// so we load them from the server's node_modules explicitly.
const requireFromServer = createRequire(path.join(__dirname, '../server/package.json'));

const dotenv = requireFromServer('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = requireFromServer('mongoose');
const bcrypt = requireFromServer('bcryptjs');

// local mongoose schemaaa
const StudentSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  phone:         { type: String },
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  trade:         { type: String, enum: TRADES },
  district:      { type: String, enum: DISTRICTS },
  country:       { type: String, default: 'India' },
  state:         { type: String },
  certifications:[{ type: String }],
  availability:  { type: Boolean, default: true },
  status:        { type: String, default: 'active' },
  tradeHistory:  [{ type: String }],
  createdAt:     { type: Date, default: Date.now }
});
StudentSchema.index({ trade: 1, status: 1 });
const Student = mongoose.model('Student', StudentSchema);

const EmployerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  city:        { type: String },
  createdAt:   { type: Date, default: Date.now }
});
const Employer = mongoose.model('Employer', EmployerSchema);

const JobSchema = new mongoose.Schema({
  title:        { type: String },
  trade:        { type: String, enum: TRADES },
  district:     { type: String, enum: DISTRICTS },
  country:      { type: String, default: 'India' },
  state:        { type: String },
  certRequired: [{ type: String }],
  description:  { type: String },
  employerId:   { type: mongoose.Schema.Types.ObjectId },
  createdAt:    { type: Date, default: Date.now }
});
const Job = mongoose.model('Job', JobSchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillbridge';
const LOCAL_MONGO_FALLBACK = 'mongodb://localhost:27017/skillbridge';


//  Pick a random subset of arr with length between min and max (inclusive). 
function randomSubset(arr, min, max) {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}


async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    // Common dev case on Windows: `.env` points at docker hostname `mongo`
    // but Docker Desktop isn't running. Retry against local MongoDB.
    if (
      MONGO_URI.includes('mongodb://mongo:') &&
      (err?.message || '').includes('ENOTFOUND mongo') &&
      LOCAL_MONGO_FALLBACK !== MONGO_URI
    ) {
      console.warn(`Could not reach "${MONGO_URI}". Retrying with "${LOCAL_MONGO_FALLBACK}"...`);
      await mongoose.connect(LOCAL_MONGO_FALLBACK);
      console.log('MongoDB connected');
    } else {
      throw err;
    }
  }

  await Student.deleteMany({});
  await Employer.deleteMany({});
  await Job.deleteMany({});
  console.log('Cleared existing Student, Employer, and Job documents');

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
      country:        'India',
      state:          district,
      district,
      certifications: certs,
      availability:   true,
      status,
      tradeHistory:   [],
    });
  }

  const insertedStudents = await Student.insertMany(students);
  console.log(`Seeded ${insertedStudents.length} students`);

  const employers = [
    { companyName: 'SkillBridge Demo Co', email: 'employer1@skillbridge.test', city: 'Ahmedabad' },
    { companyName: 'BlueCollar Hiring Pvt Ltd', email: 'employer2@skillbridge.test', city: 'Surat' },
  ];

  const hashedEmployerPassword = await bcrypt.hash('test123', 10);
  const insertedEmployers = await Employer.insertMany(
    employers.map((e) => ({ ...e, password: hashedEmployerPassword }))
  );
  console.log(`Seeded ${insertedEmployers.length} employers`);

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
    country: 'India',
    state: t.district,
    employerId:  insertedEmployers[0]._id,
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