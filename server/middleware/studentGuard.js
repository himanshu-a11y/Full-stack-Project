// SEPARATE GUARD — only for student routes. Cannot be used on employer routes.
const jwt = require('jsonwebtoken');

module.exports = function studentGuard(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('studentGuard: No auth header');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('studentGuard: Token missing in header');
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'student') {
      console.log('studentGuard: Access denied, role is', decoded.role);
      return res.status(403).json({ message: 'Access denied: not a student token' });
    }
    console.log('studentGuard: Authenticated student ID:', decoded.id);
    req.student = decoded;
    next();
  } catch (err) {
    console.log('studentGuard: Invalid token', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};