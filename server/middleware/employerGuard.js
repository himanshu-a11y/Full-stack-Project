// SEPARATE GUARD — only for employer routes. Cannot be used on student routes.
const jwt = require('jsonwebtoken');

module.exports = function employerGuard(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied: not an employer token' });
    }
    req.employer = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};