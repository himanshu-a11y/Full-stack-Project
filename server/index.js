require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// auth routes        ← M1 will uncomment these
const authRoutes    = require('./routes/auth');
const studentRoutes = require('./routes/student');
const adminRoutes   = require('./routes/admin');
app.use('/api', authRoutes);
app.use('/api', studentRoutes);
app.use('/api', adminRoutes);

<<<<<<< Updated upstream
// job routes         ← M2
const jobRoutes = require('./routes/jobs');
app.use('/api', jobRoutes);
=======
// Routes — M2 (Bobby)
const jobRoutes     = require('./routes/jobs');

// Routes — M1
app.use('/api/student', studentRoutes); // /api/student/profile
app.use('/api/admin', adminRoutes);     // /api/admin/import
app.use('/api', authRoutes);            // /api/student/register, /api/employer/register, /api/auth/login

// Routes — M2
app.use('/api/jobs', jobRoutes);         // /api/jobs

// Health check
app.get('/', (req, res) => res.send('SkillBridge API running ✅'));
>>>>>>> Stashed changes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

module.exports = app;