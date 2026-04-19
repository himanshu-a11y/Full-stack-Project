// SEPARATE GUARD — only for student routes. Cannot be used on employer routes.
const jwt = require('jsonwebtoken');

module.exports = function studentGuard(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'student') {
      return res.status(403).json({ message: 'Access denied: not a student token' });
    }
    req.student = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};