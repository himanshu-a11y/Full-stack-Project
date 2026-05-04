const mongoose = require('mongoose');
const Student = require('./models/Student');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const fixPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillbridge');
    console.log('Connected to MongoDB...');

    const defaultPass = await bcrypt.hash('SkillBridge@123', 10);
    
    // Find all students missing a password or having an empty one
    const students = await Student.find({
      $or: [
        { password: { $exists: false } },
        { password: '' },
        { password: null }
      ]
    });

    console.log(`Found ${students.length} students missing passwords.`);

    for (const student of students) {
      student.password = 'SkillBridge@123'; // The pre-save hook will hash this
      await student.save();
      console.log(`Fixed password for: ${student.email}`);
    }

    console.log('All missing passwords have been fixed!');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing passwords:', err);
    process.exit(1);
  }
};

fixPasswords();
