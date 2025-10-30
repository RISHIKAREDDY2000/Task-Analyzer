const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized! Invalid token' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.username = decoded.username;
    next();
  });
};

// Middleware to check if user has editor role
const isEditor = (req, res, next) => {
  if (req.userRole !== 'editor') {
    return res.status(403).json({ 
      message: 'Access denied! Editor role required.' 
    });
  }
  next();
};

// Middleware to check if user has reader or editor role
const isReaderOrEditor = (req, res, next) => {
  if (req.userRole !== 'reader' && req.userRole !== 'editor') {
    return res.status(403).json({ 
      message: 'Access denied! Valid role required.' 
    });
  }
  next();
};

module.exports = { verifyToken, isEditor, isReaderOrEditor, SECRET_KEY };