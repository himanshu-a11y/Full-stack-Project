const jwt = require('jsonwebtoken');

module.exports = function authGuard(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('authGuard: No authorization header found');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('authGuard: Token missing from header');
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('authGuard: Decoded token payload:', decoded);
    
    // Normalize user object
    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role
    };
    
    console.log('authGuard: Normalized req.user:', req.user);
    next();
  } catch (err) {
    console.error('authGuard: Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
