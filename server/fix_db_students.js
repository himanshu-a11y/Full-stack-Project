const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/skillbridge').then(async () => {
  const db = mongoose.connection.db;
  const students = await db.collection('students').find({}).toArray();
  for (let s of students) {
    if (!s.country || !s.state) {
      await db.collection('students').updateOne(
        { _id: s._id },
        { $set: { country: s.country || 'India', state: s.state || s.district } }
      );
      console.log(`Updated student ${s._id}`);
    }
  }
  console.log('Done');
  process.exit(0);
});
