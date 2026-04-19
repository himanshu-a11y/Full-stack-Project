require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes — M1 (Vedika)
const authRoutes    = require('./routes/auth');
const studentRoutes = require('./routes/student');
const adminRoutes   = require('./routes/admin');

// Routes — M2 (Bobby)
const jobRoutes     = require('./routes/jobs');

// Mount — M1
app.use('/api', authRoutes);            // /api/student/register, /api/employer/register, /api/auth/login
app.use('/api/student', studentRoutes); // /api/student/profile
app.use('/api/admin', adminRoutes);     // /api/admin/import

// Mount — M2
app.use('/api', jobRoutes);             // /api/jobs

// Health check
app.get('/', (req, res) => res.send('SkillBridge API running ✅'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

module.exports = app;