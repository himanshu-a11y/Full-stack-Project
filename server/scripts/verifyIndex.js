require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

async function verify() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB\n');

  const result = await mongoose.connection.db
    .collection('students')
    .find(
      { trade: 'Electrician', status: 'active' },
      { projection: { _id: 0, trade: 1, status: 1 } }
    )
    .explain('executionStats');

  const stats = result.executionStats;
  const stage = result.queryPlanner.winningPlan.inputStage?.stage
    || result.queryPlanner.winningPlan.stage;

  console.log('--- Covered Query Verification ---');
  console.log('totalDocsExamined :', stats.totalDocsExamined);
  console.log('totalKeysExamined :', stats.totalKeysExamined);
  console.log('winningPlan stage :', stage);

  if (stats.totalDocsExamined === 0) {
    console.log('\n✅ PASS — Covered query confirmed. Zero documents scanned.');
  } else {
    console.log('\n❌ FAIL — Documents were examined. Check index or projection.');
    console.log('Hint: projection MUST have _id: 0');
  }

  await mongoose.disconnect();
}

verify().catch(console.error);