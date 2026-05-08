const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/skillbridge').then(async () => {
  const db = mongoose.connection.db;
  const jobs = await db.collection('jobs').find({}).toArray();
  for (let job of jobs) {
    if (!job.country || !job.state) {
      await db.collection('jobs').updateOne(
        { _id: job._id },
        { $set: { country: job.country || 'India', state: job.state || job.district } }
      );
      console.log(`Updated job ${job._id}`);
    }
  }
  console.log('Done');
  process.exit(0);
});
