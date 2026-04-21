// Run with: node seed/testWeights.js
// Prints ranked candidates for 3 weight configs against the first job in DB

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { matchCandidates } = require('../server/services/matching');
const Job = require('../server/models/Job');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillbridge';

const SCENARIOS = [
  {
    label:   'Scenario A — Default        (trade=40, district=30, cert=30)',
    weights: { trade: 40, district: 30, cert: 30 },
  },
  {
    label:   'Scenario B — Location-First (trade=30, district=50, cert=20)',
    weights: { trade: 30, district: 50, cert: 20 },
  },
  {
    label:   'Scenario C — Cert-Heavy     (trade=30, district=20, cert=50)',
    weights: { trade: 30, district: 20, cert: 50 },
  },
];

function printResults(label, weights, candidates) {
  const divider = '─'.repeat(72);
  console.log('\n' + divider);
  console.log(label);
  console.log(`Weights → trade: ${weights.trade}, district: ${weights.district}, cert: ${weights.cert}`);
  console.log(divider);

  if (candidates.length === 0) {
    console.log('  No matching candidates found.');
    return;
  }

  candidates.forEach((c, i) => {
    console.log(
      `  ${String(i + 1).padStart(2)}. ` +
      `Score: ${String(c.score).padStart(3)} | ` +
      `${c.name.padEnd(20)} | ` +
      `${c.trade.padEnd(14)} | ` +
      `${c.district.padEnd(12)} | ` +
      `[${(c.certifications || []).join(', ')}]`
    );
  });
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');

  const job = await Job.findOne({}).lean();
  if (!job) {
    console.error('No jobs found — run `node seed/seed.js` first.');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('SkillBridge — Matching Weight Tuning Demo');
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log(`\nTest Job: "${job.title}"`);
  console.log(`  Trade:        ${job.trade}`);
  console.log(`  District:     ${job.district}`);
  console.log(`  CertRequired: [${job.certRequired.join(', ')}]`);

  for (const scenario of SCENARIOS) {
    const candidates = await matchCandidates(job, scenario.weights);
    printResults(scenario.label, scenario.weights, candidates);
  }

  console.log('\n' + '─'.repeat(72));
  console.log('Done.\n');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('testWeights failed:', err);
  mongoose.disconnect();
  process.exit(1);
});