require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url} - Headers: ${JSON.stringify(req.headers)}`);
  next();
});

app.use(cors());
app.use(express.json());

// auth routes
const authRoutes    = require('./routes/auth');
const studentRoutes = require('./routes/student');
const adminRoutes   = require('./routes/admin');
const jobRoutes     = require('./routes/jobs');

app.use('/api', authRoutes);            // /api/student/register, /api/employer/register, /api/auth/login
app.use('/api/student', studentRoutes); // /api/student/profile
app.use('/api/admin', adminRoutes);     // /api/admin/import
app.use('/api/jobs', jobRoutes);        // /api/jobs



// Health check
app.get('/', (req, res) => res.send('SkillBridge API running ✅'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

module.exports = app;